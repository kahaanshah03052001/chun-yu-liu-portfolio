import { motion } from 'framer-motion';
import { education } from '../data/content.js';
import { EASE, Eyebrow, MaskedLines } from './Motion.jsx';

export default function Education() {
  return (
    <section id="education" className="section section--rule" aria-labelledby="edu-title">
      <div className="section__head">
        <Eyebrow>Education</Eyebrow>
        <MaskedLines as="h2" className="display" lines={['Trained for', 'global business.']} />
        <span id="edu-title" className="sr-only">Education</span>
      </div>
      <ol className="edu">
        {education.map((e, i) => (
          <motion.li
            key={e.school}
            className="edu__row"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
          >
            <span className="edu__year" aria-hidden="true">{e.year}</span>
            <div className="edu__main">
              <p className="edu__degree">{e.degree}</p>
              <p className="edu__school">
                {e.school}
                {e.parent && <span className="muted">, {e.parent}</span>}
              </p>
            </div>
            <div className="edu__meta">
              <span>{e.date}</span>
              <span className="muted">{e.place}</span>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
