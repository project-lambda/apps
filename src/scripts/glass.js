/**
 * Liquid Glass: the Apple-style layer that sits on top of the plain CSS
 * material in global.css.
 *
 *   · refraction: Chromium can run an SVG filter as a backdrop-filter, so an
 *     element marked data-liquid gets a displacement map built for its exact
 *     size and radius, which bends whatever is behind its rim. data-chroma
 *     splits the colour channels a little, like thick glass does. Safari and
 *     Firefox keep the frosted CSS glass, which is still the whole design.
 *   · a rim light that turns toward the pointer
 *   · the header's sliding lens, the Dock, the draggable hero lens, the
 *     word-by-word statement and the isometric stack
 *
 * Loaded on every page, including with reduced motion: everything still
 * works there, it just stops moving on its own.
 */

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const chromium = !!navigator.userAgentData?.brands?.some((b) => b.brand === 'Chromium');

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function startGlass() {
  if (chromium) initRefraction();
  if (fine) initRim();
  initNavLens();
  initDock();
  initLens();
  initStatement();
  initIso();
}

/* ── refraction ─────────────────────────────────────────────────── */

const NS = 'http://www.w3.org/2000/svg';
let defs = null;
let uid = 0;

function defsEl() {
  if (defs) return defs;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
  defs = document.createElementNS(NS, 'defs');
  svg.append(defs);
  document.body.append(svg);
  return defs;
}

/**
 * A displacement map for a rounded rectangle: neutral grey in the flat
 * middle, and across the bezel a push that grows toward the rim and points
 * inward, so the edge shows a squeezed view of what sits just inside it,
 * the way a thick convex edge does. Red carries x, green carries y.
 */
function displacementMap(w, h, radius, bezel) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const hw = w / 2, hh = h / 2;
  const r = Math.min(radius, hw, hh);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - hw, py = y + 0.5 - hh;
      const qx = Math.abs(px) - (hw - r), qy = Math.abs(py) - (hh - r);
      let inside, nx, ny;
      if (qx > 0 && qy > 0) {
        const l = Math.hypot(qx, qy) || 1;
        inside = r - l; nx = qx / l; ny = qy / l;
      } else if (qx > qy) {
        inside = r - qx; nx = 1; ny = 0;
      } else {
        inside = r - qy; nx = 0; ny = 1;
      }
      let dx = 0, dy = 0;
      if (inside > 0 && inside < bezel) {
        const t = 1 - inside / bezel;                 // 1 at the rim
        const m = 1 - Math.sqrt(1 - t * t);           // a round edge: steep at the rim
        dx = -Math.sign(px) * nx * m;
        dy = -Math.sign(py) * ny * m;
      }
      const i = (y * w + x) * 4;
      d[i] = 128 + dx * 127;
      d[i + 1] = 128 + dy * 127;
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

function filterMarkup(map, w, h, scale, chroma) {
  const image = `<feImage href="${map}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>`;
  const shift = (s, result) =>
    `<feDisplacementMap in="SourceGraphic" in2="map" scale="${s.toFixed(1)}" xChannelSelector="R" yChannelSelector="G" result="${result}"/>`;
  if (!chroma) return image + shift(scale, 'out');
  const only = (input, row, result) => {
    const m = ['0 0 0 0 0', '0 0 0 0 0', '0 0 0 0 0'];
    m[row] = ['1 0 0 0 0', '0 1 0 0 0', '0 0 1 0 0'][row];
    return `<feColorMatrix in="${input}" type="matrix" values="${m.join(' ')} 0 0 0 1 0" result="${result}"/>`;
  };
  return (
    image +
    shift(scale, 'dr') + only('dr', 0, 'r') +
    shift(scale * 0.93, 'dg') + only('dg', 1, 'g') +
    shift(scale * 0.86, 'db') + only('db', 2, 'b') +
    '<feBlend in="r" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b" mode="screen"/>'
  );
}

