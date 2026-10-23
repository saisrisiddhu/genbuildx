// Solutions scroll story: the site builds itself as the visitor scrolls through the pinned section.
(() => {
  const story = document.getElementById('story');
  if (!story) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // a(type, from, to, extra) -> attributes that drive an element from scroll progress
  const a = (type, from, to, extra = '') => `data-anim="${type}" data-from="${from}" data-to="${to}" ${extra}`;
  const tree = (x, y, r, from, sway) => `<g ${a('pop', from, from + 0.05)}><g class="a-sway" style="animation-delay:${sway}s"><path class="st-trunk" d="M${x - 3} ${y}v-${r + 6}h6v${r + 6}z"/><circle class="st-tree" cx="${x}" cy="${y - r - 10}" r="${r}"/><circle class="st-tree-hi" cx="${x - r / 3}" cy="${y - r - 14}" r="${r / 2.6}"/></g></g>`;
  const pine = (x, y, h, from, sway, alt) => `<g ${a('pop', from, from + 0.04)}><g class="a-sway" style="animation-delay:${sway}s"><path class="st-trunk" d="M${x - 2} ${y}v-10h4v10z"/><path class="${alt ? 'st-tree2' : 'st-tree'}" d="M${x} ${y - 10 - h}l${h * 0.42} ${h}h-${h * 0.84}z"/></g></g>`;

  let s = `
  <svg viewBox="0 0 1200 700" class="illo-svg story-svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="stSky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f6fbee"/><stop offset="1" stop-color="#e6f5cf"/></linearGradient>
      <linearGradient id="stWater" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e3f8ef"/><stop offset="1" stop-color="#b9e8d2"/></linearGradient>
      <pattern id="stGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(14,138,16,.12)"/></pattern>
    </defs>
    <rect width="1200" height="700" fill="url(#stSky)"/>

    <!-- sun -->
    <g ${a('rise', 0.8, 0.92, 'data-dy="220"')}><g class="a-spin slow"><circle class="st-sun" cx="1040" cy="120" r="44"/>${Array.from({ length: 10 }, (_, k) => { const t = (k / 10) * Math.PI * 2; return `<path class="st-ray" d="M${1040 + 56 * Math.cos(t)} ${120 + 56 * Math.sin(t)}L${1040 + 72 * Math.cos(t)} ${120 + 72 * Math.sin(t)}"/>`; }).join('')}</g></g>

    <!-- hills: bare, then green -->
    <path class="st-dirt2" d="M0 360 Q200 280 420 330 T820 300 T1200 320 V700 H0Z"/>
    <path class="st-hill" ${a('fade', 0.5, 0.64)} d="M0 360 Q200 280 420 330 T820 300 T1200 320 V700 H0Z"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => pine(700 + i * 42, 318 - Math.sin(i / 1.7) * 14, 46 + (i % 3) * 10, 0.66 + i * 0.012, i * 0.3, i % 2)).join('')}

    <!-- ground: bare, then grass -->
    <path class="st-dirt" d="M0 470 Q300 440 600 465 T1200 455 V700 H0Z"/>
    <path class="st-grass" ${a('fade', 0.48, 0.62)} d="M0 470 Q300 440 600 465 T1200 455 V700 H0Z"/>

    <!-- blueprint overlay -->
    <g ${a('fadeout', 0.42, 0.56)}>
      <rect width="1200" height="700" fill="url(#stGrid)"/>
      <g class="st-plan">
        <rect ${a('draw', 0.02, 0.1)} pathLength="1" x="300" y="200" width="130" height="270"/>
        <path ${a('draw', 0.04, 0.12)} pathLength="1" d="M0 560H1200M0 610H1200"/>
        <ellipse ${a('draw', 0.06, 0.13)} pathLength="1" cx="760" cy="520" rx="90" ry="22"/>
        <rect ${a('draw', 0.07, 0.14)} pathLength="1" x="940" y="470" width="220" height="60"/>
        <path ${a('draw', 0.08, 0.15)} pathLength="1" d="M470 420h200M480 420v50M660 420v50"/>
      </g>
    </g>

    <!-- earthworks -->
    <path class="st-mound" ${a('shrink', 0.17, 0.28)} d="M160 472q60-70 130 0z"/>
    <g ${a('slide', 0.12, 0.22, 'data-dx="-320"')}>
      <rect class="st-dark" x="40" y="452" width="110" height="18" rx="9"/>
      <rect class="st-lime" x="56" y="412" width="70" height="40" rx="5"/><rect class="st-glass" x="66" y="420" width="26" height="20" rx="3"/>
      <g class="a-dig"><path class="st-arm" d="M120 424l48-44 42 34"/><path class="st-acc" d="M202 404l20 3-3 22-22-8z"/></g>
    </g>

    <!-- road -->
    <rect class="st-road" ${a('growx', 0.18, 0.3)} x="0" y="560" width="1200" height="50"/>
    <path class="st-lane a-dash" ${a('fade', 0.28, 0.32)} d="M0 585h1200"/>

    <!-- tower + crane -->
    ${Array.from({ length: 8 }, (_, i) => `<g ${a('pop', 0.3 + i * 0.018, 0.33 + i * 0.018)}><rect class="st-bld" x="300" y="${436 - i * 32}" width="130" height="32"/><rect class="st-win" ${a('light', 0.44, 0.47)} x="312" y="${444 - i * 32}" width="46" height="16"/><rect class="st-win" ${a('light', 0.45, 0.48)} x="372" y="${444 - i * 32}" width="46" height="16"/></g>`).join('')}
    <g ${a('fade', 0.28, 0.32)}>
      <path class="st-steel" ${a('draw', 0.28, 0.34)} pathLength="1" d="M470 470V150"/>
      <path class="st-steel" ${a('draw', 0.32, 0.36)} pathLength="1" d="M340 158h260M470 150l-130 8M470 150l130 8"/>
      <g class="a-swing"><path class="st-steel" d="M560 158v120"/><rect class="st-lime" x="546" y="278" width="28" height="16"/></g>
    </g>

    <!-- flyover with expansion joint -->
    <rect class="st-dark" ${a('grow', 0.32, 0.37)} x="502" y="438" width="12" height="32"/><rect class="st-dark" ${a('grow', 0.33, 0.38)} x="626" y="438" width="12" height="32"/>
    <g ${a('slide', 0.36, 0.43, 'data-dx="-140"')}><rect class="st-bld" x="480" y="424" width="88" height="14"/></g>
    <g ${a('slide', 0.36, 0.43, 'data-dx="140"')}><rect class="st-bld" x="572" y="424" width="88" height="14"/></g>
    <path class="st-joint" ${a('pop', 0.43, 0.45)} d="M570 418v26"/>

    <!-- house with interior -->
    <g ${a('pop', 0.38, 0.44)}><path class="st-bld" d="M690 470V398l52-38 52 38v72z"/><rect class="st-win" ${a('light', 0.46, 0.5)} x="704" y="410" width="46" height="34"/><rect class="st-dark" x="764" y="432" width="18" height="38"/></g>
    <circle class="st-lamp a-pulse" ${a('fade', 0.47, 0.5)} cx="718" cy="424" r="6"/>

    <!-- park -->
    <path class="st-path" ${a('draw', 0.5, 0.58)} pathLength="1" d="M820 470q80-34 170 0"/>
    ${tree(840, 470, 20, 0.52, 0)}${tree(900, 466, 24, 0.54, 0.4)}${tree(965, 470, 18, 0.56, 0.8)}
    <path class="st-dark" ${a('fade', 0.56, 0.6)} d="M880 452h34v5h-34zM884 457v12M910 457v12"/>

    <!-- avenue along the road -->
    ${[60, 150, 240, 330, 420, 510, 600, 690].map((x, i) => tree(x, 556, 14, 0.66 + i * 0.016, i * 0.25)).join('')}

    <!-- bio-pool -->
    <ellipse class="st-poolrim" ${a('draw', 0.78, 0.84)} pathLength="1" cx="860" cy="520" rx="96" ry="24"/>
    <ellipse class="st-water" ${a('grow', 0.82, 0.88)} cx="860" cy="520" rx="92" ry="21"/>
    <g ${a('fade', 0.86, 0.9)}><path class="st-ripple a-wave-x" d="M800 518q14-6 28 0t28 0 28 0 28 0"/><path class="st-ripple a-wave-x" style="animation-delay:.8s" d="M818 527q14-6 28 0t28 0 28 0"/></g>

    <!-- solar -->
    ${[990, 1060, 1130].map((x, i) => `<g ${a('pop', 0.84 + i * 0.02, 0.88 + i * 0.02)}><path class="st-panel" d="M${x - 30} 540l20-34h56l-20 34z"/><path class="st-steel thin" d="M${x - 2} 540v12"/></g>`).join('')}
    <path class="st-energy a-dash" ${a('fade', 0.9, 0.93)} d="M980 524H1190"/>

    <!-- maintenance facility -->
    <g ${a('pop', 0.88, 0.94)}><rect class="st-bld" x="1040" y="380" width="110" height="76"/><rect class="st-win" x="1054" y="394" width="34" height="22"/><rect class="st-win" x="1102" y="394" width="34" height="22"/></g>
    <g ${a('pop', 0.9, 0.95)}><g class="a-spin"><circle class="st-lime" cx="1095" cy="360" r="14"/><circle class="st-bld" cx="1095" cy="360" r="6"/></g></g>

    <!-- delivery truck -->
    <g ${a('drive', 0.9, 1, 'data-x0="-220" data-x1="1320"')}><rect class="st-lime" x="0" y="532" width="86" height="34" rx="4"/><path class="st-bld" d="M86 542h26l14 14v10H86z"/><circle class="st-dark" cx="24" cy="570" r="8"/><circle class="st-dark" cx="104" cy="570" r="8"/></g>
  </svg>`;

  const host = document.getElementById('storySvg');
  host.innerHTML = s;
  const els = [...host.querySelectorAll('[data-anim]')].map((el) => ({
    el,
    type: el.dataset.anim,
    from: Number(el.dataset.from),
    to: Number(el.dataset.to),
    dx: Number(el.dataset.dx || 0),
    dy: Number(el.dataset.dy || 0),
    x0: Number(el.dataset.x0 || 0),
    x1: Number(el.dataset.x1 || 0),
  }));
  const hint = document.getElementById('storyHint');
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  const render = (p) => {
    els.forEach((o) => {
      const raw = Math.min(1, Math.max(0, (p - o.from) / (o.to - o.from)));
      const k = ease(raw);
      const st = o.el.style;
      switch (o.type) {
        case 'fade': st.opacity = k; break;
        case 'fadeout': st.opacity = 1 - k; break;
        case 'light': st.fill = k > 0.5 ? '#c6f36b' : ''; st.opacity = 0.6 + k * 0.4; break;
        case 'draw': st.strokeDashoffset = 1 - k; break;
        case 'pop': st.transform = `scale(${k})`; st.opacity = k > 0 ? 1 : 0; break;
        case 'grow': st.transform = `scaleY(${k})`; break;
        case 'growx': st.transform = `scaleX(${k})`; break;
        case 'shrink': st.transform = `scale(${1 - k})`; break;
        case 'slide': st.transform = `translateX(${o.dx * (1 - k)}px)`; st.opacity = Math.min(1, k * 3); break;
        case 'rise': st.transform = `translateY(${o.dy * (1 - k)}px)`; st.opacity = k; break;
        case 'drive': st.transform = `translateX(${o.x0 + (o.x1 - o.x0) * raw}px)`; st.opacity = raw > 0 && raw < 1 ? 1 : 0; break;
        default: break;
      }
    });
    hint.classList.toggle('is-hidden', p > 0.04);
  };

  if (reduceMotion) {
    story.classList.add('is-static');
    render(1);
    return;
  }

  let ticking = false;
  const update = () => {
    ticking = false;
    const r = story.getBoundingClientRect();
    const total = story.offsetHeight - window.innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
    render(p);
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();

  // Ambient motion only while the story is on screen
  new IntersectionObserver(([e]) => story.classList.toggle('in-view', e.isIntersecting)).observe(story);
})();
