import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { buildDots } from '../data/geo.js';
import { origin, regions } from '../data/content.js';
import { TIMING } from './GlobeTiming.js';

/*
  3D intro scene (React Three Fiber).
  A dot-matrix globe of the case study's world map turns from Lehi toward the
  interview countries while red arcs fly out to each one. The globe then glides to
  the exact spot of the hero portrait and turns into a solid ink sphere, whose
  silhouette is the portrait's black circle: the page takes over from there.
*/


const INK = new THREE.Color('#111110');
const RED = new THREE.Color('#d6361f');
const R = 1; // globe radius in local units
const DEG = Math.PI / 180;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));

function toVec(lon, lat, r = R) {
  const phi = lat * DEG;
  const lam = lon * DEG;
  return new THREE.Vector3(r * Math.cos(phi) * Math.cos(lam), r * Math.sin(phi), -r * Math.cos(phi) * Math.sin(lam));
}

function arcPoints(a, b, segments = 64) {
  const va = toVec(a[0], a[1]).normalize();
  const vb = toVec(b[0], b[1]).normalize();
  const angle = va.angleTo(vb);
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const v = new THREE.Vector3().copy(va);
    // spherical interpolation, lifted off the surface mid-way
    const s1 = Math.sin((1 - t) * angle) / Math.sin(angle);
    const s2 = Math.sin(t * angle) / Math.sin(angle);
    v.multiplyScalar(s1).add(vb.clone().multiplyScalar(s2));
    v.setLength(R * (1 + 0.28 * Math.sin(Math.PI * t) * Math.min(1, angle)));
    pts.push(v);
  }
  return pts;
}

function portraitTarget(size) {
  const el = typeof document !== 'undefined' && document.querySelector('.portrait-disc');
  if (el) {
    const r = el.getBoundingClientRect();
    const d = Math.min(r.width, r.height) / 0.8; // hero portrait rests at scale(1), starts at 0.8
    if (d > 40) return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: d / 2 };
  }
  return { x: size.width * 0.72, y: size.height * 0.5, r: Math.min(size.width, size.height) * 0.25 };
}

function Globe({ start }) {
  const group = useRef();
  const land = useRef();
  const shell = useRef();
  const solid = useRef();
  const arcRefs = useRef([]);
  const pinRefs = useRef([]);
  const { size, viewport } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  const { landGeo, shellGeo, arcs, pins } = useMemo(() => {
    const dots = buildDots(size.width < 700 ? 3.2 : 2.4);
    const pos = new Float32Array(dots.length * 3);
    const col = new Float32Array(dots.length * 3);
    dots.forEach((d, i) => {
      const v = toVec(d.lon, d.lat, R * 1.002);
      pos.set([v.x, v.y, v.z], i * 3);
      const c = d.region ? INK.clone().lerp(RED, 0.85) : INK;
      col.set([c.r, c.g, c.b], i * 3);
    });
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    lg.setAttribute('color', new THREE.BufferAttribute(col, 3));

    // faint fibonacci shell gives the sphere its volume
    const n = 1600;
    const sp = new Float32Array(n * 3);
    const g = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const rr = Math.sqrt(1 - y * y);
      sp.set([Math.cos(i * g) * rr * R, y * R, Math.sin(i * g) * rr * R], i * 3);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));

    const countries = regions.flatMap((r) => r.countries);
    const arcLines = countries.map((c) => {
      const geo = new THREE.BufferGeometry().setFromPoints(arcPoints(origin.coord, c.coord));
      geo.setDrawRange(0, 0);
      return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: RED, transparent: true, opacity: 0.95 }));
    });
    const pinPos = [origin.coord, ...countries.map((c) => c.coord)].map(([lon, lat]) => toVec(lon, lat, R * 1.01));
    return { landGeo: lg, shellGeo: sg, arcs: arcLines, pins: pinPos };
  }, [size.width]);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame(() => {
    const t = performance.now() - start.current;
    const g = group.current;
    if (!g) return;

    // where the portrait sits, in world units at z = 0
    const target = portraitTarget(size);
    const vw = viewport.width;
    const vh = viewport.height;
    const toWorldX = (px) => (px / size.width - 0.5) * vw;
    const toWorldY = (py) => -(py / size.height - 0.5) * vh;
    const baseR = Math.min(vw, vh) * (size.width < 700 ? 0.34 : 0.3);
    const endR = (target.r / size.width) * vw;

    const intro = ease(clamp01(t / 500));
    const m = ease(clamp01((t - TIMING.move) / (TIMING.end - TIMING.move)));

    const x = toWorldX(target.x) * m;
    const y = toWorldY(target.y) * m;
    g.position.set(x, y, 0);
    const s = (baseR * (0.82 + 0.18 * intro)) * (1 - m) + endR * m;
    g.scale.setScalar(s);

    // turn from the Americas toward Asia, with a gentle pointer parallax
    const viewLon = -100 + 170 * ease(clamp01(t / TIMING.end));
    g.rotation.y = -Math.PI / 2 - viewLon * DEG + pointer.current.x * 0.12 * (1 - m);
    g.rotation.x = 0.32 + pointer.current.y * 0.08 * (1 - m);

    const fade = 1 - m;
    land.current.material.opacity = intro * fade;
    shell.current.material.opacity = 0.16 * intro * fade;
    solid.current.material.opacity = clamp01((m - 0.35) / 0.65);

    const arcP = clamp01((t - TIMING.arcs) / (TIMING.move - TIMING.arcs));
    arcs.forEach((line, i) => {
      const local = clamp01(arcP * 1.5 - i * 0.08);
      line.geometry.setDrawRange(0, Math.floor(65 * ease(local)));
      line.material.opacity = 0.95 * fade;
    });
    pinRefs.current.forEach((p, i) => {
      if (!p) return;
      const on = i === 0 ? intro : clamp01(arcP * 1.5 - (i - 1) * 0.08 - 0.6) * 2.5;
      p.scale.setScalar(Math.min(1, on) * fade);
    });
  });

  return (
    <group ref={group}>
      <points ref={shell} geometry={shellGeo}>
        <pointsMaterial color={INK} size={0.012} sizeAttenuation transparent opacity={0} depthWrite={false} />
      </points>
      <points ref={land} geometry={landGeo}>
        <pointsMaterial vertexColors size={0.022} sizeAttenuation transparent opacity={0} depthWrite={false} />
      </points>
      {arcs.map((line, i) => (
        <primitive key={i} object={line} ref={(el) => (arcRefs.current[i] = el)} />
      ))}
      {pins.map((p, i) => (
        <mesh key={i} position={p} ref={(el) => (pinRefs.current[i] = el)} scale={0}>
          <sphereGeometry args={[i === 0 ? 0.022 : 0.03, 12, 12]} />
          <meshBasicMaterial color={i === 0 ? INK : RED} />
        </mesh>
      ))}
      {/* occluder: hides the far side so the globe reads as a solid object */}
      <mesh renderOrder={-1}>
        <sphereGeometry args={[R * 0.985, 48, 48]} />
        <meshBasicMaterial color="#f4f1ea" />
      </mesh>
      <mesh ref={solid}>
        <sphereGeometry args={[R * 1.03, 64, 64]} />
        <meshBasicMaterial color="#0c0c0d" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function GlobeScene({ onReady }) {
  const start = useRef(performance.now());
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 30, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => {
        start.current = performance.now();
        onReady?.();
      }}
    >
      <Globe start={start} />
    </Canvas>
  );
}
