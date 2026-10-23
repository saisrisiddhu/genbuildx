import * as THREE from 'three';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = window.matchMedia('(max-width: 900px)').matches;
// Lower-power devices get a lighter render
const lowPower = small || (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
const MAX_DPR = lowPower ? 1 : 1.5;
const FRAME_MS = 1000 / (lowPower ? 30 : 45);

// While the page is actively scrolling, 3D scenes drop to a few frames per second
// so the browser can spend its time on smooth scrolling.
let scrolling = false;
let scrollTimer;
window.addEventListener('scroll', () => {
  scrolling = true;
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => { scrolling = false; }, 140);
}, { passive: true });
const C = { lime: 0xc6f36b, green: 0x7dc12e, mid: 0x22a024, deep: 0x0e8a10, bg: 0x07130d };

// Seeded random so the city looks the same on every visit
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// Shared renderer lifecycle: resize, pause off-screen / hidden tab, reduced motion
function mount(canvas, setup) {
  if (!canvas) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPower, alpha: true, powerPreference: lowPower ? 'low-power' : 'high-performance' });
  } catch (e) {
    canvas.style.display = 'none';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  const ctx = setup({ scene, camera, canvas });

  let raf = null;
  let visible = false;
  let last = 0;
  let t = 0;
  const render = () => renderer.render(scene, camera);
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (ctx.resize) ctx.resize(w, h);
    if (!raf) render();
  };
  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    const gap = now - last;
    if (gap < (scrolling ? 250 : FRAME_MS)) return;
    const dt = Math.min(0.05, gap / 1000);
    last = now;
    t += dt;
    ctx.update(t, dt);
    render();
  };
  const play = () => {
    if (raf || reduceMotion) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => { cancelAnimationFrame(raf); raf = null; };

  new ResizeObserver(resize).observe(canvas);
  resize();
  if (reduceMotion) { ctx.update(6, 0); render(); return; }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !document.hidden) play(); else stop();
  }, { rootMargin: '100px' }).observe(canvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else if (visible) play();
  });
}

// Pointer helpers: window-wide parallax + horizontal drag on the canvas
const pointer = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

