import { useEffect, useRef, useState } from 'react';
import { MAP, buildDots, project } from '../data/geo.js';
import { origin, regions } from '../data/content.js';

/*
  Particle intro, no text. On the warm-white page colour, ink particles drift in and
  settle into the dot-matrix world map used in the case study. Red pins light up the
  three research regions and arcs fly out from Lehi. The map then collapses into a solid
  ink disc that lands exactly where the hero portrait sits, and the portrait takes over.
*/

const T_FORM = 1700; // scatter -> world map
const T_HOLD = 1700; // map holds, arcs draw
const T_DISC = 1200; // map -> disc at the portrait position
const T_FADE = 700; // loader fades, portrait appears

const BG = [244, 241, 234];
const INK = [17, 17, 16];
const RED = [214, 54, 31];
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function portraitTarget(W, H) {
  const el = document.querySelector('.portrait-disc');
  if (el) {
    const r = el.getBoundingClientRect();
    // the hero portrait starts at scale(0.8); undo that to get its resting size
    const size = Math.min(r.width, r.height) / 0.8;
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

    // Fit the world map into the viewport
    const small = W < 700;
    const mapW = Math.min(W * (small ? 1.12 : 0.9), 1400);
    const scale = mapW / MAP.width;
    const mapH = MAP.height * scale;
    const offX = (W - mapW) / 2;
    const offY = (H - mapH) / 2;
    const toScreen = ([x, y]) => [offX + x * scale, offY + y * scale];

    const dots = buildDots(small ? 3.2 : 2.6);
    const pins = regions.flatMap((r) => r.countries.map((c) => toScreen(project(c.coord))));
    const lehi = toScreen(project(origin.coord));
    const disc = portraitTarget(W, H);
    const N = dots.length;
    const golden = Math.PI * (3 - Math.sqrt(5));

    const particles = dots.map((d, i) => {
      const [tx, ty] = toScreen([d.x, d.y]);
      // sunflower packing fills the disc evenly
      const rr = Math.sqrt((i + 0.5) / N) * disc.R * 0.97;
      const a = i * golden;
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.max(W, H) * (0.55 + Math.random() * 0.4);
      return {
        x: W / 2 + Math.cos(ang) * dist,
        y: H / 2 + Math.sin(ang) * dist,
        vx: 0,
        vy: 0,
        tx,
        ty,
        dx: disc.cx + Math.cos(a) * rr,
        dy: disc.cy + Math.sin(a) * rr,
        red: Boolean(d.region),
        delay: Math.random() * 600,
        spin: (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.7),
        size: (small ? 2.2 : 2.6) * (0.85 + Math.random() * 0.3),
        seed: Math.random() * 1000
      };
    });

    const pointer = { x: -9999, y: -9999 };
    const onMove = (e) => {
      const t = e.touches ? e.touches[0] : e;
      pointer.x = t.clientX;
      pointer.y = t.clientY;
    };
    const start = performance.now();
    let skipShift = 0;
    const skip = () => {
      const t = performance.now() - start + skipShift;
      if (t < T_FORM + T_HOLD) skipShift += T_FORM + T_HOLD - t;
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
      const t = now - start + skipShift;
      const inDisc = t > T_FORM + T_HOLD;
      const tDisc = Math.max(0, t - T_FORM - T_HOLD);
      const discP = Math.min(1, tDisc / T_DISC);
      if (discP >= 1) fade();

      // soft trails on the page colour
      ctx.fillStyle = `rgba(${BG[0]},${BG[1]},${BG[2]},0.32)`;
      ctx.fillRect(0, 0, W, H);

      // arcs from Lehi to each interview country while the map holds
      const holdP = Math.min(1, Math.max(0, (t - T_FORM) / (T_HOLD * 0.7)));
      if (holdP > 0 && !inDisc) {
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},0.85)`;
        pins.forEach(([px, py], i) => {
          const local = Math.min(1, Math.max(0, holdP * 1.6 - i * 0.1));
          if (local <= 0) return;
          const mx = (lehi[0] + px) / 2;
          const my = Math.min(lehi[1], py) - Math.max(40, Math.abs(px - lehi[0]) * 0.22);
          ctx.beginPath();
          const steps = 40;
          for (let s = 0; s <= steps * local; s++) {
            const u = s / steps;
            const x = (1 - u) * (1 - u) * lehi[0] + 2 * (1 - u) * u * mx + u * u * px;
            const y = (1 - u) * (1 - u) * lehi[1] + 2 * (1 - u) * u * my + u * u * py;
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          if (local >= 1) {
            const pulse = 6 + ((now / 18 + i * 20) % 22);
            ctx.beginPath();
            ctx.arc(px, py, pulse, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},${0.5 * (1 - (pulse - 6) / 22)})`;
            ctx.stroke();
            ctx.strokeStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},0.85)`;
            ctx.beginPath();
            ctx.arc(px, py, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${RED[0]},${RED[1]},${RED[2]})`;
            ctx.fill();
          }
        });
        ctx.beginPath();
        ctx.arc(lehi[0], lehi[1], 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${INK[0]},${INK[1]},${INK[2]})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let gx;
        let gy;
        let k;
        if (!inDisc) {
          const local = Math.max(0, t - p.delay);
          const prog = Math.min(1, local / (T_FORM - 200));
          gx = p.tx + (t > T_FORM ? Math.sin(now * 0.0015 + p.seed) * 0.8 : 0);
          gy = p.ty + (t > T_FORM ? Math.cos(now * 0.0012 + p.seed) * 0.8 : 0);
          k = 0.01 + easeInOut(prog) * 0.09;
          const ddx = gx - p.x;
          const ddy = gy - p.y;
          const dist = Math.hypot(ddx, ddy) || 1;
          const swirl = Math.min(dist / 260, 1.5) * (1 - prog * 0.9) * p.spin;
          p.vx += (-ddy / dist) * swirl;
          p.vy += (ddx / dist) * swirl;
        } else {
          const e = easeInOut(discP);
          gx = p.tx + (p.dx - p.tx) * e;
          gy = p.ty + (p.dy - p.ty) * e;
          k = 0.08 + e * 0.12;
          const ddx = gx - p.x;
          const ddy = gy - p.y;
          const dist = Math.hypot(ddx, ddy) || 1;
          const swirl = Math.min(dist / 200, 1.2) * (1 - e) * p.spin * 1.4;
          p.vx += (-ddy / dist) * swirl;
          p.vy += (ddx / dist) * swirl;
        }

        const px = p.x - pointer.x;
        const py = p.y - pointer.y;
        const pd = px * px + py * py;
        if (pd < 12100 && !inDisc) {
          const d = Math.sqrt(pd) || 1;
          const f = (1 - d / 110) * 5;
          p.vx += (px / d) * f;
          p.vy += (py / d) * f;
        }

        p.vx += (gx - p.x) * k;
        p.vy += (gy - p.y) * k;
        p.vx *= 0.8;
        p.vy *= 0.8;
        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.min(1, Math.hypot(p.vx, p.vy) / 12);
        const showRed = p.red && t > T_FORM * 0.8 && !inDisc;
        const c = showRed ? RED : INK;
        const s = p.size * (1 + speed * 0.6) * (inDisc ? 1 + discP * 0.9 : 1);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.55 + (1 - speed) * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // the disc solidifies into the portrait's black circle
      if (inDisc && discP > 0.55) {
        const a = easeOut((discP - 0.55) / 0.45);
        ctx.beginPath();
        ctx.arc(disc.cx, disc.cy, disc.R * (0.9 + 0.1 * a), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(12,12,13,${a})`;
        ctx.fill();
      }

      if (!done || now - start < T_FORM + T_HOLD + T_DISC + T_FADE + 200) raf = requestAnimationFrame(frame);
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
