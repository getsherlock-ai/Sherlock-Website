// Adapted from the supplied Magnifying Eye ASCII animation.
// Keep the renderer state local to each mounted illustration.
export function mountMagnifyingEye(el) {
const Easing = {
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
};

const W = 1920, H = 1080, CW = 12, CH = 18, COLS = 160, ROWS = 60, N = COLS * ROWS, F = 1100;
const RAMPS = {
  classic: ".,-~:;=!*#$@",
  detailed: ".'`^\",:;Il!i><~+_-?][}{1)(|tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B$@",
  blocks: "·:░░▒▒▓▓██",
};
const PALETTES = {
  amber: { bg: '#0c0a07', base: '#E39A45', accent: '#FFEBC8' },
  phosphor: { bg: '#060b07', base: '#47C973', accent: '#D8FFE3' },
  ice: { bg: '#07090d', base: '#78A9E0', accent: '#EEF5FF' },
};
const MOTION = { enter: Easing.easeInOutCubic, pop: Easing.easeOutBack, settle: Easing.easeOutQuart };

const clamp01 = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
const lerpV = (a, b, p) => Array.isArray(a) ? a.map((v, i) => v + (b[i] - v) * p) : a + (b - a) * p;
function kf(T, keys) {
  if (T <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (T < k[0]) { const p = keys[i - 1]; return lerpV(p[1], k[1], (k[2] || MOTION.enter)((T - p[0]) / (k[0] - p[0]))); }
  }
  return keys[keys.length - 1][1];
}
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---- 3x4 matrices (row-major) ----
const Tm = (x, y, z) => [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z];
const Sm = (x, y, z) => [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0];
const RXm = (a) => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0]; };
const RYm = (a) => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0]; };
const RZm = (a) => { const c = Math.cos(a), s = Math.sin(a); return [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0]; };
function mul(a, b) {
  const r = new Array(12);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) r[i * 4 + j] = a[i * 4] * b[j] + a[i * 4 + 1] * b[4 + j] + a[i * 4 + 2] * b[8 + j];
    r[i * 4 + 3] += a[i * 4 + 3];
  }
  return r;
}
const chain = (...ms) => ms.reduce((a, b) => mul(a, b));
const ap = (m, x, y, z) => [m[0] * x + m[1] * y + m[2] * z + m[3], m[4] * x + m[5] * y + m[6] * z + m[7], m[8] * x + m[9] * y + m[10] * z + m[11]];

// ---- raster state ----
const ZB = new Float32Array(N), CHB = new Uint16Array(N), LAY = new Uint8Array(N);
let RAMP = RAMPS.classic, cam = null;
const LX = -0.5, LY = 0.62, LZ = 0.6, LL = Math.hypot(LX, LY, LZ);
const Lx = LX / LL, Ly = LY / LL, Lz = LZ / LL;

