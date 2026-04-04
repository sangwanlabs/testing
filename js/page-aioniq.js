/* =============================================
   PARKAR.IN - AIONIQ Page Script
   js/page-aioniq.js
   Neural network canvas + GSAP scroll animations
   ============================================= */

(function () {
  'use strict';

  /* ─── Neural Network Canvas ─── */
  const canvas = document.getElementById('aiq-neural-network');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x      = Math.random() * canvas.width;
      this.y      = Math.random() * canvas.height;
      this.vx     = (Math.random() - 0.5) * 0.5;
      this.vy     = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 217, 255, 0.5)';
      ctx.fill();
    }
  }

  const particles = [];
  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 * (1 - dist / 150)})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();

  /* ─── GSAP Scroll Animations ─── */
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Problem cards
  gsap.utils.toArray('.aiq-problem-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
      y: 100, opacity: 0, duration: 0.8, delay: i * 0.2
    });
  });

  // Framework phases
  gsap.utils.toArray('.aiq-framework-phase').forEach((phase, i) => {
    gsap.from(phase, {
      scrollTrigger: { trigger: phase, start: 'top 80%', toggleActions: 'play none none reverse' },
      x: -100, opacity: 0, duration: 1, delay: i * 0.3
    });
  });

  // Feature cards
  gsap.utils.toArray('.aiq-feature-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
      scale: 0.8, opacity: 0, duration: 0.6, delay: i * 0.1
    });
  });

  // Architecture layers
  gsap.utils.toArray('.aiq-arch-layer').forEach((layer, i) => {
    gsap.from(layer, {
      scrollTrigger: { trigger: layer, start: 'top 85%', toggleActions: 'play none none reverse' },
      x: i % 2 === 0 ? -150 : 150, opacity: 0, duration: 1, ease: 'power3.out'
    });
  });

  // Scorecard dimension rows + progress bars
  gsap.utils.toArray('.aiq-dimension').forEach((dim, i) => {
    gsap.from(dim, {
      scrollTrigger: { trigger: dim, start: 'top 85%', toggleActions: 'play none none reverse' },
      x: -50, opacity: 0, duration: 0.6, delay: i * 0.1
    });

    const bar   = dim.querySelector('.aiq-bar-fill');
    const width = bar.style.width;
    bar.style.width = '0%';

    gsap.to(bar, {
      scrollTrigger: { trigger: dim, start: 'top 85%', toggleActions: 'play none none reverse' },
      width: width, duration: 1.5, delay: 0.3, ease: 'power2.out'
    });
  });

  // Smooth scroll for anchor links within this page
  document.querySelectorAll('a[href^="#aiq-"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        gsap.to(window, { duration: 1, scrollTo: target, ease: 'power3.inOut' });
      }
    });
  });

})();