function initRefraction() {
  const els = document.querySelectorAll('[data-liquid]');
  if (!els.length) return;
  document.documentElement.classList.add('lg-refract');

  for (const el of els) {
    const id = `lg-${++uid}`;
    const filter = document.createElementNS(NS, 'filter');
    filter.id = id;
    filter.setAttribute('filterUnits', 'userSpaceOnUse');
    filter.setAttribute('primitiveUnits', 'userSpaceOnUse');
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    defsEl().append(filter);

    let lastW = 0, lastH = 0, timer = 0;
    const build = () => {
      // Layout size, not the transformed box: the filter runs before transforms.
      const w = el.offsetWidth, h = el.offsetHeight;
      if (!w || !h || (w === lastW && h === lastH)) return;
      lastW = w; lastH = h;
      const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      const bezel = Math.min(+el.dataset.bezel || Math.min(w, h) * 0.3, Math.min(w, h) / 2);
      const map = displacementMap(w, h, radius, bezel);
      for (const [k, v] of Object.entries({ x: 0, y: 0, width: w, height: h })) filter.setAttribute(k, v);
      filter.innerHTML = filterMarkup(map, w, h, +el.dataset.liquid || 40, el.hasAttribute('data-chroma'));
      el.style.setProperty('--lg-url', `url(#${id})`);
      el.classList.add('refracting');
    };
    build();
    // Sizes change as the header shrinks and the Dock magnifies; rebuilding
    // on every frame of that would be wasteful, so wait for it to settle.
    new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(build, 140); }).observe(el);
  }
}

/* ── rim light ──────────────────────────────────────────────────── */

function initRim() {
  const els = [...document.querySelectorAll('.glass')];
  if (!els.length) return;
  let x = innerWidth / 2, y = -innerHeight, raf = 0;
  const aim = () => {
    raf = 0;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      // The bright edge faces the pointer: a gradient starts opposite the
      // way its angle points, hence the half turn.
      const deg = (Math.atan2(x - (r.left + r.width / 2), -(y - (r.top + r.height / 2))) * 180) / Math.PI + 180;
      el.style.setProperty('--rim', `${deg.toFixed(1)}deg`);
    }
  };
  addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    if (!raf) raf = requestAnimationFrame(aim);
  }, { passive: true });
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(aim); }, { passive: true });
}

/* ── header lens ────────────────────────────────────────────────── */

function initNavLens() {
  const nav = document.querySelector('[data-nav]');
  const lens = nav?.querySelector('.nav-lens');
  if (!nav || !lens) return;
  const to = (a) => {
    const first = !lens.classList.contains('on');
    if (first) lens.style.transition = 'opacity .3s';
    lens.style.setProperty('--x', `${a.offsetLeft}px`);
    lens.style.setProperty('--w', `${a.offsetWidth}px`);
    lens.classList.add('on');
    if (first) requestAnimationFrame(() => { lens.style.transition = ''; });
  };
  for (const a of nav.querySelectorAll('a')) {
    a.addEventListener('pointerenter', () => to(a));
    a.addEventListener('focus', () => to(a));
  }
  nav.addEventListener('pointerleave', () => lens.classList.remove('on'));
  nav.addEventListener('focusout', (e) => { if (!nav.contains(e.relatedTarget)) lens.classList.remove('on'); });
}

/* ── Dock ───────────────────────────────────────────────────────── */

function initDock() {
  const dock = document.querySelector('[data-dock]');
  if (!dock) return;
  const items = [...dock.querySelectorAll('.dock-item')];

  // The launch bounce: a short hop before the page changes.
  if (!reduced) {
    for (const a of items) {
      a.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.href.startsWith('mailto:')) return;
        e.preventDefault();
        a.classList.add('launch');
        setTimeout(() => { location.href = a.href; }, 420);
      });
    }
  }

  if (!fine || reduced) return;
  const base = parseFloat(getComputedStyle(dock).getPropertyValue('--icon')) || 56;
  const scale = items.map(() => 1);
  let mx = null, raf = 0;
  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
  function step() {
    raf = 0;
    let moving = false;
    items.forEach((el, i) => {
      let target = 1;
      if (mx !== null) {
        const r = el.getBoundingClientRect();
        const d = Math.abs(mx - (r.left + r.width / 2));
        const reach = base * 2.8;
        if (d < reach) target = 1 + 0.72 * Math.cos(((d / reach) * Math.PI) / 2) ** 2;
      }
      scale[i] = lerp(scale[i], target, 0.24);
      if (Math.abs(scale[i] - target) > 0.002) moving = true;
      el.style.setProperty('--s', scale[i].toFixed(3));
    });
    if (moving) kick();
  }
  dock.addEventListener('pointermove', (e) => { mx = e.clientX; kick(); });
  dock.addEventListener('pointerleave', () => { mx = null; kick(); });
}

/* ── the hero lens ──────────────────────────────────────────────── */

