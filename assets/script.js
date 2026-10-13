// Small extras only. The site works fully without this file.
(function () {
  var root = document.documentElement;

  // Light / dark switch, remembered between visits.
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    var current = function () {
      if (root.dataset.theme) return root.dataset.theme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    var label = function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      toggle.textContent = next;
      toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    };
    toggle.hidden = false;
    label();
    toggle.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      label();
    });
  }

  // Click to copy: anything with data-copy (email address, Discord username).
  if (navigator.clipboard) {
    var status = document.createElement('span');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    document.body.appendChild(status);

    document.querySelectorAll('.copy-hint').forEach(function (hint) {
      hint.hidden = false;
    });

    document.querySelectorAll('[data-copy]').forEach(function (el) {
      el.title = 'Click to copy';
      el.addEventListener('click', function (event) {
        event.preventDefault();
        navigator.clipboard.writeText(el.dataset.copy).then(function () {
          el.classList.add('copied');
          status.textContent = 'Copied ' + el.dataset.copy;
          setTimeout(function () {
            el.classList.remove('copied');
            status.textContent = '';
          }, 1500);
        }, function () {
          // Copying was blocked: fall back to opening the mail app for email links.
          if (el.href) window.location.href = el.href;
        });
      });
    });
  }

  // Works page: tabs, counts and cards are all built from the list in works-data.js.
  var allTabs = [];
  var el = function (tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  var slug = function (name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  // One card: icon, title, summary, and a button per link.
  var card = function (item) {
    if (!item.title) console.warn('works-data.js: this item has no title, so it will look empty:', item);
    var article = el('article', 'item');
    if (item.icon) {
      var icon = el('img', 'item-img');
      icon.src = item.icon;
      icon.alt = '';
      icon.width = 64;
      icon.height = 64;
      article.appendChild(icon);
    }
    var body = el('div');
    body.appendChild(el('h3', '', item.title));
    if (item.summary) body.appendChild(el('p', '', item.summary));
    if (item.links && item.links.length) {
      var links = el('p', 'item-links');
      item.links.forEach(function (link) {
        var a = el('a', 'btn btn-sm', link.label);
        a.href = link.url;
        links.appendChild(a);
      });
      body.appendChild(links);
    }
    article.appendChild(body);
    return article;
  };

  // A row of tabs plus their panels. Each entry: { id, name, color, count, panel }.
  var tabGroup = function (group, label, entries) {
    var list = el('div', 'tablist');
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', label);
    group.appendChild(list);

    var tabs = entries.map(function (entry) {
      var tab = el('button', entry.color ? 'tab c-' + entry.color : 'tab', entry.name);
      tab.type = 'button';
      tab.id = 'tab-' + entry.id;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', entry.id);

      var count = el('span', entry.count ? 'count filled' : 'count', entry.count);
      count.title = entry.count + (entry.count === 1 ? ' item' : ' items');
      tab.appendChild(count);
      list.appendChild(tab);

      entry.panel.id = entry.id;
      entry.panel.setAttribute('role', 'tabpanel');
      entry.panel.setAttribute('aria-labelledby', tab.id);
      group.appendChild(entry.panel);
      return tab;
    });

    var select = function (tab) {
      tabs.forEach(function (t, i) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        entries[i].panel.hidden = !on;
      });
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        select(tab);
        history.replaceState(null, '', '#' + entries[i].id);
      });
      tab.addEventListener('keydown', function (event) {
        var step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        var next = tabs[(i + step + tabs.length) % tabs.length];
        next.focus();
        next.click();
      });
    });
    select(tabs[0]);
    allTabs = allTabs.concat(tabs);
  };

  var worksMount = document.querySelector('[data-works]');
  if (worksMount && window.WORKS) {
    worksMount.textContent = '';
    tabGroup(worksMount, 'Categories', window.WORKS.map(function (category) {
      var id = slug(category.name);
      var section = el('section', category.color ? 'panel c-' + category.color : 'panel');
      var inner = el('div', 'subtabs');
      var total = 0;
      section.appendChild(inner);

      tabGroup(inner, category.name, (category.tabs || []).map(function (tab) {
        var items = tab.items || [];
        var win = el('div', 'panel window');
        var body = el('div', 'window-body');
        win.appendChild(el('p', 'window-bar', category.name + ' / ' + tab.name));
        win.appendChild(body);
        if (!items.length) body.appendChild(el('p', 'empty', 'Nothing here yet.'));
        items.forEach(function (item) {
          body.appendChild(card(item));
        });
        total += items.length;
        return { id: id + '-' + slug(tab.name), name: tab.name, count: items.length, panel: win };
      }));

      return { id: id, name: category.name, color: category.color, count: total, panel: section };
    }));
  }

  // Open the tab named in the address, e.g. /works#community-sayn.
  var openFromAddress = function () {
    var target = window.location.hash && document.getElementById(window.location.hash.slice(1));
    var chain = [];
    while (target) {
      if (target.getAttribute('role') === 'tabpanel') chain.unshift(target.id);
      target = target.parentElement;
    }
    chain.forEach(function (id) {
      allTabs.forEach(function (tab) {
        if (tab.getAttribute('aria-controls') === id) tab.click();
      });
    });
  };
  if (allTabs.length) {
    openFromAddress();
    window.addEventListener('hashchange', openFromAddress);
  }

  // 404 page: show the address that was asked for.
  var path = document.querySelector('[data-path]');
  if (path) path.textContent = window.location.pathname;
})();
