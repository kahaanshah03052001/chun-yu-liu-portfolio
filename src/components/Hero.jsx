import { motion } from 'framer-motion';
import { person } from '../data/content.js';
import { useLocalTime, useMagnetic, useTilt } from '../hooks/index.js';
import { EASE, MaskedLines } from './Motion.jsx';

export default function Hero({ portrait, ready = true }) {
  const time = useLocalTime(person.timeZone);
  const tiltRef = useTilt(12);
  const magRef = useMagnetic(0.35);

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <motion.div
        className="hero__meta"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <span>Portfolio 2026</span>
        <span className="hero__meta-rule" aria-hidden="true" />
        <span>
          {person.location} <span className="muted">· {time} local</span>
        </span>
      </motion.div>

      <div className="hero__grid">
        <div className="hero__type">
          <MaskedLines
            as="h1"
            className="display display--hero"
            lines={['Structure.', 'Clarity.', 'Execution.']}
            animateOnMount
            play={ready}
            delay={0.15}
            stagger={0.12}
          />
          <motion.p
            id="hero-title"
            className="hero__role"
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
          >
            <strong className="hero__name">{person.name}</strong>
            <span className="hero__role-line">{person.roleLine}</span>
          </motion.p>
        </div>

        <motion.figure
          className="hero__portrait"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
        >
          <div className="portrait-disc" ref={tiltRef}>
            <span className="portrait-glare" aria-hidden="true" />
            <picture>
              <source type="image/webp" srcSet={portrait.webp} sizes="(max-width: 800px) 80vw, 40vw" />
              <img
                src={portrait.jpg}
                srcSet={portrait.jpgSet}
                sizes="(max-width: 800px) 80vw, 40vw"
                width="1200"
                height="1200"
                alt="Portrait of Chun-Yu Liu in a light blue shirt and glasses"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
          <span className="portrait-orbit" aria-hidden="true" />
          <figcaption className="hero__badge">
            <span className="pulse" aria-hidden="true" />
            {person.availability}
          </figcaption>
        </motion.figure>
      </div>

      <motion.div
        className="hero__foot"
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
      >
        <p className="hero__intro">{person.intro}</p>
        <dl className="hero__facts">
          <div>
            <dt>Based in</dt>
            <dd>{person.location}</dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>{person.languages}</dd>
          </div>
          <div>
            <dt>Education</dt>
            <dd>MGM, Thunderbird</dd>
          </div>
        </dl>
        <a className="cta-round" href="#kiin">
          <span className="cta-round__label">View experience</span>
          <span className="cta-round__icon" aria-hidden="true" ref={magRef}>
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 4v16m0 0-6-6m6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </span>
        </a>
      </motion.div>

      <a className="scroll-cue" href="#kiin" aria-label="Scroll to the Kiin case study">
        <span className="scroll-cue__track" aria-hidden="true"><span className="scroll-cue__thumb" /></span>
        <span>Scroll</span>
      </a>
    </section>
  );
}
