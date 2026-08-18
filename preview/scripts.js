(() => {
  'use strict';

  try {
    const cleanPath = location.pathname
      .replace(/\/index(?:\.html)?$/, '/')
      .replace(/\.html$/, '');
    if (cleanPath !== location.pathname) {
      history.replaceState(history.state, '', `${cleanPath}${location.search}${location.hash}`);
    }
  } catch (_) {}

  const ready = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn();

  ready(() => {
    const root = document.documentElement;
    const toggle = document.getElementById('darkModeToggle');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    const history = window.WIM_DESIGN_HISTORY;
    const currentDesign = () => history?.designs.find((design) => design.id === root.dataset.design);

    const syncTheme = () => {
      if (toggle) toggle.setAttribute('aria-pressed', root.classList.contains('dark-mode') ? 'true' : 'false');
    };
    syncTheme();

    if (toggle) {
      toggle.addEventListener('click', () => {
        const theme = root.classList.contains('dark-mode') ? 'light' : 'dark';
        const design = currentDesign();
        if (design && typeof history?.setTheme === 'function') history.setTheme(design, theme);
        else root.classList.toggle('dark-mode', theme === 'dark');
        syncTheme();
      });

      let showThemeHint = true;
      try {
        showThemeHint = sessionStorage.getItem('wimThemeHintSeen') !== 'true';
        if (showThemeHint) sessionStorage.setItem('wimThemeHintSeen', 'true');
      } catch (_) {}

      if (showThemeHint) {
        const hintStyle = document.createElement('style');
        hintStyle.textContent = `
          .theme-mode-hint {
            position: fixed;
            z-index: 1002;
            padding: 4px 7px;
            border: 1px solid GrayText;
            border-radius: 999px;
            background: Canvas;
            color: CanvasText;
            font: 500 10px/1.2 ui-sans-serif, system-ui, sans-serif;
            letter-spacing: .08em;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transform: translateY(2px);
            transition: opacity .35s ease, transform .35s ease;
          }
          .theme-mode-hint.is-visible { opacity: .68; transform: none; }
          @media (prefers-reduced-motion: reduce) { .theme-mode-hint { transition: none; } }
        `;
        document.head.append(hintStyle);

        const hint = document.createElement('span');
        hint.className = 'theme-mode-hint';
        hint.setAttribute('aria-hidden', 'true');
        document.body.append(hint);

        const placeThemeHint = () => {
          if (!hint.isConnected) return;
          const rect = toggle.getBoundingClientRect();
          const below = rect.top + rect.height / 2 < innerHeight / 2;
          hint.textContent = below ? '↑ try me' : 'try me ↓';
          const left = Math.max(8, Math.min(innerWidth - hint.offsetWidth - 8, rect.left + rect.width / 2 - hint.offsetWidth / 2));
          const top = below ? rect.bottom + 7 : rect.top - hint.offsetHeight - 7;
          hint.style.left = `${left}px`;
          hint.style.top = `${Math.max(8, Math.min(innerHeight - hint.offsetHeight - 8, top))}px`;
        };
        let hintDismissed = false;
        const dismissThemeHint = () => {
          if (hintDismissed) return;
          hintDismissed = true;
          hint.classList.remove('is-visible');
          setTimeout(() => {
            hint.remove();
            hintStyle.remove();
            window.removeEventListener('resize', placeThemeHint);
          }, reduced.matches ? 0 : 400);
        };
        placeThemeHint();
        requestAnimationFrame(() => {
          placeThemeHint();
          hint.classList.add('is-visible');
        });
        window.addEventListener('load', placeThemeHint, { once: true });
        setTimeout(placeThemeHint, 250);
        window.addEventListener('resize', placeThemeHint, { passive: true });
        toggle.addEventListener('click', dismissThemeHint, { once: true });
        setTimeout(dismissThemeHint, 5000);
      }
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
        if (typeof history.applyTheme === 'function') history.applyTheme(selected);
        try { sessionStorage.setItem('wimDesign', selected.id); } catch (_) {}
        syncTheme();
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