function dragger(el) {
  const state = { offset: 0, velocity: 0, down: false, lastX: 0 };
  el.addEventListener('pointerdown', (e) => { state.down = true; state.lastX = e.clientX; });
  window.addEventListener('pointerup', () => { state.down = false; });
  window.addEventListener('pointermove', (e) => {
    if (!state.down) return;
    const dx = e.clientX - state.lastX;
    state.lastX = e.clientX;
    state.velocity = dx * 0.005;
    state.offset += state.velocity;
  });
  return state;
}

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(198,243,107,1)');
  grd.addColorStop(0.25, 'rgba(125,193,46,.6)');
  grd.addColorStop(1, 'rgba(14,138,16,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ---------------- Hero: digital twin city ---------------- */
mount(document.getElementById('cityCanvas'), ({ scene, camera, canvas }) => {
  scene.fog = new THREE.Fog(C.bg, 16, 34);
  const city = new THREE.Group();
  scene.add(city);

  const grid = new THREE.GridHelper(26, 52, C.green, C.green);
  grid.material.transparent = true;
  grid.material.opacity = 0.12;
  city.add(grid);

  const unit = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const unitEdges = new THREE.EdgesGeometry(unit);
  const fillMat = new THREE.MeshBasicMaterial({ color: C.deep, transparent: true, opacity: 0.16, depthWrite: false });
  const edgeMat = new THREE.LineBasicMaterial({ color: C.green, transparent: true, opacity: 0.8 });
  const hotMat = new THREE.LineBasicMaterial({ color: C.lime, transparent: true, opacity: 1 });
  const floorMat = new THREE.LineBasicMaterial({ color: C.green, transparent: true, opacity: 0.28 });

  // Floor-line geometries, cached by floor count
  const floorCache = new Map();
  const floorsGeo = (n) => {
    if (floorCache.has(n)) return floorCache.get(n);
    const pts = [];
    for (let i = 1; i < n; i++) {
      const y = i / n;
      pts.push(-0.5, y, -0.5, 0.5, y, -0.5, 0.5, y, -0.5, 0.5, y, 0.5, 0.5, y, 0.5, -0.5, y, 0.5, -0.5, y, 0.5, -0.5, y, -0.5);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    floorCache.set(n, g);
    return g;
  };

  const SPAN = 6;
  const CELL = 1.25;
  const roads = [];
  const buildings = [];
  for (let gx = -SPAN; gx <= SPAN; gx++) {
    if (gx % 3 === 0) { roads.push(gx * CELL); continue; }
    for (let gz = -SPAN; gz <= SPAN; gz++) {
      if (gz % 3 === 0) continue;
      const dist = Math.hypot(gx, gz);
      if (dist > SPAN + 0.5 || rand() < 0.08) continue;
      const centre = Math.max(0, 1 - dist / (SPAN + 1));
      const h = 0.4 + Math.pow(rand(), 1.6) * 5.5 * centre + centre * 1.4;
      const w = 0.7 + rand() * 0.25;
      const d = 0.7 + rand() * 0.25;
      const hot = h > 4.2 && rand() < 0.6;
      const b = new THREE.Group();
      b.add(new THREE.Mesh(unit, fillMat));
      b.add(new THREE.LineSegments(unitEdges, hot ? hotMat : edgeMat));
      b.add(new THREE.LineSegments(floorsGeo(Math.max(2, Math.round(h / 0.32))), floorMat));
      b.position.set(gx * CELL, 0, gz * CELL);
      b.scale.set(w, 0.001, d);
      b.userData = { h, delay: 0.15 + dist * 0.12 + rand() * 0.3 };
      city.add(b);
      buildings.push(b);
    }
  }

  // Sensor beacons on the tallest towers
  const tall = [...buildings].sort((a, b) => b.userData.h - a.userData.h).slice(0, 7);
  const glow = glowTexture();
  const beacons = tall.map((b, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.scale.setScalar(0.7);
    s.userData = { b, phase: i * 0.9 };
    const beamGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 2.2, 0)]);
    const beam = new THREE.Line(beamGeo, new THREE.LineBasicMaterial({ color: C.lime, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }));
    s.userData.beam = beam;
    city.add(s, beam);
    return s;
  });

  // Tower cranes
  const cranes = [];
  [[1, 2], [-2, -1], [4, -2]].forEach(([gx, gz], i) => {
    const g = new THREE.Group();
    const mastH = 4.6 + i * 0.8;
    const mast = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, mastH, 0)]);
    g.add(new THREE.Line(mast, hotMat));
    const jib = new THREE.Group();
    jib.position.y = mastH;
    const jibGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.8, 0, 0), new THREE.Vector3(2.6, 0, 0),
      new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(2.6, 0, 0),
      new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(-0.8, 0, 0),
      new THREE.Vector3(2.0, 0, 0), new THREE.Vector3(2.0, -1.4, 0),
    ]);
    jib.add(new THREE.LineSegments(jibGeo, hotMat));
    g.add(jib);
    g.position.set(gx * CELL + 0.62, 0, gz * CELL + 0.62);
    g.userData = { jib, speed: 0.25 + i * 0.1, phase: i * 2 };
    city.add(g);
    cranes.push(g);
  });

  // Radar pulses
  const ringGeo = new THREE.RingGeometry(0.97, 1, 96).rotateX(-Math.PI / 2);
  const rings = [0, 0.5].map((off) => {
    const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: C.lime, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    m.position.y = 0.02;
    m.userData.off = off;
    city.add(m);
    return m;
  });

  // Data traffic along the roads
  const N = small ? 90 : 160;
  const traffic = [];
  const tPos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    traffic.push({ axis: rand() < 0.5 ? 'x' : 'z', lane: roads[Math.floor(rand() * roads.length)] + (rand() - 0.5) * 0.3, p: (rand() * 2 - 1) * 8, v: (0.6 + rand() * 1.4) * (rand() < 0.5 ? -1 : 1) });
  }
  const tGeo = new THREE.BufferGeometry();
  tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
  const tMat = new THREE.PointsMaterial({ color: C.lime, size: 0.11, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending });
  city.add(new THREE.Points(tGeo, tMat));

  // Survey drone with scanning cone
  const drone = new THREE.Group();
  const body = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.22)), hotMat);
  const rotor = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.36, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: C.lime, side: THREE.DoubleSide }));
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.scale.setScalar(1.2);
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(1.4, 1, 40, 1, true).translate(0, -0.5, 0),
    new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  drone.add(body, rotor, halo, cone);
  city.add(drone);
  const scanSpot = new THREE.Mesh(new THREE.CircleGeometry(1.4, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: C.lime, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending }));
  scanSpot.position.y = 0.03;
  city.add(scanSpot);

  const drag = dragger(canvas);
  const target = new THREE.Vector3(0, 1.6, 0);
  let radius = 19;
  const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

  return {
    resize(w, h) {
      radius = w / h < 0.9 ? 25 : w / h < 1.3 ? 22 : 20.5;
      target.set(0, w / h < 0.9 ? 1.2 : 1.6, 0);
    },
    update(t, dt) {
      buildings.forEach((b) => {
        const k = ease((t - b.userData.delay) / 1.4);
        b.scale.y = Math.max(0.001, b.userData.h * k);
      });
      beacons.forEach((s) => {
        const { b, phase, beam } = s.userData;
        const top = b.scale.y + 0.15;
        s.position.set(b.position.x, top, b.position.z);
        const pulse = 0.55 + Math.sin(t * 2.4 + phase) * 0.25;
        s.scale.setScalar(pulse);
        beam.position.set(b.position.x, top, b.position.z);
        beam.material.opacity = 0.15 + Math.max(0, Math.sin(t * 1.3 + phase)) * 0.55;
      });
      cranes.forEach((c) => { c.userData.jib.rotation.y = Math.sin(t * c.userData.speed + c.userData.phase) * 1.4; });
      rings.forEach((r) => {
        const p = ((t * 0.22 + r.userData.off) % 1);
        r.scale.setScalar(0.5 + p * 10);
        r.material.opacity = 0.45 * (1 - p);
      });
      for (let i = 0; i < N; i++) {
        const o = traffic[i];
        o.p += o.v * dt;
        if (o.p > 8.5) o.p = -8.5; else if (o.p < -8.5) o.p = 8.5;
        tPos[i * 3] = o.axis === 'x' ? o.p : o.lane;
        tPos[i * 3 + 1] = 0.06;
        tPos[i * 3 + 2] = o.axis === 'x' ? o.lane : o.p;
      }
      tGeo.attributes.position.needsUpdate = true;

      const dx = Math.sin(t * 0.23) * 5.5;
      const dz = Math.sin(t * 0.31 + 1) * 4.5;
      const dy = 6.4 + Math.sin(t * 0.8) * 0.3;
      drone.position.set(dx, dy, dz);
      rotor.rotation.y += dt * 8;
      body.rotation.y += dt * 1.5;
      cone.scale.set(1, dy, 1);
      scanSpot.position.x = dx;
      scanSpot.position.z = dz;

      if (!drag.down) { drag.velocity *= 0.94; drag.offset += drag.velocity; }
      const az = t * 0.07 + drag.offset + pointer.x * 0.25 + 0.6;
      const el = 0.62 + pointer.y * 0.06;
      camera.position.set(
        target.x + radius * Math.cos(el) * Math.sin(az),
        target.y + radius * Math.sin(el),
        target.z + radius * Math.cos(el) * Math.cos(az),
      );
      camera.lookAt(target);
    },
  };
});

