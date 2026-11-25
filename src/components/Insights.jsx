import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { findings, friction, regions } from '../data/content.js';
import { EASE } from './Motion.jsx';

const COLORS = { latam: 'var(--night-ink)', africa: 'var(--accent)', asia: '#8f8a80' };

function Donut({ active, setActive }) {
  const R = 70;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="donut">
      <svg viewBox="0 0 200 200" role="img" aria-label="Questionnaire respondents by region: Latin America 38.5%, Africa 30.8%, Asia 30.8%">
        <g transform="rotate(-90 100 100)">
          {regions.map((r) => {
            const len = (r.survey / 100) * C;
            const seg = (
              <circle
                key={r.id}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={COLORS[r.id]}
                strokeWidth={active === r.id ? 30 : 22}
                strokeDasharray={`${len - 3} ${C - len + 3}`}
                strokeDashoffset={-acc}
                className="donut__seg"
                style={{ opacity: !active || active === r.id ? 1 : 0.25 }}
                onMouseEnter={() => setActive(r.id)}
                onClick={() => setActive(r.id)}
              />
            );
            acc += len;
            return seg;
          })}
        </g>
        <text x="100" y="96" textAnchor="middle" className="donut__big">
          {active ? `${regions.find((r) => r.id === active).survey}%` : '13'}
        </text>
        <text x="100" y="120" textAnchor="middle" className="donut__small">
          {active ? regions.find((r) => r.id === active).name : 'respondents'}
        </text>
      </svg>
      <div className="donut__keys" onMouseLeave={() => setActive(null)}>
        {regions.map((r) => (
          <button
            key={r.id}
            type="button"
            className={active === r.id ? 'is-active' : undefined}
            onMouseEnter={() => setActive(r.id)}
            onFocus={() => setActive(r.id)}
            onClick={() => setActive(r.id)}
          >
            <span style={{ background: COLORS[r.id] }} />
            {r.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Insights() {
  const [mode, setMode] = useState('operational');
  const [pick, setPick] = useState(0);
  const [region, setRegion] = useState(null);
  const items = friction[mode];
  const item = items[pick] || items[0];

  return (
    <div className="insights">
      <div className="insights__main">
        <div className="seg" role="tablist" aria-label="Friction type">
          {[
            ['operational', 'Operational'],
            ['cultural', 'Cultural']
          ].map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={mode === k}
              className={mode === k ? 'is-active' : undefined}
              onClick={() => {
                setMode(k);
                setPick(0);
              }}
            >
              {label}
            </button>
          ))}
          <span className="seg__thumb" style={{ transform: `translateX(${mode === 'operational' ? 0 : 100}%)` }} aria-hidden="true" />
        </div>

        <ul className="chips" aria-label="Pain points">
          {items.map((it, i) => (
            <li key={`${mode}-${it.label}`}>
              <button
                type="button"
                className={`chip ${pick === i ? 'is-active' : ''} ${it.detail ? '' : 'chip--plain'}`}
                aria-pressed={pick === i}
                onMouseEnter={() => setPick(i)}
                onFocus={() => setPick(i)}
                onClick={() => setPick(i)}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="insights__detail" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${mode}-${item.label}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <strong>{item.label}.</strong> {item.detail || 'Reported by questionnaire respondents.'}
            </motion.p>
          </AnimatePresence>
        </div>

        <ul className="findings">
          {findings.map((f) => (
            <li key={f.label}>
              <span className="findings__fig">{f.figure}</span>
              <span className="findings__label">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <Donut active={region} setActive={setRegion} />
    </div>
  );
}
