(() => {
  'use strict';

  const designs = Object.freeze([
    Object.freeze({ id: 'classic-2026-08', label: 'Classic', css: '/designs/classic-2026-08.css?v=20260813-theme' }),
    Object.freeze({ id: 'poster-2026-08', label: 'Kinetic Poster', css: '/designs/poster-2026-08.css?v=20260813-theme' })
  ]);
  const latest = designs[designs.length - 1];
  let requested = null;

  try {
    const query = new URLSearchParams(location.search).get('design');
    requested = query || sessionStorage.getItem('wimDesign');
  } catch (_) {}

  const selected = designs.find((design) => design.id === requested) || latest;
  const stylesheet = document.querySelector('link[data-site-design]');
  if (stylesheet) stylesheet.href = selected.css;
  document.documentElement.dataset.design = selected.id;

  window.WIM_DESIGN_HISTORY = Object.freeze({ designs, latest: latest.id, selected: selected.id });
})();