/* ---------------- AI section: neural core ---------------- */
mount(document.getElementById('coreCanvas'), ({ scene, camera, canvas }) => {
  camera.position.set(0, 0, 11);
  const core = new THREE.Group();
  scene.add(core);

  // Fibonacci sphere of nodes
  const N = small ? 220 : 380;
  const R = 3.2;
  const nodes = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    nodes.push(new THREE.Vector3(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R));
  }
  const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodes);
  core.add(new THREE.Points(nodeGeo, new THREE.PointsMaterial({ color: C.lime, size: 0.07, transparent: true, opacity: 0.9 })));

  // Connect each node to its nearest neighbours
  const adj = nodes.map(() => []);
  const seg = [];
  const seen = new Set();
  nodes.forEach((a, i) => {
    const near = nodes.map((b, j) => [j, a.distanceToSquared(b)]).filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]).slice(0, 3);
    near.forEach(([j]) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      adj[i].push(j);
      adj[j].push(i);
      seg.push(a, nodes[j]);
    });
  });
  const linkGeo = new THREE.BufferGeometry().setFromPoints(seg);
  core.add(new THREE.LineSegments(linkGeo, new THREE.LineBasicMaterial({ color: C.green, transparent: true, opacity: 0.22 })));

  // Signals travelling across the network
  const M = small ? 36 : 70;
  const sPos = new Float32Array(M * 3);
  const signals = Array.from({ length: M }, () => {
    const a = Math.floor(rand() * N);
    return { a, b: adj[a][0], k: rand(), v: 0.8 + rand() * 1.4 };
  });
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  core.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xeaffc0, size: 0.16, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  // Inner core
  const inner = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.35, 1)), new THREE.LineBasicMaterial({ color: C.lime, transparent: true, opacity: 0.45 }));
  core.add(inner);
  const inner2 = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.8)), new THREE.LineBasicMaterial({ color: C.green, transparent: true, opacity: 0.8 }));
  core.add(inner2);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.setScalar(4.2);
  core.add(glow);

  // Orbit rings with satellites (compute nodes)
  const orbits = [[4.3, 0.4, 0], [4.7, -0.6, 0.8], [5.1, 1.2, -0.4]].map(([r, rx, rz], i) => {
    const g = new THREE.Group();
    g.rotation.set(rx, 0, rz);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 6, 200), new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: 0.45 }));
    ring.rotation.x = Math.PI / 2;
    const sat = new THREE.Group();
    const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.28, 0.28, 0.28)), new THREE.LineBasicMaterial({ color: C.lime }));
    const sg = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow.material.map, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    sg.scale.setScalar(0.9);
    sat.add(box, sg);
    g.add(ring, sat);
    g.userData = { r, sat, box, speed: 0.35 + i * 0.12, phase: i * 2.1 };
    scene.add(g);
    return g;
  });

  const drag = dragger(canvas);
  const rot = { x: 0, y: 0 };

  return {
    resize(w, h) { camera.position.z = w < 420 ? 12.5 : 11; },
    update(t, dt) {
      for (let i = 0; i < M; i++) {
        const s = signals[i];
        s.k += s.v * dt;
        if (s.k >= 1) {
          s.k = 0;
          const nextOpts = adj[s.b];
          s.a = s.b;
          s.b = nextOpts[Math.floor(rand() * nextOpts.length)];
        }
        const A = nodes[s.a];
        const B = nodes[s.b];
        sPos[i * 3] = A.x + (B.x - A.x) * s.k;
        sPos[i * 3 + 1] = A.y + (B.y - A.y) * s.k;
        sPos[i * 3 + 2] = A.z + (B.z - A.z) * s.k;
      }
      sGeo.attributes.position.needsUpdate = true;

      if (!drag.down) { drag.velocity *= 0.94; drag.offset += drag.velocity; }
      rot.x += ((pointer.y * 0.35) - rot.x) * 0.05;
      rot.y += ((pointer.x * 0.5) - rot.y) * 0.05;
      core.rotation.y = t * 0.12 + rot.y + drag.offset;
      core.rotation.x = rot.x * 0.6;
      inner.rotation.y = -t * 0.4;
      inner.rotation.x = t * 0.2;
      inner2.rotation.y = t * 0.8;
      const breathe = 1 + Math.sin(t * 1.2) * 0.03;
      core.scale.setScalar(breathe);
      glow.material.opacity = 0.7 + Math.sin(t * 2) * 0.2;

      orbits.forEach((o) => {
        const { r, sat, box, speed, phase } = o.userData;
        const a = t * speed + phase;
        sat.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        box.rotation.x += dt;
        box.rotation.y += dt * 1.3;
      });
    },
  };
});

