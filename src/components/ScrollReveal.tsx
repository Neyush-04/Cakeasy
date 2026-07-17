import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms delay
  key?: React.Key;
}

export default function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -50px 0px' }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
