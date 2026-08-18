(() => {
  'use strict';

  const designs = Object.freeze([
    Object.freeze({
      id: 'classic-2026-08',
      label: 'Classic',
      css: '/designs/classic-2026-08.css?v=20260818-design-theme',
      defaultTheme: 'light'
    }),
    Object.freeze({
      id: 'poster-2026-08',
      label: 'Kinetic Poster',
      css: '/designs/poster-2026-08.css?v=20260818-design-theme',
      defaultTheme: 'dark'
    })
  ]);
  const latest = designs[designs.length - 1];
  const root = document.documentElement;
  const validTheme = (theme) => theme === 'light' || theme === 'dark';
  const themeKey = (design) => `wimTheme:${design.id}`;
  let requested = null;

  try {
    const query = new URLSearchParams(location.search).get('design');
    requested = query || sessionStorage.getItem('wimDesign');
  } catch (_) {}

  const selected = designs.find((design) => design.id === requested) || latest;
  const stylesheet = document.querySelector('link[data-site-design]');
  if (stylesheet) stylesheet.href = selected.css;
  root.dataset.design = selected.id;

  const themeFor = (design) => {
    let stored = null;
    try { stored = localStorage.getItem(themeKey(design)); } catch (_) {}
    return validTheme(stored) ? stored : design.defaultTheme;
  };

  const applyTheme = (design) => {
    const theme = themeFor(design);
    root.classList.toggle('dark-mode', theme === 'dark');
    root.dataset.theme = theme;
    return theme;
  };

  const setTheme = (design, theme) => {
    if (!validTheme(theme)) return applyTheme(design);
    try { localStorage.setItem(themeKey(design), theme); } catch (_) {}
    root.classList.toggle('dark-mode', theme === 'dark');
    root.dataset.theme = theme;
    return theme;
  };

  applyTheme(selected);

  window.WIM_DESIGN_HISTORY = Object.freeze({
    designs,
    latest: latest.id,
    selected: selected.id,
    applyTheme,
    setTheme,
    themeFor
  });
})();