/* ---------------- Construction tech: BIM tower assembling floor by floor ---------------- */
mount(document.getElementById('bimCanvas'), ({ scene, camera, canvas }) => {
  const root = new THREE.Group();
  scene.add(root);
  const ink = 0x0e8a10;

  const grid = new THREE.GridHelper(14, 28, C.green, C.green);
  grid.material.transparent = true;
  grid.material.opacity = 0.25;
  root.add(grid);

  // Site boundary
  const plot = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(7, 0.02, 7)), new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.5 }));
  root.add(plot);

  const FLOORS = 14;
  const FH = 0.38;
  const W = 2.6;
  const D = 2.0;
  const slabGeo = new THREE.BoxGeometry(W, 0.06, D);
  const slabEdges = new THREE.EdgesGeometry(slabGeo);
  const glassGeo = new THREE.BoxGeometry(W * 0.96, FH - 0.06, D * 0.96);
  const glassEdges = new THREE.EdgesGeometry(glassGeo);
  const slabMat = new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: 0.35, depthWrite: false });
  const lineMat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.9 });
  const glassMat = new THREE.MeshBasicMaterial({ color: C.lime, transparent: true, opacity: 0.18, depthWrite: false });
  const glassLine = new THREE.LineBasicMaterial({ color: C.mid, transparent: true, opacity: 0.45 });

  const floors = [];
  for (let i = 0; i < FLOORS; i++) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(slabGeo, slabMat), new THREE.LineSegments(slabEdges, lineMat));
    const glass = new THREE.Group();
    glass.position.y = FH / 2;
    glass.add(new THREE.Mesh(glassGeo, glassMat), new THREE.LineSegments(glassEdges, glassLine));
    g.add(glass);
    g.userData = { baseY: i * FH + 0.03 };
    g.visible = false;
    root.add(g);
    floors.push(g);
  }

  // Tower crane
  const crane = new THREE.Group();
  const mastH = FLOORS * FH + 1.6;
  crane.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.18, mastH, 0.18).translate(0, mastH / 2, 0)), lineMat));
  const jib = new THREE.Group();
  jib.position.y = mastH;
  jib.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5, 0.12, 0.12).translate(1.4, 0, 0)), lineMat));
  const hook = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.3), new THREE.MeshBasicMaterial({ color: C.lime }));
  const cable = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0)]), lineMat);
  jib.add(hook, cable);
  crane.add(jib);
  crane.position.set(-2.4, 0, -1.6);
  root.add(crane);

  // Scanning plane (digital twin capture)
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 3.4).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: C.lime, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false }));
  const scanEdge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(4.2, 3.4).rotateX(-Math.PI / 2)), new THREE.LineBasicMaterial({ color: C.mid }));
  scan.add(scanEdge);
  root.add(scan);

  // Data points rising from the tower
  const P = small ? 40 : 80;
  const pPos = new Float32Array(P * 3);
  const parts = Array.from({ length: P }, () => ({ x: (rand() - 0.5) * W, z: (rand() - 0.5) * D, y: rand() * 6, v: 0.4 + rand() * 0.8 }));
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  root.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: C.mid, size: 0.07, transparent: true, opacity: 0.8 })));

  const drag = dragger(canvas);
  const CYCLE = 14;
  const target = new THREE.Vector3(0, 2.8, 0);
  let radius = 13;

  return {
    resize(w, h) { radius = w < 420 ? 14.5 : 13; },
    update(t, dt) {
      const ct = t % CYCLE;
      const build = Math.min(1, ct / 7);
      const built = build * FLOORS;
      // explode the stack (BIM layers) between 8s and 12s
      const ex = ct > 8 && ct < 12 ? Math.sin(((ct - 8) / 4) * Math.PI) : 0;
      floors.forEach((f, i) => {
        const k = Math.min(1, Math.max(0, built - i));
        f.visible = k > 0;
        f.position.y = f.userData.baseY + (1 - k) * 1.2 + ex * i * 0.22;
        f.scale.setScalar(0.6 + k * 0.4);
      });
      const topY = Math.max(0.3, built * FH);
      hook.position.y = -(mastH - topY - 0.6) * (0.5 + 0.5 * Math.cos(t * 1.3));
      cable.scale.y = -hook.position.y;
      jib.rotation.y = Math.sin(t * 0.4) * 0.9 + 0.6;
      scan.position.y = (Math.sin(t * 0.9) * 0.5 + 0.5) * topY;
      scan.material.opacity = 0.12 + 0.12 * Math.abs(Math.sin(t * 0.9));
      for (let i = 0; i < P; i++) {
        const o = parts[i];
        o.y += o.v * dt;
        if (o.y > topY + 2.5) o.y = 0;
        pPos[i * 3] = o.x * 1.1;
        pPos[i * 3 + 1] = o.y;
        pPos[i * 3 + 2] = o.z * 1.1;
      }
      pGeo.attributes.position.needsUpdate = true;
      if (!drag.down) { drag.velocity *= 0.94; drag.offset += drag.velocity; }
      const az = t * 0.15 + drag.offset + pointer.x * 0.3 + 0.8;
      const el = 0.42 + pointer.y * 0.05;
      camera.position.set(radius * Math.cos(el) * Math.sin(az), target.y + radius * Math.sin(el), radius * Math.cos(el) * Math.cos(az));
      camera.lookAt(target);
    },
  };
});

