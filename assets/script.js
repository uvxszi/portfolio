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

  // "Copy address" buttons.
  document.querySelectorAll('[data-copy]').forEach(function (button) {
    if (!navigator.clipboard) return;
    var status = document.querySelector('.copy-status');
    button.hidden = false;
    button.addEventListener('click', function () {
      navigator.clipboard.writeText(button.dataset.copy).then(function () {
        if (status) status.textContent = 'Copied ' + button.dataset.copy;
      });
    });
  });

  // 404 page: show the address that was asked for.
  var path = document.querySelector('[data-path]');
  if (path) path.textContent = window.location.pathname;
})();
