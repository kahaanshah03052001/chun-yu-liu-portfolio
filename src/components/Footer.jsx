import { nav, person } from '../data/content.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__name" aria-hidden="true">{person.name}</div>
      <div className="footer__row">
        <p>© {new Date().getFullYear()} {person.name}. Phoenix, Arizona.</p>
        <nav aria-label="Footer">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`}>{n.label}</a>
          ))}
        </nav>
        <a href="#top" className="footer__top">
          Back to top
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 20V4m0 0-6 6m6-6 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
        </a>
      </div>
    </footer>
  );
}
