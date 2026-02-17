/* ============================================================
   DEEPTHI ADDANKI — ROYAL GLASSMORPHISM PORTFOLIO
   main.js — Animations, Interactions & Form Validation
   ============================================================ */

'use strict';

/* ── DOM Ready ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initNavbar();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  setActiveNavLink();
});

/* ── 1. Starfield Background ──────────────────────────────── */
function initStars() {
  const container = document.createElement('div');
  container.className = 'stars';
  document.body.prepend(container);

  const count = window.innerWidth < 768 ? 60 : 120;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    const opacity = Math.random() * 0.5 + 0.15;
    const dur = (Math.random() * 4 + 2).toFixed(1);
    const delay = -(Math.random() * 6).toFixed(1);

    Object.assign(star.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      '--max-opacity': opacity,
      '--dur': `${dur}s`,
      '--delay': `${delay}s`,
    });
    fragment.appendChild(star);
  }
  container.appendChild(fragment);
}

/* ── 2. Navbar ────────────────────────────────────────────── */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const mobile  = document.getElementById('navMobile');

  if (!navbar) return;

  // Scroll effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      mobile.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    mobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobile.contains(e.target)) {
        toggle.classList.remove('open');
        mobile.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ── 3. Active Nav Link ───────────────────────────────────── */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const allLinks = document.querySelectorAll('[data-nav]');
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    const isActive =
      (href === page) ||
      (page === '' && href === 'index.html') ||
      (page === 'index.html' && href === 'index.html');
    link.classList.toggle('active', isActive);
  });
}

/* ── 4. Scroll Reveal ─────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ── 5. Skill Bars ────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const target = bar.dataset.width || '80%';
          // Slight delay for stagger effect
          setTimeout(() => {
            bar.style.width = target;
            bar.classList.add('loaded');
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
}

/* ── 6. Contact Form Validation ───────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name:    { el: form.querySelector('#name'),    minLen: 2,  label: 'Name' },
    email:   { el: form.querySelector('#email'),   minLen: 5,  label: 'Email' },
    subject: { el: form.querySelector('#subject'), minLen: 0,  label: 'Subject', optional: true },
    message: { el: form.querySelector('#message'), minLen: 10, label: 'Message' },
  };

  const success = document.getElementById('formSuccess');

  // Validate on blur
  Object.entries(fields).forEach(([key, field]) => {
    if (!field.el) return;
    field.el.addEventListener('blur', () => validateField(field));
    field.el.addEventListener('input', () => {
      if (field.el.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;

    Object.entries(fields).forEach(([key, field]) => {
      if (!field.el || field.optional) return;
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) return;

    // Simulate send
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.innerHTML = `<span class="btn-spinner"></span> Sending…`;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.innerHTML = '✦ Send Message';
      btn.style.opacity = '1';

      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }

      // Clear errors
      form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.field-error').forEach(el => el.classList.remove('show'));
    }, 1500);
  });
}

function validateField({ el, minLen, label, optional }) {
  if (!el) return true;
  const errorEl = el.parentElement.querySelector('.field-error');
  const val = el.value.trim();

  let error = '';

  if (!optional && !val) {
    error = `${label} is required.`;
  } else if (val && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    error = 'Please enter a valid email address.';
  } else if (!optional && val.length < minLen) {
    error = `${label} must be at least ${minLen} characters.`;
  }

  el.classList.toggle('error', !!error);
  if (errorEl) {
    errorEl.textContent = error;
    errorEl.classList.toggle('show', !!error);
  }

  return !error;
}

/* ── 7. Smooth Page Link Transitions ─────────────────────── */
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') && !link.target) {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.25s ease';
      setTimeout(() => { window.location.href = href; }, 250);
    }
  });
});

window.addEventListener('load', () => {
  document.body.style.transition = 'opacity 0.35s ease';
  document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
