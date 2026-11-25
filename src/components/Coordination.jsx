import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { rhythm, trackerRows } from '../data/content.js';
import { EASE } from './Motion.jsx';

function Tracker() {
  return (
    <div className="viz viz--tracker">
      <div className="sheet" role="table" aria-label="Illustrative project tracker">
        <div className="sheet__row sheet__row--head" role="row">
          <span role="columnheader">Workstream</span>
          <span role="columnheader">Scope</span>
          <span role="columnheader">Status</span>
        </div>
        {trackerRows.map((r, i) => (
          <motion.div
            key={r.item}
            className="sheet__row"
            role="row"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.08 * i }}
          >
            <span role="cell">{r.item}</span>
            <span role="cell" className="muted">{r.detail}</span>
            <span role="cell" className="status">
              <motion.span
                className="status__dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.35 + 0.1 * i }}
              />
              Complete
            </span>
          </motion.div>
        ))}
      </div>
      <p className="fineprint fineprint--light">Illustrative layout of the project tracker.</p>
    </div>
  );
}

function TeamRing() {
  const members = Array.from({ length: 6 });
  return (
    <div className="viz viz--team">
      <svg viewBox="0 0 320 320" role="img" aria-label="Follow-ups across a six-member team">
        <circle cx="160" cy="160" r="112" className="team__orbit" />
        {members.map((_, i) => {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const x = 160 + Math.cos(a) * 112;
          const y = 160 + Math.sin(a) * 112;
          return (
            <g key={i}>
              <line x1="160" y1="160" x2={x} y2={y} className="team__spoke" style={{ animationDelay: `${i * 0.35}s` }} />
              <motion.circle
                cx={x}
                cy={y}
                r="15"
                className="team__member"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.06 * i }}
              />
            </g>
          );
        })}
        <circle cx="160" cy="160" r="30" className="team__hub" />
        <text x="160" y="165" textAnchor="middle" className="team__hub-text">6</text>
      </svg>
      <ul className="team__legend">
        <li>Pending items</li>
        <li>Open requests</li>
        <li>Deadlines</li>
      </ul>
    </div>
  );
}

function StatusReport() {
  const sections = ['Progress', 'Timeline', 'Open items'];
  return (
    <div className="viz viz--report">
      <div className="doc" aria-label="Weekly status report structure">
        <div className="doc__head">
          <span>Weekly status report</span>
          <span className="muted">Every week</span>
        </div>
        {sections.map((s, i) => (
          <motion.div
            key={s}
            className="doc__section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.12 }}
          >
            <p>{s}</p>
            <span className="bar" style={{ width: `${88 - i * 14}%` }} />
            <span className="bar" style={{ width: `${64 + i * 8}%` }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SlideMock() {
  return (
    <div className="viz viz--slide">
      <motion.div
        className="slide"
        initial={{ opacity: 0, rotateX: 10, y: 20 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <p className="slide__title">Progress and timelines</p>
        <div className="slide__body">
          <div className="slide__chart" aria-hidden="true">
            {[38, 56, 72, 90].map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.25 + i * 0.1 }}
              />
            ))}
          </div>
          <div className="slide__text" aria-hidden="true">
            <span className="bar" style={{ width: '90%' }} />
            <span className="bar" style={{ width: '72%' }} />
            <span className="bar" style={{ width: '80%' }} />
          </div>
        </div>
        <p className="slide__foot">PowerPoint · clear updates for review</p>
      </motion.div>
    </div>
  );
}

const VIZ = { track: Tracker, follow: TeamRing, report: StatusReport, present: SlideMock };

export default function Coordination() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (touched || !inView || reduce) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % rhythm.length), 4800);
    return () => clearTimeout(id);
  }, [active, touched, inView, reduce]);

  const select = (i) => {
    setTouched(true);
    setActive(i);
  };
  const Viz = VIZ[rhythm[active].key];

  return (
    <div className="coord" ref={ref}>
      <ol className="rhythm" aria-label="Weekly operating rhythm">
        {rhythm.map((r, i) => (
          <li key={r.key}>
            <button
              type="button"
              className={`rhythm__step ${active === i ? 'is-active' : ''}`}
              aria-pressed={active === i}
              onClick={() => select(i)}
              onMouseEnter={() => select(i)}
            >
              <span className="rhythm__index" aria-hidden="true">{i + 1}</span>
              <span className="rhythm__main">
                <span className="rhythm__title">{r.title}</span>
                <span className="rhythm__tool">{r.tool}</span>
              </span>
              <span className="rhythm__body">{r.body}</span>
            </button>
          </li>
        ))}
        <li className="rhythm__loop" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 12a8 8 0 0 1 14-5.3M20 4v4h-4M20 12a8 8 0 0 1-14 5.3M4 20v-4h4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          Repeats every week
        </li>
      </ol>

      <div className="coord__viz" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={rhythm[active].key}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="coord__viz-inner"
          >
            <Viz />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
