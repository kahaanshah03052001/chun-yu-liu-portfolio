import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { consulting, database, gallery } from '../data/content.js';
import { kiinImages } from '../data/assets.js';
import { EASE } from './Motion.jsx';

function Folder({ icon }) {
  return (
    <svg viewBox="0 0 48 40" width="44" height="36" aria-hidden="true">
      <path d="M2 8a3 3 0 0 1 3-3h12l5 5h21a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" className="folder__back" />
      <path d="M2 15h44v20a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" className="folder__front" />
      <text x="24" y="31" textAnchor="middle" className="folder__icon">{icon}</text>
    </svg>
  );
}

function Database() {
  const [open, setOpen] = useState(0);
  return (
    <div className="db">
      <ul className="db__list">
        {database.map((d, i) => (
          <li key={d.key}>
            <button
              type="button"
              className={`db__folder ${open === i ? 'is-open' : ''}`}
              aria-expanded={open === i}
              onClick={() => setOpen(i)}
              onMouseEnter={() => setOpen(i)}
            >
              <Folder icon={i + 1} />
              <span>{d.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="db__window" aria-live="polite">
        <div className="db__bar" aria-hidden="true"><i /><i /><i /><span>Kiin / {database[open].title}</span></div>
        <AnimatePresence mode="wait">
          <motion.ul
            key={open}
            className="db__files"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {database[open].items.map((it, i) => (
              <motion.li
                key={it}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.07 }}
              >
                <span className="db__file" aria-hidden="true" />
                {it}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Gallery() {
  const track = useRef(null);
  const [lightbox, setLightbox] = useState(null);
  const scrollBy = (dir) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + gallery.length) % gallery.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox, close]);

  return (
    <div className="gallery">
      <div
        className="gallery__track"
        ref={track}
        tabIndex={0}
        aria-label="Proof of concept gallery"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') scrollBy(1);
          if (e.key === 'ArrowLeft') scrollBy(-1);
        }}
      >
        {gallery.map((g, i) => (
          <figure key={g.title} className={`shot shot--${g.img === 'moodboard' ? 'tall' : 'wide'}`}>
            <button type="button" className="shot__btn" onClick={() => setLightbox(i)} aria-label={`Enlarge ${g.title}`}>
              <img src={kiinImages[g.img]} alt={`${g.type}: ${g.title}`} loading="lazy" decoding="async" />
            </button>
            <figcaption>
              <span>{g.type}</span>
              {g.title}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="gallery__nav">
        <button type="button" className="icon-btn" onClick={() => scrollBy(-1)} aria-label="Previous">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
        </button>
        <button type="button" className="icon-btn" onClick={() => scrollBy(1)} aria-label="Next">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
        </button>
        <span className="gallery__hint">Click any piece to enlarge</span>
      </div>

      {createPortal(
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={gallery[lightbox].title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.img
              key={lightbox}
              src={kiinImages[gallery[lightbox].img]}
              alt={gallery[lightbox].title}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            />
            <p className="lightbox__cap">{gallery[lightbox].type} · {gallery[lightbox].title}</p>
            <button type="button" className="lightbox__close" onClick={close} aria-label="Close" autoFocus>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </div>
  );
}

function Consulting() {
  const [open, setOpen] = useState(0);
  return (
    <ul className="consult">
      {consulting.map((c, i) => (
        <li key={c.title}>
          <button
            type="button"
            className={`consult__row ${open === i ? 'is-open' : ''}`}
            aria-expanded={open === i}
            onMouseEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => setOpen(i)}
          >
            <span className="consult__title">{c.title}</span>
            <span className="consult__body">{c.body}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

const TABS = [
  { key: 'poc', label: 'Proof of concept', C: Gallery },
  { key: 'db', label: 'Content database', C: Database },
  { key: 'consult', label: 'Campaign consultation', C: Consulting }
];

export default function Deliverables() {
  const [tab, setTab] = useState(0);
  const Active = TABS[tab].C;
  return (
    <div className="deliver">
      <div className="deliver__tabs" role="tablist" aria-label="Deliverables">
        {TABS.map((t, i) => (
          <button key={t.key} type="button" role="tab" aria-selected={tab === i} className={tab === i ? 'is-active' : undefined} onClick={() => setTab(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          role="tabpanel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <Active />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
