import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { TIMING } from './GlobeTiming.js';

// three.js loads in its own chunk so the page itself stays light
const GlobeScene = lazy(() => import('./GlobeScene.jsx'));

const FADE_MS = 450;
const HARD_CAP_MS = 5000; // never hold the page longer than this, whatever happens

class SafeBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Loader({ onReveal, onDone }) {
  const [fading, setFading] = useState(false);
  const finished = useRef(false);
  const timers = useRef([]);

  const reveal = () => {
    if (finished.current) return;
    finished.current = true;
    setFading(true);
    onReveal?.();
    timers.current.push(
      setTimeout(() => {
        document.documentElement.classList.remove('is-loading');
        onDone?.();
      }, FADE_MS)
    );
  };

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let webgl = false;
    try {
      const c = document.createElement('canvas');
      webgl = Boolean(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
      webgl = false;
    }
    if (reduce || !webgl) {
      reveal();
      return undefined;
    }
    document.documentElement.classList.add('is-loading');
    timers.current.push(setTimeout(reveal, HARD_CAP_MS));
    const skip = () => reveal();
    window.addEventListener('keydown', skip);
    return () => {
      timers.current.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
      document.documentElement.classList.remove('is-loading');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReady = () => {
    timers.current.push(setTimeout(reveal, TIMING.end));
  };

  return (
    <div
      className={`loader ${fading ? 'loader--fade' : ''}`}
      role="status"
      aria-label="Loading Chun-Yu Liu's portfolio"
      onClick={reveal}
    >
      <SafeBoundary onError={reveal}>
        <Suspense fallback={null}>
          <GlobeScene onReady={onReady} />
        </Suspense>
      </SafeBoundary>
    </div>
  );
}
