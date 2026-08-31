"""Convert root-relative URLs in site/ to relative ones.

Makes the mirror portable to any base path (GitHub Pages project sites
serve under /<repo>/, where root-relative /wp-content/... would break).
Run after mirror.py whenever the mirror is re-synced.
"""
import re
from pathlib import Path

SITE = Path(__file__).parent / "site"


def rel_prefix(depth: int) -> str:
    return "../" * depth if depth else "./"


def fix_html(text: str, depth: int) -> str:
    pre = rel_prefix(depth)

    # href/src/action/poster/content attributes with root-relative values
    def attr(m):
        val = m.group(3)
        return f"{m.group(1)}={m.group(2)}{pre}{val.lstrip('/')}{m.group(2)}" \
            if val != "/" else f"{m.group(1)}={m.group(2)}{pre}{m.group(2)}"

    text = re.sub(
        r"""\b(href|src|action|poster|content)=(["'])(/[^/"'][^"']*|/)\2""",
        attr, text,
    )

    # srcset attribute entries
    def srcset(m):
        parts = []
        for part in m.group(2).split(","):
            part = part.strip()
            if part.startswith("/") and not part.startswith("//"):
                part = pre + part.lstrip("/")
            parts.append(part)
        return f"srcset={m.group(1)}{', '.join(parts)}{m.group(1)}"

    text = re.sub(r"""srcset=(["'])([^"']+)\1""", srcset, text)

    # url(/...) in inline styles and <style> blocks
    text = re.sub(
        r"""url\(\s*(['"]?)/([^/'")][^'")]*)\1\s*\)""",
        lambda m: f"url({m.group(1)}{pre}{m.group(2)}{m.group(1)})", text,
    )

    # JSON-escaped root-relative refs (elementor data-settings, wpcf7 api root)
    esc = pre.replace("/", r"\/")
    for seg in ("wp-content", "wp-includes", "wp-json"):
        text = text.replace(f"\\/{seg}\\/", f"{esc}{seg}\\/")
    return text


def fix_css(text: str, depth: int) -> str:
    pre = rel_prefix(depth)
    text = re.sub(
        r"""url\(\s*(['"]?)/([^/'")][^'")]*)\1\s*\)""",
        lambda m: f"url({m.group(1)}{pre}{m.group(2)}{m.group(1)})", text,
    )
    return re.sub(
        r"""@import\s+(['"])/([^'"]+)\1""",
        lambda m: f"@import {m.group(1)}{pre}{m.group(2)}{m.group(1)}", text,
    )


def main():
    n_html = n_css = 0
    for f in SITE.rglob("*"):
        if f.suffix.lower() not in (".html", ".css"):
            continue
        depth = len(f.relative_to(SITE).parts) - 1
        text = f.read_text(encoding="utf-8", errors="ignore")
        fixed = fix_html(text, depth) if f.suffix.lower() == ".html" else fix_css(text, depth)
        if fixed != text:
            f.write_text(fixed, encoding="utf-8")
            if f.suffix.lower() == ".html":
                n_html += 1
            else:
                n_css += 1
    print(f"relativized: {n_html} html, {n_css} css files")


if __name__ == "__main__":
    main()
