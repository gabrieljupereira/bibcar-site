'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export default function ScrollReveal({ children, className = '', style, delay = 0, direction = 'up' }: Props) {
  const initial = {
    opacity: 0,
    y: direction === 'up' ? 32 : 0,
    x: direction === 'left' ? -32 : direction === 'right' ? 32 : 0,
  };

  return (
    <motion.div
      className={className}
      style={style}
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
