import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';

export interface TabOption {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

export interface TabFilterProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const TabFilter: React.FC<TabFilterProps> = ({
  options,
  activeId,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 p-1.5 rounded-[6px] bg-surface-3/70 dark:bg-[#222631]/70 border border-border-main backdrop-blur-sm",
        className
      )}
    >
      {options.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-3.5 py-1.5 rounded-[6px] text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 select-none",
              isActive
                ? "text-white"
                : "text-text-muted hover:text-text-main hover:bg-surface-2/50 dark:hover:bg-[#181b22]/50"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterTab"
                className="absolute inset-0 bg-primary rounded-[6px] shadow-sm shadow-primary/30 -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {tab.icon && (
              <Icon
                icon={tab.icon}
                width={14}
                height={14}
                className={isActive ? "text-white" : "text-text-muted"}
              />
            )}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-[6px] font-mono",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-surface-2 dark:bg-[#181b22] text-text-muted"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabFilter;
