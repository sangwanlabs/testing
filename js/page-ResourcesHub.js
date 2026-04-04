/* =============================================
   PARKAR.IN – Resource Centre JS
   js/page-ResourcesHub.js
   ============================================= */

(function () {
  'use strict';

  function init() {

    /* ── 1. Scroll Reveal ── */
    var revealObserver;
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      // Fallback: just show everything
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ── 2. Tab Switching (ResourcesHub) ── */
    var tabBtns  = document.querySelectorAll('.rc-tab-btn');
    var tabPanes = document.querySelectorAll('.rc-tab-pane');

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');

        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        tabPanes.forEach(function (p) { p.classList.remove('active'); });

        btn.classList.add('active');
        var pane = document.getElementById('tab-' + target);
        if (pane) {
          pane.classList.add('active');
          if (revealObserver) {
            pane.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
              revealObserver.observe(el);
            });
          }
        }
      });
    });

    /* ── 3. Category Filter Pills (Insights page) ── */
    var filterPills = document.querySelectorAll('.rc-filter-pill');
    var filterItems = document.querySelectorAll('.rc-filterable');

    for (var i = 0; i < filterPills.length; i++) {
      (function (pill) {
        pill.addEventListener('click', function () {
          var category = pill.textContent.trim();

          // Update active pill
          for (var j = 0; j < filterPills.length; j++) {
            filterPills[j].classList.remove('active');
          }
          pill.classList.add('active');

          // Show/hide cards
          for (var k = 0; k < filterItems.length; k++) {
            var item = filterItems[k];
            if (category === 'All') {
              item.style.display = '';
            } else {
              var itemCat = item.getAttribute('data-category') || '';
              item.style.display = (itemCat === category) ? '' : 'none';
            }
          }
        });
      })(filterPills[i]);
    }
  }

  // Run immediately since script is at bottom of body,
  // but also handle case where DOM isn't ready yet
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
