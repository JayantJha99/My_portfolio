/**
 * Hero background animation: particles flow left → right through three zones.
 * Bronze zone   — scattered, jittery, raw records.
 * Silver zone   — particles converge into lanes; duplicates fade out.
 * Gold zone     — orderly, aligned, uniform: analytics-ready.
 *
 * Honors prefers-reduced-motion (renders a single static frame) and pauses
 * when the hero is off-screen or the tab is hidden.
 */

const LANES = 7;
const PARTICLE_COUNT = 90;

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export function initPipeline(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let colors = { bronze: [85, 139, 113], silver: [127, 207, 168], gold: [152, 251, 203] };
  let particles = [];
  let rafId = null;
  let visible = true;

  function readColors() {
    colors = {
      bronze: hexToRgb(cssVar('--bronze') || '#558b71'),
      silver: hexToRgb(cssVar('--silver') || '#7fcfa8'),
      gold: hexToRgb(cssVar('--gold') || '#98fbcb'),
    };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function laneY(lane) {
    // Lanes occupy the vertical middle band of the hero.
    const band = height * 0.6;
    const top = height * 0.2;
    return top + (band / (LANES - 1)) * lane;
  }

  function spawn(x) {
    return {
      x: x !== undefined ? x : -10,
      y: Math.random() * height,
      speed: 0.35 + Math.random() * 0.55,
      lane: Math.floor(Math.random() * LANES),
      jitterSeed: Math.random() * Math.PI * 2,
      size: 1.2 + Math.random() * 1.8,
      // ~18% of records are "duplicates" removed in the silver zone
      dupe: Math.random() < 0.18,
      alpha: 0.4 + Math.random() * 0.5,
    };
  }

  function seed() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => spawn(Math.random() * width));
  }

  function step(p, t) {
    p.x += p.speed * (width / 900);
    const progress = p.x / width; // 0 → 1 across hero

    if (progress < 0.36) {
      // bronze: raw and jittery
      p.y += Math.sin(t / 600 + p.jitterSeed) * 0.5 + (Math.random() - 0.5) * 0.6;
    } else if (progress < 0.68) {
      // silver: converge toward lane
      const target = laneY(p.lane);
      p.y += (target - p.y) * 0.035;
    } else {
      // gold: locked to lane
      p.y = laneY(p.lane);
    }

    if (p.x > width + 10) Object.assign(p, spawn(-10), { y: Math.random() * height });
  }

  function colorFor(p) {
    const progress = Math.max(0, Math.min(1, p.x / width));
    let rgb;
    if (progress < 0.36) rgb = colors.bronze;
    else if (progress < 0.68) rgb = mix(colors.bronze, colors.silver, (progress - 0.36) / 0.32);
    else rgb = mix(colors.silver, colors.gold, Math.min(1, (progress - 0.68) / 0.24));

    let alpha = p.alpha;
    // duplicates fade out inside the silver zone
    if (p.dupe && progress > 0.42) {
      alpha *= Math.max(0, 1 - (progress - 0.42) / 0.2);
    }
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
  }

  function drawZoneLines() {
    ctx.save();
    ctx.setLineDash([2, 6]);
    ctx.lineWidth = 1;
    for (const zx of [0.36, 0.68]) {
      ctx.strokeStyle = `rgba(${colors.silver[0]},${colors.silver[1]},${colors.silver[2]},0.12)`;
      ctx.beginPath();
      ctx.moveTo(width * zx, height * 0.08);
      ctx.lineTo(width * zx, height * 0.92);
      ctx.stroke();
    }
    ctx.restore();
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    drawZoneLines();
    for (const p of particles) {
      if (p.dupe && p.x / width > 0.64) continue; // fully removed
      ctx.fillStyle = colorFor(p);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduceMotion.matches) {
      for (const p of particles) step(p, t);
    }
  }

  function frame(t) {
    draw(t);
    if (visible && !reduceMotion.matches && !document.hidden) {
      rafId = requestAnimationFrame(frame);
    } else {
      rafId = null;
    }
  }

  function start() {
    if (rafId === null) rafId = requestAnimationFrame(frame);
  }

  // Static frame for reduced motion: settle particles into their zones first.
  function staticFrame() {
    for (const p of particles) {
      const progress = p.x / width;
      if (progress >= 0.68) p.y = laneY(p.lane);
    }
    draw(0);
  }

  readColors();
  resize();
  seed();

  if (reduceMotion.matches) staticFrame();
  else start();

  window.addEventListener('resize', () => {
    resize();
    if (reduceMotion.matches) staticFrame();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) start();
  });

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  });
  io.observe(canvas);

  // Re-read palette when theme changes.
  new MutationObserver(() => {
    readColors();
    if (reduceMotion.matches) staticFrame();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) staticFrame();
    else start();
  });
}
