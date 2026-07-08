import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  title: string;
}

const AnimatedCounter = ({ end, duration = 2, suffix = '', title }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-[var(--color-border-gray)]">
      <div className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] font-[var(--font-heading)] mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm uppercase tracking-wider text-[var(--color-body)] font-medium">
        {title}
      </div>
    </div>
  );
};

export default AnimatedCounter;
