// Shared by the deploy scripts: where the site lives and which pages it has.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const origin = 'https://' + fs.readFileSync(path.join(root, 'CNAME'), 'utf8').trim();

// Files that change what a page says, besides the page's own .html file.
// A name ending in "/" means everything in that folder.
const extraSources = {
  'works.html': ['assets/works-data.js', 'assets/works-render.js', 'assets/works/'],
};

// Every published page: each .html file in the root except the 404 page.
function pages() {
  return fs.readdirSync(root)
    .filter((file) => file.endsWith('.html') && file !== '404.html')
    .sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)))
    .map((file) => ({ file, url: urlFor(file), sources: [file].concat(extraSources[file] || []) }));
}

// index.html -> https://uvxszi.com/      about.html -> https://uvxszi.com/about
function urlFor(file) {
  return origin + '/' + (file === 'index.html' ? '' : file.replace(/\.html$/, ''));
}

module.exports = { root, origin, pages, urlFor };
