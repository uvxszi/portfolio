# uvxszi's portfolio website

Static site for [uvxszi.com](https://uvxszi.com), hosted on GitHub Pages and published by GitHub Actions workflow on every push to `main`.

- `index.html`, `works.html`, `about.html`, `services.html`, `contact.html` — the pages
- `404.html` — shown by GitHub Pages for any missing address
- `assets/style.css` — all styling (colors are the variables at the top)
- `assets/script.js` — light/dark switch, click-to-copy contacts, and tab switching on the Works page
- `assets/works-data.js` — the list of works; the only file to edit when adding one
- `assets/works-render.js` — turns that list into the Works page's HTML
- `assets/works/` — icons for the works
- `brand/` — logo
- `tools/` and `.github/workflows/deploy.yml` — the publishing steps (see below)

Links are written without `.html` (`/about`, `/works`) and start from the site root, which GitHub Pages serves as-is. Opening the files straight from disk won't find the stylesheet, so preview through a local web server that also resolves extensionless addresses.

## Adding a work

Open `assets/works-data.js`, find the category and tab it belongs in, and add an entry to that tab's `items`:

```text
{
  title: 'Name of the work',
  summary: 'One or two sentences about it.',
  icon: '/assets/works/some-image.png',
  links: [
    { label: 'Button text', url: 'https://example.com' },
  ],
},
```

Only `title` is required. Icons are always shown at 64 × 64 whatever the file's size. Tabs and categories are added the same way in that file, and the number on each tab is counted automatically.

## Publishing

Requires **Settings → Pages → Source: GitHub Actions** in the repository. On each push to `main`, `.github/workflows/deploy.yml`:

1. runs `tools/build.js`, which copies the site into `_site`, writes the Works list into `works.html` as plain HTML (so search engines don't need JavaScript to read it), and generates `sitemap.xml` with each page's last-commit date;
2. publishes `_site` to GitHub Pages;
3. runs `tools/indexnow.js`, which tells IndexNow (Bing, and through it DuckDuckGo) which pages changed.

Nothing needs to be run by hand. Locally the Works page builds itself in the browser from the same two files, so it looks the same without the build step. To see exactly what gets published, run `node tools/build.js` and look in `_site` (ignored by git).

## Search engines

- `sitemap.xml` is generated at publish time, so there is no sitemap file in the repository. New `.html` pages in the root are picked up automatically.
- `robots.txt` points crawlers at the sitemap.
- The long `.txt` file in the root is the IndexNow key that proves the site sent the request. It is meant to be public and must not be renamed or deleted.
- Each page's `<head>` has a `<title>`, a `<meta name="description">`, a canonical address, and a block of structured data (`application/ld+json`). If you change what a page says, keep those in step with it.
