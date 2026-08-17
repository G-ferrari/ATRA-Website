import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

interface AnimatedCounterProps {
  from?: number;
  to?: number;
  end?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from = 0,
  to,
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const targetValue = end !== undefined ? end : (to !== undefined ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(from);
  const springVal = useSpring(motionVal, {
    damping: 30 + duration * 10,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, amount: 0.1, margin: '0px 0px 50px 0px' });

  useEffect(() => {
    if (isInView) {
      motionVal.set(targetValue);
    }
  }, [isInView, motionVal, targetValue]);

  // Fallback for mobile views to guarantee non-zero final metric
  useEffect(() => {
    const timer = setTimeout(() => {
      motionVal.set(targetValue);
    }, 1500);
    return () => clearTimeout(timer);
  }, [motionVal, targetValue]);

  useEffect(() => {
    const unsubscribe = springVal.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [springVal, prefix, suffix, decimals]);

  return <span ref={ref} className={className}>{prefix}{from.toFixed(decimals)}{suffix}</span>;
};

export default AnimatedCounter;
