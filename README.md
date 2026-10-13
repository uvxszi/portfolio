# uvxszi's portfolio website

Static site for [uvxszi.com](https://uvxszi.com), hosted on GitHub Pages. Plain HTML and CSS, no build step.

- `index.html`, `works.html`, `about.html`, `services.html`, `contact.html` — the pages
- `404.html` — shown by GitHub Pages for any missing address
- `assets/style.css` — all styling (colors are the variables at the top)
- `assets/script.js` — light/dark switch, click-to-copy contacts, and the Works tabs; the site still reads fine without it
- `brand/` — logo

Links are written without `.html` (`/about`, `/works`) and start from the site root, which GitHub Pages serves as-is. Opening the files straight from disk won't find the stylesheet, so preview through a local web server that also resolves extensionless addresses.

To add a tab on the Works page, copy a `<button role="tab">` and its matching `role="tabpanel"` block in `works.html`; the button's `aria-controls` must equal the panel's `id`.

The number box on each tab is counted automatically: every element with a `data-item` attribute inside a panel is one item, so give each new work a `data-item` wrapper (see ZyBooks AutoUltra in `works.html`).
