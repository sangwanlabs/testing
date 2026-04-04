/* =============================================
   PARKAR.IN - Cloud Page Scripts
   js/page-cloud.js
   ============================================= */

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up, .fade-in').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + 's';
  observer.observe(el);
});

// Accordion
function toggleAccordion(header) {
  const item = header.closest('.accordion-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Approach tabs
function toggleApproachTab(header) {
  const tab = header.closest('.approach-tab');
  const isActive = tab.classList.contains('active');
  document.querySelectorAll('.approach-tab').forEach(t => t.classList.remove('active'));
  if (!isActive) tab.classList.add('active');
}

// Custom counters for this page (25-40%, 99.99%, 3X)
function animateCounters() {
  // Stat 1: 25-40%
  const s1 = document.getElementById('stat1');
  let v1 = 0;
  const t1 = setInterval(() => {
    v1 = Math.min(v1 + 1, 40);
    s1.textContent = (v1 < 25 ? v1 : '25\u201340') + '%';
    if (v1 >= 40) { s1.textContent = '25\u201340%'; clearInterval(t1); }
  }, 40);

  // Stat 2: 99.99%
  const s2 = document.getElementById('stat2');
  let v2 = 99;
  const t2 = setInterval(() => {
    v2 = Math.min(v2 + 0.01, 99.99);
    s2.textContent = v2.toFixed(2) + '%';
    if (v2 >= 99.99) { s2.textContent = '99.99%'; clearInterval(t2); }
  }, 30);

  // Stat 3: 3X
  const s3 = document.getElementById('stat3');
  let v3 = 0;
  const t3 = setInterval(() => {
    v3 = Math.min(v3 + 0.1, 3);
    s3.textContent = v3.toFixed(1) + 'X';
    if (v3 >= 3) { s3.textContent = '3X'; clearInterval(t3); }
  }, 40);
}
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { animateCounters(); statsObserver.disconnect(); }
}, { threshold: 0.3 });
const statsEl = document.querySelector('.stats');
if (statsEl) statsObserver.observe(statsEl);

// GSAP hero ellipse
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to('#heroEllipse', {
    rotation: 720,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 }
  });
}
