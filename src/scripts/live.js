/**
 * Everything that moves on the site, in one animation loop:
 *
 *   · a WebGL network of nodes that ripples and leans toward the pointer
 *   · sparkles that trail the cursor
 *   · the custom cursor, magnetic buttons and card tilt
 *   · smooth scrolling, scroll reveals and the footer wordmark
 *
 * Loaded lazily from Backdrop.astro, and never on a reduced-motion setting,
 * so the site stays usable without any of it.
 */
import * as THREE from 'three';
import Lenis from 'lenis';

const lerp = (a, b, t) => a + (b - a) * t;

/** One source of truth for pointer and scroll, read by everything below. */
const M = {
  x: innerWidth / 2, y: innerHeight / 2,
  px: innerWidth / 2, py: innerHeight / 2,
  sx: innerWidth / 2, sy: innerHeight / 2,
  down: false, scroll: 0, velocity: 0,
};

export function start() {
  const coarse = matchMedia('(pointer: coarse)').matches;
  const cursor = coarse ? null : initCursor();
  const lenis = initScroll();
  const three = initGL();
  initCards();
  initReveals();
  const wordmark = initWordmark();
  const rail = initRail();
  const magnets = [...document.querySelectorAll('.magnetic')];
  const prog = document.querySelector('.progress');
  const head = document.querySelector('[data-header]');

  addEventListener('pointermove', (e) => { M.x = e.clientX; M.y = e.clientY; }, { passive: true });
  addEventListener('pointerdown', () => {
    M.down = true;
    cursor?.ring.classList.add('press');
    if (three) three.ripples.push({ x: three.cursor.x, y: three.cursor.y, t: 0 });
    if (three && three.ripples.length > 5) three.ripples.shift();
  });
  addEventListener('pointerup', () => { M.down = false; cursor?.ring.classList.remove('press'); });

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    lenis?.raf(now);

    M.sx = lerp(M.sx, M.x, 0.12);
    M.sy = lerp(M.sy, M.y, 0.12);
    cursor?.tick();

    for (const el of magnets) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = M.x - cx, dy = M.y - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, 180);
      const k = dist < reach ? (1 - dist / reach) * 0.32 : 0;
      el.style.transform = `translate(${(dx * k).toFixed(2)}px, ${(dy * k).toFixed(2)}px)`;
    }

    if (Math.abs(M.velocity) > 0.03) refreshHotCard();

    const y = lenis ? M.scroll : scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    head?.classList.toggle('stuck', y > 14);

    rail?.(dt);
    wordmark?.(now);
    three?.tick(now, dt, y);

    M.velocity = lerp(M.velocity, 0, 0.08);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) last = performance.now(); });

  /* ── smooth scrolling ─────────────────────────────────────────── */
  function initScroll() {
    const l = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.09 });
    l.on('scroll', ({ scroll, velocity }) => { M.scroll = scroll; M.velocity = velocity; });
    for (const a of document.querySelectorAll('a[href^="#"]')) {
      a.addEventListener('click', (e) => {
        const el = document.querySelector(a.getAttribute('href'));
        if (!el) return;
        e.preventDefault();
        l.scrollTo(el, { offset: -80 });
      });
    }
    document.querySelector('[data-top]')?.addEventListener('click', () => l.scrollTo(0, { duration: 1.4 }));
    return l;
  }

  /* ── cursor ───────────────────────────────────────────────────── */
  function initCursor() {
    const dot = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return null;
    let rx = M.x, ry = M.y;
    document.addEventListener('pointerover', (e) => {
      const hot = e.target instanceof Element && e.target.closest('a, button, summary, [data-cursor]');
      ring.classList.toggle('hot', !!hot);
    });
    return {
      ring,
      tick() {
        rx = lerp(rx, M.x, 0.16);
        ry = lerp(ry, M.y, 0.16);
        dot.style.transform = `translate(${M.x}px, ${M.y}px)`;
        ring.style.transform = `translate(${rx.toFixed(2)}px, ${ry.toFixed(2)}px)`;
      },
    };
  }

  /* ── cards ────────────────────────────────────────────────────── */
  let hotCard = null;
  function shapeCard(card, x, y) {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${x - r.left}px`);
    card.style.setProperty('--spot-y', `${y - r.top}px`);
    const rX = (((y - r.top) / r.height) - 0.5) * -6;
    const rY = (((x - r.left) / r.width) - 0.5) * 8;
    card.style.transform =
      `perspective(1000px) rotateX(${rX.toFixed(2)}deg) rotateY(${rY.toFixed(2)}deg) translateY(-6px) scale(1.035)`;
  }
  function clearCard(card) { if (card) card.style.transform = ''; }
  function refreshHotCard() {
    const el = document.elementFromPoint(M.x, M.y);
    const card = el && el.closest ? el.closest('.card') : null;
    if (card !== hotCard) { clearCard(hotCard); hotCard = card; }
    if (card) shapeCard(card, M.x, M.y);
  }
  function initCards() {
    for (const card of document.querySelectorAll('.card')) {
      card.addEventListener('pointermove', (e) => {
        if (hotCard && hotCard !== card) clearCard(hotCard);
        hotCard = card;
        shapeCard(card, e.clientX, e.clientY);
      });
      card.addEventListener('pointerleave', () => {
        clearCard(card);
        if (hotCard === card) hotCard = null;
      });
    }
  }

  /* ── reveals ──────────────────────────────────────────────────── */
  function initReveals() {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const sibs = [...en.target.parentElement.children].filter((c) => c.classList.contains('r'));
        en.target.style.transitionDelay = `${Math.max(0, sibs.indexOf(en.target)) * 0.07}s`;
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    for (const el of document.querySelectorAll('.r')) io.observe(el);
  }

  /* ── marquee ──────────────────────────────────────────────────── */
  function initRail() {
    const rail = document.querySelector('[data-rail]');
    if (!rail) return null;
    rail.innerHTML += rail.innerHTML;          // second copy, so it can loop
    let x = 0, half = 0;
    const measure = () => { half = rail.scrollWidth / 2; };
    addEventListener('resize', measure);
    addEventListener('load', measure);
    measure();
    return (dt) => {
      x -= (26 + Math.abs(M.velocity) * 11) * dt;
      if (half && -x >= half) x += half;
      rail.style.transform = `translateX(${x.toFixed(2)}px)`;
    };
  }

  /* ── footer wordmark ──────────────────────────────────────────── */
  function initWordmark() {
    const text = document.querySelector('[data-wordmark]');
    if (!text) return null;
    const chars = [];
    const raw = text.textContent;
    text.textContent = '';
    for (const ch of raw) {
      const el = document.createElement('span');
      el.className = 'wm-char';
      el.textContent = ch;
      text.appendChild(el);
      chars.push({ el, y: 0, offset: 0 });
    }
    let width = 0;
    const slice = () => {
      const box = text.getBoundingClientRect();
      width = box.width;
      for (const c of chars) {
        c.offset = c.el.getBoundingClientRect().left - box.left;
        c.el.style.backgroundSize = `${width}px 100%`;
        c.el.style.backgroundPosition = `${-c.offset}px 0`;
      }
    };
    addEventListener('resize', slice);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(slice);
    slice();

    return (now) => {
      for (const c of chars) {
        const r = c.el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > innerHeight + 80) continue;
        const dx = M.x - (r.left + r.width / 2), dy = M.y - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        const fall = d < 190 ? (1 - d / 190) * (1 - d / 190) : 0;
        c.y = lerp(c.y, -fall * 24, 0.14);
        c.el.style.transform = `translateY(${c.y.toFixed(2)}px)`;
        if (width) c.el.style.backgroundPosition = `${((now / 26) % width) - c.offset}px 0`;
      }
    };
  }

  /* ── WebGL: network waves and cursor sparkles ─────────────────── */
  function initGL() {
    const canvas = document.querySelector('[data-gl]');
    if (!canvas) return null;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return null;                              // no WebGL: the page still works
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.setSize(innerWidth, innerHeight);

    const dark = () => document.documentElement.dataset.theme !== 'light';
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
    camera.position.z = 26;

    const small = innerWidth < 760;
    const COLS = small ? 16 : 26, ROWS = small ? 11 : 15, GAP = 2.5;
    const N = COLS * ROWS;
    const home = new Float32Array(N * 3), node = new Float32Array(N * 3), nodeSize = new Float32Array(N);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i3 = (r * COLS + c) * 3;
        home[i3] = (c - (COLS - 1) / 2) * GAP;
        home[i3 + 1] = (r - (ROWS - 1) / 2) * GAP;
        nodeSize[r * COLS + c] = Math.random() * 1.6 + 1.1;
      }
    }
    node.set(home);

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(node, 3));
    nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(nodeSize, 1));
    const nodeMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color('#5ff0bb') }, uOpacity: { value: 0.85 } },
      vertexShader: `attribute float aSize; varying float vFade;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vFade = clamp(1.0 - abs(position.z) * 0.06, 0.35, 1.0);
          gl_PointSize = aSize * (150.0 / -mv.z) * (0.75 + abs(position.z) * 0.10);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `uniform vec3 uColor; uniform float uOpacity; varying float vFade;
        void main() {
          float a = smoothstep(0.5, 0.05, length(gl_PointCoord - 0.5));
          gl_FragColor = vec4(uColor, a * a * uOpacity * vFade);
        }`,
    });
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    const pairs = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        if (c < COLS - 1) pairs.push(i, i + 1);
        if (r < ROWS - 1) pairs.push(i, i + COLS);
      }
    }
    const linkPos = new Float32Array(pairs.length * 3);
    const linkAlpha = new Float32Array(pairs.length);
    const linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPos, 3));
    linkGeo.setAttribute('aAlpha', new THREE.BufferAttribute(linkAlpha, 1));
    const linkMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color('#1fc98a') }, uOpacity: { value: 0.5 } },
      vertexShader: `attribute float aAlpha; varying float vA;
        void main() { vA = aAlpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uOpacity; varying float vA;
        void main() { gl_FragColor = vec4(uColor, vA * uOpacity); }`,
    });
    scene.add(new THREE.LineSegments(linkGeo, linkMat));

    const SPARKS = 220;
    const sparkScene = new THREE.Scene();
    const sparkCam = new THREE.OrthographicCamera(0, innerWidth, 0, innerHeight, -1, 1);
    const sPos = new Float32Array(SPARKS * 3), sLife = new Float32Array(SPARKS);
    const sSeed = new Float32Array(SPARKS), sHue = new Float32Array(SPARKS), sVel = new Float32Array(SPARKS * 2);
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    sparkGeo.setAttribute('aLife', new THREE.BufferAttribute(sLife, 1));
    sparkGeo.setAttribute('aSeed', new THREE.BufferAttribute(sSeed, 1));
    sparkGeo.setAttribute('aHue', new THREE.BufferAttribute(sHue, 1));
    const sparkMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uA: { value: new THREE.Color('#9dffd8') }, uB: { value: new THREE.Color('#8ab6ff') } },
      vertexShader: `attribute float aLife; attribute float aSeed; attribute float aHue;
        varying float vLife; varying float vSeed; varying float vHue;
        void main() {
          vLife = aLife; vSeed = aSeed; vHue = aHue;
          gl_PointSize = (2.0 + 16.0 * aLife * aLife) * (aLife > 0.0 ? 1.0 : 0.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `uniform float uTime; uniform vec3 uA, uB;
        varying float vLife; varying float vSeed; varying float vHue;
        void main() {
          vec2 p = gl_PointCoord - 0.5;
          float core = smoothstep(0.42, 0.0, length(p));
          float flare = smoothstep(0.5, 0.0, abs(p.x) * 7.0 + abs(p.y) * 0.6)
                      + smoothstep(0.5, 0.0, abs(p.y) * 7.0 + abs(p.x) * 0.6);
          float tw = 0.65 + 0.35 * sin(uTime * 9.0 + vSeed);
          gl_FragColor = vec4(mix(uA, uB, vHue), (core + flare * 0.55) * vLife * tw);
        }`,
    });
    sparkScene.add(new THREE.Points(sparkGeo, sparkMat));

    addEventListener('resize', () => {
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      sparkCam.right = innerWidth;
      sparkCam.bottom = innerHeight;
      sparkCam.updateProjectionMatrix();
    });

    const api = {
      cursor: new THREE.Vector3(),
      ripples: [],
      retheme() {
        const d = dark();
        nodeMat.uniforms.uColor.value.set(d ? '#5ff0bb' : '#0f9c6c');
        nodeMat.uniforms.uOpacity.value = d ? 0.85 : 0.45;
        linkMat.uniforms.uColor.value.set(d ? '#1fc98a' : '#0f9c6c');
        linkMat.uniforms.uOpacity.value = d ? 0.5 : 0.26;
        sparkMat.uniforms.uA.value.set(d ? '#9dffd8' : '#12b981');
        sparkMat.uniforms.uB.value.set(d ? '#8ab6ff' : '#4f46e5');
      },
      tick(now, dt, scrollTop) {
        const t = now / 1000;
        const hH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        const hW = hH * camera.aspect;
        api.cursor.set((M.sx / innerWidth - 0.5) * 2 * hW, -(M.sy / innerHeight - 0.5) * 2 * hH, 0);
        const cx = api.cursor.x, cy = api.cursor.y;

        for (const r of api.ripples) r.t += dt;
        while (api.ripples.length && api.ripples[0].t > 2.6) api.ripples.shift();

        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          const hx = home[i3], hy = home[i3 + 1];
          let z = Math.sin(hx * 0.32 + t * 0.9) * 1.25 + Math.cos(hy * 0.38 - t * 0.7) * 1.05;
          z += Math.sin((hx + hy) * 0.2 + t * 0.45) * 0.7;
          const dx = hx - cx, dy = hy - cy, d = Math.hypot(dx, dy);
          z += Math.exp((-d * d) / 40) * 3.4;
          for (const r of api.ripples) {
            const rd = Math.hypot(hx - r.x, hy - r.y);
            const front = r.t * 11;
            z += Math.cos((rd - front) * 0.9) * Math.exp(-Math.abs(rd - front) * 0.45) * Math.exp(-r.t * 1.1) * 3.2;
          }
          const spread = d < 7 ? (7 - d) * 0.07 : 0;
          node[i3] = lerp(node[i3], hx + (dx / (d || 1)) * spread, 0.12);
          node[i3 + 1] = lerp(node[i3 + 1], hy + (dy / (d || 1)) * spread, 0.12);
          node[i3 + 2] = lerp(node[i3 + 2], z, 0.16);
        }
        nodeGeo.attributes.position.needsUpdate = true;

        for (let k = 0; k < pairs.length; k += 2) {
          const a = pairs[k] * 3, b = pairs[k + 1] * 3;
          linkPos[k * 3] = node[a]; linkPos[k * 3 + 1] = node[a + 1]; linkPos[k * 3 + 2] = node[a + 2];
          linkPos[k * 3 + 3] = node[b]; linkPos[k * 3 + 4] = node[b + 1]; linkPos[k * 3 + 5] = node[b + 2];
          const len = Math.hypot(node[a] - node[b], node[a + 1] - node[b + 1], node[a + 2] - node[b + 2]);
          const strain = Math.max(0, 1 - (len - GAP) * 0.55);
          const mx = (node[a] + node[b]) / 2 - cx, my = (node[a + 1] + node[b + 1]) / 2 - cy;
          const v = Math.min(1, strain * (0.22 + Math.exp(-(mx * mx + my * my) / 70) * 1.5));
          linkAlpha[k] = v; linkAlpha[k + 1] = v;
        }
        linkGeo.attributes.position.needsUpdate = true;
        linkGeo.attributes.aAlpha.needsUpdate = true;

        const moved = Math.hypot(M.x - M.px, M.y - M.py);
        M.px = M.x; M.py = M.y;
        let budget = Math.min(6, Math.round(moved / 9)) + (M.down ? 3 : 0);
        for (let i = 0; i < SPARKS && budget > 0; i++) {
          if (sLife[i] > 0) continue;
          sPos[i * 3] = M.px + (Math.random() - 0.5) * 16;
          sPos[i * 3 + 1] = M.py + (Math.random() - 0.5) * 16;
          sVel[i * 2] = (Math.random() - 0.5) * 34;
          sVel[i * 2 + 1] = (Math.random() - 0.5) * 34 - 12;
          sLife[i] = 1; sSeed[i] = Math.random() * 6.28; sHue[i] = Math.random();
          budget--;
        }
        for (let i = 0; i < SPARKS; i++) {
          if (sLife[i] <= 0) continue;
          sLife[i] = Math.max(0, sLife[i] - dt * 1.25);
          sVel[i * 2 + 1] += 26 * dt;
          sPos[i * 3] += sVel[i * 2] * dt;
          sPos[i * 3 + 1] += sVel[i * 2 + 1] * dt;
        }
        sparkGeo.attributes.position.needsUpdate = true;
        sparkGeo.attributes.aLife.needsUpdate = true;
        sparkGeo.attributes.aSeed.needsUpdate = true;
        sparkGeo.attributes.aHue.needsUpdate = true;
        sparkMat.uniforms.uTime.value = t;

        scene.rotation.x = lerp(scene.rotation.x, -(M.sy / innerHeight - 0.5) * 0.3 + 0.12, 0.05);
        scene.rotation.y = lerp(scene.rotation.y, (M.sx / innerWidth - 0.5) * 0.36, 0.05);
        scene.position.y = lerp(scene.position.y, (scrollTop / innerHeight) * 2.2, 0.06);

        renderer.render(scene, camera);
        renderer.autoClear = false;
        renderer.render(sparkScene, sparkCam);
        renderer.autoClear = true;
      },
    };
    api.retheme();
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', api.retheme);
    return api;
  }
}
