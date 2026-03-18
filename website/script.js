// ============================================
//   AYOMIDE OBADINA — script.js
//   Scroll effects, cursor, nav, animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- CUSTOM CURSOR ----
  const cursor = document.querySelector('.cursor');
  const trail = document.querySelector('.cursor-trail');

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
    }, 80);
  });

  // Cursor hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .skill-card, .stat-card, .project-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      trail.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      trail.classList.remove('hover');
    });
  });


  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // ---- SMOOTH ACTIVE NAV LINK ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const activateNavLink = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--accent)';
      }
    });
  };

  window.addEventListener('scroll', activateNavLink);


  // ---- SCROLL REVEAL (IntersectionObserver) ----
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));


  // ---- SKILL BAR ANIMATION ----
  const skillCards = document.querySelectorAll('.skill-card');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, parseInt(entry.target.style.getPropertyValue('--i') || 0) * 100);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillCards.forEach(card => skillObserver.observe(card));


  // ---- TYPING EFFECT ON HERO TAG ----
  const heroTag = document.querySelector('.hero-tag');
  if (heroTag) {
    const original = heroTag.textContent;
    heroTag.textContent = '';
    let i = 0;
    const typeIt = () => {
      if (i < original.length) {
        heroTag.textContent += original[i];
        i++;
        setTimeout(typeIt, 55);
      }
    };
    // Start after a short delay
    setTimeout(typeIt, 300);
  }


  // ---- PARALLAX ON HERO GRID ----
  const heroGrid = document.querySelector('.hero-bg-grid');
  window.addEventListener('scroll', () => {
    if (heroGrid) {
      const offset = window.scrollY * 0.3;
      heroGrid.style.transform = `translateY(${offset}px)`;
    }
  });


  // ---- STAT CARD COUNT-UP ANIMATION ----
  const statNums = document.querySelectorAll('.stat-num');

  const countUp = (el) => {
    const raw = el.textContent.trim();
    // Skip non-numeric symbols
    if (raw === '∞' || raw.includes('%') === false && isNaN(parseInt(raw))) return;

    const isPercent = raw.includes('%');
    const hasPlus = raw.includes('+');
    const target = parseInt(raw);
    if (isNaN(target)) return;

    let count = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      el.textContent = count + (isPercent ? '%' : '') + (hasPlus ? '+' : '');
    }, 30);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statNums.forEach(num => statObserver.observe(num));


  // ---- SMOOTH ANCHOR SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ---- TILT EFFECT ON PROJECT CARDS ----
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, border-color 0.3s';
    });
  });

});