function setCam(pos, tgt) {
  let fx = tgt[0] - pos[0], fy = tgt[1] - pos[1], fz = tgt[2] - pos[2];
  const fl = Math.hypot(fx, fy, fz); fx /= fl; fy /= fl; fz /= fl;
  let rx = fz * 0 - fy * 0, ry = 0, rz = 0; // r = f x up(0,1,0)
  rx = -fz; ry = 0; rz = fx; const rl = Math.hypot(rx, rz); rx /= rl; rz /= rl;
  const ux = ry * fz - rz * fy, uy = rz * fx - rx * fz, uz = rx * fy - ry * fx;
  cam = { px: pos[0], py: pos[1], pz: pos[2], fx, fy, fz, rx, ry, rz, ux, uy, uz };
}
function proj(x, y, z) {
  const dx = x - cam.px, dy = y - cam.py, dz = z - cam.pz;
  const d = dx * cam.fx + dy * cam.fy + dz * cam.fz;
  const cx = dx * cam.rx + dy * cam.ry + dz * cam.rz, cy = dx * cam.ux + dy * cam.uy + dz * cam.uz;
  return [W / 2 + F * cx / d, H / 2 - F * cy / d, d];
}
const charFor = (l) => RAMP.charCodeAt(Math.max(0, Math.min(RAMP.length - 1, Math.floor(l * RAMP.length))));
function plotC(x, y, z, code, layer) {
  const dx = x - cam.px, dy = y - cam.py, dz = z - cam.pz;
  const d = dx * cam.fx + dy * cam.fy + dz * cam.fz; if (d < 0.15) return;
  const col = Math.floor((W / 2 + F * (dx * cam.rx + dy * cam.ry + dz * cam.rz) / d) / CW);
  const row = Math.floor((H / 2 - F * (dx * cam.ux + dy * cam.uy + dz * cam.uz) / d) / CH);
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
  const i = row * COLS + col, o = 1 / d;
  if (o > ZB[i]) { ZB[i] = o; CHB[i] = code; LAY[i] = layer; }
}
function shade(nx, ny, nz, mat) {
  const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
  const dif = Math.max(0, nx * Lx + ny * Ly + nz * Lz);
  const nv = 1 - Math.abs(nx * cam.fx + ny * cam.fy + nz * cam.fz);
  return mat.b + mat.g * (0.1 + 0.9 * dif) + nv * nv * 0.3;
}
function density(m, R) {
  const c = ap(m, 0, 0, 0);
  const d = Math.max(0.3, (c[0] - cam.px) * cam.fx + (c[1] - cam.py) * cam.fy + (c[2] - cam.pz) * cam.fz);
  const sc = Math.hypot(m[0], m[4], m[8]);
  return F * R * sc / d / CW;
}
function ellipsoid(m, rx, ry, rz, mat) {
  const cells = density(m, Math.max(rx, ry, rz));
  const nu = Math.max(12, Math.min(600, Math.ceil(cells * 6.283 * 1.3))), nv = Math.max(8, Math.ceil(nu * 0.55));
  for (let i = 0; i < nv; i++) {
    const v = Math.PI * (i + 0.5) / nv, sv = Math.sin(v), cv = Math.cos(v);
    for (let j = 0; j < nu; j++) {
      const u = 6.2832 * j / nu, cu = Math.cos(u), su = Math.sin(u);
      const lx = rx * sv * cu, ly = ry * cv, lz = rz * sv * su;
      const ax = sv * cu / rx, ay = cv / ry, az = sv * su / rz;
      const x = m[0] * lx + m[1] * ly + m[2] * lz + m[3], y = m[4] * lx + m[5] * ly + m[6] * lz + m[7], z = m[8] * lx + m[9] * ly + m[10] * lz + m[11];
      let l = shade(m[0] * ax + m[1] * ay + m[2] * az, m[4] * ax + m[5] * ay + m[6] * az, m[8] * ax + m[9] * ay + m[10] * az, mat);
      if (mat.chk && ((Math.floor(u / 6.2832 * mat.chk[0]) + Math.floor(v / Math.PI * mat.chk[1])) & 1)) l *= 0.55;
      plotC(x, y, z, charFor(l), mat.lay || 0);
    }
  }
}
const E = (m, p, r, mat, rot) => ellipsoid(rot ? chain(m, Tm(p[0], p[1], p[2]), rot) : mul(m, Tm(p[0], p[1], p[2])), r[0], r[1], r[2], mat);
function capsule(m, a, b, r, mat) {
  let wx = b[0] - a[0], wy = b[1] - a[1], wz = b[2] - a[2]; const len = Math.hypot(wx, wy, wz); wx /= len; wy /= len; wz /= len;
  let hx = 0, hy = 1, hz = 0; if (Math.abs(wy) > 0.9) { hx = 1; hy = 0; }
  let e1x = wy * hz - wz * hy, e1y = wz * hx - wx * hz, e1z = wx * hy - wy * hx; const el = Math.hypot(e1x, e1y, e1z); e1x /= el; e1y /= el; e1z /= el;
  const e2x = wy * e1z - wz * e1y, e2y = wz * e1x - wx * e1z, e2z = wx * e1y - wy * e1x;
  const mm = mul(m, Tm((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2));
  const nl = Math.max(2, Math.min(300, Math.ceil(density(mm, len) * 1.5))), nu = Math.max(8, Math.min(300, Math.ceil(density(mm, r) * 6.283 * 1.4)));
  for (let i = 0; i <= nl; i++) {
    const t = len * i / nl;
    for (let j = 0; j < nu; j++) {
      const u = 6.2832 * j / nu, c = Math.cos(u), s = Math.sin(u);
      const ax = e1x * c + e2x * s, ay = e1y * c + e2y * s, az = e1z * c + e2z * s;
      const lx = a[0] + wx * t + ax * r, ly = a[1] + wy * t + ay * r, lz = a[2] + wz * t + az * r;
      const x = m[0] * lx + m[1] * ly + m[2] * lz + m[3], y = m[4] * lx + m[5] * ly + m[6] * lz + m[7], z = m[8] * lx + m[9] * ly + m[10] * lz + m[11];
      plotC(x, y, z, charFor(shade(m[0] * ax + m[1] * ay + m[2] * az, m[4] * ax + m[5] * ay + m[6] * az, m[8] * ax + m[9] * ay + m[10] * az, mat)), mat.lay || 0);
    }
  }
  E(m, a, [r, r, r], mat); E(m, b, [r, r, r], mat);
}
function torus(m, R, r, mat) {
  const nu = Math.max(24, Math.min(700, Math.ceil(density(m, R) * 6.283 * 1.5))), nv = Math.max(10, Math.min(60, Math.ceil(density(m, r) * 6.283 * 1.6)));
  for (let i = 0; i < nu; i++) {
    const u = 6.2832 * i / nu, cu = Math.cos(u), su = Math.sin(u);
    for (let j = 0; j < nv; j++) {
      const v = 6.2832 * j / nv, cv = Math.cos(v), sv = Math.sin(v);
      const lx = (R + r * cv) * cu, ly = (R + r * cv) * su, lz = r * sv, ax = cv * cu, ay = cv * su, az = sv;
      const x = m[0] * lx + m[1] * ly + m[2] * lz + m[3], y = m[4] * lx + m[5] * ly + m[6] * lz + m[7], z = m[8] * lx + m[9] * ly + m[10] * lz + m[11];
      plotC(x, y, z, charFor(shade(m[0] * ax + m[1] * ay + m[2] * az, m[4] * ax + m[5] * ay + m[6] * az, m[8] * ax + m[9] * ay + m[10] * az, mat)), mat.lay || 0);
    }
  }
}

const MAT = { rim: { g: 0.95, b: 0.1, lay: 1 }, handle: { g: 0.85, b: 0.05 }, ferrule: { g: 0.95, b: 0.1, lay: 1 } };

function renderFrame(T, C, tw) {
  RAMP = RAMPS[tw.charset] || RAMPS.classic;
  ZB.fill(0); CHB.fill(0); LAY.fill(0);
  setCam([0, 0, 2.5], [0, 0, 0]);

  const tiltX = kf(T, [[C.Down, 0], [C.Down + 0.5, 0.34, MOTION.settle], [C.Back, 0.34], [C.Back + 0.7, 0]]);
  const push = kf(T, [[C.Look, 0], [C.Down + 0.6, 0.22], [C.Back, 0.22], [C.Back + 0.8, 0]]);
  const PER = C.Back + 1.0, ph = 6.2832 * T / PER;
  const sway = 0.12 * Math.sin(ph * 2), bob = 0.03 * Math.sin(ph * 3);
  const glassM = chain(Tm(0.1, 0.32 + bob, push), RYm(sway), RXm(tiltX), RZm(-0.55 + 0.04 * Math.sin(ph)));

  torus(glassM, 0.5, 0.06, MAT.rim);
  E(glassM, [0, -0.57, 0], [0.085, 0.07, 0.085], MAT.ferrule);
  capsule(glassM, [0, -0.62, 0], [0, -1.45, 0], 0.07, MAT.handle);

  const setCell = (col, row, ch, layer) => { if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return; const i = row * COLS + col; CHB[i] = ch; LAY[i] = layer; };
  const lc0 = proj(...ap(glassM, 0, 0, 0)), la = proj(...ap(glassM, 0.5, 0, 0)), lb = proj(...ap(glassM, 0, 0.5, 0));
  const ax = la[0] - lc0[0], ay = la[1] - lc0[1], bx = lb[0] - lc0[0], by = lb[1] - lc0[1];
  const det = ax * by - bx * ay, lensOoz = 1 / lc0[2];
  const lensST = (qx, qy) => { qx -= lc0[0]; qy -= lc0[1]; return [(qx * by - bx * qy) / det, (ax * qy - qx * ay) / det]; };

  const eyeAmt = 1;
  if (Math.abs(det) > 400 && lc0[2] > 0.2 && eyeAmt > 0) {
    const open = kf(T, [[C.Look + 1.5, 1], [C.Look + 1.58, 0.04], [C.Look + 1.7, 1], [C.Down + 0.1, 1], [C.Down + 0.5, 0.62, MOTION.settle], [C.Back, 0.62], [C.Back + 0.6, 1]]);
    const gz = kf(T, [[C.Look + 0.3, [0, 0]], [C.Look + 0.45, [-0.32, 0.02], MOTION.settle], [C.Look + 1.1, [-0.32, 0.02]], [C.Look + 1.25, [0.32, 0.04], MOTION.settle], [C.Look + 1.9, [0.32, 0.04]], [C.Look + 2.1, [0.04, 0.12], MOTION.settle], [C.Look + 3.2, [0, 0]], [C.Down + 0.1, [0, 0]], [C.Down + 0.5, [0, -0.18], MOTION.settle], [C.Back, [0, -0.18]], [C.Back + 0.7, [0, 0]]]);
    const brow = kf(T, [[C.Look + 2.0, 0], [C.Look + 2.25, 0.14, MOTION.pop], [C.Look + 2.9, 0.14], [C.Look + 3.2, 0], [C.Down + 0.1, 0], [C.Down + 0.5, -0.06], [C.Back, -0.06], [C.Back + 0.6, 0]]);
    const pr = kf(T, [[C.Down + 0.2, 0.12], [C.Down + 0.7, 0.16, MOTION.settle], [C.Back, 0.16], [C.Back + 0.5, 0.12]]);
    const ex = Math.abs(ax) + Math.abs(bx), ey = Math.abs(ay) + Math.abs(by);
    const c0 = Math.max(0, Math.floor((lc0[0] - ex) / CW)), c1 = Math.min(COLS - 1, Math.ceil((lc0[0] + ex) / CW));
    const r0 = Math.max(0, Math.floor((lc0[1] - ey) / CH)), r1 = Math.min(ROWS - 1, Math.ceil((lc0[1] + ey) / CH));
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
      const i = r * COLS + c;
      if (ZB[i] >= lensOoz * 1.02) continue;
      const [s, t] = lensST((c + 0.5) * CW, (r + 0.5) * CH), rr = s * s + t * t;
      if (rr >= 0.8 || hash(i * 0.37) > eyeAmt) continue;
      CHB[i] = 0; LAY[i] = 0;
      if (rr > 0.5 && rr < 0.62 && s < -0.15 && t > 0.15) { setCell(c, r, 58, 1); continue; }
      const X = s / 0.98, Y = t / 0.98, w = 0.86, k = 1 - (X / w) ** 2;
      const up = (0.4 * k) * open - 0.02, lo = -0.28 * k * open - 0.02;
      const yb = 0.6 + brow + 0.12 * X - 0.3 * X * X;
      let ch = (c + r) % 2 === 0 ? 46 : 0, lay = 0;
      if (Math.abs(Y - yb) < 0.06 && Math.abs(X) < 0.78) { ch = 61; lay = 1; }
      else if (k > 0 && Y > lo && Y < up && open > 0.12) {
        const ir = Math.hypot(X - gz[0], Y - gz[1]);
        if (Math.hypot(X - gz[0] + 0.1, Y - gz[1] - 0.1) < 0.06) ch = 0;
        else if (ir < pr) { ch = 64; lay = 1; }
        else if (ir < 0.3) { const a = Math.atan2(Y - gz[1], X - gz[0]); ch = ir > 0.26 ? 35 : charFor(0.45 + 0.3 * Math.sin(a * 9)); lay = 1; }
        else if (up - Y < 0.08) { ch = 61; lay = 1; }
        else if (Y - lo < 0.05) { ch = 45; lay = 0; }
        else ch = Math.abs(X) > 0.62 ? 46 : 0;
      } else if (k > 0 && Math.abs(Y - (open > 0.12 ? up : lo)) < 0.05) { ch = 61; lay = 1; }
      else if (k > 0.2 && Math.abs(Y - (up + 0.13)) < 0.035) { ch = 45; lay = 0; }
      if (ch) setCell(c, r, ch, lay);
    }
  }

  let base = '', acc = '';
  for (let r = 0; r < ROWS; r++) {
    let sb = '', sa = '';
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c, ch = CHB[i];
      if (!ch || ch === 32) { sb += ' '; sa += ' '; }
      else if (LAY[i]) { sa += String.fromCharCode(ch); sb += ' '; }
      else { sb += String.fromCharCode(ch); sa += ' '; }
    }
    base += sb + (r < ROWS - 1 ? '\n' : ''); acc += sa + (r < ROWS - 1 ? '\n' : '');
  }
  return { base, acc };
}


