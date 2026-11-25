import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];

/** Fades and lifts its children into place when scrolled into view. */
export function Reveal({ as = 'div', delay = 0, y = 28, className, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Oversized headline: each line slides up from behind a mask.
 * `lines` is an array of strings; `animateOnMount` plays immediately (hero) instead of on scroll.
 */
export function MaskedLines({ lines, as = 'h2', className, delay = 0, stagger = 0.09, animateOnMount = false, play = true }) {
  const Tag = as;
  // Observe the (unclipped) heading itself: the masked inner spans sit outside their clip until revealed.
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const shown = animateOnMount ? play : inView;
  return (
    <Tag ref={ref} className={className} aria-label={lines.join(' ')}>
      {lines.map((line, i) => (
        <span className="mask-line" aria-hidden="true" key={line + i}>
          <motion.span
            className="mask-inner"
            initial={{ y: '108%' }}
            animate={{ y: shown ? '0%' : '108%' }}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({ children, light = false }) {
  return <p className={light ? 'eyebrow eyebrow--light' : 'eyebrow'}>{children}</p>;
}
