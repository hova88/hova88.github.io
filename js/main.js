(function () {
  'use strict';

  /* Mobile menu */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');

  if (toggle && menu) {
    function setMenuOpen(open) {
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', open);

      if (open) {
        menu.removeAttribute('hidden');
        menu.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(function () {
          menu.classList.add('open');
        });
      } else {
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        menu.addEventListener('transitionend', function onEnd(e) {
          if (e.propertyName === 'opacity' && !menu.classList.contains('open')) {
            menu.setAttribute('hidden', '');
            menu.removeEventListener('transitionend', onEnd);
          }
        });
      }
    }

    toggle.addEventListener('click', function () {
      setMenuOpen(!toggle.classList.contains('is-active'));
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });
  }

  /* Back to top */
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* TOC scroll spy */
  var toc = document.querySelector('.left-toc');
  if (!toc) return;

  var links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  var sections = links
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  function setActive(id) {
    links.forEach(function (link) {
      var active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach(function (s) {
    observer.observe(s.el);
  });
})();
