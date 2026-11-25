import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { skills } from '../data/content.js';
import { EASE, Eyebrow, MaskedLines } from './Motion.jsx';

export default function Skills() {
  const [active, setActive] = useState(skills[0].id);
  const group = skills.find((s) => s.id === active);

  const onKeyDown = (e) => {
    const i = skills.findIndex((s) => s.id === active);
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % skills.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + skills.length) % skills.length;
    if (next !== null) {
      e.preventDefault();
      setActive(skills[next].id);
      document.getElementById(`skill-tab-${skills[next].id}`)?.focus();
    }
  };

  return (
    <section id="skills" className="section section--rule" aria-labelledby="skills-title">
      <div className="section__head">
        <Eyebrow>Capabilities</Eyebrow>
        <MaskedLines as="h2" className="display" lines={['Tools of', 'the trade.']} />
        <span id="skills-title" className="sr-only">Skills</span>
      </div>

      <div className="skills">
        <div className="skills__tabs" role="tablist" aria-orientation="vertical" aria-label="Skill groups" onKeyDown={onKeyDown}>
          {skills.map((s) => (
            <button
              key={s.id}
              id={`skill-tab-${s.id}`}
              role="tab"
              type="button"
              aria-selected={active === s.id}
              aria-controls="skill-panel"
              tabIndex={active === s.id ? 0 : -1}
              className={`skills__tab ${active === s.id ? 'is-active' : ''}`}
              onClick={() => setActive(s.id)}
              onMouseEnter={() => setActive(s.id)}
            >
              <span className="skills__tab-name">{s.name}</span>
              <span className="skills__tab-count">{s.items.length}</span>
            </button>
          ))}
        </div>

        <div className="skills__panel" id="skill-panel" role="tabpanel" aria-labelledby={`skill-tab-${active}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {active === 'languages' ? (
                <div className="langs">
                  {[
                    { glyph: '中文', name: 'Mandarin', level: 'Native' },
                    { glyph: 'EN', name: 'English', level: 'Fluent' }
                  ].map((l, i) => (
                    <motion.div
                      key={l.name}
                      className="lang"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
                    >
                      <span className={`lang__glyph ${l.name === 'Mandarin' ? 'lang__glyph--cjk' : ''}`} lang={l.name === 'Mandarin' ? 'zh-Hant' : 'en'}>{l.glyph}</span>
                      <span className="lang__name">{l.name}</span>
                      <span className="lang__level">{l.level} · written and verbal</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <ul className="skills__items">
                  {group.items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              )}
              {group.usedIn.length > 0 && (
                <div className="skills__used">
                  <span>Seen in</span>
                  {group.usedIn.map((u) => (
                    <a key={u.label} href={u.href}>{u.label}</a>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
