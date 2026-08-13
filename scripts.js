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

    const nextRedesign = new Date('2026-09-01T09:00:00+07:00');
    const banner = document.createElement('aside');
    banner.className = 'monthly-redesign';
    banner.setAttribute('aria-label', 'Monthly website redesign');

    const bannerMessage = document.createElement('span');
    bannerMessage.className = 'monthly-redesign__message';
    bannerMessage.textContent = 'This site gets a totally new design every month.';

    const controls = document.createElement('div');
    controls.className = 'design-switcher';
    const history = window.WIM_DESIGN_HISTORY;
    if (history && history.designs.length > 1) {
      const previous = document.createElement('button');
      previous.type = 'button';
      previous.className = 'design-switcher__button';
      previous.setAttribute('aria-label', 'Show previous website design');
      previous.textContent = '←';

      const status = document.createElement('span');
      status.className = 'design-switcher__status';
      status.setAttribute('aria-live', 'polite');

      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'design-switcher__button';
      next.setAttribute('aria-label', 'Show next website design');
      next.textContent = '→';

      const currentIndex = () => history.designs.findIndex((design) => design.id === document.documentElement.dataset.design);
      const syncDesignStatus = () => {
        const index = Math.max(0, currentIndex());
        status.textContent = `Design ${index + 1} of ${history.designs.length}`;
      };
      const chooseDesign = (offset) => {
        const index = Math.max(0, currentIndex());
        const selected = history.designs[(index + offset + history.designs.length) % history.designs.length];
        const stylesheet = document.querySelector('link[data-site-design]');
        if (!stylesheet) return;
        stylesheet.href = selected.css;
        document.documentElement.dataset.design = selected.id;
        try { sessionStorage.setItem('wimDesign', selected.id); } catch (_) {}
        syncDesignStatus();
      };
      previous.addEventListener('click', () => chooseDesign(-1));
      next.addEventListener('click', () => chooseDesign(1));
      controls.append(previous, status, next);
      syncDesignStatus();
    }

    const countdown = document.createElement('time');
    banner.append(bannerMessage, controls, countdown);
    document.body.append(banner);

    countdown.dateTime = nextRedesign.toISOString();
    const updateCountdown = () => {
      const remaining = Math.max(0, nextRedesign.getTime() - Date.now());
      const minutes = Math.floor(remaining / 60000);
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      const mins = minutes % 60;
      countdown.textContent = remaining > 0
        ? `Next remix in ${days}d ${hours}h ${mins}m`
        : 'Next remix is due now';
    };
    updateCountdown();
    window.setInterval(updateCountdown, 60000);
  });
})();
