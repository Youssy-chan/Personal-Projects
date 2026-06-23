/* ============================================================
   LUMINO — main.js
   Navbar scroll, hamburger menu, back-to-top, dark mode, ripple
   ============================================================ */

'use strict';

// ── DOM refs ─────────────────────────────────────────────
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');
const backToTop   = document.getElementById('back-to-top');

// ── Theme ─────────────────────────────────────────────────
const THEME_KEY = 'lumino-theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Init theme immediately
applyTheme(getStoredTheme());

themeToggle.addEventListener('click', toggleTheme);

// ── Navbar scroll shadow ──────────────────────────────────
let lastScrollY = 0;

function onScroll() {
  const scrollY = window.scrollY;

  // Navbar shadow
  navbar.classList.toggle('scrolled', scrollY > 20);

  // Back to top visibility
  if (scrollY > 400) {
    backToTop.removeAttribute('hidden');
  } else {
    backToTop.setAttribute('hidden', '');
  }

  lastScrollY = scrollY;
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // Run once on load

// ── Hamburger menu ────────────────────────────────────────
function toggleMenu(open) {
  hamburger.classList.toggle('open', open);
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.contains('open');
  toggleMenu(!isOpen);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Close menu on outside click
document.addEventListener('click', e => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    toggleMenu(false);
  }
});

// Close menu on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    toggleMenu(false);
    hamburger.focus();
  }
});

// ── Back to top ───────────────────────────────────────────
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Ripple effect on buttons ──────────────────────────────
function createRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.classList.add('btn-ripple');
  ripple.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
  `;

  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', createRipple);
});

// ── Active nav link on scroll ─────────────────────────────
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollMid = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const link   = document.querySelector(`.nav-link[href="#${section.id}"]`);

    if (link) {
      link.classList.toggle('active', scrollMid >= top && scrollMid < bottom);
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ── FAQ Accordion ─────────────────────────────────────────
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn    = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all others
    faqItems.forEach(other => {
      const otherBtn    = other.querySelector('.faq-question');
      const otherAnswer = other.querySelector('.faq-answer');
      otherBtn.setAttribute('aria-expanded', 'false');
      otherAnswer.classList.remove('open');
      otherAnswer.setAttribute('hidden', '');
    });

    // Toggle current
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.removeAttribute('hidden');
      // Force reflow for CSS grid animation
      requestAnimationFrame(() => {
        answer.classList.add('open');
      });
    }
  });
});

// ── Smooth scroll for anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
