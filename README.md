# Thinkvistar website

Static marketing website for Thinkvistar LLP (https://thinkvistar.com) with a small PHP endpoint for the contact form.

The **repository root is the deployable site** (upload it to `public_html/`). The HTML pages and `/assets` in the root are **generated** — edit the sources in `_src/` and rebuild.

## Editing content

| What to change | Where |
| --- | --- |
| Services, projects/blueprints, stats, clients, contact details, footer links, privacy & terms text | `_src/site-data.json` |
| Page titles, meta descriptions, breadcrumbs, FAQs, structured data | `_src/pages.mjs` |
| Page body HTML (sections, headings, copy) | `_src/pages/<page>.html` |
| Shared `<head>`, header, footer | `_src/layout.mjs` |
| Styles | `_src/css/site.css` (original design) and `_src/css/additions.css` |
| Rendering logic, estimator, contact form | `_src/js/main.js` |

FAQs are written once in `pages.mjs`; the build renders them on the page **and** as FAQPage structured data, so the two never drift apart. Only publish genuine testimonials, client names and metrics.

## Building

Requires Node.js 18+ and Microsoft Edge or Google Chrome (used headlessly to pre-render pages).

```bash
cd _src
npm install        # first time only
npm run build      # writes the pages, /assets, sitemap.xml into the repo root
node check.mjs     # optional QA: loads every page on desktop + mobile, reports errors, saves screenshots
```

The build:

1. fingerprints CSS/JS into `/assets` (file names change when content changes, so browsers can cache them for a year);
2. assembles each page from the shared layout and its body;
3. **pre-renders** the JavaScript-driven sections (navigation, services, projects, footer, legal text) into the HTML, so search engines, AI crawlers and link previews see the full content without running JavaScript;
4. regenerates `sitemap.xml`.

`npm run build:fast` skips pre-rendering (useful while editing; always do a full build before deploying).

## Running locally

```bash
php -S 127.0.0.1:8000
```

Open http://127.0.0.1:8000. For the contact form, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Structure

```
index.html, about/, services/, industries/, tech-stack/, projects/,
estimator/, contact/, privacy/, terms/, case-study/, 404.html   ← generated pages
assets/            generated, fingerprinted CSS/JS
fonts/             self-hosted Inter (woff2)
images/            logos, OG image, client logos, illustrations
api/               PHP contact endpoint (config.php is git-ignored)
.htaccess          HTTPS + canonical host redirects, 404 page, caching, compression
robots.txt, sitemap.xml
_src/              sources + build tooling (blocked from the web by .htaccess)
```