const CUES = {"Look":0,"Down":3.6,"Back":5.6}, DURATION = 6.6;
const options = { charset: "classic" };
const stage = document.createElement("div");
stage.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;pointer-events:none;`;
const scanlines = "repeating-linear-gradient(to bottom,#000 0px,#000 2px,rgba(0,0,0,.62) 2px,rgba(0,0,0,.62) 4px)";
function layer(color, glow) {
  const pre = document.createElement("pre");
  pre.setAttribute("aria-hidden", "true");
  pre.style.cssText = `position:absolute;left:0;top:0;margin:0;width:${W}px;height:${H}px;font-family:var(--font-mono-jb),ui-monospace,Menlo,Consolas,monospace;font-size:20px;line-height:${CH}px;letter-spacing:0;white-space:pre;font-variant-ligatures:none;font-weight:500;background:transparent;color:${color};text-shadow:0 0 ${glow}px ${color}99;mask-image:${scanlines};-webkit-mask-image:${scanlines};`;
  stage.appendChild(pre);
  return pre;
}
const base = layer("#E39A45", 8);
const accent = layer("#FFEBC8", 12);
el.appendChild(stage);
const fit = () => {
  // Crop the source's empty side margins while retaining the full figure.
  const scale = Math.max(el.clientWidth / W, el.clientHeight / H);
  stage.style.transform = `translate(${(el.clientWidth - W * scale) / 2}px,${(el.clientHeight - H * scale) / 2}px) scale(${scale})`;
};
fit();
const resize = new ResizeObserver(fit);
resize.observe(el);
const draw = (time) => {
  const frame = renderFrame(time, CUES, options);
  base.textContent = frame.base;
  accent.textContent = frame.acc;
};
const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
let raf = 0, intersecting = false, destroyed = false;
let elapsed = 200, last = null, lastDraw = 0;
const loop = (now) => {
  if (destroyed) return;
  if (last !== null) elapsed += Math.min(now - last, 100);
  last = now;
  if (now - lastDraw >= 1000 / 30) {
    draw((elapsed / 1000) % DURATION);
    lastDraw = now;
  }
  raf = requestAnimationFrame(loop);
};
const syncPlayback = () => {
  const play = intersecting && !document.hidden && !preference.matches;
  if (play && !raf) {
    last = null;
    raf = requestAnimationFrame(loop);
  } else if (!play && raf) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
};
const visibility = new IntersectionObserver(([entry]) => {
  intersecting = entry.isIntersecting;
  syncPlayback();
});
visibility.observe(el);
preference.addEventListener("change", syncPlayback);
document.addEventListener("visibilitychange", syncPlayback);
draw(.2);
return {
  destroy() {
    destroyed = true;
    cancelAnimationFrame(raf);
    resize.disconnect();
    visibility.disconnect();
    preference.removeEventListener("change", syncPlayback);
    document.removeEventListener("visibilitychange", syncPlayback);
    stage.remove();
  },
};
}
