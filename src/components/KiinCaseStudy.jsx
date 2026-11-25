import { useState } from 'react';
import { motion } from 'framer-motion';
import { execution, kiin } from '../data/content.js';
import { useCountUp } from '../hooks/index.js';
import { EASE, Eyebrow, MaskedLines, Reveal } from './Motion.jsx';
import ResearchMap from './ResearchMap.jsx';
import InsightPipeline from './InsightPipeline.jsx';
import Insights from './Insights.jsx';
import Deliverables from './Deliverables.jsx';
import Recommendations from './Recommendations.jsx';
import Coordination from './Coordination.jsx';

function Stat({ value, label }) {
  const [ref, n] = useCountUp(value, value > 100 ? 1800 : 1400);
  return (
    <div className="stat" ref={ref}>
      <span className="stat__value" aria-hidden="true">{n}</span>
      <span className="sr-only">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

function Chapter({ letter, title, lede, children, id }) {
  return (
    <article className="chapter" aria-labelledby={id} id={`${id}-wrap`}>
      <header className="chapter__head">
        <Reveal className="chapter__letter" y={16}>
          <span aria-hidden="true">{letter}</span>
        </Reveal>
        <div>
          <Reveal as="h3" id={id} className="chapter__title">{title}</Reveal>
          {lede && <Reveal as="p" className="chapter__lede" delay={0.08}>{lede}</Reveal>}
        </div>
      </header>
      <Reveal delay={0.12}>{children}</Reveal>
    </article>
  );
}

function Execution() {
  const [open, setOpen] = useState(0);
  return (
    <ul className="execution">
      {execution.map((e, i) => (
        <motion.li
          key={e.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}
        >
          <button
            type="button"
            className={`execution__row ${open === i ? 'is-open' : ''}`}
            aria-expanded={open === i}
            onMouseEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => setOpen(i)}
          >
            <span className="execution__title">{e.title}</span>
            <span className="execution__evidence">{e.evidence}</span>
          </button>
        </motion.li>
      ))}
    </ul>
  );
}

const CHAPTERS = [
  { id: 'ch-outreach', label: 'Outreach' },
  { id: 'ch-funnel', label: 'Research' },
  { id: 'ch-heard', label: 'Insights' },
  { id: 'ch-built', label: 'Deliverables' },
  { id: 'ch-recs', label: 'Recommendations' },
  { id: 'ch-coord', label: 'Coordination' }
];

export default function KiinCaseStudy() {
  return (
    <section id="kiin" className="kiin" aria-labelledby="kiin-title">
      <div className="kiin__intro">
        <Eyebrow light>Featured case study · {kiin.program}</Eyebrow>
        <MaskedLines as="h2" className="display display--light" lines={['Global research.', 'Actionable insights.']} />
        <span id="kiin-title" className="sr-only">Kiin Global case study: Global research, actionable insights</span>

        <div className="kiin__brief">
          <Reveal as="p" className="kiin__summary">{kiin.summary}</Reveal>
          <Reveal as="dl" className="kiin__facts" delay={0.1}>
            <div><dt>Client</dt><dd>{kiin.org}</dd></div>
            <div><dt>Role</dt><dd>{kiin.role}</dd></div>
            <div><dt>Location</dt><dd>{kiin.location}</dd></div>
            <div><dt>Duration</dt><dd>{kiin.duration}</dd></div>
          </Reveal>
        </div>

        <div className="stats" role="list">
          {kiin.stats.map((s, i) => (
            <motion.div
              role="listitem"
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
            >
              <Stat value={s.value} label={s.label} />
            </motion.div>
          ))}
        </div>

        <nav className="kiin__toc" aria-label="Case study chapters">
          {CHAPTERS.map((c, i) => (
            <a key={c.id} href={`#${c.id}-wrap`}>
              <span aria-hidden="true">{String.fromCharCode(65 + i)}</span>
              {c.label}
            </a>
          ))}
        </nav>
      </div>

      <Chapter id="ch-outreach" letter="A" title="Targeted outreach" lede="Click a region to zoom in.">
        <ResearchMap />
      </Chapter>

      <Chapter id="ch-funnel" letter="B" title="From 680 to the CEO" lede="Watch the research narrow down.">
        <InsightPipeline />
      </Chapter>

      <Chapter id="ch-heard" letter="C" title="What the research found" lede="Pick a pain point.">
        <Insights />
      </Chapter>

      <Chapter id="ch-built" letter="D" title="What was built" lede="Three deliverables handed to Kiin.">
        <Deliverables />
      </Chapter>

      <Chapter id="ch-recs" letter="E" title="Recommendations" lede="Presented to Kiin’s CEO.">
        <Recommendations />
      </Chapter>

      <Chapter id="ch-coord" letter="F" title="Project coordination" lede="The weekly rhythm behind a six-person team.">
        <Coordination />
      </Chapter>

      <Chapter id="ch-execution" letter="G" title="Business execution" lede="Hover or tap each line.">
        <Execution />
      </Chapter>
    </section>
  );
}
