# uvxszi's portfolio website

Static site for [uvxszi.com](https://uvxszi.com), hosted on GitHub Pages. Plain HTML and CSS, no build step.

- `index.html`, `works.html`, `about.html`, `services.html`, `contact.html` — the pages
- `404.html` — shown by GitHub Pages for any missing address
- `assets/style.css` — all styling (colors are the variables at the top)
- `assets/script.js` — light/dark switch, click-to-copy contacts, and the code that builds the Works page
- `assets/works-data.js` — the list of works; the only file to edit when adding one
- `assets/works/` — icons for the works
- `brand/` — logo

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
