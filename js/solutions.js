// Solutions section: blueprint-to-built interactive landscape, hotspots, and filterable service cards.
(() => {
  const stage = document.getElementById('landStage');
  if (!stage) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const d = (s) => `style="animation-delay:${s}s"`;

  /* ---------- Scene ---------- */
  // One landscape drawn twice: as a dashed blueprint, and as the finished, green build.
  function scene(mode) {
    const P = mode === 'plan';
    const c = (cls) => (P ? 'p' : cls);
    let s = P
      ? '<rect width="1200" height="600" class="l-bp"/><rect width="1200" height="600" fill="url(#bpGrid)"/>'
      : '<rect width="1200" height="600" fill="url(#skyG)"/>';

    if (!P) {
      s += '<g class="a-spin slow"><circle cx="1090" cy="90" r="34" class="l-sun"/>';
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2;
        s += `<path class="l-ray" d="M${1090 + 44 * Math.cos(a)} ${90 + 44 * Math.sin(a)}L${1090 + 58 * Math.cos(a)} ${90 + 58 * Math.sin(a)}"/>`;
      }
      s += '</g>';
      s += '<g class="l-cloud a-cloud"><ellipse cx="200" cy="80" rx="60" ry="18"/><ellipse cx="240" cy="66" rx="40" ry="20"/></g>';
      s += `<g class="l-cloud a-cloud" ${d(-14)}><ellipse cx="700" cy="110" rx="70" ry="18"/><ellipse cx="660" cy="96" rx="40" ry="18"/></g>`;
    } else {
      s += '<text x="40" y="560" class="p-txt">SITE PLAN · GENBUILDX</text><path class="p-dim" d="M40 575h300M40 570v10M340 570v10"/>';
    }

    // Back hills + afforestation
    s += '<g class="px" data-depth="4">';
    s += `<path class="${c('l-hill2')}" d="M0 300 Q180 220 360 270 T720 250 T1200 268 V600 H0Z"/>`;
    for (let i = 0; i < 8; i++) {
      const x = 760 + i * 36;
      const y = 262 - Math.sin(i / 2) * 6;
      s += `<g class="a-grow-y" ${d(i * 0.25)}><path class="${c('l-trunk')}" d="M${x - 2} ${y}h4v12h-4z"/><path class="${c(i % 2 ? 'l-tree2' : 'l-tree')}" d="M${x} ${y - 42}l16 42h-32z"/></g>`;
    }
    s += '</g>';

    // Mid ground: construction site, flyover, interior, park, maintenance facility
    s += '<g class="px" data-depth="10">';
    s += `<path class="${c('l-hill1')}" d="M0 380 Q260 330 520 368 T1000 350 T1200 360 V600 H0Z"/>`;
    // tower under construction
    s += `<rect class="${c('l-bld')}" x="150" y="190" width="100" height="230"/>`;
    for (let f = 0; f < 7; f++) {
      const y = 200 + f * 31;
      s += `<rect class="${c('l-glass')}" x="160" y="${y}" width="36" height="20"/><rect class="${c('l-glass')}" x="204" y="${y}" width="36" height="20"/>`;
    }
    s += `<rect class="${c('l-acc')} a-pop" x="150" y="160" width="100" height="30"/>`;
    // crane
    s += `<path class="${c('l-steel')}" d="M290 420V132M200 140h230M290 132l-90 8M290 132l140 8"/>`;
    s += `<g class="a-swing"><path class="${c('l-steel')}" d="M380 140v110"/><rect class="${c('l-lime')}" x="368" y="250" width="24" height="14"/></g>`;
    // excavator + dirt
    s += `<path class="${c('l-dirt')}" d="M40 420q40-42 90 0z"/>`;
    s += `<rect class="${c('l-dark')}" x="20" y="404" width="96" height="16" rx="8"/><rect class="${c('l-lime')}" x="34" y="372" width="60" height="32" rx="4"/>`;
    s += `<g class="a-dig"><path class="${c('l-steel')} thick" d="M90 380l40-36 34 30"/><path class="${c('l-acc')}" d="M156 368l16 2-2 18-18-6z"/></g>`;
    // flyover with expansion joint
    s += `<rect class="${c('l-dark')}" x="338" y="378" width="12" height="44"/><rect class="${c('l-dark')}" x="452" y="378" width="12" height="44"/>`;
    s += `<g class="a-gap-l"><rect class="${c('l-bld')}" x="316" y="364" width="80" height="14"/></g><g class="a-gap-r"><rect class="${c('l-bld')}" x="400" y="364" width="80" height="14"/></g>`;
    s += `<path class="${c('l-joint')}" d="M398 358v26"/>`;
    // interior house
    s += `<path class="${c('l-bld')}" d="M505 420V352l48-36 48 36v68z"/><rect class="${c('l-glass')}" x="518" y="362" width="44" height="32"/><rect class="${c('l-dark')}" x="574" y="384" width="16" height="36"/>`;
    s += `<circle class="${c('l-lime')} a-pulse" cx="532" cy="376" r="6"/><rect class="${c('l-acc')}" x="540" y="382" width="18" height="10" rx="3"/>`;
    // park with path and bench
    s += `<path class="${c('l-path')}" d="M620 420q70-28 150 0"/>`;
    [[640, 0], [690, 0.4], [745, 0.8]].forEach(([x, dl]) => {
      s += `<g class="a-sway" ${d(dl)}><path class="${c('l-trunk')}" d="M${x - 2} 420v-22h4v22z"/><circle class="${c('l-tree')}" cx="${x}" cy="386" r="18"/></g>`;
    });
    s += `<path class="${c('l-dark')}" d="M700 408h26v4h-26zM703 412v8M723 412v8"/>`;
    // maintenance facility
    s += `<rect class="${c('l-bld')}" x="870" y="360" width="90" height="60"/><rect class="${c('l-glass')}" x="882" y="372" width="28" height="18"/><rect class="${c('l-glass')}" x="920" y="372" width="28" height="18"/>`;
    s += `<g class="a-spin"><circle class="${c('l-lime')}" cx="915" cy="340" r="12"/><circle class="${c('l-bld')}" cx="915" cy="340" r="5"/></g>`;
    s += '</g>';

    // Front ground: pool, avenue, solar, road, vehicles
    s += '<g class="px" data-depth="18">';
    s += `<path class="${c('l-ground')}" d="M0 448 Q300 425 600 445 T1200 440 V600 H0Z"/>`;
    s += `<ellipse class="${c('l-water')}" cx="720" cy="476" rx="78" ry="18"/>`;
    s += `<path class="${c('l-ripple')} a-wave-x" d="M664 474q14-6 28 0t28 0 28 0 28 0"/><path class="${c('l-ripple')} a-wave-x" ${d(0.8)} d="M684 482q14-6 28 0t28 0 28 0"/>`;
    s += `<g class="a-sway"><path class="${c('l-tree2')}" d="M640 470c-10-6-12-20-6-28 8 6 10 18 6 28z"/></g><g class="a-sway" ${d(0.5)}><path class="${c('l-tree2')}" d="M800 470c10-6 12-20 6-28-8 6-10 18-6 28z"/></g>`;
    [850, 880, 910, 940].forEach((x, i) => {
      s += `<g class="a-sway" ${d(i * 0.3)}><path class="${c('l-trunk')}" d="M${x - 2} 498v-18h4v18z"/><circle class="${c(i % 2 ? 'l-tree' : 'l-tree2')}" cx="${x}" cy="472" r="13"/></g>`;
    });
    [980, 1040, 1100].forEach((x) => {
      s += `<path class="${c('l-panel')}" d="M${x} 492l18-30h46l-18 30z"/><path class="${c('l-steel')}" d="M${x + 22} 492v8"/>`;
    });
    s += `<path class="${c('l-steel')}" d="M1170 500V440M1160 450h20"/>`;
    if (!P) s += '<path class="l-energy a-dash" d="M1000 478 H1170"/>';
    s += `<rect class="${c('l-road')}" x="0" y="505" width="1200" height="42"/>`;
    s += `<path class="${c('l-roadline')} a-dash" d="M0 526h1200"/>`;
    s += `<g class="a-truck"><rect class="${c('l-lime')}" x="0" y="474" width="70" height="32" rx="3"/><path class="${c('l-bld')}" d="M70 484h22l12 12v10H70z"/><circle class="${c('l-dark')}" cx="22" cy="508" r="7"/><circle class="${c('l-dark')}" cx="88" cy="508" r="7"/></g>`;
    s += `<g class="a-roller"><rect class="${c('l-acc')}" x="300" y="486" width="46" height="20" rx="4"/><rect class="${c('l-bld')}" x="312" y="472" width="22" height="14" rx="2"/><circle class="${c('l-dark')}" cx="356" cy="506" r="12"/><circle class="${c('l-dark')}" cx="306" cy="510" r="8"/></g>`;
    s += '</g>';
    return s;
  }

  const svgHost = document.getElementById('landSvg');
  svgHost.innerHTML = `
    <svg viewBox="0 0 1200 600" class="illo-svg land-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f4fde6"/><stop offset="1" stop-color="#ddf3c0"/></linearGradient>
        <pattern id="bpGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(125,193,46,.16)"/></pattern>
        <clipPath id="landClip"><rect id="landClipRect" x="600" y="0" width="600" height="600"/></clipPath>
      </defs>
      <g class="land-plan">${scene('plan')}</g>
      <g class="land-built" clip-path="url(#landClip)">${scene('built')}</g>
    </svg>`;
  const clipRect = document.getElementById('landClipRect');
  const handle = document.getElementById('landHandle');
  const range = document.getElementById('landRange');
  const layers = [...svgHost.querySelectorAll('.px')];

  // Divider position, 0-100 (% of width). Built landscape shows to the right of the divider.
  let pos = 50;
  const setPos = (p) => {
    pos = Math.max(0, Math.min(100, p));
    clipRect.setAttribute('x', String(pos * 12));
    clipRect.setAttribute('width', String(1200 - pos * 12));
    handle.style.left = `${pos}%`;
    range.value = String(Math.round(100 - pos));
  };
  range.addEventListener('input', () => setPos(100 - Number(range.value)));

  // Drag the divider (anywhere on the stage with a mouse, on the knob for touch)
  let dragging = false;
  const fromEvent = (e) => {
    const r = stage.getBoundingClientRect();
    setPos(((e.clientX - r.left) / r.width) * 100);
  };
  handle.addEventListener('pointerdown', (e) => { dragging = true; handle.setPointerCapture(e.pointerId); stopIntro(); });
  handle.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
  handle.addEventListener('pointerup', () => { dragging = false; });
  if (finePointer) {
    stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.hotspot')) return;
      dragging = true;
      stopIntro();
      fromEvent(e);
    });
    window.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
    window.addEventListener('pointerup', () => { dragging = false; });
  }

  // Mouse parallax across the scene's depth layers
  if (finePointer && !reduceMotion) {
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((g) => {
        const k = Number(g.dataset.depth);
        g.style.transform = `translate(${-x * k}px, ${-y * k * 0.4}px)`;
      });
    });
    stage.addEventListener('pointerleave', () => layers.forEach((g) => { g.style.transform = ''; }));
  }

  // Intro sweep the first time the scene is seen: blueprint wipes into the built landscape
  let introRaf = null;
  const stopIntro = () => { cancelAnimationFrame(introRaf); introRaf = null; };
  const intro = () => {
    const start = performance.now();
    const from = 96;
    const to = window.innerWidth <= 640 ? 30 : 38;
    const step = (now) => {
      const k = Math.min(1, (now - start) / 2400);
      const e = 1 - Math.pow(1 - k, 3);
      setPos(from + (to - from) * e);
      if (k < 1) introRaf = requestAnimationFrame(step);
    };
    introRaf = requestAnimationFrame(step);
  };
  if (reduceMotion || !('IntersectionObserver' in window)) {
    setPos(40);
  } else {
    setPos(96);
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { intro(); io.disconnect(); }
    }, { threshold: 0.45 });
    io.observe(stage);
  }

  // Animate only while visible
  new IntersectionObserver(([en]) => svgHost.classList.toggle('in-view', en.isIntersecting), { rootMargin: '80px' }).observe(stage);
  svgHost.setAttribute('data-illo', 'land');

  // On narrow screens the scene scrolls sideways: start centred
  const scroller = document.getElementById('landScroll');
  const centre = () => { scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2; };
  centre();
  window.addEventListener('resize', centre);

  /* ---------- Hotspots ---------- */
  const CAT = { infra: 'Construction & Infrastructure', green: 'Landscape & Environment', services: 'Project Services' };
  const SPOTS = [
    { id: 'sol-construction', cat: 'infra', x: 16.7, y: 40, illo: 'excavator', title: 'Construction & Infrastructure', desc: 'Earthworks, excavation, site preparation, civil works and residential and high-rise construction.' },
    { id: 'sol-joint', cat: 'infra', x: 33.2, y: 57, illo: 'joint', title: 'Expansion Joint Solutions', desc: 'Building and bridge expansion joint systems with project-specific supply, installation and execution.' },
    { id: 'sol-interior', cat: 'infra', x: 46, y: 54, illo: 'interior', title: 'Interior Solutions & Execution', desc: 'Residential and commercial interiors, finishing works, fit-outs and renovation.' },
    { id: 'sol-roads', cat: 'infra', x: 30, y: 87, illo: 'roadworks', title: 'Roadworks & Civil Execution', desc: 'Road construction and rehabilitation, earthworks, backfilling and civil infrastructure execution.' },
    { id: 'sol-landscape', cat: 'green', x: 57.5, y: 62, illo: 'landscape', title: 'Landscape Design & Development', desc: 'Campus, commercial and residential landscaping, hardscape and softscape, pathways, lawns and gardens.' },
    { id: 'sol-biopool', cat: 'green', x: 60, y: 80, illo: 'biopool', title: 'Bio-Pools & Natural Water Features', desc: 'Ecological swimming pools, plant-based water regeneration, ponds and natural filtration.' },
    { id: 'sol-afforest', cat: 'green', x: 73, y: 36, illo: 'afforest', title: 'Large-Scale Afforestation', desc: 'Reforestation, native species plantation and degraded-land restoration with survival monitoring.' },
    { id: 'sol-urban', cat: 'green', x: 74.5, y: 75, illo: 'urbanforest', title: 'Urban Forestry & Plantation', desc: 'Roadside and avenue plantation, green belts, and campus and township canopy development.' },
    { id: 'sol-solar', cat: 'green', x: 88, y: 74, illo: 'solar', title: 'Solar & Renewable Energy', desc: 'Rooftop, commercial and industrial solar, EPC coordination and renewable integration.' },
    { id: 'sol-procure', cat: 'services', x: 6, y: 74, illo: 'procurement', title: 'Procurement & Commercial Support', desc: 'Material sourcing, vendor coordination, BOQ-based procurement, documentation and billing.' },
    { id: 'sol-maintain', cat: 'services', x: 76.2, y: 52, illo: 'maintenance', title: 'Facility, Landscape & Asset Maintenance', desc: 'Building, campus and landscape maintenance with long-term programmes.' },
  ];
  const spotsHost = document.getElementById('landSpots');
  const pop = document.getElementById('landPop');
  const land = document.getElementById('land');
  const popIllo = document.getElementById('landPopIllo');
  const popTitle = document.getElementById('landPopTitle');
  const popDesc = document.getElementById('landPopDesc');
  const popCat = document.getElementById('landPopCat');
  const popLink = document.getElementById('landPopLink');
  let activeSpot = null;

  SPOTS.forEach((sp, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hotspot';
    b.dataset.cat = sp.cat;
    b.style.left = `${sp.x}%`;
    b.style.top = `${sp.y}%`;
    b.style.animationDelay = `${i * 0.18}s`;
    b.setAttribute('aria-label', sp.title);
    b.innerHTML = '<span>+</span>';
    b.addEventListener('click', (e) => { e.stopPropagation(); openPop(sp, b); });
    spotsHost.appendChild(b);
    sp.el = b;
  });

  function openPop(sp, btn) {
    if (activeSpot === sp && !pop.hidden) { closePop(); return; }
    activeSpot = sp;
    SPOTS.forEach((s) => s.el.classList.toggle('is-open', s === sp));
    popIllo.innerHTML = window.gbxIllo ? window.gbxIllo(sp.illo) : '';
    popIllo.classList.add('in-view');
    popTitle.textContent = sp.title;
    popDesc.textContent = sp.desc;
    popCat.textContent = CAT[sp.cat];
    popLink.href = `#${sp.id}`;
    pop.hidden = false;
    // Position next to the hotspot inside the .land frame (bottom sheet on small screens)
    if (window.innerWidth > 640) {
      const lr = land.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      const w = pop.offsetWidth;
      const h = pop.offsetHeight;
      let left = br.left - lr.left + br.width / 2 + 18;
      if (left + w > lr.width - 12) left = br.left - lr.left - w - 18;
      let top = br.top - lr.top - h / 2;
      top = Math.max(12, Math.min(lr.height - h - 12, top));
      pop.style.left = `${Math.max(12, left)}px`;
      pop.style.top = `${top}px`;
    } else {
      pop.style.left = '';
      pop.style.top = '';
    }
    pop.classList.remove('is-anim');
    void pop.offsetWidth;
    pop.classList.add('is-anim');
  }
  function closePop() {
    pop.hidden = true;
    activeSpot = null;
    SPOTS.forEach((s) => s.el.classList.remove('is-open'));
  }
  pop.querySelector('.land__close').addEventListener('click', closePop);
  document.addEventListener('click', (e) => { if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('.hotspot')) closePop(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) closePop(); });
  document.getElementById('landScroll').addEventListener('scroll', closePop, { passive: true });

  popLink.addEventListener('click', (e) => {
    e.preventDefault();
    const sp = activeSpot;
    if (!sp) return;
    closePop();
    applyFilter('all');
    const card = document.getElementById(sp.id);
    card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    card.classList.remove('is-flash');
    void card.offsetWidth;
    card.classList.add('is-flash');
  });

  /* ---------- Filters (category tiles + filter chips) ---------- */
  const cards = [...document.querySelectorAll('#solCards .card')];
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
    tiles.forEach((t) => t.classList.toggle('is-active', t.dataset.f === f));
    SPOTS.forEach((s) => s.el.classList.toggle('is-dim', f !== 'all' && s.cat !== f));
    let shown = 0;
    cards.forEach((card) => {
      const match = card.dataset.cat === 'all' ? f === 'all' : (f === 'all' || card.dataset.cat === f);
      if (match) {
        card.hidden = false;
        card.classList.add('is-visible');
        card.style.animationDelay = `${shown * 60}ms`;
        card.classList.remove('is-in');
        void card.offsetWidth;
        card.classList.add('is-in');
        shown += 1;
      } else {
        card.hidden = true;
      }
    });
  }
  chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.dataset.f)));
  tiles.forEach((t) => {
    t.addEventListener('click', () => {
      applyFilter(current === t.dataset.f ? 'all' : t.dataset.f);
      if (current !== 'all') {
        document.querySelector('.sfilters').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
    // Hovering a tile previews its hotspots in the scene
    t.addEventListener('pointerenter', () => SPOTS.forEach((s) => s.el.classList.toggle('is-hint', s.cat === t.dataset.f)));
    t.addEventListener('pointerleave', () => SPOTS.forEach((s) => s.el.classList.remove('is-hint')));
  });
})();
