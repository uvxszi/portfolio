// Tells IndexNow (used by Bing, and through it DuckDuckGo) which pages changed, so they are
// re-crawled quickly. Run by .github/workflows/deploy.yml after the site has been published.
//
//   BEFORE / AFTER   the commits to compare; without them every page is submitted
//   --dry-run        print what would be sent without sending it
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { root, origin, pages, urlFor } = require('./site');

// The key is the name of the <key>.txt file in the site root, which also contains the key.
// It is public by design: it only proves that this site sent the request.
const keyFile = fs.readdirSync(root).find((name) => {
  const key = name.replace(/\.txt$/, '');
  return /^[a-z0-9-]{8,128}\.txt$/i.test(name) && fs.readFileSync(path.join(root, name), 'utf8').trim() === key;
});
if (!keyFile) throw new Error('No IndexNow key file found in the site root.');
const key = keyFile.replace(/\.txt$/, '');

const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const isCommit = (sha) => {
  try {
    git(['cat-file', '-e', sha + '^{commit}']);
    return true;
  } catch (error) {
    return false;
  }
};

const { BEFORE, AFTER } = process.env;
let urls;
if (BEFORE && AFTER && isCommit(BEFORE) && isCommit(AFTER)) {
  const changed = git(['diff', '--name-only', BEFORE, AFTER]).split('\n').filter(Boolean);
  const touched = (source) => changed.some((file) => (source.endsWith('/') ? file.startsWith(source) : file === source));
  urls = pages().filter((page) => page.sources.some(touched)).map((page) => page.url);
  // Pages that were deleted: submit them too, so they are dropped from the index.
  for (const file of changed) {
    if (/^[^/]+\.html$/.test(file) && file !== '404.html' && !fs.existsSync(path.join(root, file))) urls.push(urlFor(file));
  }
} else {
  urls = pages().map((page) => page.url);
}

const body = { host: new URL(origin).host, key, keyLocation: origin + '/' + keyFile, urlList: urls };

if (!urls.length) {
  console.log('No page content changed; nothing to submit.');
} else if (process.argv.includes('--dry-run')) {
  console.log('Dry run, not sent:');
  console.log(JSON.stringify(body, null, 2));
} else {
  console.log(JSON.stringify(body, null, 2));
  fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(async (response) => {
    console.log('IndexNow answered ' + response.status + ' ' + (await response.text()));
    if (response.status !== 200 && response.status !== 202) process.exit(1);
  });
}
