import { useState } from 'react';
import { person } from '../data/content.js';
import { useLocalTime } from '../hooks/index.js';
import { Eyebrow, MaskedLines, Reveal } from './Motion.jsx';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const time = useLocalTime(person.timeZone);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
    } catch {
      // Fallback: select the address so the visitor can copy it manually.
      const el = document.getElementById('contact-email-text');
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      setCopied(true);
    }
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <Eyebrow light>Contact</Eyebrow>
      <MaskedLines as="h2" className="display display--light display--contact" lines={['Let’s make', 'things work', 'better.']} />
      <span id="contact-title" className="sr-only">Contact</span>

      <div className="contact__grid">
        <Reveal className="contact__primary">
          <p className="contact__label">Email</p>
          <a className="contact__email" href={`mailto:${person.email}`}>
            <span id="contact-email-text">{person.email}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </a>
          <button type="button" className="copy-btn" onClick={copy} aria-live="polite">
            {copied ? 'Copied to clipboard' : 'Copy address'}
          </button>
        </Reveal>
        <Reveal className="contact__secondary" delay={0.1}>
          <div>
            <p className="contact__label">LinkedIn</p>
            <a className="contact__link" href={person.linkedin} target="_blank" rel="noopener noreferrer">
              {person.linkedinLabel}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <div>
            <p className="contact__label">Location</p>
            <p className="contact__text">{person.location} · {time}</p>
          </div>
          <div>
            <p className="contact__label">Status</p>
            <p className="contact__text"><span className="pulse pulse--light" aria-hidden="true" />{person.availability}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
