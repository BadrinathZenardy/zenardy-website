"""Serve the mirrored Zenardy site with local form handling.

Static files come from ./site. Form POSTs (Contact Form 7, careers
applications via admin-ajax, comments) are logged to submissions.jsonl
and answered with the same response shape the live WordPress backend
returns, so the front-end shows its normal success message.

Run:  python serve.py  [port]   (default 8080)
"""
import datetime
import json
import re
import sys
from email import policy
from email.parser import BytesParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs

ROOT = Path(__file__).parent
SITE = ROOT / "site"
LOG = ROOT / "submissions.jsonl"

CF7_FEEDBACK = re.compile(r"^/wp-json/contact-form-7/v1/contact-forms/(\d+)/feedback")


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE), **kwargs)

    def parse_form(self):
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length)
        ctype = self.headers.get("Content-Type", "")
        fields = {}
        if ctype.startswith("multipart/form-data"):
            msg = BytesParser(policy=policy.default).parsebytes(
                b"Content-Type: " + ctype.encode("latin-1") + b"\r\n\r\n" + body
            )
            for part in msg.iter_parts():
                name = part.get_param("name", header="content-disposition")
                if not name:
                    continue
                filename = part.get_filename()
                if filename:
                    payload = part.get_payload(decode=True) or b""
                    fields[name] = f"<file: {filename}, {len(payload)} bytes>"
                else:
                    fields[name] = part.get_content().strip()
        elif "application/x-www-form-urlencoded" in ctype:
            fields = {k: v[0] for k, v in parse_qs(body.decode("utf-8", "replace")).items()}
        else:
            fields = {"_raw": body.decode("utf-8", "replace")[:2000]}
        return fields

    def log_submission(self, kind, fields):
        entry = {
            "time": datetime.datetime.now().isoformat(timespec="seconds"),
            "kind": kind,
            "path": self.path,
            "referer": self.headers.get("Referer", ""),
            "fields": {k: v for k, v in fields.items() if not k.startswith("_wp")},
        }
        with LOG.open("a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
        print(f"*** {kind} submission logged -> {LOG.name}")

    def send_json(self, obj, status=200):
        data = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        path = self.path.split("?", 1)[0]
        fields = self.parse_form()

        m = CF7_FEEDBACK.match(path)
        if m:
            self.log_submission("contact-form-7", fields)
            unit_tag = fields.get("_wpcf7_unit_tag", f"wpcf7-f{m.group(1)}")
            self.send_json({
                "contact_form_id": int(m.group(1)),
                "status": "mail_sent",
                "message": "Thank you for your message. It has been sent. "
                           "(logged locally to submissions.jsonl)",
                "posted_data_hash": "",
                "into": f"#{unit_tag}",
                "invalid_fields": [],
            })
            return

        if path == "/wp-admin/admin-ajax.php":
            self.log_submission("admin-ajax:" + fields.get("action", "unknown"), fields)
            self.send_json({"success": True, "data": {
                "message": "Submission received (logged locally to submissions.jsonl)."
            }})
            return

        if path == "/wp-comments-post.php":
            self.log_submission("comment", fields)
            self.send_response(302)
            self.send_header("Location", self.headers.get("Referer", "/"))
            self.end_headers()
            return

        self.log_submission("other-post", fields)
        self.send_json({"success": True})


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    print(f"Serving {SITE} at http://localhost:{port}/  (form submissions -> {LOG})")
    ThreadingHTTPServer(("", port), Handler).serve_forever()
