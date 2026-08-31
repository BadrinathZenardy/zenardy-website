"""Mirror zenardy.com into ./site preserving URL structure.

Pages are saved as <path>/index.html, assets at their original paths
(query strings stripped). All absolute zenardy.com references are
rewritten to root-relative so any static HTTP server reproduces the
live site's routing.
"""
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlsplit

import requests

HOST = "zenardy.com"
START = f"https://{HOST}/"
OUT = Path(__file__).parent / "site"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) local-mirror"}

ASSET_EXT = re.compile(
    r"\.(css|js|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|eot|otf|mp4|webm|pdf|json|xml|txt)$",
    re.I,
)
SKIP_PATH = re.compile(
    r"/(feed|comments|wp-json|wp-admin|wp-login|xmlrpc)", re.I
)

session = requests.Session()
session.headers.update(UA)

pages_done: set[str] = set()
assets_done: set[str] = set()
failed: list[str] = []


def norm_page(url: str) -> str | None:
    """Normalize a candidate internal page URL, or None if not a page."""
    s = urlsplit(url)
    if s.netloc and s.netloc not in (HOST, "www." + HOST):
        return None
    path = s.path or "/"
    if SKIP_PATH.search(path) or ASSET_EXT.search(path):
        return None
    if not path.endswith("/"):
        path += "/"
    return f"https://{HOST}{path}"


def local_path_for(url: str, is_page: bool) -> Path:
    path = urlsplit(url).path
    if is_page:
        path = path.rstrip("/") + "/index.html"
        if path == "/index.html":
            path = "index.html"
    return OUT / path.lstrip("/")


def rewrite(text: str) -> str:
    for pat in (
        f"https://{HOST}", f"http://{HOST}",
        f"https://www.{HOST}", f"http://www.{HOST}",
    ):
        text = text.replace(pat, "")
        text = text.replace(pat.replace("/", r"\/"), "")
    text = text.replace(f"//{HOST}", "")
    return text


def save(path: Path, data: bytes):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def fetch(url: str) -> requests.Response | None:
    try:
        r = session.get(url, timeout=30)
        if r.status_code == 200:
            return r
        failed.append(f"{r.status_code} {url}")
    except requests.RequestException as e:
        failed.append(f"ERR {url} ({e})")
    return None


def collect_asset_urls(text: str, base_url: str) -> set[str]:
    urls = set()
    # absolute same-host, root-relative, and relative refs in attributes/css
    for m in re.finditer(
        r"""(?:src|href)=["']([^"']+)["']|url\(\s*['"]?([^'")]+)['"]?\s*\)""",
        text,
    ):
        ref = m.group(1) or m.group(2)
        urls.add(ref)
    # srcset entries
    for m in re.finditer(r"""srcset=["']([^"']+)["']""", text):
        for part in m.group(1).split(","):
            ref = part.strip().split(" ")[0]
            if ref:
                urls.add(ref)
    out = set()
    for ref in urls:
        if ref.startswith("data:") or ref.startswith("#"):
            continue
        absu = urljoin(base_url, ref)
        s = urlsplit(absu)
        if s.netloc not in (HOST, "www." + HOST):
            continue
        if ASSET_EXT.search(s.path):
            out.add(f"https://{HOST}{s.path}")
    return out


def download_asset(url: str):
    if url in assets_done:
        return
    assets_done.add(url)
    r = fetch(url)
    if r is None:
        return
    path = local_path_for(url, is_page=False)
    if url.lower().endswith((".css", ".js", ".json", ".xml", ".svg", ".txt")):
        text = rewrite(r.text)
        save(path, text.encode("utf-8"))
        if url.lower().endswith(".css"):
            for sub in collect_asset_urls(r.text, url):
                download_asset(sub)
    else:
        save(path, r.content)


def crawl():
    queue = [START]
    while queue:
        url = queue.pop(0)
        if url in pages_done:
            continue
        pages_done.add(url)
        r = fetch(url)
        if r is None:
            continue
        ctype = r.headers.get("content-type", "")
        if "text/html" not in ctype:
            continue
        html = r.text
        # discover linked pages
        for m in re.finditer(r"""href=["']([^"'#]+)["']""", html):
            cand = norm_page(urljoin(url, m.group(1)))
            if cand and cand not in pages_done and len(pages_done) + len(queue) < 200:
                queue.append(cand)
        # discover + download assets
        for a in collect_asset_urls(html, url):
            download_asset(a)
        save(local_path_for(url, is_page=True), rewrite(html).encode("utf-8"))
        print(f"[{len(pages_done):3}] page  {urlsplit(url).path}  (queue {len(queue)})", flush=True)
        time.sleep(0.15)


if __name__ == "__main__":
    crawl()
    print(f"\npages: {len(pages_done)}  assets: {len(assets_done)}  failures: {len(failed)}")
    for f in failed[:40]:
        print("  " + f)
