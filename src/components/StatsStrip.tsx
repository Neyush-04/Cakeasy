import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'motion/react';

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 500, suffix: '+', label: 'Cakes baked with love' },
  { value: 4, suffix: '+', label: 'Years of home baking' },
  { value: 30, suffix: '+', label: 'Signature designs' },
  { value: 5, suffix: '★', label: 'Rated by our customers' },
];

function CountUpNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-serif font-bold text-4xl sm:text-5xl text-[#1E1E1E]">
      {prefix}{display}{suffix}
    </span>
  );
}

export default function StatsStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#FFF5F8] rounded-[32px] border border-[#F6B8C8]/30 py-12 px-6 sm:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1"
            >
              <CountUpNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <p className="text-xs sm:text-sm text-gray-500 leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
