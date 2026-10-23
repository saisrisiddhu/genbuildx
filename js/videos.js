// Solutions: looping animated "video" scenes, one per service (pure SVG + CSS, no media files).
(() => {
  const hosts = document.querySelectorAll('[data-video]');
  if (!hosts.length) return;

  const dl = (s) => `style="animation-delay:${s}s"`;
  const sky = (id, top = '#eef9e0', bottom = '#d3efb0') => `<defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="640" height="360" fill="url(#${id})"/>`;
  const sun = (x, y, r = 30) => `<g class="a-spin slow"><circle cx="${x}" cy="${y}" r="${r}" fill="#d9f77f"/>${Array.from({ length: 10 }, (_, k) => { const t = (k / 10) * Math.PI * 2; return `<path d="M${x + (r + 8) * Math.cos(t)} ${y + (r + 8) * Math.sin(t)}L${x + (r + 18) * Math.cos(t)} ${y + (r + 18) * Math.sin(t)}" stroke="#b7e65a" stroke-width="4" stroke-linecap="round"/>`; }).join('')}</g>`;
  const cloud = (x, y, s, delay) => `<g class="v-cloud" ${dl(delay)}><g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".95"><ellipse cx="0" cy="0" rx="46" ry="14"/><ellipse cx="22" cy="-10" rx="26" ry="16"/><ellipse cx="-18" cy="-6" rx="20" ry="12"/></g></g>`;
  const tree = (x, y, r, delay = 0, fill = '#22a024') => `<g class="a-sway" ${dl(delay)}><rect x="${x - 3}" y="${y - r - 4}" width="6" height="${r + 4}" fill="#2f4237"/><circle cx="${x}" cy="${y - r - 10}" r="${r}" fill="${fill}"/><circle cx="${x - r / 3}" cy="${y - r - 14}" r="${r / 2.5}" fill="#7dc12e" opacity=".7"/></g>`;
  const pine = (x, y, h, fill = '#22a024') => `<rect x="${x - 2}" y="${y - 8}" width="4" height="8" fill="#2f4237"/><path d="M${x} ${y - 8 - h}l${h * 0.42} ${h}h-${h * 0.84}z" fill="${fill}"/>`;
  const car = (color, y, delay, dur = 7, dir = 1) => `<g class="v-drive${dir < 0 ? ' rev' : ''}" style="animation-delay:${delay}s;animation-duration:${dur}s"><g transform="translate(0 ${y})"><rect x="0" y="-16" width="52" height="16" rx="5" fill="${color}"/><path d="M10 -16l8-10h18l8 10z" fill="${color}" opacity=".85"/><path d="M20 -24h7v7h-9zM30 -24h5l5 7h-10z" fill="#e8f6dc"/><circle cx="13" cy="0" r="6" fill="#1f3328"/><circle cx="40" cy="0" r="6" fill="#1f3328"/></g></g>`;
  const bird = (x, y, delay) => `<g class="v-bird" ${dl(delay)}><path d="M${x} ${y}q6-6 12 0q6-6 12 0" fill="none" stroke="#2f4237" stroke-width="2" stroke-linecap="round"/></g>`;

  const S = {
    construction: () => `${sky('vs1')}${sun(560, 60)}${cloud(120, 70, 1, 0)}${cloud(400, 50, 0.8, -9)}
      <path d="M0 290 Q160 270 320 285 T640 280 V360 H0Z" fill="#b5d98a"/><path d="M0 310 H640 V360 H0Z" fill="#9fcc6e"/>
      <path d="M60 300q50-56 110 0z" fill="#cdbf98"/>
      ${Array.from({ length: 8 }, (_, i) => `<g class="v-floor" ${dl(i * 0.5)}><rect x="250" y="${284 - i * 28}" width="120" height="28" fill="#fff" stroke="#0e8a10" stroke-width="2"/><rect x="262" y="${291 - i * 28}" width="40" height="14" fill="#c6f36b" class="v-light" ${dl(i * 0.5 + 0.6)}/><rect x="318" y="${291 - i * 28}" width="40" height="14" fill="#dcefcf"/></g>`).join('')}
      <path d="M430 300V54" stroke="#0e8a10" stroke-width="5"/><path d="M424 300l12-24-12-24 12-24-12-24 12-24-12-24 12-24-12-24 12-24" fill="none" stroke="#0e8a10" stroke-width="1.5" opacity=".7"/>
      <g class="v-jib"><path d="M300 60h300M430 50l-130 10M430 50l170 10" stroke="#0e8a10" stroke-width="4" stroke-linecap="round" fill="none"/><rect x="590" y="56" width="24" height="18" fill="#2f4237"/>
        <g class="v-lift"><path d="M340 60v90" stroke="#2f4237" stroke-width="2"/><rect x="310" y="150" width="60" height="10" fill="#c6f36b" stroke="#0e8a10" stroke-width="1.5"/></g></g>
      <g><rect x="40" y="290" width="96" height="16" rx="8" fill="#1f3328"/><rect x="52" y="256" width="64" height="34" rx="5" fill="#c6f36b" stroke="#0e8a10" stroke-width="2"/><rect x="62" y="263" width="24" height="18" rx="3" fill="#e8f6dc"/>
        <g class="a-dig"><path d="M110 266l40-38 36 30" fill="none" stroke="#0e8a10" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M180 250l18 3-3 20-20-7z" fill="#22a024"/></g></g>
      ${[0, 0.4, 0.8].map((d) => `<circle class="a-rise" ${dl(d)} cx="${190 + d * 20}" cy="290" r="4" fill="#cdbf98"/>`).join('')}
      ${car('#22a024', 340, 0, 9)}`,

    joint: () => `${sky('vs2', '#eaf7ff', '#d8f2e2')}${sun(80, 60, 26)}${cloud(470, 60, 0.9, -5)}
      <rect x="0" y="270" width="640" height="90" fill="#bfe9d6"/>${[0, 1, 2].map((i) => `<path class="a-wave-x" ${dl(i * 0.6)} d="M${-20 + i * 30} ${290 + i * 22}q20-8 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" fill="none" stroke="#7dc12e" stroke-width="2"/>`).join('')}
      ${[70, 230, 410, 570].map((x) => `<rect x="${x - 10}" y="200" width="20" height="80" fill="#dfe8d4" stroke="#0e8a10" stroke-width="2"/>`).join('')}
      <g class="a-gap-l"><rect x="-10" y="180" width="328" height="22" fill="#fff" stroke="#0e8a10" stroke-width="2"/></g>
      <g class="a-gap-r"><rect x="322" y="180" width="330" height="22" fill="#fff" stroke="#0e8a10" stroke-width="2"/></g>
      <rect x="0" y="174" width="640" height="6" fill="#2c3d33"/>
      ${car('#c6f36b', 172, 0, 6)}${car('#22a024', 172, -3, 6)}
      <circle class="a-ring" cx="320" cy="191" r="16" fill="none" stroke="#c6f36b" stroke-width="3"/>
      <g transform="translate(470 70)"><circle r="58" fill="#fff" stroke="#0e8a10" stroke-width="3"/>
        <g class="a-gap-l"><path d="M-46 -8h40v16h-40z" fill="#dfe8d4"/>${[0, 1, 2, 3].map((k) => `<rect x="${-14 + k * -8}" y="-8" width="5" height="16" fill="#0e8a10"/>`).join('')}</g>
        <g class="a-gap-r"><path d="M6 -8h40v16H6z" fill="#dfe8d4"/>${[0, 1, 2, 3].map((k) => `<rect x="${9 + k * 8}" y="-8" width="5" height="16" fill="#0e8a10"/>`).join('')}</g>
        <path d="M-30 30h60" stroke="#c6f36b" stroke-width="4" stroke-linecap="round" class="a-pulse"/></g>
      <path d="M404 112L330 182" stroke="#0e8a10" stroke-width="2" stroke-dasharray="4 4"/>`,

    interior: () => `<rect width="640" height="360" fill="#f6faf1"/>
      <rect class="v-paint" x="0" y="0" width="640" height="270" fill="#e4f6cd"/>
      <rect x="0" y="270" width="640" height="90" fill="#dfe8cf"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${i * 90} 270l-40 90" stroke="#cbd9b6" stroke-width="2"/>`).join('')}
      <rect x="60" y="60" width="150" height="120" rx="6" fill="#dff1ff" stroke="#0e8a10" stroke-width="3"/><path d="M135 60v120M60 120h150" stroke="#0e8a10" stroke-width="2"/>${cloud(110, 100, 0.5, -3)}
      <g class="a-swing"><path d="M420 40v24" stroke="#2f4237" stroke-width="2"/><rect x="380" y="64" width="80" height="58" fill="#fff" stroke="#0e8a10" stroke-width="3"/><path d="M392 110l18-24 14 12 14-20 14 32z" fill="#7dc12e"/><circle cx="446" cy="80" r="6" fill="#c6f36b"/></g>
      <g class="v-slidein"><rect x="300" y="210" width="200" height="56" rx="14" fill="#22a024"/><rect x="290" y="196" width="30" height="70" rx="10" fill="#0e8a10"/><rect x="480" y="196" width="30" height="70" rx="10" fill="#0e8a10"/><rect x="320" y="200" width="70" height="26" rx="8" fill="#5fb82a"/><rect x="400" y="200" width="70" height="26" rx="8" fill="#5fb82a"/><rect x="305" y="266" width="8" height="10" fill="#2f4237"/><rect x="487" y="266" width="8" height="10" fill="#2f4237"/></g>
      <path d="M570 270V150" stroke="#2f4237" stroke-width="4"/><path d="M548 150h44l-8-30h-28z" fill="#c6f36b" stroke="#0e8a10" stroke-width="2"/><circle class="v-glow" cx="570" cy="162" r="34" fill="#f3ffb0"/>
      <g class="v-grow"><path d="M230 270h40l-6 -30h-28z" fill="#fff" stroke="#0e8a10" stroke-width="2"/><path d="M250 240c-20-10-24-40-10-56 10 14 12 36 10 56zM250 240c18-12 24-38 12-54-12 14-14 34-12 54z" fill="#22a024"/></g>
      <path d="M320 0v26" stroke="#2f4237" stroke-width="2"/><path d="M300 26h40l-6 14h-28z" fill="#0e8a10"/><path class="v-glow" ${dl(1)} d="M300 40h40l70 200H230z" fill="#f3ffb0"/>`,

    roads: () => `${sky('vs4')}${sun(80, 64)}${cloud(380, 60, 1, -6)}
      <path d="M0 230 Q200 200 400 222 T640 214 V360 H0Z" fill="#b5d98a"/>
      <path d="M0 250 L640 250 L640 330 L0 330Z" fill="#cdbf98"/>
      <rect class="v-pave" x="0" y="250" width="640" height="80" fill="#2c3d33"/>
      <g class="v-pave-dash">${Array.from({ length: 12 }, (_, i) => `<rect x="${20 + i * 56}" y="286" width="30" height="6" fill="#f3fbe3"/>`).join('')}</g>
      <g class="v-paver"><rect x="0" y="212" width="90" height="40" rx="6" fill="#c6f36b" stroke="#0e8a10" stroke-width="2"/><rect x="14" y="190" width="34" height="24" rx="3" fill="#fff" stroke="#0e8a10" stroke-width="2"/><rect x="-20" y="248" width="34" height="10" fill="#1f3328"/><circle cx="30" cy="256" r="8" fill="#1f3328"/><circle cx="70" cy="256" r="8" fill="#1f3328"/>
        ${[0, 0.3, 0.6].map((d) => `<circle class="a-rise" ${dl(d)} cx="${-6 + d * 10}" cy="240" r="4" fill="#d7d7c8"/>`).join('')}</g>
      <g class="v-roller"><rect x="0" y="220" width="56" height="26" rx="5" fill="#22a024"/><rect x="10" y="202" width="26" height="18" rx="2" fill="#fff" stroke="#0e8a10" stroke-width="2"/><circle cx="68" cy="248" r="14" fill="#1f3328"/><circle cx="8" cy="252" r="9" fill="#1f3328"/></g>
      ${[520, 570, 610].map((x, i) => `<g class="a-blink" ${dl(i * 0.3)}><path d="M${x} 330l10-30 10 30z" fill="#c6f36b" stroke="#0e8a10" stroke-width="2"/><path d="M${x + 4} 318h12" stroke="#fff" stroke-width="3"/></g>`).join('')}
      ${tree(40, 228, 14, 0)}${tree(600, 214, 16, 0.6)}`,

    landscape: () => `${sky('vs5')}${sun(560, 56)}${cloud(150, 60, 0.9, -2)}
      <path d="M0 200 Q160 160 320 190 T640 180 V360 H0Z" fill="#b5e08a"/><path d="M0 250 Q200 220 420 250 T640 240 V360 H0Z" fill="#94d25e"/>
      <path class="v-draw" pathLength="1" d="M60 360 C160 300 260 330 330 280 S 520 230 640 250" fill="none" stroke="#f3fbe3" stroke-width="18" stroke-linecap="round"/>
      ${tree(120, 240, 22, 0)}${tree(470, 236, 26, 0.5)}${tree(560, 246, 18, 1)}${tree(260, 214, 16, 0.3, '#5fb82a')}
      ${[[180, 300], [210, 318], [380, 300], [410, 322], [520, 300], [90, 320], [300, 330]].map(([x, y], i) => `<g class="v-bloom" ${dl(i * 0.35)}><path d="M${x} ${y}v-14" stroke="#22a024" stroke-width="2"/>${[0, 72, 144, 216, 288].map((a) => `<circle cx="${x + 6 * Math.cos((a * Math.PI) / 180)}" cy="${y - 18 + 6 * Math.sin((a * Math.PI) / 180)}" r="4" fill="${i % 2 ? '#ffffff' : '#c6f36b'}"/>`).join('')}<circle cx="${x}" cy="${y - 18}" r="3" fill="#0e8a10"/></g>`).join('')}
      <path d="M330 262h56v6h-56zM336 268v14M380 268v14M330 254h56" stroke="#2f4237" stroke-width="3" fill="#2f4237"/>
      ${[0, 2.5].map((d) => `<g class="v-butterfly" ${dl(d)}><g class="v-flap"><path d="M0 0c-10-10-16 2-8 8zM0 0c10-10 16 2 8 8z" fill="#c6f36b" stroke="#0e8a10" stroke-width="1"/></g></g>`).join('')}`,

    biopool: () => `${sky('vs6', '#eefaf3', '#d8f2df')}${sun(90, 60, 26)}
      <path d="M0 170 Q200 140 420 160 T640 150 V360 H0Z" fill="#b5e08a"/>
      <defs><linearGradient id="vpw" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d9f6ea"/><stop offset="1" stop-color="#9edbc0"/></linearGradient></defs>
      <ellipse cx="330" cy="260" rx="260" ry="70" fill="#e9dfc4"/><ellipse cx="330" cy="258" rx="240" ry="60" fill="url(#vpw)"/>
      ${[0, 1, 2, 3].map((i) => `<path class="a-wave-x" ${dl(i * 0.5)} d="M${130 + i * 10} ${232 + i * 14}q20-7 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" fill="none" stroke="#ffffff" stroke-width="2" opacity=".8"/>`).join('')}
      ${[[220, 250], [420, 270], [330, 236]].map(([x, y], i) => `<g class="a-float" ${dl(i * 0.7)}><ellipse cx="${x}" cy="${y}" rx="18" ry="7" fill="#22a024"/><path d="M${x} ${y}l14-5" stroke="#9edbc0" stroke-width="2"/></g>`).join('')}
      <g class="v-jump"><path d="M0 0c8-6 20-6 26 0-6 6-18 6-26 0zM26 0l8-6v12z" fill="#7dc12e"/></g>
      <circle class="a-ring" cx="380" cy="262" r="14" fill="none" stroke="#fff" stroke-width="2"/>
      ${[[96, 236], [120, 226], [560, 230], [584, 240]].map(([x, y], i) => `<g class="a-sway" ${dl(i * 0.4)}><path d="M${x} ${y}c-2-30 0-50 6-70M${x + 4} ${y}c4-26 10-40 18-52" stroke="#0e8a10" stroke-width="3" fill="none"/><ellipse cx="${x + 6}" cy="${y - 70}" rx="4" ry="10" fill="#2f4237"/></g>`).join('')}
      ${[0, 1, 2, 3, 4].map((i) => `<circle class="a-blink" ${dl(i * 0.3)} cx="${200 + i * 60}" cy="${246 + (i % 2) * 18}" r="3" fill="#fff"/>`).join('')}`,

    afforest: () => `${sky('vs7', '#fdf9e6', '#dff2c0')}<g class="v-sunrise">${sun(320, 120, 40)}</g>${bird(120, 80, 0)}${bird(160, 96, -1.5)}
      <path d="M0 200 Q160 150 320 180 T640 170 V360 H0Z" fill="#c4e79a"/><path d="M0 250 Q200 220 420 245 T640 236 V360 H0Z" fill="#9fd36a"/>
      ${Array.from({ length: 4 }, (_, r) => Array.from({ length: 9 }, (_, c) => { const x = 40 + c * 70 + (r % 2) * 35; const y = 214 + r * 38; return `<g class="v-sprout" ${dl((c + r * 2) * 0.22)}>${pine(x, y, 30 + r * 8, (c + r) % 2 ? '#22a024' : '#5fb82a')}</g>`; }).join('')).join('')}
      <g class="v-seed"><circle cx="0" cy="0" r="5" fill="#2f4237"/></g>`,

    urban: () => `${sky('vs8', '#f1fae6', '#e0f3c8')}${cloud(500, 60, 0.9, -4)}
      ${[[20, 120], [90, 170], [170, 100], [240, 150], [330, 190], [420, 130], [500, 165], [570, 110]].map(([x, h]) => `<rect x="${x}" y="${250 - h}" width="64" height="${h}" fill="#e9f4df" stroke="#b8d6a6" stroke-width="2"/>${Array.from({ length: Math.floor(h / 30) }, (_, k) => `<rect x="${x + 10}" y="${260 - h + k * 30}" width="14" height="12" fill="#cfe8bd"/><rect x="${x + 38}" y="${260 - h + k * 30}" width="14" height="12" fill="#cfe8bd"/>`).join('')}`).join('')}
      <rect x="0" y="250" width="640" height="22" fill="#dfe8d4"/><rect x="0" y="272" width="640" height="56" fill="#2c3d33"/><path class="a-dash" d="M0 300h640" stroke="#f3fbe3" stroke-width="3" stroke-dasharray="20 16"/><rect x="0" y="328" width="640" height="32" fill="#dfe8d4"/>
      ${[40, 130, 220, 310, 400, 490, 580].map((x, i) => `<g class="v-sprout" ${dl(i * 0.4)}>${tree(x, 264, 18, i * 0.3, i % 2 ? '#22a024' : '#5fb82a')}</g>`).join('')}
      ${car('#c6f36b', 294, 0, 6)}${car('#ffffff', 318, -2, 8, -1)}
      ${[0, 1, 2, 3, 4].map((i) => `<g class="v-leaf" ${dl(i * 0.9)}><path d="M${80 + i * 120} 200c6-6 12-2 10 6-6 4-12 0-10-6z" fill="#7dc12e"/></g>`).join('')}`,

    solar: () => `${sky('vs9', '#f6fbe6', '#dff3c4')}<g class="v-sunarc">${sun(0, 0, 30)}</g>
      <path d="M0 230 Q200 200 400 222 T640 214 V360 H0Z" fill="#b5d98a"/>
      ${Array.from({ length: 2 }, (_, r) => Array.from({ length: 4 }, (_, c) => { const x = 40 + c * 92 + r * 30; const y = 250 + r * 50; return `<g><path d="M${x} ${y}l26-40h70l-26 40z" fill="#1f5a35" stroke="#c6f36b" stroke-width="2"/><path d="M${x + 22} ${y - 34}h62M${x + 13} ${y - 20}h62M${x + 40} ${y - 40}l-24 40M${x + 62} ${y - 40}l-24 40" stroke="#3f8a55" stroke-width="1.5"/><path class="v-glint" ${dl(c * 0.3 + r * 0.5)} d="M${x + 30} ${y - 40}l-26 40h10l26-40z" fill="#ffffff" opacity=".6"/><path d="M${x + 44} ${y}v12" stroke="#2f4237" stroke-width="3"/></g>`; }).join('')).join('')}
      <path class="a-dash" d="M420 280 H520 V250" fill="none" stroke="#c6f36b" stroke-width="4" stroke-dasharray="8 8"/>
      <path d="M500 250v-50l44-34 44 34v50z" fill="#fff" stroke="#0e8a10" stroke-width="3"/><rect class="v-light" x="514" y="208" width="26" height="20" fill="#c6f36b"/><rect x="552" y="214" width="22" height="36" fill="#2f4237"/>
      <rect x="596" y="200" width="30" height="56" rx="5" fill="#fff" stroke="#0e8a10" stroke-width="3"/><rect x="606" y="194" width="10" height="6" fill="#0e8a10"/><rect class="v-fill" x="601" y="205" width="20" height="46" rx="2" fill="#7dc12e"/>`,

    procure: () => `<rect width="640" height="360" fill="#f3f9ec"/>
      <path d="M40 120l170-60 170 60v170H40z" fill="#fff" stroke="#0e8a10" stroke-width="3"/><rect x="150" y="170" width="120" height="120" fill="#2f4237"/>
      ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect class="v-pop" ${dl((r * 3 + c) * 0.25)} x="${60 + c * 26}" y="${248 - r * 26}" width="22" height="22" fill="#c6f36b" stroke="#0e8a10" stroke-width="1.5"/>`).join('')).join('')}
      <rect x="0" y="290" width="640" height="70" fill="#dfe8d4"/><path class="a-dash" d="M0 320h640" stroke="#b8d6a6" stroke-width="3" stroke-dasharray="14 12"/>
      <g class="v-forklift"><rect x="0" y="252" width="56" height="34" rx="5" fill="#22a024"/><rect x="10" y="228" width="26" height="24" fill="none" stroke="#0e8a10" stroke-width="3"/><path d="M60 214v72M60 286h22" stroke="#2f4237" stroke-width="4"/><rect x="64" y="246" width="26" height="26" fill="#c6f36b" stroke="#0e8a10" stroke-width="2"/><circle cx="14" cy="290" r="8" fill="#1f3328"/><circle cx="46" cy="290" r="8" fill="#1f3328"/></g>
      <g class="v-truckout"><rect x="430" y="208" width="140" height="80" rx="4" fill="#fff" stroke="#0e8a10" stroke-width="3"/>${[0, 1, 2].map((k) => `<rect class="v-pop" ${dl(1 + k * 0.4)} x="${442 + k * 42}" y="248" width="34" height="34" fill="#c6f36b" stroke="#0e8a10" stroke-width="1.5"/>`).join('')}<path d="M570 228h40l24 30v30h-64z" fill="#22a024"/><rect x="584" y="236" width="22" height="16" fill="#e8f6dc"/><circle cx="470" cy="292" r="12" fill="#1f3328"/><circle cx="600" cy="292" r="12" fill="#1f3328"/></g>
      <g transform="translate(430 40)"><rect width="170" height="130" rx="10" fill="#fff" stroke="#0e8a10" stroke-width="2"/>${[0, 1, 2, 3].map((k) => `<rect x="44" y="${24 + k * 26}" width="${100 - k * 12}" height="8" rx="4" fill="#dcefcf"/><path class="v-tick" ${dl(k * 0.6)} pathLength="1" d="M16 ${28 + k * 26}l6 6 10-12" fill="none" stroke="#22a024" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>`,

    maintain: () => `${sky('vs11')}${cloud(200, 56, 0.8, -7)}
      <path d="M0 250 Q200 230 420 248 T640 240 V360 H0Z" fill="#94d25e"/>
      <rect x="230" y="110" width="200" height="140" fill="#fff" stroke="#0e8a10" stroke-width="3"/>${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect class="v-light" ${dl((r * 4 + c) * 0.3)} x="${246 + c * 46}" y="${126 + r * 38}" width="30" height="24" fill="#dcefcf" stroke="#22a024"/>`).join('')).join('')}
      <g class="a-spin"><path d="${gear(520, 120, 34, 26, 9)}" fill="#c6f36b" stroke="#0e8a10" stroke-width="2"/><circle cx="520" cy="120" r="10" fill="#fff" stroke="#0e8a10" stroke-width="2"/></g>
      <g class="a-spin-r"><path d="${gear(566, 158, 22, 16, 7)}" fill="#22a024"/><circle cx="566" cy="158" r="6" fill="#fff"/></g>
      ${tree(110, 260, 26, 0)}${tree(170, 266, 18, 0.5, '#5fb82a')}
      <g transform="translate(560 300)"><path d="M0 0v-20" stroke="#2f4237" stroke-width="4"/>${[-60, -40, -20, 0, 20].map((a, i) => { const r = (a * Math.PI) / 180; return `<circle class="v-spray" style="--dx:${Math.round(Math.sin(r) * 90)}px;--dy:${Math.round(-Math.cos(r) * 50)}px;animation-delay:${i * 0.25}s" cx="0" cy="-22" r="3.5" fill="#9fe0c4"/>`; }).join('')}</g>
      <g class="a-float"><g transform="translate(120 90)"><rect x="-16" y="-6" width="32" height="12" rx="4" fill="#2f4237"/><ellipse class="a-spin" cx="-24" cy="-8" rx="12" ry="3" fill="#c6f36b"/><ellipse class="a-spin" cx="24" cy="-8" rx="12" ry="3" fill="#c6f36b"/><path d="M-30 6l-20 60h100l-20-60z" fill="#c6f36b" opacity=".2"/></g></g>`,
  };

  function gear(cx, cy, ro, ri, n) {
    let p = '';
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 ? ri : ro;
      const a1 = (i / (n * 2)) * Math.PI * 2;
      const a2 = ((i + 1) / (n * 2)) * Math.PI * 2;
      p += `${i ? 'L' : 'M'}${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)}L${(cx + r * Math.cos(a2)).toFixed(1)} ${(cy + r * Math.sin(a2)).toFixed(1)}`;
    }
    return `${p}Z`;
  }

  hosts.forEach((h) => {
    const make = S[h.dataset.video];
    if (!make) return;
    h.innerHTML = `<svg viewBox="0 0 640 360" class="illo-svg vid-svg" preserveAspectRatio="xMidYMid slice">${make()}</svg>`;
  });

  // Play only while on screen; tap toggles the description on touch devices
  const vids = document.querySelectorAll('.vid');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-playing', e.isIntersecting)), { rootMargin: '60px' });
    vids.forEach((v) => io.observe(v));
  } else {
    vids.forEach((v) => v.classList.add('is-playing'));
  }
  vids.forEach((v) => {
    v.addEventListener('click', () => {
      const open = !v.classList.contains('is-open');
      vids.forEach((o) => o.classList.remove('is-open'));
      v.classList.toggle('is-open', open);
    });
    v.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); v.click(); }
    });
  });
})();
