import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects } from '../data/content.js';
import { EASE, Eyebrow, MaskedLines, Reveal } from './Motion.jsx';

function ProjectRow({ project, open, onToggle }) {
  const panelId = `panel-${project.id}`;
  const btnId = `btn-${project.id}`;
  return (
    <li className={`project ${open ? 'is-open' : ''}`}>
      <h3 className="project__heading">
        <button id={btnId} type="button" className="project__trigger" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
          <span className="project__figure">
            <span className="project__figure-num">{project.figure}</span>
            <span className="project__figure-label">{project.figureLabel}</span>
          </span>
          <span className="project__titles">
            <span className="project__title">{project.title}</span>
            <span className="project__context">{project.context}</span>
          </span>
          <span className="project__icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            className="project__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="project__body">
              <ul className="project__points">
                {project.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="project__aside">
                <p className="project__aside-label">{project.highlightLabel}</p>
                {project.highlights.map((h) => (
                  <p key={h} className="project__highlight">{h}</p>
                ))}
                <ul className="project__tags" aria-label="Methods and tools">
                  {project.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Projects() {
  const [open, setOpen] = useState(projects[0].id);
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="section__head">
        <Eyebrow>Additional experience and projects</Eyebrow>
        <MaskedLines as="h2" className="display" lines={['More evidence,', 'same habits.']} />
        <span id="work-title" className="sr-only">Additional experience and projects</span>
        <Reveal as="p" className="section__lede">
          Survey research, statistical analysis and program coordination, from university projects to a leadership role in Taiwan.
        </Reveal>
      </div>
      <Reveal as="ul" className="projects">
        {projects.map((p) => (
          <ProjectRow key={p.id} project={p} open={open === p.id} onToggle={() => setOpen(open === p.id ? null : p.id)} />
        ))}
      </Reveal>
    </section>
  );
}
