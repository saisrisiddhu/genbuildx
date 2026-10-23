// Solutions section: filter chips for the service cards.
(() => {
  const grid = document.getElementById('solCards');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.card')];
  const chips = [...document.querySelectorAll('.sfilter')];

  function applyFilter(f) {
    chips.forEach((c) => {
      const on = c.dataset.f === f;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
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
})();
