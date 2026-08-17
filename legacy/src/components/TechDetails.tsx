import React from 'react';
import { motion } from 'motion/react';

interface TechDetailProps {
  color?: 'blue' | 'orange' | 'mixed';
  sectionName?: string;
  delay?: number;
  align?: 'left' | 'right';
  side?: 'top' | 'bottom';
}

/**
 * TechHorizontalLine
 * A horizontal line (spanning ~30% width) with a glowing terminal dot and 
 * monospace system text that animates on scroll.
 */
export const TechHorizontalLine: React.FC<TechDetailProps> = ({
  color = 'blue',
  sectionName = 'SYSTEM_NODE',
  delay = 0,
  align = 'left',
  side = 'top'
}) => {
  const isLeft = align === 'left';
  const isTop = side === 'top';
  
  // Color configuration
  const lineColorClass = color === 'blue' 
    ? 'bg-primary' 
    : color === 'orange' 
    ? 'bg-secondary' 
    : 'bg-gradient-to-r from-primary to-secondary';
    
  const textColClass = color === 'blue' 
    ? 'text-primary' 
    : color === 'orange' 
    ? 'text-secondary' 
    : 'text-primary';

  const glowColorClass = color === 'blue'
    ? 'shadow-[0_0_8px_#3C98FA]'
    : color === 'orange'
    ? 'shadow-[0_0_8px_#FF8B08]'
    : 'shadow-[0_0_8px_#3C98FA]';

  return (
    <div 
      className={`absolute ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} w-full pointer-events-none select-none z-10`}
      style={{ height: '32px' }}
    >
      <div className={`relative w-full h-full flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
        
        {/* The 30% Width Animating Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ 
            duration: 0.9, 
            delay: delay, 
            ease: [0.25, 1, 0.5, 1] 
          }}
          style={{ 
            originX: isLeft ? 0 : 1,
            width: '30%'
          }}
          className={`h-[1px] ${lineColorClass} opacity-60 relative`}
        >
          {/* Glowing Terminal Node at the inner end of the line */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.8, duration: 0.3 }}
            className={`absolute top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full ${isLeft ? 'right-0' : 'left-0'} ${lineColorClass} ${glowColorClass}`}
          />
          
          {/* Subtle Accent Cross mark */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.5 }}
            className={`absolute top-1/2 -translate-y-1/2 text-[8px] text-text-muted ${isLeft ? 'left-4' : 'right-4'}`}
          >
            +
          </motion.div>
        </motion.div>



      </div>
    </div>
  );
};


/**
 * TechVerticalLine
 * A vertical line (spanning ~30% height of a section) on the side,
 * with horizontal small hashes and a pulsing node.
 */
export const TechVerticalLine: React.FC<TechDetailProps & { alignY?: 'top' | 'bottom' }> = ({
  color = 'blue',
  sectionName = 'SIDE_TRACK',
  delay = 0.1,
  align = 'left',
  alignY = 'top'
}) => {
  const isLeft = align === 'left';
  const isTopY = alignY === 'top';

  const lineColorClass = color === 'blue' 
    ? 'bg-primary' 
    : color === 'orange' 
    ? 'bg-secondary' 
    : 'bg-gradient-to-b from-primary to-secondary';

  const textColClass = color === 'blue' 
    ? 'text-primary' 
    : color === 'orange' 
    ? 'text-secondary' 
    : 'text-primary';

  return (
    <div 
      className={`absolute ${isLeft ? 'left-0' : 'right-0'} ${isTopY ? 'top-[10%]' : 'bottom-[10%]'} h-[30%] pointer-events-none select-none z-10`}
      style={{ width: '24px' }}
    >
      <div className="relative w-full h-full flex flex-col items-center">
        
        {/* The Animating Vertical Line */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ 
            duration: 1.0, 
            delay: delay, 
            ease: [0.25, 1, 0.5, 1] 
          }}
          style={{ 
            originY: isTopY ? 0 : 1,
            height: '100%'
          }}
          className={`w-[1px] ${lineColorClass} opacity-40 relative`}
        >
          {/* Animated vertical pulse node that slides down the line */}
          <motion.div
            animate={{ 
              y: [0, 150, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              top: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
            className={`absolute left-1/2 -translate-x-1/2 w-[3px] h-[12px] rounded-full ${lineColorClass} transform-gpu`}
          />

          {/* Tiny structural tick marks */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-[1px] bg-current opacity-30" />
          <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-2 h-[1px] bg-current opacity-30" />
        </motion.div>



      </div>
    </div>
  );
};


/**
 * TechCornerBraces
 * Small bounding L-brackets that define a visual boundary inside cards/sections
 * with digital code/coordinate readings.
 */
export const TechCornerBraces: React.FC<{
  color?: 'blue' | 'orange';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  delay?: number;
  size?: number;
}> = ({
  color = 'blue',
  position = 'top-left',
  delay = 0.2,
  size = 14
}) => {
  const borderCol = color === 'blue' ? 'border-primary' : 'border-secondary';
  const textCol = color === 'blue' ? 'text-primary' : 'text-secondary';
  
  // Placement coordinate calculations
  const styleObj: React.CSSProperties = {};
  if (position.includes('top')) styleObj.top = '16px';
  else styleObj.bottom = '16px';
  
  if (position.includes('left')) styleObj.left = '16px';
  else styleObj.right = '16px';

  // Specific border style to make it look like an L-bracket
  const borderStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderTop: position.includes('top') ? `1.5px solid` : 'none',
    borderBottom: position.includes('bottom') ? `1.5px solid` : 'none',
    borderLeft: position.includes('left') ? `1.5px solid` : 'none',
    borderRight: position.includes('right') ? `1.5px solid` : 'none',
  };

  const isLeft = position.includes('left');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 0.8, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      style={{ ...styleObj }}
      className="absolute pointer-events-none select-none z-15 flex flex-col gap-1"
    >
      <div 
        style={borderStyle}
        className={`${borderCol} opacity-65`}
      />

    </motion.div>
  );
};


/**
 * TechSectionBoundary
 * Visual structural line divider that draws itself to partition sections.
 * Features an accent block and crosshair.
 */
export const TechSectionBoundary: React.FC<{
  color?: 'blue' | 'orange' | 'mixed';
  title?: string;
  delay?: number;
}> = ({
  color = 'mixed',
  title = 'SECTION_DIVIDER',
  delay = 0.1
}) => {
  const lineColorClass = color === 'blue' 
    ? 'from-primary/0 via-primary/40 to-primary/0' 
    : color === 'orange' 
    ? 'from-secondary/0 via-secondary/40 to-secondary/0' 
    : 'from-primary/0 via-secondary/40 to-primary/0';

  const textColClass = color === 'blue' 
    ? 'text-primary' 
    : color === 'orange' 
    ? 'text-secondary' 
    : 'text-primary';

  return (
    <div className="w-full relative py-6 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      <div className="w-full max-w-7xl px-6 relative flex items-center justify-center">
        {/* Draw boundary line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay, ease: "easeInOut" }}
          className={`h-[1px] w-full bg-gradient-to-r ${lineColorClass}`}
        />

        {/* Tech badge overlay */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.4 }}
          className="absolute bg-surface-1 dark:bg-surface-inverse p-1.5 flex items-center justify-center border border-border-main rounded-full shadow-xs"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};
