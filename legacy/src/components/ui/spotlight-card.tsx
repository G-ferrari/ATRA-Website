import React, { useState, useRef, ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
  radius?: number; // Corner radius in pixels (defaults to 12 for Opção A)
}

const glowColorMap = {
  blue: { base: 210, spread: 20 },
  orange: { base: 30, spread: 20 },
  purple: { base: 280, spread: 30 },
  green: { base: 140, spread: 30 },
  red: { base: 0, spread: 20 }
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96'
};

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  radius = 12
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { base, spread } = glowColorMap[glowColor] || glowColorMap.blue;

  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return ''; // Let className or inline styles handle sizing
    }
    return sizeMap[size];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only track pointer moves on non-touch (mouse/pen) devices to prevent blocking mobile scroll/drag
    if (e.pointerType === 'touch') return;

    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--x', x.toFixed(2));
    card.style.setProperty('--xp', (x / rect.width).toFixed(2));
    card.style.setProperty('--y', y.toFixed(2));
    card.style.setProperty('--yp', (y / rect.height).toFixed(2));
  };

  const getInlineStyles = () => {
    const baseStyles: any = {
      '--base': base,
      '--spread': spread,
      '--radius': String(radius),
      '--border': '1',
      '--size': '250',
      '--outer': '1',
      '--border-size': 'calc(var(--border, 1) * 1px)',
      '--spotlight-size': 'calc(var(--size, 250) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      '--saturation': '100',
      '--lightness': '60',
      '--bg-spot-opacity': isHovered ? '0.12' : '0',
      '--border-spot-opacity': isHovered ? '0.8' : '0',
      '--border-light-opacity': isHovered ? '0.2' : '0',
      borderRadius: 'calc(var(--radius) * 1px)',
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.12)), transparent
      )`,
      position: 'relative' as const,
      touchAction: 'pan-y' as const,
    };

    // Add width and height if provided
    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return baseStyles as React.CSSProperties;
  };

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: -1px;
      border: 1px solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-position: 0 0;
      background-repeat: no-repeat;
      
      /* Precise cross-browser mask to draw ONLY the border */
      -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0) border-box;
      -webkit-mask-composite: destination-out;
      mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0) border-box;
      mask-composite: exclude;
    }
    
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
      );
      filter: brightness(1.5);
    }
    
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
      );
    }
    
    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
    }
    
    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={getInlineStyles()}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        className={`
          ${getSizeClasses()}
          ${!customSize ? 'aspect-[3/4]' : ''}
          relative 
          backdrop-blur-[5px]
          transition-all duration-300
          ${className}
        `}
      >
        <div data-glow></div>
        <div className="relative z-10 h-full w-full flex flex-col justify-between">
          {children}
        </div>
      </div>
    </>
  );
};

export { GlowCard };
