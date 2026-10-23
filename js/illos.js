// Animated SVG illustrations, injected into any element with data-illo="name".
// Colours come from CSS variables (--i-stroke, --i-fill, --i-acc, --i-acc2) so each section theme restyles them.
(() => {
  const d = (s) => `style="animation-delay:${s}s"`;
  const I = {
    /* ---------- AI & Compute ---------- */
    chat: `
      <rect class="f s" x="26" y="26" width="176" height="66" rx="18"/>
      <path class="f s" d="M58 91l-12 20 30-20"/>
      <circle class="a a-blink" cx="84" cy="59" r="7"/><circle class="a a-blink" cx="110" cy="59" r="7" ${d(0.2)}/><circle class="a a-blink" cx="136" cy="59" r="7" ${d(0.4)}/>
      <rect class="f s" x="118" y="114" width="176" height="62" rx="18"/>
      <rect class="a a-grow-x" x="140" y="134" width="120" height="7" rx="3.5"/>
      <rect class="d a-grow-x" x="140" y="150" width="78" height="7" rx="3.5" ${d(0.5)}/>
      <g class="a-float"><circle class="f s" cx="262" cy="56" r="24"/><text x="262" y="65" class="glyph">अ</text></g>`,
    voice: `
      <rect class="f s" x="140" y="30" width="40" height="80" rx="20"/>
      <path class="s" d="M120 92a40 40 0 0 0 80 0M160 132v26M138 160h44"/>
      ${[40, 58, 76, 94, 226, 244, 262, 280].map((x, i) => `<rect class="${i % 2 ? 'a' : 'd'} a-bar" x="${x}" y="70" width="8" height="${30 + (i * 13) % 34}" rx="4" ${d(i * 0.12)}/>`).join('')}`,
    layers: `
      ${[0, 1, 2, 3].map((i) => `<g class="a-float" ${d(i * 0.3)}><path class="${i === 0 ? 'a-fill' : 'f'} s" d="M160 ${36 + i * 34}l96 26-96 26-96-26z"/></g>`).join('')}
      <circle class="a a-pulse" cx="160" cy="62" r="5"/>`,
    gpu: `
      <path class="s a-dash" d="M20 60h70M20 100h70M20 140h70M230 60h70M230 100h70M230 140h70M120 10v40M160 10v40M200 10v40M120 150v40M160 150v40M200 150v40"/>
      <rect class="f s" x="90" y="40" width="140" height="120" rx="14"/>
      <rect class="d a-pulse" x="125" y="70" width="70" height="60" rx="8"/>
      <path class="s-acc" d="M140 85h40M140 100h40M140 115h40"/>`,
    datacentre: `
      ${[50, 130, 210].map((x, r) => `<rect class="f s" x="${x}" y="24" width="60" height="150" rx="6"/>` + [0, 1, 2, 3, 4, 5].map((k) => `<rect class="s" x="${x + 8}" y="${34 + k * 23}" width="44" height="15" rx="3"/><circle class="${(k + r) % 3 ? 'a' : 'd'} a-blink" cx="${x + 44}" cy="${41.5 + k * 23}" r="3" ${d(((k * 3 + r) % 7) * 0.2)}/>`).join('')).join('')}
      <path class="s" d="M30 178h260"/>`,
    research: `
      <path class="f s" d="M70 30h40M80 30v50l-40 78a10 10 0 0 0 9 14h82a10 10 0 0 0 9-14l-40-78V30"/>
      <path class="a-fill" d="M52 134h96l14 26a8 8 0 0 1-7 12H45a8 8 0 0 1-7-12z" opacity=".7"/>
      ${[0, 1, 2].map((i) => `<circle class="a a-rise" cx="${86 + i * 14}" cy="140" r="${5 - i}" ${d(i * 0.6)}/>`).join('')}
      <rect class="f s" x="180" y="40" width="118" height="110" rx="10"/>
      <path class="s-acc a-draw" d="M192 130l22-26 20 12 22-36 30-12"/>`,

    /* ---------- Construction technology ---------- */
    bim: `
      <path class="s" d="M30 180h260"/>
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect class="${i % 2 ? 'f' : 'a-fill'} s a-pop" x="104" y="${152 - i * 20}" width="96" height="20" ${d(i * 0.25)}/>`).join('')}
      <path class="s" d="M240 180V22M226 22h70M240 22l-14 0M286 22v40"/>
      <rect class="a a-swing" x="280" y="62" width="12" height="10"/>
      <path class="s-acc a-dash" d="M84 40h-30v140M220 40h0"/>`,
    vision: `
      <path class="s" d="M30 180h260"/>
      <rect class="f s" x="70" y="70" width="60" height="110"/><rect class="f s" x="140" y="40" width="70" height="140"/><rect class="f s" x="220" y="96" width="50" height="84"/>
      <path class="s-acc" d="M40 30h24M40 30v24M280 30h-24M280 30v24M40 190h24M40 190v-24M280 190h-24M280 190v-24" />
      <g class="a-scan"><rect class="box" x="134" y="34" width="82" height="62" rx="4"/><rect class="tag" x="134" y="18" width="60" height="14" rx="3"/></g>`,
    drone: `
      <path class="s" d="M10 182h300"/>
      <rect class="f s" x="40" y="130" width="50" height="52"/><rect class="f s" x="110" y="104" width="40" height="78"/><rect class="f s" x="200" y="120" width="70" height="62"/>
      <g class="a-fly">
        <path class="beam" d="M150 52l-46 128h92z"/>
        <path class="s" d="M126 44h48M150 44v8"/><rect class="a" x="138" y="40" width="24" height="12" rx="4"/>
        <ellipse class="s-acc a-spin" cx="122" cy="42" rx="12" ry="3"/><ellipse class="s-acc a-spin" cx="178" cy="42" rx="12" ry="3"/>
      </g>`,
    shm: `
      <path class="s" d="M10 150h300M40 150v30M280 150v30M160 150v30"/>
      <path class="f s" d="M20 150q140-90 280 0"/>
      ${[70, 120, 200, 250].map((x, i) => { const t = (x - 20) / 280; return `<circle class="a a-pulse" cx="${x}" cy="${Math.round(150 - 180 * t * (1 - t))}" r="6" ${d(i * 0.3)}/>`; }).join('')}
      <path class="s-acc a-draw" d="M20 40l20 0 10-16 12 32 12-24 10 8h30l10-20 12 40 12-30 10 10h120"/>`,
    crm: `
      <rect class="f s" x="40" y="30" width="78" height="140" rx="14"/>
      <circle class="a" cx="79" cy="150" r="7"/>
      <path class="s-acc a-ring" d="M132 70a24 24 0 0 1 0 40"/><path class="s-acc a-ring" d="M146 58a42 42 0 0 1 0 64" ${d(0.3)}/>
      ${[0, 1, 2].map((i) => `<g class="a-slide" ${d(i * 0.5)}><rect class="f s" x="184" y="${34 + i * 46}" width="110" height="36" rx="8"/><circle class="${i === 1 ? 'a' : 'd'}" cx="204" cy="${52 + i * 46}" r="8"/><rect class="d" x="220" y="${48 + i * 46}" width="58" height="7" rx="3"/></g>`).join('')}`,
    integration: `
      <path class="s a-dash" d="M160 100L60 44M160 100l100-56M160 100L60 156M160 100l100 56"/>
      <circle class="a-fill s a-pulse" cx="160" cy="100" r="30"/><path class="s" d="M148 100h24M160 88v24"/>
      ${[[30, 24], [230, 24], [30, 136], [230, 136]].map(([x, y], i) => `<rect class="f s a-float" x="${x}" y="${y}" width="60" height="40" rx="8" ${d(i * 0.4)}/>`).join('')}`,
    gantt: `
      <path class="s" d="M40 24v156M40 180h260"/>
      ${[[50, 120], [90, 110], [140, 90], [170, 100], [210, 80]].map(([x, w], i) => `<rect class="${i % 2 ? 'd' : 'a'} a-grow-x" x="${x}" y="${36 + i * 28}" width="${w}" height="16" rx="5" ${d(i * 0.3)}/>`).join('')}
      <path class="s-acc a-sweep" d="M60 20v164"/>`,

    /* ---------- Data security ---------- */
    shield: `
      <circle class="s a-ring" cx="160" cy="100" r="56"/><circle class="s a-ring" cx="160" cy="100" r="56" ${d(1.2)}/>
      <path class="f s" d="M160 22l62 24v48c0 40-28 70-62 84-34-14-62-44-62-84V46z"/>
      <path class="s-acc a-draw thick" d="M132 100l20 20 38-40"/>`,
    lock: `
      <circle class="s a-spin dashed" cx="160" cy="104" r="80"/>
      <path class="s" d="M128 92V70a32 32 0 0 1 64 0v22"/>
      <rect class="f s" x="112" y="92" width="96" height="76" rx="12"/>
      <circle class="a a-pulse" cx="160" cy="124" r="9"/><path class="s" d="M160 132v16"/>`,
    language: `
      ${[['अ', 70, 70], ['அ', 170, 50], ['అ', 250, 100], ['ಕ', 120, 140], ['বা', 220, 160]].map(([g, x, y], i) => `<g class="a-float" ${d(i * 0.5)}><circle class="${i % 2 ? 'f' : 'a-fill'} s" cx="${x}" cy="${y}" r="30"/><text x="${x}" y="${y + 10}" class="glyph">${g}</text></g>`).join('')}`,
    network: `
      <g class="a-spin slow"><circle class="s" cx="160" cy="100" r="70"/>${Array.from({ length: 12 }, (_, k) => { const a = (k / 12) * Math.PI * 2; return `<path class="s" d="M160 100L${160 + 70 * Math.cos(a)} ${100 + 70 * Math.sin(a)}"/><circle class="${k % 3 ? 'd' : 'a'}" cx="${160 + 70 * Math.cos(a)}" cy="${100 + 70 * Math.sin(a)}" r="6"/>`; }).join('')}</g>
      <circle class="a-fill s a-pulse" cx="160" cy="100" r="18"/>`,
    onprem: `
      <path class="f s" d="M50 180V70l110-46 110 46v110z"/>
      <rect class="f s" x="120" y="88" width="80" height="92" rx="6"/>
      ${[0, 1, 2, 3].map((k) => `<rect class="s" x="130" y="${98 + k * 20}" width="60" height="12" rx="2"/><circle class="a a-blink" cx="180" cy="${104 + k * 20}" r="3" ${d(k * 0.3)}/>`).join('')}
      <circle class="s-acc a-ring" cx="160" cy="130" r="60"/>`,
    hybrid: `
      <rect class="f s" x="30" y="70" width="70" height="110" rx="6"/>
      ${[0, 1, 2, 3].map((k) => `<rect class="s" x="40" y="${82 + k * 24}" width="50" height="14" rx="2"/><circle class="a a-blink" cx="82" cy="${89 + k * 24}" r="3" ${d(k * 0.3)}/>`).join('')}
      <path class="f s" d="M210 110a30 30 0 0 1 4-60 40 40 0 0 1 76 10 26 26 0 0 1 0 50z"/>
      <path class="s-acc a-dash" d="M100 110c40 0 60-30 104-30M100 140c50 0 70-10 110-20"/>`,
    cloud: `
      <path class="f s" d="M90 140a40 40 0 0 1 6-80 56 56 0 0 1 104 14 34 34 0 0 1 4 66z"/>
      ${[[120, 110], [160, 90], [200, 112]].map(([x, y], i) => `<circle class="a a-pulse" cx="${x}" cy="${y}" r="7" ${d(i * 0.4)}/>`).join('')}
      <path class="s" d="M120 110l40-20 40 22"/>
      ${[110, 160, 210].map((x, i) => `<path class="s-acc a-up" d="M${x} 190v-30m-8 8l8-8 8 8" ${d(i * 0.3)}/>`).join('')}`,

    /* ---------- Who we serve ---------- */
    highrise: `
      <path class="s" d="M10 182h300"/>
      ${[[40, 70], [86, 120], [140, 150], [196, 100], [244, 60]].map(([x, h], i) => `<rect class="${i === 2 ? 'a-fill' : 'f'} s a-grow-y" x="${x}" y="${182 - h}" width="42" height="${h}" ${d(i * 0.2)}/>`).join('')}
      <path class="s" d="M290 182V30M250 30h56"/><rect class="a a-swing" x="256" y="30" width="10" height="16"/>`,
    infra: `
      <path class="f s" d="M10 120h300v20H10z"/>
      <path class="s" d="M40 140v40M120 140v40M200 140v40M280 140v40M10 120q75-70 150 0 75-70 150 0"/>
      <path class="s-acc a-dash" d="M10 130h300"/>
      <rect class="a a-drive" x="0" y="104" width="26" height="14" rx="4"/><rect class="d a-drive" x="0" y="104" width="26" height="14" rx="4" ${d(-2.5)}/>`,
    government: `
      <path class="f s" d="M40 70l120-44 120 44z"/><path class="s" d="M40 70h240M50 180h220M40 190h240"/>
      ${[66, 114, 162, 210, 258].map((x) => `<rect class="f s" x="${x - 9}" y="80" width="18" height="100"/>`).join('')}
      <path class="s" d="M160 26V6"/><path class="a a-wave" d="M160 6h26l-6 6 6 6h-26z"/>
      <circle class="a a-pulse" cx="160" cy="54" r="7"/>`,
    sovereign: `
      <rect class="f s" x="50" y="40" width="90" height="140" rx="8"/>
      ${[0, 1, 2, 3, 4].map((k) => `<rect class="s" x="62" y="${54 + k * 24}" width="66" height="14" rx="2"/><circle class="a a-blink" cx="118" cy="${61 + k * 24}" r="3" ${d(k * 0.25)}/>`).join('')}
      <path class="a-fill s" d="M230 46l50 20v38c0 32-22 56-50 66-28-10-50-34-50-66V66z"/>
      <path class="s-acc a-draw thick" d="M210 106l14 14 28-28"/>`,
    innovate: `
      <circle class="a a-ring" cx="160" cy="84" r="50" opacity=".4"/>
      <path class="a-fill s" d="M160 30a54 54 0 0 0-32 98v20h64v-20a54 54 0 0 0-32-98z"/>
      <path class="s" d="M134 160h52M140 174h40"/><path class="s-acc a-blink" d="M160 60v40l-14 14M160 100l14 14"/>
      ${[[90, 40], [230, 40], [70, 100], [250, 100]].map(([x, y], i) => `<path class="s-acc a-blink" d="M${x} ${y}l${x < 160 ? 14 : -14} 6" ${d(i * 0.3)}/>`).join('')}`,
    sustain: `
      <path class="s" d="M40 180h240"/>
      <path class="s" d="M160 180V90"/>
      <g class="a-sway"><path class="a-fill s" d="M160 120c-50 0-70-40-66-80 40 0 66 30 66 80z"/><path class="f s" d="M160 100c40-6 64-40 60-74-40 6-62 30-60 74z"/></g>
      ${[0, 1, 2].map((i) => `<circle class="a a-rise" cx="${120 + i * 40}" cy="170" r="4" ${d(i * 0.7)}/>`).join('')}`,
    techgear: `
      <g class="a-spin"><path class="f s" d="${gear(130, 100, 50, 38, 10)}"/><circle class="s" cx="130" cy="100" r="16"/></g>
      <g class="a-spin-r"><path class="a-fill s" d="${gear(218, 66, 32, 24, 8)}"/><circle class="s" cx="218" cy="66" r="10"/></g>
      <path class="s-acc a-dash" d="M200 130h90M246 130v40M40 40h40"/>`,
    collab: `
      <path class="s a-dash" d="M90 80l70 60 70-60M90 80h140"/>
      ${[[90, 80], [230, 80], [160, 140]].map(([x, y], i) => `<g class="a-float" ${d(i * 0.5)}><circle class="${i === 2 ? 'a-fill' : 'f'} s" cx="${x}" cy="${y}" r="28"/><circle class="d" cx="${x}" cy="${y - 6}" r="8"/><path class="d" d="M${x - 14} ${y + 16}a14 12 0 0 1 28 0z"/></g>`).join('')}`,

    /* ---------- Solutions ---------- */
    excavator: `
      <path class="s" d="M10 182h300"/><path class="f s" d="M190 182c0-30 40-30 80-30v30z" opacity=".8"/>
      <rect class="f s" x="40" y="146" width="110" height="24" rx="12"/>
      ${[58, 82, 106, 130].map((x) => `<circle class="s" cx="${x}" cy="158" r="7"/>`).join('')}
      <rect class="a-fill s" x="60" y="100" width="70" height="46" rx="6"/><rect class="f s" x="70" y="108" width="26" height="22" rx="3"/>
      <g class="a-dig"><path class="s thick" d="M126 112l50-40 40 30"/><path class="a s" d="M206 96l22 4-4 26-24-8z"/></g>`,
    joint: `
      <g class="a-gap-l"><rect class="f s" x="20" y="90" width="132" height="40"/></g>
      <g class="a-gap-r"><rect class="f s" x="168" y="90" width="132" height="40"/></g>
      <path class="s-acc" d="M160 70v80" stroke-dasharray="4 4"/>
      <path class="s" d="M60 60l-20 0m0 0l8-6m-8 6l8 6M260 60h20m0 0l-8-6m8 6l-8 6"/>
      <path class="s" d="M40 130v40M280 130v40"/>`,
    interior: `
      <path class="s" d="M20 180h280M20 30h280"/>
      <rect class="f s" x="60" y="56" width="70" height="50" rx="4"/><path class="s-acc" d="M70 96l18-20 16 12 16-22"/>
      <path class="a-fill s" d="M150 180v-34h110v34M140 146h130v-20a10 10 0 0 0-10-10H150a10 10 0 0 0-10 10z"/>
      <path class="s" d="M80 180v-50M64 130h32l-6-20H70z"/>
      <circle class="a a-pulse" cx="80" cy="118" r="14" opacity=".35"/>`,
    roadworks: `
      <path class="f s" d="M0 150h320v34H0z"/><path class="s-acc a-dash" d="M0 167h320"/>
      <g class="a-roll">
        <rect class="a-fill s" x="40" y="100" width="70" height="34" rx="6"/><rect class="f s" x="60" y="80" width="34" height="22" rx="3"/>
        <circle class="f s" cx="120" cy="134" r="16"/><circle class="s" cx="54" cy="138" r="12"/>
      </g>`,
    landscape: `
      <path class="f s" d="M0 160q80-30 160 0t160 0v40H0z"/>
      <path class="s-acc" d="M100 200q30-30 60-44t80-10"/>
      ${[[60, 0], [150, 0.4], [250, 0.8]].map(([x, dl], i) => `<g class="a-sway" ${d(dl)}><path class="s" d="M${x} 160v-30"/><circle class="${i === 1 ? 'a-fill' : 'f'} s" cx="${x}" cy="${110 - i * 4}" r="${26 - i * 3}"/></g>`).join('')}
      <path class="s" d="M196 150h30M200 150v10M222 150v10"/>`,
    biopool: `
      <ellipse class="f s" cx="160" cy="130" rx="130" ry="44"/>
      <path class="s-acc a-wave-x" d="M50 124q20-8 40 0t40 0 40 0 40 0 40 0"/><path class="s-acc a-wave-x" d="M70 142q20-8 40 0t40 0 40 0 40 0" ${d(0.6)}/>
      ${[[40, 90], [270, 84], [230, 80]].map(([x, y], i) => `<g class="a-sway" ${d(i * 0.4)}><path class="s" d="M${x} 112c0-20 4-30 ${i ? -10 : 10}-${y - 50}"/><path class="a-fill s" d="M${x} 100c-14-4-20-16-16-26 12 2 18 12 16 26z"/></g>`).join('')}`,
    afforest: `
      <path class="s" d="M10 180h300"/>
      ${[40, 100, 160, 220, 280].map((x, i) => `<g class="a-grow-y" ${d(i * 0.3)}><path class="s" d="M${x} 180v-40"/><path class="${i % 2 ? 'f' : 'a-fill'} s" d="M${x} 90l24 50h-48z"/></g>`).join('')}`,
    urbanforest: `
      <path class="s" d="M10 170h300M10 186h300"/>
      ${[[30, 60], [90, 100], [230, 80], [270, 120]].map(([x, h]) => `<rect class="f s" x="${x}" y="${170 - h}" width="40" height="${h}"/>`).join('')}
      ${[60, 130, 200, 260].map((x, i) => `<g class="a-sway" ${d(i * 0.3)}><path class="s" d="M${x} 170v-26"/><circle class="a-fill s" cx="${x}" cy="128" r="18"/></g>`).join('')}`,
    solar: `
      <g class="a-spin slow"><circle class="a" cx="70" cy="56" r="22"/>${Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2; return `<path class="s-acc" d="M${70 + 30 * Math.cos(a)} ${56 + 30 * Math.sin(a)}L${70 + 40 * Math.cos(a)} ${56 + 40 * Math.sin(a)}"/>`; }).join('')}</g>
      <path class="f s" d="M120 150l40-60h150l-40 60z"/><path class="s" d="M170 90l-30 60M220 90l-30 60M260 90l-30 60M133 130h150M147 110h150"/>
      <path class="s" d="M210 150v30M180 180h60"/>
      <path class="s-acc a-dash" d="M86 74l60 40"/>`,
    procurement: `
      <path class="s" d="M0 182h320"/>
      <g class="a-drive slow">
        <rect class="a-fill s" x="20" y="100" width="120" height="66" rx="4"/><path class="f s" d="M140 120h40l22 26v20h-62z"/>
        <circle class="f s" cx="60" cy="168" r="12"/><circle class="f s" cx="170" cy="168" r="12"/>
        <rect class="s" x="36" y="114" width="36" height="28"/><rect class="s" x="84" y="114" width="40" height="28"/>
      </g>`,
    maintenance: `
      <g class="a-spin"><path class="f s" d="${gear(130, 100, 52, 40, 10)}"/><circle class="s" cx="130" cy="100" r="16"/></g>
      <g class="a-sway"><path class="a-fill s" d="M220 160c-40-4-56-40-48-74 36 4 54 36 48 74z"/><path class="s" d="M220 160c-12-20-22-40-40-62"/></g>`,

    /* ---------- Section hero illustrations ---------- */
    skyline: `
      <path class="s" d="M0 184h320"/>
      ${[[20, 70], [52, 110], [92, 140], [132, 90]].map(([x, h], i) => `<rect class="${i === 2 ? 'a-fill' : 'f'} s a-grow-y" x="${x}" y="${184 - h}" width="34" height="${h}" ${d(i * 0.2)}/>`).join('')}
      <path class="f s" d="M176 120l60-24 60 24z"/><path class="s" d="M176 120h120M186 184v-60M206 184v-60M226 184v-60M246 184v-60M266 184v-60M286 184v-60"/>
      <circle class="a a-pulse" cx="236" cy="110" r="5"/>
      <path class="s-acc a-dash" d="M20 40c80-30 200-30 280 0"/>
      ${[40, 160, 280].map((x, i) => `<circle class="a a-blink" cx="${x}" cy="${i === 1 ? 18 : 34}" r="4" ${d(i * 0.4)}/>`).join('')}`,
    greenscape: `
      <g class="a-spin slow"><circle class="a" cx="270" cy="40" r="18"/></g>
      <path class="f s" d="M0 140q80-24 160 0t160 0v60H0z"/>
      <path class="f s" d="M0 170h320v30H0z"/><path class="s-acc a-dash" d="M0 185h320"/>
      ${[[40, 0], [90, 0.4], [140, 0.8]].map(([x, dl]) => `<g class="a-sway" ${d(dl)}><path class="s" d="M${x} 150v-24"/><circle class="a-fill s" cx="${x}" cy="112" r="16"/></g>`).join('')}
      <path class="f s" d="M190 142l20-30h80l-20 30z"/><path class="s" d="M230 142v28"/>
      <g class="a-roll"><rect class="a-fill s" x="20" y="158" width="40" height="16" rx="4"/><circle class="f s" cx="66" cy="172" r="8"/></g>`,
    mail: `
      <path class="s-acc a-dash" d="M30 160c60 0 80-80 150-80"/>
      <g class="a-float"><path class="a-fill s" d="M180 60l120-30-60 120-20-50z"/><path class="s" d="M220 100l80-70"/></g>`,
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

  window.gbxIllo = (name) => (I[name] ? `<svg viewBox="0 0 320 200" class="illo-svg" preserveAspectRatio="xMidYMid meet">${I[name]}</svg>` : '');

  const els = document.querySelectorAll('[data-illo]');
  els.forEach((el) => {
    const svg = I[el.dataset.illo];
    if (!svg) return;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<svg viewBox="0 0 320 200" class="illo-svg" preserveAspectRatio="xMidYMid meet">${svg}</svg>`;
  });

  // Only animate illustrations that are on screen
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('in-view', e.isIntersecting));
    }, { rootMargin: '80px' });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add('in-view'));
  }
})();
