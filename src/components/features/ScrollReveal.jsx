import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal.js';

/**
 * 滚动入场包装组件
 * 用法：<ScrollReveal><YourComponent /></ScrollReveal>
 */
export default function ScrollReveal({ children, className, ...options }) {
  const { ref, controls, initial } = useScrollReveal(options);

  return (
    <motion.div ref={ref} initial={initial} animate={controls} className={className}>
      {children}
    </motion.div>
  );
}
