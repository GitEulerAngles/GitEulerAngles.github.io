const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// --- Image fullscreen lightbox ---
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

document.querySelectorAll(".gallery .shot img").forEach((img) => {
  img.addEventListener("click", (e) => {
    e.preventDefault();
    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = img.src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

if (lightbox) {
  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    if (lightboxImg) lightboxImg.src = "";
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox) {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    if (lightboxImg) lightboxImg.src = "";
  }
});

// --- Screenshot fallbacks (show filename if image missing) ---
document.querySelectorAll(".shot").forEach((shot) => {
  const img = shot.querySelector("img");
  const ph = shot.querySelector(".shot-ph");
  if (!img) return;

  img.addEventListener("error", () => {
    img.style.display = "none";
    shot.classList.add("missing");
    if (ph) ph.style.display = "grid";
    shot.removeAttribute("href");
    shot.removeAttribute("target");
    shot.removeAttribute("rel");
  });

  img.addEventListener("load", () => {
    if (ph) ph.style.display = "none";
    shot.classList.remove("missing");
  });
});

// --- Animated Perlin-style background (optimized) ---
(() => {
  const canvas = document.getElementById("bgNoise");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  // Target FPS for background animation
  const FPS = 30;
  const FRAME_MS = 1000 / FPS;

  // Hard cap internal render resolution (smaller = faster)
  const MAX_W = 520;
  const MAX_H = 320;

  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + (b - a) * t;

  function makePerm(seed) {
    const rand = mulberry32(seed);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = p[i];
      p[i] = p[j];
      p[j] = tmp;
    }
    const perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    return perm;
  }

  function grad(hash, x, y) {
    switch (hash & 7) {
      case 0: return  x + y;
      case 1: return -x + y;
      case 2: return  x - y;
      case 3: return -x - y;
      case 4: return  x;
      case 5: return -x;
      case 6: return  y;
      default: return -y;
    }
  }

  function perlin2(perm, x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = fade(xf);
    const v = fade(yf);

    const aa = perm[perm[X] + Y];
    const ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y];
    const bb = perm[perm[X + 1] + Y + 1];

    const x1 = lerp(grad(aa, xf, yf),     grad(ba, xf - 1, yf),     u);
    const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);

    return (lerp(x1, x2, v) + 1) * 0.5;
  }

  function fbm(perm, x, y) {
    let value = 0;
    let amp = 1;
    let freq = 5;
    // Drop octaves from 5 -> 4 (big perf win, tiny visual difference)
    for (let i = 0; i < 4; i++) {
      value += amp * perlin2(perm, x * freq, y * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return value;
  }

  const perm = makePerm(1337);

  // Buffers
  let img = null;
  let data = null;

  // Precomputed per-pixel base coords (so we don't recompute x*scale, y*scale each frame)
  let baseX = null;
  let baseY = null;

  // Colors
  const base = [8, 10, 18];
  const blue = [60, 160, 255];
  const purple = [140, 95, 255];

  // Visual controls
  const strength = 0.80;     // overall intensity
  const cutoff = 0.70;       // higher = more black
  const gamma = 2.1;         // higher = sharper peaks

  // Motion controls
  const scale = 0.0006;       // smaller = bigger blobs
  const speed = 0.02;        // lower = slower drift
  const driftX = 0.22;
  const driftY = 0.16;

  // Hue variation field (adds blue/purple alternation)
  const hueDX = -0.12;
  const hueDY = 0.20;

  const clamp255 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
  const saturate = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const smoothstep = (a, b, x) => {
    const t = saturate((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };

  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const targetW = Math.floor(window.innerWidth * dpr);
    const targetH = Math.floor(window.innerHeight * dpr);

    // Scale down to fit within caps
    const s = Math.min(1, MAX_W / targetW, MAX_H / targetH);

    canvas.width = Math.max(2, Math.floor(targetW * s));
    canvas.height = Math.max(2, Math.floor(targetH * s));
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";

    img = ctx.createImageData(canvas.width, canvas.height);
    data = img.data;

    // Precompute base coords
    baseX = new Float32Array(canvas.width);
    baseY = new Float32Array(canvas.height);
    for (let x = 0; x < canvas.width; x++) baseX[x] = x * scale;
    for (let y = 0; y < canvas.height; y++) baseY[y] = y * scale;
  }

  let lastTS = 0;
  let accMS = 0;
  let t = 0;

  function drawFrame() {
    const w = canvas.width;
    const h = canvas.height;

    let idx = 0;
    for (let y = 0; y < h; y++) {
      const ny = baseY[y] + t * driftY;
      const hy = baseY[y] + t * hueDY;

      for (let x = 0; x < w; x++) {
        const nx = baseX[x] + t * driftX;
        const hx = baseX[x] + t * hueDX;

        // Mask field controls where "hills" appear
        const n = fbm(perm, nx, ny);
        let m = smoothstep(cutoff, 0.98, n);
        m = Math.pow(m, gamma);

        // Hue field controls blue vs purple
        const hN = fbm(perm, hx + 100.0, hy - 50.0);
        const rr = lerp(blue[0], purple[0], hN);
        const gg = lerp(blue[1], purple[1], hN);
        const bb = lerp(blue[2], purple[2], hN);

        const r = base[0] + rr * (m * strength);
        const g = base[1] + gg * (m * strength);
        const b = base[2] + bb * (m * strength);

        data[idx++] = clamp255(r);
        data[idx++] = clamp255(g);
        data[idx++] = clamp255(b);
        data[idx++] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
  }

  function tick(ts) {
    if (!img) return;

    if (!lastTS) lastTS = ts;
    const dtMS = Math.min(80, ts - lastTS);
    lastTS = ts;

    accMS += dtMS;

    // Only redraw at FPS (cuts CPU a lot)
    if (accMS >= FRAME_MS) {
      t += (accMS / 1000) * speed;
      accMS = 0;
      drawFrame();
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  requestAnimationFrame(tick);
})();


