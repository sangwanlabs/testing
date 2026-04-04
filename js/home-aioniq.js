/* ============================================================
   PARKAR.IN — Main JavaScript
   ============================================================ */

// --- Nav scroll effect ---
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
    nav.style.background = 'rgba(7,13,26,0.97)';
  } else {
    nav.classList.remove('scrolled');
    nav.style.background = 'rgba(7,13,26,0.85)';
  }
});

// --- Mobile hamburger ---
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.nav-menu');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('mobile-open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}

// --- Counter animation ---
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    const display = Number.isInteger(target)
      ? Math.floor(current)
      : current.toFixed(1);
    el.textContent = prefix + display + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// --- Intersection Observer for counters & animations ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (el.classList.contains('stat-num')) {
        animateCounter(el);
        observer.unobserve(el);
      }
      if (el.classList.contains('fade-up')) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.unobserve(el);
      }
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.stat-num, .fade-up').forEach(el => {
  if (el.classList.contains('fade-up')) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  }
  observer.observe(el);
});

// --- Smooth active nav highlight on scroll ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// --- Staggered card entry animation ---
document.querySelectorAll('.solution-card, .usecase-card, .industry-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
  observer.observe(card);
  card.classList.add('fade-up');
});
