import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { origin, regions } from '../data/content.js';
import { MAP, buildDots, project } from '../data/geo.js';
import { EASE } from './Motion.jsx';

const fmt = (h) => {
  const v = ((h % 24) + 24) % 24;
  const hh = Math.floor(v);
  const mm = Math.round((v - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const isWorkday = (h) => {
  const v = ((h % 24) + 24) % 24;
  return v >= 8 && v < 18;
};

// Zoom frames in lon/lat: [west, north, east, south]
const FRAMES = {
  world: [-180, MAP.latTop, 180, MAP.latBottom],
  latam: [-125, 36, -28, -58],
  africa: [-24, 40, 58, -38],
  asia: [22, 62, 152, -14]
};
function frameToBox(id) {
  const [w, n, e, s] = FRAMES[id];
  const [x1, y1] = project([w, n]);
  const [x2, y2] = project([e, s]);
  // keep the map's aspect ratio so dots never stretch
  const ratio = MAP.width / MAP.height;
  let bw = x2 - x1;
  let bh = y2 - y1;
  if (bw / bh > ratio) bh = bw / ratio;
  else bw = bh * ratio;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  return [cx - bw / 2, cy - bh / 2, bw, bh];
}

function arcPath(a, b) {
  const [x1, y1] = project(a);
  const [x2, y2] = project(b);
  const lift = Math.max(60, Math.abs(x2 - x1) * 0.28);
  return `M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - lift} ${x2},${y2}`;
}

export default function ResearchMap() {
  const dots = useMemo(() => buildDots(), []);
  const [view, setView] = useState('world'); // world | region id
  const [hover, setHover] = useState(null);
  const [hour, setHour] = useState(9);
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const boxRef = useRef(frameToBox('world'));
  const focus = view === 'world' ? hover : view;
  const [ox, oy] = project(origin.coord);

  // Animate the viewBox between frames
  useEffect(() => {
    const svg = svgRef.current;
    const from = boxRef.current;
    const to = frameToBox(view);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const dur = reduce ? 1 : 1100;
    const t0 = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const box = from.map((v, i) => v + (to[i] - v) * e);
      boxRef.current = box;
      svg.setAttribute('viewBox', box.join(' '));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [view]);

  // Dots swell around the cursor (direct DOM writes, no re-render)
  useEffect(() => {
    const svg = svgRef.current;
    const circles = Array.from(gRef.current.querySelectorAll('circle'));
    let touched = [];
    let raf = 0;
    let last = null;
    const apply = () => {
      raf = 0;
      touched.forEach((c) => c.style.removeProperty('transform'));
      touched = [];
      if (!last) return;
      const pt = svg.createSVGPoint();
      pt.x = last.x;
      pt.y = last.y;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const p = pt.matrixTransform(ctm.inverse());
      const R = boxRef.current[2] * 0.07;
      for (let i = 0; i < circles.length; i++) {
        const d = dots[i];
        const dx = d.x - p.x;
        const dy = d.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < R) {
          const f = 1 - dist / R;
          circles[i].style.transform = `translate(${(dx / (dist || 1)) * f * R * 0.18}px, ${(dy / (dist || 1)) * f * R * 0.18}px) scale(${1 + f * 1.4})`;
          touched.push(circles[i]);
        }
      }
    };
    const onMove = (e) => {
      last = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      last = null;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerleave', onLeave);
    return () => {
      svg.removeEventListener('pointermove', onMove);
      svg.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [dots]);

  const current = regions.find((r) => r.id === focus);
  const tabs = [{ id: 'world', name: 'World' }, ...regions];
  const rows = (current ? [current] : regions).flatMap((r) =>
    r.countries.map((c) => ({ ...c, region: r.id, label: c.count ? c.name : 'Africa' }))
  );

  return (
    <div className="research">
      <div className="map" role="group" aria-label="Interactive map of research regions">
        <svg ref={svgRef} viewBox={frameToBox('world').join(' ')} className="map__svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <g ref={gRef}>
            {dots.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r="2.1"
                className={
                  !d.region ? 'dot' : focus ? (d.region === focus ? 'dot dot--on' : 'dot dot--region') : 'dot dot--lit'
                }
                style={{ transformOrigin: `${d.x}px ${d.y}px` }}
                onMouseEnter={d.region && view === 'world' ? () => setHover(d.region) : undefined}
                onClick={d.region ? () => setView(d.region) : undefined}
              />
            ))}
          </g>
          {regions.flatMap((r) =>
            r.countries.map((c) => (
              <path key={c.name} d={arcPath(origin.coord, c.coord)} className={`arc ${!focus || r.id === focus ? 'arc--on' : ''}`} pathLength="1" />
            ))
          )}
          {regions.flatMap((r) =>
            r.countries.map((c) => {
              const [x, y] = project(c.coord);
              const on = !focus || r.id === focus;
              const rad = c.count ? 7 + c.count * 3 : 7;
              return (
                <g
                  key={c.name}
                  className={`pin ${on ? 'pin--on' : ''} ${c.count ? '' : 'pin--survey'}`}
                  transform={`translate(${x} ${y})`}
                  onClick={() => setView(r.id)}
                  onMouseEnter={() => view === 'world' && setHover(r.id)}
                >
                  <circle r={rad + 12} className="pin__hit" />
                  <circle r={rad + 8} className="pin__halo" />
                  <circle r={rad} className="pin__core" />
                  {c.count > 0 && (
                    <text className="pin__count" textAnchor="middle" dy="0.35em">{c.count}</text>
                  )}
                  {view === r.id && (
                    <text className="pin__label" x={rad + 8} y={-rad - 4}>{c.name}</text>
                  )}
                </g>
              );
            })
          )}
          <g transform={`translate(${ox} ${oy})`} className="origin">
            <circle r="5.5" />
            <text x="10" y="-10">Lehi, UT</text>
          </g>
        </svg>
        <p className="map__hint" aria-hidden="true">{view === 'world' ? 'Hover a region, click to zoom' : 'Click World to zoom out'}</p>

        <div className="map__tabs" role="tablist" aria-label="Map view" onMouseLeave={() => setHover(null)}>
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={view === t.id}
              className={view === t.id ? 'is-active' : undefined}
              onClick={() => {
                setView(t.id);
                setHover(null);
              }}
              onMouseEnter={() => view === 'world' && t.id !== 'world' && setHover(t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="research__panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={focus || 'all'}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <p className="research__kicker">{current ? 'Region' : 'Reach'}</p>
            <h4 className="research__region">{current ? current.name : '680 workers'}</h4>
            <div className="research__nums">
              <span><strong>{current ? current.countries.reduce((n, c) => n + c.count, 0) : 12}</strong> interviews</span>
              <span><strong>{current ? current.countries.filter((c) => c.count).length : 6}</strong> countries</span>
            </div>
            <p className="research__line">{current ? 'Each interview booked around both time zones.' : 'Found on LinkedIn Sales Navigator, booked across time zones.'}</p>
          </motion.div>
        </AnimatePresence>

        <div className="tz">
          <label htmlFor="tz-slider" className="tz__label">
            Interview time in Lehi
            <output htmlFor="tz-slider" className="tz__value">{fmt(hour)}</output>
          </label>
          <input
            id="tz-slider"
            type="range"
            min="0"
            max="23.5"
            step="0.5"
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            aria-valuetext={`${fmt(hour)} in Lehi`}
          />
          <ul className="sched">
            {rows.map((c) => {
              const local = hour + (c.offset - origin.offset);
              const ok = isWorkday(local);
              const overlap = HOURS.filter((h) => isWorkday(h) && isWorkday(h + c.offset - origin.offset)).length;
              return (
                <li key={c.name}>
                  <button type="button" className="sched__row" onClick={() => setView(c.region)} aria-label={`${c.label}: ${fmt(local)} local, ${overlap} hours of shared working time`}>
                    <span className="sched__head">
                      <span className="sched__name">{c.label}</span>
                      <span className={`sched__time ${ok ? 'is-ok' : ''}`}>{fmt(local)}</span>
                    </span>
                    <span className="sched__bar" aria-hidden="true">
                      {HOURS.map((h) => {
                        const theirs = isWorkday(h + c.offset - origin.offset);
                        const both = theirs && isWorkday(h);
                        return <i key={h} className={both ? 'is-both' : theirs ? 'is-theirs' : undefined} />;
                      })}
                      <b style={{ left: `${(hour / 24) * 100}%` }} />
                    </span>
                    <span className="sched__overlap">{overlap ? `${overlap}h shared` : 'No overlap'}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="sched__legend" aria-hidden="true">
            <span><i className="is-theirs" /> Their workday</span>
            <span><i className="is-both" /> Shared with Lehi</span>
          </p>
        </div>
      </div>
    </div>
  );
}
