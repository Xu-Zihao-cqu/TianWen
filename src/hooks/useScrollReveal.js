import { useEffect, useRef } from 'react';
import { useAnimation } from 'framer-motion';

/**
 * 滚动入场动画 Hook
 * 元素进入视口时触发 fade-up，尊重 prefers-reduced-motion
 */
export function useScrollReveal(options = {}) {
  const { threshold = 0.15, once = true } = options;
  const controls = useAnimation();
  const ref = useRef(null);

  useEffect(() => {
    const prefersReduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      controls.set({ opacity: 1, y: 0 });
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start({ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } });
          if (once) observer.unobserve(el);
        } else if (!once) {
          controls.start({ opacity: 0, y: 20, transition: { duration: 0.2 } });
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [controls, threshold, once]);

  return { ref, controls, initial: { opacity: 0, y: 20 } };
}
