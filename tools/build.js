// Builds the folder that GitHub Pages publishes (_site).
// Run automatically by .github/workflows/deploy.yml on every push. To try it locally: node tools/build.js
//
// It does three things:
//   1. copies the site into _site
//   2. writes the Works list into works.html as plain HTML (from assets/works-data.js)
//   3. writes sitemap.xml, dating each page by its last commit
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { root, pages } = require('./site');

const out = path.join(root, '_site');
const skip = ['_site', 'tools', 'node_modules', 'README.md'];

// 1. Copy everything except hidden files and the names above.
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
for (const name of fs.readdirSync(root)) {
  if (name.startsWith('.') || skip.includes(name)) continue;
  fs.cpSync(path.join(root, name), path.join(out, name), { recursive: true });
}

// 2. Works page. The two scripts only expect a "window" to attach to.
global.window = {};
require(path.join(root, 'assets', 'works-data.js'));
require(path.join(root, 'assets', 'works-render.js'));

const replaceOnce = (text, find, replacement) => {
  if (!text.includes(find)) throw new Error('works.html: could not find ' + find);
  return text.replace(find, () => replacement);
};
const worksFile = path.join(out, 'works.html');
let works = fs.readFileSync(worksFile, 'utf8');
works = replaceOnce(works, '<div class="works" data-works data-tabs></div>',
  '<div class="works" data-works data-tabs>\n' + window.renderWorks(window.WORKS) + '</div>');
// The built page already contains the list, so it no longer needs these two files.
for (const script of ['works-data.js', 'works-render.js']) {
  works = works.replace(new RegExp('[ \\t]*<script src="/assets/' + script.replace('.', '\\.') + '"></script>\\r?\\n'), '');
  fs.rmSync(path.join(out, 'assets', script));
}
fs.writeFileSync(worksFile, works);

// 3. Sitemap. A page's date is the last commit that touched it (or anything it is built from).
const today = new Date().toISOString().slice(0, 10);
const lastChanged = (sources) => {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--'].concat(sources), { cwd: root, encoding: 'utf8' }).trim() || today;
  } catch (error) {
    return today;
  }
};
const entries = pages().map((page) => '  <url><loc>' + page.url + '</loc><lastmod>' + lastChanged(page.sources) + '</lastmod></url>\n');
fs.writeFileSync(path.join(out, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries.join('') + '</urlset>\n');

console.log('Built _site with ' + entries.length + ' pages:\n' + entries.join(''));
