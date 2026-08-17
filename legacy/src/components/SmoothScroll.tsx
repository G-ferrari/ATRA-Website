import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Enable native smooth scrolling on the root document
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Handle smooth scrolling when hash or path changes
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const hash = location.hash;
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''));
      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const targetY = rect.top + window.scrollY;
          window.scrollTo({
            top: Math.max(0, targetY - 30),
            behavior: 'smooth'
          });
          return true;
        }
        return false;
      };

      // Multi-pass scrolling to handle dynamic layout shifts, fonts, and image rendering
      scrollToElement();
      timers.push(setTimeout(scrollToElement, 50));
      timers.push(setTimeout(scrollToElement, 150));
      timers.push(setTimeout(scrollToElement, 350));
      timers.push(setTimeout(scrollToElement, 600));
    } else {
      // Default / Home or no-hash route: reset directly to top
      const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      };

      scrollToTop();
      timers.push(setTimeout(scrollToTop, 50));
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [location.pathname, location.hash, location.key]);

  return (
    <div className="w-full relative min-h-screen">
      {children}
    </div>
  );
};

