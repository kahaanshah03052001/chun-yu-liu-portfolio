import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { pipeline } from '../data/content.js';
import { EASE } from './Motion.jsx';

const STEP_MS = 4400;
const COLS = 40;
const ROWS = 17; // 40 x 17 = 680 people reached
const GX = 14;
const X0 = 47;
const Y0 = 68;
// spread the 25 respondents across the grid
const PICK = Array.from({ length: 25 }, (_, i) => Math.floor(((i * 680) / 25 + ((i * 37) % 23)) % 680));
const ROLE = new Map(PICK.map((idx, i) => [idx, i < 12 ? 'interview' : 'survey']));
const CEO = [320, 176];
const RECS = ['Branding', 'Design', 'Campaign', 'Outreach'];

function place(i, stage) {
  const gx = X0 + (i % COLS) * GX;
  const gy = Y0 + Math.floor(i / COLS) * GX;
  const role = ROLE.get(i);
  if (stage === 0) return { x: gx, y: gy, s: 1, o: 0.85 };
  if (!role) return { x: gx, y: gy, s: 0.7, o: stage === 1 ? 0.12 : 0 };
  const k = PICK.indexOf(i);
  if (stage === 1) {
    return role === 'interview'
      ? { x: 100 + k * 40, y: 140, s: 4.2, o: 1 }
      : { x: 80 + (k - 12) * 40, y: 232, s: 3.2, o: 1 };
  }
  if (stage === 2) {
    const left = k % 2 === 0;
    const n = left ? Math.floor(k / 2) : Math.floor(k / 2);
    const a = (n / 13) * Math.PI * 2;
    const r = 30 + (n % 3) * 18;
    return { x: (left ? 190 : 450) + Math.cos(a) * r, y: 176 + Math.sin(a) * r, s: 2.6, o: 1 };
  }
  return { x: CEO[0], y: CEO[1], s: 0.5, o: 0 };
}

export default function InsightPipeline() {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useReducedMotion();
  const auto = playing && inView && !reduce;

  useEffect(() => {
    if (!auto) return;
    const id = setTimeout(() => setStage((s) => (s + 1) % pipeline.length), STEP_MS);
    return () => clearTimeout(id);
  }, [auto, stage]);

  const go = useCallback((i) => {
    setPlaying(false);
    setStage((i + pipeline.length) % pipeline.length);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(stage + 1);
      document.getElementById(`pipe-tab-${(stage + 1) % pipeline.length}`)?.focus();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(stage - 1);
      document.getElementById(`pipe-tab-${(stage + pipeline.length - 1) % pipeline.length}`)?.focus();
    }
  };

  const step = pipeline[stage];

  return (
    <div className="pipeline" ref={ref}>
      <div className="pipeline__tabs" role="tablist" aria-label="Research to recommendation" onKeyDown={onKeyDown}>
        {pipeline.map((p, i) => (
          <button
            key={p.key}
            id={`pipe-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={stage === i}
            aria-controls="pipe-panel"
            tabIndex={stage === i ? 0 : -1}
            className={`pipeline__tab ${stage === i ? 'is-active' : ''} ${i < stage ? 'is-done' : ''}`}
            onClick={() => go(i)}
          >
            <span className="pipeline__tab-fig">{p.figure}</span>
            <span className="pipeline__tab-title">{p.small}</span>
            <span className="pipeline__tab-bar" aria-hidden="true">
              {stage === i && <span key={`${stage}-${auto}`} className={`pipeline__tab-fill ${auto ? 'is-running' : 'is-static'}`} style={{ animationDuration: `${STEP_MS}ms` }} />}
            </span>
          </button>
        ))}
      </div>

      <div className="pipeline__stage">
        <svg viewBox="0 0 640 360" className="pipeline__svg" role="img" aria-label={`${step.title}: ${step.body}`}>
          {stage === 2 && (
            <g className="clusters">
              <circle cx="190" cy="176" r="88" className="ring" />
              <circle cx="450" cy="176" r="88" className="ring" />
              <text x="190" y="300" textAnchor="middle" className="svg-label svg-label--strong">Operational friction</text>
              <text x="450" y="300" textAnchor="middle" className="svg-label svg-label--strong">Cultural friction</text>
            </g>
          )}
          {stage === 1 && (
            <g className="clusters">
              <text x="320" y="104" textAnchor="middle" className="svg-label">12 interviews</text>
              <text x="320" y="282" textAnchor="middle" className="svg-label">13 questionnaires</text>
            </g>
          )}

          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const p = place(i, stage);
            const role = ROLE.get(i);
            return (
              <g
                key={i}
                className="node"
                style={{
                  transform: `translate(${p.x}px, ${p.y}px) scale(${p.s})`,
                  opacity: p.o,
                  transitionDelay: role ? `${(PICK.indexOf(i) % 12) * 30}ms` : `${(i % 40) * 6}ms`
                }}
              >
                <circle r="2.4" className={role === 'survey' && stage > 0 ? 'node__survey' : 'node__core'} />
              </g>
            );
          })}

          <g className={`ceo ${stage === 3 ? 'is-on' : ''}`} transform={`translate(${CEO[0]} ${CEO[1]})`}>
            {RECS.map((r, i) => {
              const a = (i / RECS.length) * Math.PI * 2 - Math.PI / 4;
              const x = Math.cos(a) * 150;
              const y = Math.sin(a) * 105;
              return (
                <g key={r}>
                  <line x1="0" y1="0" x2={x} y2={y} className="ceo-spoke" />
                  <circle cx={x} cy={y} r="5" className="ceo__tip" />
                  <text x={x} y={y + (y > 0 ? 22 : -12)} textAnchor="middle" className="svg-label svg-label--strong">{r}</text>
                </g>
              );
            })}
            <circle r="58" className="ceo__ring" />
            <circle r="40" className="ceo__core" />
            <text y="6" textAnchor="middle" className="ceo__text">CEO</text>
          </g>
          <text x="320" y="330" textAnchor="middle" className="svg-label" style={{ opacity: stage === 0 ? 1 : 0, transition: 'opacity .4s' }}>
            Each dot is one international worker reached
          </text>
        </svg>

        <div className="pipeline__copy" id="pipe-panel" role="tabpanel" aria-labelledby={`pipe-tab-${stage}`} aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p className="pipeline__count">
                {String(stage + 1).padStart(2, '0')} <span>/ {String(pipeline.length).padStart(2, '0')}</span>
              </p>
              <h4 className="pipeline__title">{step.title}</h4>
              <p className="pipeline__body">{step.body}</p>
            </motion.div>
          </AnimatePresence>
          <div className="pipeline__controls">
            <button type="button" className="icon-btn" onClick={() => go(stage - 1)} aria-label="Previous stage">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
            <button type="button" className="icon-btn" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause autoplay' : 'Play autoplay'} aria-pressed={!playing}>
              {playing ? (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 5v14M15 5v14" stroke="currentColor" strokeWidth="1.8" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor" /></svg>
              )}
            </button>
            <button type="button" className="icon-btn" onClick={() => go(stage + 1)} aria-label="Next stage">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
