// Turns the list in works-data.js into the HTML of the Works page: tabs, counts and cards.
//
// It is used in two places, so both always produce the same page:
//   - on GitHub, tools/build.js writes the result into works.html before publishing, so
//     search engines and visitors get plain HTML;
//   - in the browser, script.js calls it when the page was not built (local preview).

window.renderWorks = function (works) {
  var esc = function (text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };
  var slug = function (name) {
    return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  // The small numbered box on a tab.
  var count = function (n) {
    return '<span class="count' + (n ? ' filled' : '') + '" title="' + n + (n === 1 ? ' item' : ' items') + '">' + n + '</span>';
  };

  // One row of tab buttons. Each entry: { id, name, color, total }.
  var tablist = function (label, entries) {
    return '<div class="tablist" role="tablist" aria-label="' + esc(label) + '" hidden>\n' +
      entries.map(function (entry) {
        return '<button class="tab' + (entry.color ? ' c-' + esc(entry.color) : '') + '" type="button" role="tab" id="tab-' + entry.id +
          '" aria-controls="' + entry.id + '">' + esc(entry.name) + count(entry.total) + '</button>\n';
      }).join('') +
      '</div>\n';
  };

  // One card: icon, title, summary, and a button per link.
  var card = function (item) {
    var html = '<article class="item">\n';
    if (item.icon) {
      html += '<img class="item-img" src="' + esc(item.icon) + '" alt="' + esc(item.title) + ' icon" width="64" height="64">\n';
    }
    html += '<div>\n<h3>' + esc(item.title) + '</h3>\n';
    if (item.summary) html += '<p>' + esc(item.summary) + '</p>\n';
    if (item.links && item.links.length) {
      html += '<p class="item-links">\n' +
        item.links.map(function (link) {
          return '<a class="btn btn-sm" href="' + esc(link.url) + '">' + esc(link.label) + '</a>\n';
        }).join('') +
        '</p>\n';
    }
    return html + '</div>\n</article>\n';
  };

  var categories = works.map(function (category) {
    var id = slug(category.name);
    var tabs = (category.tabs || []).map(function (tab) {
      var items = tab.items || [];
      return { id: id + '-' + slug(tab.name), name: tab.name, items: items, total: items.length };
    });
    var total = tabs.reduce(function (sum, tab) { return sum + tab.total; }, 0);
    return { id: id, name: category.name, color: category.color, tabs: tabs, total: total };
  });

  return tablist('Categories', categories) + categories.map(function (category) {
    return '<section class="panel' + (category.color ? ' c-' + esc(category.color) : '') + '" id="' + category.id +
      '" role="tabpanel" aria-labelledby="tab-' + category.id + '">\n' +
      '<h2 class="panel-title">' + esc(category.name) + '</h2>\n' +
      '<div class="subtabs" data-tabs>\n' +
      tablist(category.name, category.tabs) +
      category.tabs.map(function (tab) {
        return '<div class="panel window" id="' + tab.id + '" role="tabpanel" aria-labelledby="tab-' + tab.id + '">\n' +
          '<p class="window-bar">' + esc(category.name) + ' / ' + esc(tab.name) + '</p>\n' +
          '<div class="window-body">\n' +
          (tab.items.length ? tab.items.map(card).join('') : '<p class="empty">Nothing here yet.</p>\n') +
          '</div>\n</div>\n';
      }).join('') +
      '</div>\n</section>\n';
  }).join('');
};
