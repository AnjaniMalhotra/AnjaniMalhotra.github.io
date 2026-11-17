/* Pose engine: 9 drawn poses (3x3 look directions) blended continuously.
   - The gaze is a spring-smoothed point that eases toward the cursor like a real head turn.
   - The 4 poses around that point are blended (bilinear, with a sharpened middle so a single
     pose dominates most of the time and there's no blurry "double face").
   - While blending, every pose is slid so its face sits where the blended face is
     ("motion-compensated" cross-fade): the head appears to travel between poses rather than pop.
   Drawn on a <canvas>; the <img> tags are just the sources / no-JS fallback. */
(() => {
  const poser = document.getElementById('poser');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const GRID = [['up-left', 'up', 'up-right'], ['left', 'center', 'right'], ['down-left', 'down', 'down-right']];
  // face centre of each pose (fraction of the pose image), measured from the artwork
  const FACE = {
    'up-left': [0.4656, 0.42], up: [0.5057, 0.4105], 'up-right': [0.5724, 0.44],
    left: [0.3835, 0.4475], center: [0.5074, 0.4524], right: [0.6254, 0.473],
    'down-left': [0.39, 0.4833], down: [0.5226, 0.5015], 'down-right': [0.6191, 0.499],
  };

  // ---- feel ----
  const STIFF = 90;        // head-turn spring: lower = slower, heavier turn
  const DAMP = 0.9;          // < 1 = tiny natural settle at the end of a turn
  const SHARP = 8.6;         // > 1 shortens the cross-fade zone between poses
  // how far from her face (fraction of the screen) the cursor goes before she turns that way;
  // ENTER > EXIT = hysteresis, so she never flickers on a boundary
  const ENTER_X = 0.1, EXIT_X = 0.06, ENTER_Y = 0.1, EXIT_Y = 0.06;
  const COMPENSATE = 0.9;    // how much faces are slid onto each other while blending
  const IDLE_MS = 2600;

  const imgs = Object.fromEntries([...poser.querySelectorAll('.pose')].map(i => [i.dataset.pose, i]));
  const canvas = document.createElement('canvas');
  canvas.className = 'pose-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');

  const target = { x: 0, y: 0 }, g = { x: 0, y: 0 }, v = { x: 0, y: 0 };
  let lastMove = performance.now(), ready = false, dirty = true;

  // wait for every pose image, then switch from <img> to the canvas
  Promise.all(Object.values(imgs).map(i => (i.complete && i.naturalWidth ? Promise.resolve() : i.decode().catch(() => {})))).then(() => {
    poser.appendChild(canvas);
    poser.classList.add('is-canvas');
    ready = true; dirty = true;
  });

  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const smoother = t => t * t * t * (t * (t * 6 - 15) + 10);           // smootherstep
  const shape = f => smoother(clamp((f - 0.5) * SHARP + 0.5, 0, 1));

  // She always comes to rest on a real drawn pose (-1 / 0 / +1 on each axis); the spring then
  // carries her there, and the blend between poses only exists while she is turning.
  function settle(n, cur, enter, exit) {
    if (cur === 0) return n < -enter ? -1 : n > enter ? 1 : 0;
    if (cur === -1) return n > -exit ? (n > enter ? 1 : 0) : -1;
    return n < exit ? (n < -enter ? -1 : 0) : 1;
  }
  function aim(clientX, clientY) {
    const r = poser.getBoundingClientRect();
    const fx = r.left + r.width * 0.5, fy = r.top + r.height * 0.45;
    target.x = settle((clientX - fx) / innerWidth, target.x, ENTER_X, EXIT_X);
    target.y = settle((clientY - fy) / innerHeight, target.y, ENTER_Y, EXIT_Y);
  }
  addEventListener('pointermove', e => { aim(e.clientX, e.clientY); lastMove = performance.now(); }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { lastMove = 0; });

  // idle: ease back to centre, then the occasional curious glance
  let glanceAt = 0;
  function idle(now) {
    if (now - lastMove < IDLE_MS || now < glanceAt) return;
    const atCentre = target.x === 0 && target.y === 0;
    if (!atCentre || Math.random() < 0.55) { target.x = 0; target.y = 0; glanceAt = now + 2500 + Math.random() * 2500; return; }
    const dirs = [[-1, 0], [1, 0], [-1, -1], [1, -1], [0, -1], [-1, 1], [1, 1], [0, 1]];
    [target.x, target.y] = dirs[Math.floor(Math.random() * dirs.length)];
    glanceAt = now + 1300 + Math.random() * 1500;
  }

  function draw() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = Math.round(poser.clientWidth * dpr), H = Math.round(poser.clientHeight * dpr);
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // gaze -> grid position (0..2 on each axis) -> the 4 surrounding poses + weights
    const gx = 1 + clamp(g.x, -1, 1), gy = 1 + clamp(g.y, -1, 1);
    const c0 = Math.min(1, Math.floor(gx)), r0 = Math.min(1, Math.floor(gy));
    const sx = shape(gx - c0), sy = shape(gy - r0);
    const layers = [
      [GRID[r0][c0], (1 - sx) * (1 - sy)], [GRID[r0][c0 + 1], sx * (1 - sy)],
      [GRID[r0 + 1][c0], (1 - sx) * sy], [GRID[r0 + 1][c0 + 1], sx * sy],
    ].filter(([, w]) => w > 0.002).sort((a, b) => b[1] - a[1]);

    // where the blended face is, so each pose can be slid onto it
    let Fx = 0, Fy = 0, tw = 0;
    for (const [n, w] of layers) { Fx += FACE[n][0] * w; Fy += FACE[n][1] * w; tw += w; }
    Fx /= tw; Fy /= tw;

    // composite so the result is a true weighted average (no see-through dip mid-fade)
    let cum = 0;
    for (const [n, w] of layers) {
      cum += w;
      ctx.globalAlpha = w / cum;
      const ox = (Fx - FACE[n][0]) * COMPENSATE * W, oy = (Fy - FACE[n][1]) * COMPENSATE * H;
      ctx.drawImage(imgs[n], ox, oy, W, H);
    }
    ctx.globalAlpha = 1;
  }

  // ---- loop ----
  const C = 2 * Math.sqrt(STIFF) * DAMP;
  let last = performance.now(), lastDrawn = '';
  function frame(now) {
    const dtMs = Math.min(64, now - last); last = now;
    idle(now);
    const steps = Math.max(1, Math.ceil(dtMs / 4)), h = dtMs / 1000 / steps;
    for (let i = 0; i < steps; i++) for (const a of ['x', 'y']) {
      v[a] += ((target[a] - g[a]) * STIFF - v[a] * C) * h;
      g[a] += v[a] * h;
    }
    if (reduceMotion) { g.x = target.x; g.y = target.y; }

    if (ready) {
      const key = g.x.toFixed(4) + ',' + g.y.toFixed(4) + ',' + poser.clientWidth;
      if (key !== lastDrawn || dirty) { draw(); lastDrawn = key; dirty = false; }
      if (!reduceMotion) {
        // tiny body sway + breathing so she never looks frozen
        const breathe = Math.sin(now / 1500) * 0.0035;
        poser.style.transform = `translate3d(${(g.x * 5).toFixed(2)}px, ${(g.y * 3 - breathe * 140).toFixed(2)}px, 0) rotate(${(g.x * 0.5).toFixed(3)}deg) scale(${(1 + breathe).toFixed(4)})`;
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.poser = { look(x, y = 0) { target.x = Math.sign(Math.round(x)); target.y = Math.sign(Math.round(y)); lastMove = performance.now() + 2000; }, state: () => ({ g: { ...g }, target: { ...target } }) };
})();
