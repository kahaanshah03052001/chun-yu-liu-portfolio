import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { nav, person } from '../data/content.js';
import { useActiveSection, useScrollProgress } from '../hooks/index.js';
import { EASE } from './Motion.jsx';

export default function Nav() {
  const ids = useMemo(() => nav.map((n) => n.id), []);
  const active = useActiveSection(ids);
  const barRef = useRef(null);
  useScrollProgress(barRef);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header ref={barRef} className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__inner">
        <a className="nav__mark" href="#top" onClick={() => setOpen(false)} aria-label="Chun-Yu Liu, back to top">
          <span className="nav__dot" aria-hidden="true" />
          {person.name}
        </a>
        <nav aria-label="Primary" className="nav__links">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={active === item.id ? 'is-active' : undefined}
              aria-current={active === item.id ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a className="nav__cta" href={`mailto:${person.email}`}>
          Get in touch
        </a>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="nav__burger" aria-hidden="true" />
        </button>
      </div>
      <div className="nav__progress" aria-hidden="true" />

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <nav aria-label="Mobile">
              {nav.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.05 + i * 0.05 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <a className="mobile-menu__mail" href={`mailto:${person.email}`}>
              {person.email}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
