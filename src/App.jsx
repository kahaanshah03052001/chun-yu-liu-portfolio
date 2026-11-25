import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Loader from './components/Loader.jsx';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import KiinCaseStudy from './components/KiinCaseStudy.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Education from './components/Education.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { portrait } from './data/assets.js';

export default function App() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  return (
    <MotionConfig reducedMotion="user">
      {loading && <Loader onReveal={() => setReady(true)} onDone={() => setLoading(false)} />}
      <Cursor />
      <a className="skip-link" href="#kiin">Skip to main content</a>
      <Nav />
      <main>
        <Hero portrait={portrait} ready={ready} />
        <KiinCaseStudy />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
