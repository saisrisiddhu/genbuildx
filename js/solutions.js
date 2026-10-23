// Solutions section: category tiles and filter chips for the service cards.
(() => {
  const grid = document.getElementById('solCards');
  if (!grid) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = [...grid.querySelectorAll('.card')];
  const chips = [...document.querySelectorAll('.sfilter')];
  const tiles = [...document.querySelectorAll('.cat-tile')];
  let current = 'all';

  function applyFilter(f) {
    current = f;
    chips.forEach((c) => {
      const on = c.dataset.f === f;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
    tiles.forEach((t) => {
      const on = t.dataset.f === f;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-pressed', String(on));
    });
    let shown = 0;
    cards.forEach((card) => {
      // the "Have a project in mind?" card only appears in the full list
      const match = card.dataset.cat === 'all' ? f === 'all' : (f === 'all' || card.dataset.cat === f);
      card.hidden = !match;
      if (!match) return;
      card.classList.add('is-visible');
      card.style.animationDelay = `${shown * 60}ms`;
      card.classList.remove('is-in');
      void card.offsetWidth;
      card.classList.add('is-in');
      shown += 1;
    });
  }

  chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.dataset.f)));
  tiles.forEach((t) => {
    t.setAttribute('aria-pressed', 'false');
    t.addEventListener('click', () => {
      applyFilter(current === t.dataset.f ? 'all' : t.dataset.f);
      document.querySelector('.sfilters').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
