import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { recommendations } from '../data/content.js';
import { EASE } from './Motion.jsx';

export default function Recommendations() {
  const [tab, setTab] = useState(0);
  const [variant, setVariant] = useState('General');
  const rec = recommendations[tab];
  const points = rec.variants ? rec.variants[variant] : rec.points;

  return (
    <div className="recs">
      <div className="recs__tabs" role="tablist" aria-label="Recommendation areas">
        {recommendations.map((r, i) => (
          <button
            key={r.key}
            type="button"
            role="tab"
            aria-selected={tab === i}
            className={tab === i ? 'is-active' : undefined}
            onClick={() => setTab(i)}
            onMouseEnter={() => setTab(i)}
          >
            {r.title}
          </button>
        ))}
      </div>
      <div className="recs__panel" role="tabpanel">
        {rec.variants && (
          <div className="recs__variants" role="group" aria-label="Outreach audience">
            {Object.keys(rec.variants).map((v) => (
              <button key={v} type="button" aria-pressed={variant === v} className={variant === v ? 'is-active' : undefined} onClick={() => setVariant(v)}>
                {v}
              </button>
            ))}
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.ol key={`${rec.key}-${variant}`} className="recs__list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {points.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
              >
                <span className="recs__n" aria-hidden="true">{i + 1}</span>
                {p}
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>
    </div>
  );
}
