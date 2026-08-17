import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AetherFlowHeroProps {
  theme?: 'dark' | 'light';
  className?: string;
  children?: React.ReactNode;
  onCtaClick?: () => void;
}

const ROTATING_WORDS = [
  'software sob medida',
  'inteligência artificial',
  'dados e analytics',
  'automação',
  'inovação digital',
];

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isOrange: boolean;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 0.7;
    this.vy = (Math.random() - 0.5) * 0.7;
    this.radius = Math.random() * 2 + 1.5;
    // ~1 in every 6 particles is orange (#FF8B08)
    this.isOrange = Math.random() < (1 / 6);
  }

  update(
    canvasWidth: number,
    canvasHeight: number,
    mouse: { x: number | null; y: number | null; radius: number }
  ) {
    // Mouse repulsion (within 200px radius)
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius && dist > 0) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        const pushX = Math.cos(angle) * force * 3.5;
        const pushY = Math.sin(angle) * force * 3.5;

        this.x += pushX;
        this.y += pushY;
      }
    }

    // Normal velocity movement
    this.x += this.vx;
    this.y += this.vy;

    // Wrap canvas boundaries smoothly
    if (this.x < 0) this.x = canvasWidth;
    else if (this.x > canvasWidth) this.x = 0;

    if (this.y < 0) this.y = canvasHeight;
    else if (this.y > canvasHeight) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D, isDarkMode: boolean) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    if (this.isOrange) {
      // ATRA Orange #FF8B08
      const alpha = isDarkMode ? 0.85 : 0.95;
      ctx.fillStyle = `rgba(255, 139, 8, ${alpha})`;
    } else {
      // ATRA Blue #3C98FA
      const alpha = isDarkMode ? 0.8 : 0.9;
      ctx.fillStyle = `rgba(60, 152, 250, ${alpha})`;
    }

    ctx.fill();
  }
}