function initLens() {
  const lens = document.querySelector('[data-lens]');
  const area = lens?.parentElement;
  if (!lens || !area) return;

  let x = 0, y = 0, vx = 0, vy = 0, stretch = 0, angle = 0, raf = 0;
  let drag = null;

  const bounds = () => ({ w: area.clientWidth - lens.offsetWidth, h: area.clientHeight - lens.offsetHeight });
  const paint = () => {
    const s = stretch;
    lens.style.transform =
      `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${angle}rad) scale(${1 + s}, ${1 - s * 0.7}) rotate(${-angle}rad)`;
  };

  // Start over the one serif word, where the bending shows best. On a phone
  // the headline fills the width, so the lens waits in the gap below the
  // buttons instead; without refraction it sits beside the headline rather
  // than blurring it.
  const place = () => {
    const word = area.querySelector('.display .serif');
    const cta = area.querySelector('.cta-row');
    const a = area.getBoundingClientRect();
    if (innerWidth < 760 && cta) {
      const r = cta.getBoundingClientRect();
      const dock = area.querySelector('[data-dock]')?.getBoundingClientRect();
      const floor = dock ? dock.top : a.bottom;
      x = (a.width - lens.offsetWidth) / 2;
      y = (r.bottom + floor) / 2 - a.top - lens.offsetHeight / 2;
    } else if (word && chromium) {
      const r = word.getBoundingClientRect();
      x = r.left - a.left + r.width / 2 - lens.offsetWidth / 2;
      y = r.top - a.top + r.height / 2 - lens.offsetHeight / 2;
    } else {
      x = a.width * (innerWidth < 760 ? 0.52 : 0.68);
      y = a.height * 0.2;
    }
    const b = bounds();
    x = clamp(x, 0, b.w); y = clamp(y, 0, b.h);
    paint();
    lens.classList.add('ready');
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(place));
  addEventListener('resize', () => {
    const b = bounds();
    x = clamp(x, 0, b.w); y = clamp(y, 0, b.h);
    paint();
  });

  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
  function step() {
    raf = 0;
    const b = bounds();
    if (drag) {
      vx *= 0.8; vy *= 0.8;
    } else if (!reduced) {
      x += vx; y += vy;
      vx *= 0.94; vy *= 0.94;
      if (x < 0) { x = 0; vx = -vx * 0.55; }
      if (x > b.w) { x = b.w; vx = -vx * 0.55; }
      if (y < 0) { y = 0; vy = -vy * 0.55; }
      if (y > b.h) { y = b.h; vy = -vy * 0.55; }
    } else {
      vx = vy = 0;
    }
    const speed = Math.hypot(vx, vy);
    if (speed > 0.3) angle = Math.atan2(vy, vx);
    stretch = lerp(stretch, reduced ? 0 : Math.min(speed * 0.014, 0.26), 0.2);
    paint();
    if (drag || speed > 0.05 || stretch > 0.002) kick();
  }

  lens.addEventListener('pointerdown', (e) => {
    lens.setPointerCapture(e.pointerId);
    drag = { ox: e.clientX - x, oy: e.clientY - y };
    lens.classList.add('held', 'used');
    kick();
  });
  lens.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const b = bounds();
    const nx = clamp(e.clientX - drag.ox, 0, b.w), ny = clamp(e.clientY - drag.oy, 0, b.h);
    vx = lerp(vx, nx - x, 0.6); vy = lerp(vy, ny - y, 0.6);
    x = nx; y = ny;
    kick();
  });
  const release = () => {
    if (!drag) return;
    drag = null;
    lens.classList.remove('held');
    kick();
  };
  lens.addEventListener('pointerup', release);
  lens.addEventListener('pointercancel', release);
}

/* ── the statement, lit word by word ────────────────────────────── */

function initStatement() {
  const el = document.querySelector('[data-words]');
  if (!el) return;
  if (reduced) { el.style.setProperty('--p', '1'); return; }
  let raf = 0;
  const update = () => {
    raf = 0;
    const r = el.getBoundingClientRect();
    const p = clamp((innerHeight * 0.82 - r.top) / (r.height + innerHeight * 0.3), 0, 1);
    el.style.setProperty('--p', p.toFixed(3));
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', update);
  update();
}

/* ── the isometric stack ────────────────────────────────────────── */

function initIso() {
  const iso = document.querySelector('[data-iso]');
  const stack = iso?.querySelector('.iso-stack');
  if (!iso || !stack) return;
  new IntersectionObserver(([en]) => stack.classList.toggle('open', en.isIntersecting), { threshold: 0.3 }).observe(iso);

  const set = (v) => { if (v == null) delete stack.dataset.active; else stack.dataset.active = v; };
  for (const el of document.querySelectorAll('[data-value], [data-pane]')) {
    const v = el.dataset.value ?? el.dataset.pane;
    if (fine) {
      el.addEventListener('pointerenter', () => set(v));
      el.addEventListener('pointerleave', () => set(null));
    } else {
      // No hover on touch: a tap lifts the layer and a second tap drops it.
      el.addEventListener('click', () => set(stack.dataset.active === v ? null : v));
    }
  }
}
