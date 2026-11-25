import { useEffect, useRef } from 'react';

/**
 * Desktop-only cursor companion: a ring that trails the pointer, swells over anything
 * clickable and inverts colours underneath it. Hidden on touch devices and for reduced motion.
 */
export default function Cursor() {
  const ring = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    document.documentElement.classList.add('has-cursor');
    const pos = { x: -100, y: -100 };
    const lag = { x: -100, y: -100 };
    let raf;
    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.18;
      lag.y += (pos.y - lag.y) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${lag.x}px, ${lag.y}px)`;
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const hot = e.target.closest?.('a, button, input, [role="tab"], .dot--region, .dot--lit, .pin');
      ring.current?.classList.toggle('is-hot', Boolean(hot));
    };
    const onDown = () => ring.current?.classList.add('is-down');
    const onUp = () => ring.current?.classList.remove('is-down');
    const onLeave = () => ring.current?.classList.add('is-hidden');
    const onEnter = () => ring.current?.classList.remove('is-hidden');
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
    };
  }, []);

  return (
    <>
      <span ref={ring} className="cursor-ring" aria-hidden="true" />
      <span ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
