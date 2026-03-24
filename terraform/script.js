// =============================================
//   AYOMIDE OBADINA — script.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.querySelector('.nav-links');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // ---- NAVBAR SCROLL SHRINK ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ---- ACTIVE NAV LINK ----
  const sections = document.querySelectorAll('header[id], section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  // ---- SCROLL REVEAL ----
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.scroll-reveal').forEach(el => revealObs.observe(el));

  // ---- TYPING EFFECT — type once, then show blinking cursor ----
  const heroTag = document.querySelector('.hero-tag');
  if (heroTag) {
    const text = heroTag.textContent.trim();
    heroTag.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        heroTag.textContent += text[i++];
        setTimeout(type, 55);
      } else {
        heroTag.classList.add('typed-done');
      }
    };
    setTimeout(type, 600);
  }

  // ---- PARALLAX HERO GRID ----
  const grid = document.querySelector('.hero-grid-bg');
  window.addEventListener('scroll', () => {
    if (grid) grid.style.transform = 'translateY(' + (window.scrollY * 0.28) + 'px)';
  });

  // ---- COUNT-UP STATS ----
  const countUp = (el) => {
    const raw = el.textContent.trim();
    if (raw === '\u221e') return;
    const isPercent = raw.includes('%');
    const hasPlus   = raw.includes('+');
    const target    = parseInt(raw);
    if (isNaN(target)) return;
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      count += step;
      if (count >= target) { count = target; clearInterval(timer); }
      el.textContent = count + (isPercent ? '%' : '') + (hasPlus ? '+' : '');
    }, 28);
  };
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); statObs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-num').forEach(n => statObs.observe(n));

  // ---- SMOOTH ANCHOR SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ---- 3D TILT ON PROJECT CARDS ----
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / r.height) * -6;
      const ry = ((e.clientX - r.left - r.width  / 2) / r.width)  *  6;
      card.style.transition = 'transform 0.1s ease, border-color 0.3s, box-shadow 0.3s';
      card.style.transform  = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease, border-color 0.3s, box-shadow 0.3s';
      card.style.transform  = '';
    });
  });

  // ---- LIGHT / DARK MODE TOGGLE ----
  const themeBtn = document.getElementById('theme-toggle');
  const isInitiallyLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  if (isInitiallyLight) document.body.classList.add('light');
  if (themeBtn) {
    themeBtn.textContent = isInitiallyLight ? '\u2600' : '\u263E';
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light');
      const isLight = document.body.classList.contains('light');
      themeBtn.textContent = isLight ? '\u2600' : '\u263E';
      themeBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }

});
