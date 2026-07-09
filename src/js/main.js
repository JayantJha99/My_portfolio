import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '../styles/main.css';
import { initPipeline } from './pipeline.js';

/* ---------- theme toggle ---------- */
function initTheme() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  function updateLabel() {
    const dark = document.documentElement.dataset.theme === 'dark';
    toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  toggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch { /* private mode */ }
    updateLabel();
  });
  updateLabel();
}

/* ---------- mobile nav ---------- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close the menu after navigating.
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------- scroll-spy: highlight active section link ---------- */
function initScrollSpy() {
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  if (!links.length) return;
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = `#${entry.target.id}`;
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => io.observe(s));
}

/* ---------- reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- metric count-up ---------- */
function initCounters() {
  const values = document.querySelectorAll('.metric-value[data-count]');
  if (!values.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function animate(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(target * ease(t)) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.6 }
  );
  values.forEach((el) => io.observe(el));
}

/* ---------- boot ---------- */
document.getElementById('year')?.replaceChildren(String(new Date().getFullYear()));
initTheme();
initNav();
initScrollSpy();
initReveal();
initCounters();

const canvas = document.querySelector('.hero-canvas');
if (canvas) initPipeline(canvas);