export const AetherFlowHero: React.FC<AetherFlowHeroProps> = ({
  theme: themeProp,
  className,
  children,
  onCtaClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Cycle rotating word every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleScrollDown = () => {
    if (heroSectionRef.current) {
      const rect = heroSectionRef.current.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.bottom,
        behavior: 'smooth',
      });
    } else if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.bottom,
        behavior: 'smooth',
      });
    }
  };

  // Theme state detection
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (themeProp) return themeProp === 'dark';
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        !document.documentElement.classList.contains('light');
    }
    return true;
  });

  // Sync theme prop or class changes
  useEffect(() => {
    if (themeProp) {
      setIsDarkMode(themeProp === 'dark');
      return;
    }

    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        !document.documentElement.classList.contains('light');
      setIsDarkMode(isDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [themeProp]);

  // Canvas particle setup & animation loop with performance optimizations
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let isVisible = true;
    let lastFrameTime = 0;
    const targetInterval = 1000 / 60; // 60 FPS cap

    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 160 // 160px repulsion radius
    };

    // Robust IntersectionObserver to completely halt canvas loop when out of screen
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          isVisible = entry.isIntersecting && !document.hidden;
          if (isVisible) {
            cancelAnimationFrame(animationFrameId);
            lastFrameTime = performance.now();
            animationFrameId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        const rect = container.getBoundingClientRect();
        const isInViewport = rect.bottom > 0 && rect.top < window.innerHeight;
        isVisible = isInViewport;
        if (isVisible) {
          lastFrameTime = performance.now();
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;

      // Smart particle density (clean visual, low GPU load)
      const particleCount = Math.floor((width * height) / 22000);
      const clampedCount = Math.max(35, Math.min(particleCount, 60));

      particles = [];
      for (let i = 0; i < clampedCount; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    };

    const handleTouchEnd = () => {
      mouse.x = null;
      mouse.y = null;
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    const maxDistance = 110;
    const maxDistanceSq = maxDistance * maxDistance;

    const animate = (currentTime: number = performance.now()) => {
      if (!isVisible) return;

      animationFrameId = requestAnimationFrame(animate);

      // FPS Throttling to 60fps max
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < targetInterval - 1) return;
      lastFrameTime = currentTime - (elapsed % targetInterval);

      const width = canvas.width;
      const height = canvas.height;

      // Fill canvas background based on theme
      ctx.fillStyle = isDarkMode ? '#0F1117' : '#F7F8FA';
      ctx.fillRect(0, 0, width, height);

      // 1. Update particles and separate by color for batched drawing
      const blueParticles: Particle[] = [];
      const orangeParticles: Particle[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update(width, height, mouse);
        if (p.isOrange) {
          orangeParticles.push(p);
        } else {
          blueParticles.push(p);
        }
      }

      // Draw blue particles in 1 batch
      if (blueParticles.length > 0) {
        ctx.beginPath();
        for (let i = 0; i < blueParticles.length; i++) {
          const p = blueParticles[i];
          ctx.moveTo(p.x + p.radius, p.y);
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
        ctx.fillStyle = isDarkMode ? 'rgba(60, 152, 250, 0.85)' : 'rgba(60, 152, 250, 0.95)';
        ctx.fill();
      }

      // Draw orange particles in 1 batch
      if (orangeParticles.length > 0) {
        ctx.beginPath();
        for (let i = 0; i < orangeParticles.length; i++) {
          const p = orangeParticles[i];
          ctx.moveTo(p.x + p.radius, p.y);
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
        ctx.fillStyle = isDarkMode ? 'rgba(255, 139, 8, 0.9)' : 'rgba(255, 139, 8, 1)';
        ctx.fill();
      }

      // 2. Batched Connecting Lines (drastically cuts draw calls from 300+ to just 2 per frame)
      const normalLines: [number, number, number, number, number][] = [];
      const highlightedLines: [number, number, number, number, number][] = [];

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          if (Math.abs(dx) > maxDistance) continue;

          const dy = p1.y - p2.y;
          if (Math.abs(dy) > maxDistance) continue;

          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistanceSq) {
            const dist = Math.sqrt(distSq);
            const alpha = 1 - dist / maxDistance;

            let isNearMouse = false;
            if (mouse.x !== null && mouse.y !== null) {
              const midX = (p1.x + p2.x) * 0.5;
              const midY = (p1.y + p2.y) * 0.5;
              const mDx = midX - mouse.x;
              const mDy = midY - mouse.y;
              if (mDx * mDx + mDy * mDy < 20000) {
                isNearMouse = true;
              }
            }

            if (isNearMouse) {
              highlightedLines.push([p1.x, p1.y, p2.x, p2.y, alpha]);
            } else {
              normalLines.push([p1.x, p1.y, p2.x, p2.y, alpha]);
            }
          }
        }
      }

      // Draw normal lines in one path
      if (normalLines.length > 0) {
        ctx.beginPath();
        for (let k = 0; k < normalLines.length; k++) {
          const line = normalLines[k];
          ctx.moveTo(line[0], line[1]);
          ctx.lineTo(line[2], line[3]);
        }
        ctx.strokeStyle = isDarkMode
          ? 'rgba(60, 152, 250, 0.18)'
          : 'rgba(40, 130, 230, 0.28)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw highlighted orange lines in one path
      if (highlightedLines.length > 0) {
        ctx.beginPath();
        for (let k = 0; k < highlightedLines.length; k++) {
          const line = highlightedLines[k];
          ctx.moveTo(line[0], line[1]);
          ctx.lineTo(line[2], line[3]);
        }
        ctx.strokeStyle = isDarkMode
          ? 'rgba(255, 139, 8, 0.65)'
          : 'rgba(255, 139, 8, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    };

    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  // Framer Motion Staggered Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden transition-colors duration-500',
        isDarkMode ? 'text-white' : 'text-slate-900',
        className
      )}
    >
      {/* Full-screen / Full-container Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-0"
      />

      {/* Main Hero Overlay Content Section */}
      <section
        ref={heroSectionRef}
        className="relative z-10 w-full min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 md:px-8 max-w-7xl mx-auto text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-5xl mx-auto space-y-5 sm:space-y-6 md:space-y-8"
        >
          {/* H1 Headline with Rotating Word Animation */}
          <motion.div variants={fadeUpVariants} className="w-full">
            <h1
              className={cn(
                'text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-snug sm:leading-tight select-none text-center',
                isDarkMode ? 'text-white' : 'text-slate-900'
              )}
            >
              <span>A ATRA cria soluções em </span>
              <span className="inline-block relative min-h-[1.2em] align-top text-[#FF8B08]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ROTATING_WORDS[currentWordIndex]}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block text-[#FF8B08]"
                  >
                    {ROTATING_WORDS[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </motion.div>

          {/* Subheadline Paragraph */}
          <motion.div variants={fadeUpVariants} className="max-w-2xl px-2">
            <p
              className={cn(
                'text-sm sm:text-lg md:text-xl font-light leading-relaxed',
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              )}
            >
              Criamos, desenvolvemos e avaliamos soluções personalizadas de software,
              inteligência artificial e dados para impulsionar a inovação e acelerar o crescimento do seu negócio.
            </p>
          </motion.div>

          {/* Scroll Down Indicator Cue */}
          <motion.div variants={fadeUpVariants} className="pt-2 sm:pt-4 flex justify-center w-full">
            <button
              type="button"
              onClick={handleScrollDown}
              className={cn(
                'group flex flex-col items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C98FA] rounded-[6px] p-2.5 sm:p-3',
                isDarkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-slate-900'
              )}
              aria-label="Descubra mais da ATRA"
            >
              <span className="text-xs sm:text-base font-medium tracking-wide select-none">
                Descubra mais da ATRA
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <ChevronDown size={22} className="transition-transform group-hover:scale-110" />
              </motion.div>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Optional Children rendered inside the same relative container over the canvas */}
      {children && <div className="relative z-10 w-full">{children}</div>}
    </div>
  );
};

export default AetherFlowHero;
