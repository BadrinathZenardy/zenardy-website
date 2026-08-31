# Zenardy Website (static mirror)

Static mirror of [zenardy.com](https://zenardy.com), deployable to GitHub Pages.

## Layout

- `site/` — the mirrored site (61+ pages, all assets, fully relative URLs)
- `mirror.py` — re-syncs `site/` from the live site (rewrites URLs root-relative)
- `relativize.py` — converts root-relative URLs to relative; run once after `mirror.py`
- `serve.py` — local dev server with form handling (submissions logged to `submissions.jsonl`)

## Run locally

```
python serve.py          # http://localhost:8080/
```

## Re-sync from the live site

```
python mirror.py
python relativize.py
```

## Branches / deployment

- `main` — deployed to GitHub Pages automatically on push (`.github/workflows/deploy-pages.yml`)
- `stage` — working branch; merge into `main` to deploy

Note: GitHub Pages is static hosting — the contact/careers forms render but
cannot submit there (they work under `serve.py` locally).
