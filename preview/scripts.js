(() => {
  'use strict';

  const ready = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn();

  ready(() => {
    const root = document.documentElement;
    const toggle = document.getElementById('darkModeToggle');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');

    const syncTheme = () => {
      if (toggle) toggle.setAttribute('aria-pressed', root.classList.contains('dark-mode') ? 'true' : 'false');
    };
    syncTheme();

    if (toggle) {
      toggle.addEventListener('click', () => {
        root.classList.toggle('dark-mode');
        try { localStorage.setItem('darkMode', String(root.classList.contains('dark-mode'))); } catch (_) {}
        syncTheme();
      });
    }

    let frame = 0;
    const setPosition = (x, y) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nx = Math.max(0, Math.min(1, x / innerWidth));
        const ny = Math.max(0, Math.min(1, y / innerHeight));
        root.style.setProperty('--mx', `${(nx * 100).toFixed(2)}%`);
        root.style.setProperty('--my', `${(ny * 100).toFixed(2)}%`);
        root.style.setProperty('--ry', `${((nx - .5) * 5).toFixed(2)}deg`);
        root.style.setProperty('--rx', `${((.5 - ny) * 4).toFixed(2)}deg`);
      });
    };

    if (!reduced.matches && finePointer.matches) {
      window.addEventListener('pointermove', (event) => setPosition(event.clientX, event.clientY), { passive: true });
      window.addEventListener('pointerleave', () => setPosition(innerWidth / 2, innerHeight / 2), { passive: true });
    }

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      link.setAttribute('rel', [...rel].join(' '));
    });
  });
})();
