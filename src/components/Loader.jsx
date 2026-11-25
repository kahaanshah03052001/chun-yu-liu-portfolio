import { useEffect, useRef, useState } from 'react';

/*
  Particle intro, no text, about 2.5 seconds.
  Story: scattered information -> structure -> execution.
  1. Noise: thousands of ink particles drift in a swirling flow field.
  2. Structure: they snap onto a precise grid; one row lights up red (clarity).
  3. Execution: the grid spirals into a dense disc exactly where the hero portrait sits,
     the disc turns solid and the portrait takes over.
*/

const T_NOISE = 650;
const T_GRID = 1350;
const T_DISC = 2150;
const T_FADE = 450;

const BG = [244, 241, 234];
const INK = [17, 17, 16];
const RED = [214, 54, 31];
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));

function portraitTarget(W, H) {
  const el = document.querySelector('.portrait-disc');
  if (el) {
    const r = el.getBoundingClientRect();
    const size = Math.min(r.width, r.height) / 0.8; // hero portrait starts at scale(0.8)
    if (size > 40) return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, R: size / 2 };
  }
  return { cx: W * 0.72, cy: H * 0.5, R: Math.min(W, H) * 0.25 };
}

export default function Loader({ onReveal, onDone }) {
  const canvasRef = useRef(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('is-loading');
    const timers = [];
    let raf = 0;
    let done = false;
    const finish = () => {
      document.documentElement.classList.remove('is-loading');
      onDone?.();
    };
    if (reduce) {
      onReveal?.();
      timers.push(setTimeout(finish, 50));
      return () => timers.forEach(clearTimeout);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const small = W < 700;
    const N = small ? 1400 : 2800;
    const gap = small ? 18 : 22; // grid spacing
    const disc = portraitTarget(W, H);
    const redRow = Math.round(disc.cy / gap) * gap; // the "clarity" line runs through the portrait's centre
    const golden = Math.PI * (3 - Math.sqrt(5));

    const particles = Array.from({ length: N }, (_, i) => {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const gx = Math.round(x / gap) * gap;
      const gy = Math.round(y / gap) * gap;
      const rr = Math.sqrt((i + 0.5) / N) * disc.R * 0.97;
      const a = i * golden;
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        gx,
        gy,
        dx: disc.cx + Math.cos(a) * rr,
        dy: disc.cy + Math.sin(a) * rr,
        red: gy === redRow,
        delay: Math.random() * 180,
        spin: (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.6),
        size: (small ? 1.8 : 2.1) * (0.8 + Math.random() * 0.5),
        seed: Math.random() * 6.283
      };
    });

    const pointer = { x: -9999, y: -9999 };
    const onMove = (e) => {
      const t = e.touches ? e.touches[0] : e;
      pointer.x = t.clientX;
      pointer.y = t.clientY;
    };
    const start = performance.now();
    let shift = 0;
    const skip = () => {
      const t = performance.now() - start + shift;
      if (t < T_GRID) shift += T_GRID - t;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('keydown', skip);
    canvas.addEventListener('click', skip);

    const fade = () => {
      if (done) return;
      done = true;
      setFading(true);
      onReveal?.();
      timers.push(setTimeout(finish, T_FADE));
    };

    const frame = (now) => {
      const t = now - start + shift;
      if (t >= T_DISC) fade();

      ctx.fillStyle = `rgba(${BG[0]},${BG[1]},${BG[2]},0.38)`;
      ctx.fillRect(0, 0, W, H);

      const gridP = clamp01((t - T_NOISE) / (T_GRID - T_NOISE));
      const discP = clamp01((t - T_GRID) / (T_DISC - T_GRID));

      // the red "clarity" rule draws across once the grid locks
      if (gridP > 0.6 && discP < 0.5) {
        const w = W * easeInOut(clamp01((gridP - 0.6) / 0.4));
        ctx.fillStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},${0.9 * (1 - discP * 2)})`;
        ctx.fillRect(0, redRow - 0.75, w, 1.5);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (t - p.delay < T_NOISE) {
          // flow field: smooth swirling noise
          const ang = Math.sin(p.x * 0.005 + now * 0.0011) * Math.cos(p.y * 0.006 - now * 0.0009) * 6.283 + p.seed * 0.15;
          p.vx += Math.cos(ang) * 0.55;
          p.vy += Math.sin(ang) * 0.55;
          p.vx *= 0.9;
          p.vy *= 0.9;
        } else {
          let tx;
          let ty;
          let k;
          if (discP <= 0) {
            tx = p.gx;
            ty = p.gy;
            k = 0.05 + easeInOut(gridP) * 0.2;
          } else {
            const e = easeInOut(discP);
            tx = p.gx + (p.dx - p.gx) * e;
            ty = p.gy + (p.dy - p.gy) * e;
            k = 0.12 + e * 0.15;
            const ddx = tx - p.x;
            const ddy = ty - p.y;
            const dist = Math.hypot(ddx, ddy) || 1;
            const swirl = Math.min(dist / 140, 1.6) * (1 - e) * p.spin * 2;
            p.vx += (-ddy / dist) * swirl;
            p.vy += (ddx / dist) * swirl;
          }
          p.vx += (tx - p.x) * k;
          p.vy += (ty - p.y) * k;
          p.vx *= 0.72;
          p.vy *= 0.72;
        }

        const px = p.x - pointer.x;
        const py = p.y - pointer.y;
        const pd = px * px + py * py;
        if (pd < 10000 && discP < 0.3) {
          const d = Math.sqrt(pd) || 1;
          const f = (1 - d / 100) * 4;
          p.vx += (px / d) * f;
          p.vy += (py / d) * f;
        }

        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.min(1, Math.hypot(p.vx, p.vy) / 10);
        const c = p.red && gridP > 0.5 && discP < 0.6 ? RED : INK;
        const s = p.size * (1 + speed * 0.7) * (1 + discP * 0.8);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.5 + (1 - speed) * 0.45})`;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }

      // disc turns solid: the portrait's black circle
      if (discP > 0.6) {
        const a = clamp01((discP - 0.6) / 0.4);
        ctx.beginPath();
        ctx.arc(disc.cx, disc.cy, disc.R * (0.92 + 0.08 * a), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(12,12,13,${a})`;
        ctx.fill();
      }

      if (!done || now - start < T_DISC + T_FADE + 100) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('keydown', skip);
      document.documentElement.classList.remove('is-loading');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`loader ${fading ? 'loader--fade' : ''}`} role="status" aria-label="Loading Chun-Yu Liu's portfolio">
      <canvas ref={canvasRef} className="loader__canvas" aria-hidden="true" />
    </div>
  );
}
