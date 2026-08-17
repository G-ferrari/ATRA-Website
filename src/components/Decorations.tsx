import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const RoundedDiamond = ({ 
  className, 
  color = "bg-primary", 
  size = "w-20 h-20", 
  delay = 0 
}: { 
  className?: string; 
  color?: string; 
  size?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
      animate={{ opacity: 1, scale: 1, rotate: 45 }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        ease: "easeOut" 
      }}
      className={`absolute rounded-[20%] ${size} ${color} ${className} opacity-20`}
    />
  );
};

export const BackgroundDecorations = ({ color }: { color?: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <RoundedDiamond 
        color="bg-primary" 
        size="w-64 h-64" 
        className="-top-20 -left-20 opacity-10" 
      />
      <RoundedDiamond 
        color="bg-secondary" 
        size="w-40 h-40" 
        className="top-40 right-[10%] opacity-10" 
        delay={0.2}
      />
      <RoundedDiamond 
        color="bg-primary" 
        size="w-96 h-96" 
        className="top-[40%] -right-20 opacity-5" 
        delay={0.4}
      />
      <RoundedDiamond 
        color="bg-secondary" 
        size="w-32 h-32" 
        className="bottom-20 left-[15%] opacity-10" 
        delay={0.6}
      />
    </div>
  );
};

/**
 * ScrollParallaxShape
 * A wrapper that uses scrollY to create smooth, natural parallax shifts.
 * Fully responsive and lightweight using Framer Motion.
 */
export const ScrollParallaxShape = ({
  speed = 0.15,
  rotateSpeed = 0.05,
  className = "",
  style = {},
  children
}: {
  speed?: number;
  rotateSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) => {
  const { scrollY } = useScroll();
  
  // Custom scroll response
  const y = useTransform(scrollY, [0, 8000], [0, 8000 * -speed]);
  const rotate = useTransform(scrollY, [0, 8000], [0, 8000 * rotateSpeed]);
  
  return (
    <motion.div
      style={{
        y,
        rotate,
        ...style
      }}
      className={`absolute pointer-events-none select-none ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * HomeParallaxDecorations
 * A cohesive layer of high-fidelity floating tech objects positioned vertically
 * down the length of the landing page.
 */
export const HomeParallaxDecorations = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 w-full">
      {/* 1. UPPER HERO / CLIENTS TRANSITION */}
      {/* Glowing blue radial gradient background orb (No expensive CSS blur-64 filter pass) */}
      <ScrollParallaxShape speed={0.05} rotateSpeed={0} className="top-[12%] left-[-10%] w-[500px] h-[500px] transform-gpu">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(60,152,250,0.12)_0%,rgba(60,152,250,0)_70%)] dark:bg-[radial-gradient(circle,rgba(60,152,250,0.08)_0%,rgba(60,152,250,0)_70%)]" />
      </ScrollParallaxShape>

      {/* Floating glassy rounded diamond 1 */}
      <ScrollParallaxShape speed={0.15} rotateSpeed={0.04} className="top-[18%] right-[8%] z-10 transform-gpu">
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-[22%] bg-gradient-to-br from-primary/20 to-secondary/10 border border-white/10 shadow-lg" />
      </ScrollParallaxShape>

      {/* Floating glassy rounded diamond 2 */}
      <ScrollParallaxShape speed={0.1} rotateSpeed={-0.05} className="top-[28%] left-[6%] z-10 transform-gpu">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-[22%] bg-gradient-to-br from-secondary/15 to-primary/10 border border-white/5 shadow-md" />
      </ScrollParallaxShape>

      {/* 2. STATS / PARTNERS ZONE */}
      {/* Outline Tech Ring 1 */}
      <ScrollParallaxShape speed={0.18} rotateSpeed={0.03} className="top-[38%] right-[12%] transform-gpu">
        <svg className="w-24 h-24 md:w-32 md:h-32 text-primary/15 dark:text-primary/10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" />
          <path d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50" stroke="currentColor" strokeWidth="1" />
        </svg>
      </ScrollParallaxShape>

      {/* 3. FEATURES ZONE */}
      {/* Glowing orange radial gradient background orb */}
      <ScrollParallaxShape speed={0.08} rotateSpeed={0} className="top-[52%] right-[-5%] w-[450px] h-[450px] transform-gpu">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(255,139,8,0.12)_0%,rgba(255,139,8,0)_70%)] dark:bg-[radial-gradient(circle,rgba(255,139,8,0.06)_0%,rgba(255,139,8,0)_70%)]" />
      </ScrollParallaxShape>

      {/* Wireframe Grid Circle */}
      <ScrollParallaxShape speed={0.12} rotateSpeed={0.01} className="top-[58%] left-[8%] opacity-35 dark:opacity-20 transform-gpu">
        <svg className="w-36 h-36 md:w-48 md:h-48 text-slate-400 dark:text-slate-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 5" />
          <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
          <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.25" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.25" />
        </svg>
      </ScrollParallaxShape>

      {/* 4. STORIES & TESTIMONIALS ZONE */}
      {/* Glassy rounded diamond 3 */}
      <ScrollParallaxShape speed={0.2} rotateSpeed={0.08} className="top-[72%] right-[6%] transform-gpu">
        <div className="w-14 h-14 md:w-20 md:h-20 rounded-[22%] bg-gradient-to-br from-primary/15 to-secondary/15 border border-white/10 shadow-lg" />
      </ScrollParallaxShape>

      {/* Outline Tech Ring 2 */}
      <ScrollParallaxShape speed={0.14} rotateSpeed={-0.04} className="top-[82%] left-[10%] transform-gpu">
        <svg className="w-28 h-28 md:w-36 md:h-36 text-secondary/20 dark:text-secondary/10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="15 30" />
          <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </ScrollParallaxShape>

      {/* Blue glow near bottom CTA */}
      <ScrollParallaxShape speed={0.05} rotateSpeed={0} className="top-[88%] left-[20%] w-[400px] h-[400px] transform-gpu">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(60,152,250,0.12)_0%,rgba(60,152,250,0)_70%)] dark:bg-[radial-gradient(circle,rgba(60,152,250,0.06)_0%,rgba(60,152,250,0)_70%)]" />
      </ScrollParallaxShape>
    </div>
  );
};

