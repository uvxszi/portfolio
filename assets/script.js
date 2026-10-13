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

  // Tabs (Works page). Without JS every panel is simply shown in order.
  var allTabs = [];
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var list = group.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    var select = function (tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach(function (tab, i) {
      // Small box with the number of items ([data-item]) inside this tab's panel.
      var items = document.getElementById(tab.getAttribute('aria-controls')).querySelectorAll('[data-item]').length;
      var count = document.createElement('span');
      count.className = items ? 'count filled' : 'count';
      count.textContent = items;
      count.title = items + (items === 1 ? ' item' : ' items');
      tab.appendChild(count);

      tab.addEventListener('click', function () {
        select(tab);
        history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
      });
      tab.addEventListener('keydown', function (event) {
        var step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        var next = tabs[(i + step + tabs.length) % tabs.length];
        next.focus();
        next.click();
      });
    });
    list.hidden = false;
    group.classList.add('tabs-ready');
    select(tabs[0]);
    allTabs = allTabs.concat(tabs);
  });

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
