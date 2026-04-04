/* =============================================
   PARKAR.IN – About Page JS
   js/page-about.js
   =============================================
   Handles:
   1. Scroll-reveal (fade-up / fade-in)
   2. Year tab navigation (Origin + Journey)
   3. Leadership card expand/collapse
   ============================================= */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. SCROLL REVEAL (IntersectionObserver)
  ───────────────────────────────────────── */
  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    document.querySelectorAll('.fade-up, .fade-in').forEach((el, _i, all) => {
      // Stagger siblings inside the same parent grid/flex container
      const parent   = el.parentElement;
      const siblings = parent
        ? Array.from(parent.querySelectorAll(':scope > .fade-up, :scope > .fade-in'))
        : [];

      if (siblings.length > 1) {
        const idx = siblings.indexOf(el);
        if (idx > -1) el.style.transitionDelay = `${idx * 0.09}s`;
      }

      observer.observe(el);
    });
  }


  /* ─────────────────────────────────────────
     2. YEAR TABS (Origin + Journey sync)
  ───────────────────────────────────────── */
  function initYearTabs() {
    const tabs    = document.querySelectorAll('.year-tab');
    const panels  = document.querySelectorAll('.journey-panel');
    const images  = document.querySelectorAll('.journey-img');

    if (!tabs.length) return;

    function activateYear(year) {
      // Update tabs
      tabs.forEach((t) => {
        const isActive = t.dataset.year === year;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update panels
      panels.forEach((p) => {
        p.classList.toggle('active', p.dataset.panel === year);
      });

      // Update images (cross-fade)
      images.forEach((img) => {
        img.classList.toggle('active', img.dataset.img === year);
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        activateYear(tab.dataset.year);

        // Scroll the clicked tab into view within the tab bar (mobile)
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });

      // Keyboard: arrow keys to navigate years
      tab.addEventListener('keydown', (e) => {
        const tabList = Array.from(tabs);
        const idx     = tabList.indexOf(tab);
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          const next = tabList[(idx + 1) % tabList.length];
          next.focus();
          activateYear(next.dataset.year);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          const prev = tabList[(idx - 1 + tabList.length) % tabList.length];
          prev.focus();
          activateYear(prev.dataset.year);
        }
      });
    });

    // Initialise with the active tab's year (defaults to 2025 in HTML)
    const activeTab = document.querySelector('.year-tab.active');
    if (activeTab) activateYear(activeTab.dataset.year);
  }


  /* ─────────────────────────────────────────
     3. LEADERSHIP CARDS (accordion expand)
  ───────────────────────────────────────── */
  function initLeadershipCards() {
    const cards = document.querySelectorAll('.leader-card');

    if (!cards.length) return;

    cards.forEach((card) => {
      const toggleCard = () => {
        const isOpen = card.classList.contains('open');

        // Close all other cards
        cards.forEach((c) => {
          if (c !== card) c.classList.remove('open');
        });

        // Toggle this card
        card.classList.toggle('open', !isOpen);
      };

      card.addEventListener('click', toggleCard);

      // Keyboard: Enter / Space
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard();
        }
      });
    });
  }


  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initYearTabs();
    initLeadershipCards();
  });

})();
