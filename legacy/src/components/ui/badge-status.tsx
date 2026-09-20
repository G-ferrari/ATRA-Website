import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';
import { Icon } from '@iconify/react';

export interface StatusBadgeProps {
  label: string;
  variant?: 'online' | 'beta' | 'primary' | 'secondary' | 'neutral' | 'tech';
  pulse?: boolean;
  size?: 'sm' | 'md';
  icon?: string | React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'primary',
  pulse = false,
  size = 'md',
  icon,
  className,
}) => {
  const variantStyles = {
    online: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:text-emerald-400',
    beta: 'bg-primary/10 text-primary border-primary/20',
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    neutral: 'bg-surface-3 dark:bg-[#222631] text-text-muted border-border-main',
    tech: 'bg-surface-2 dark:bg-[#181b22] text-text-main border-border-main hover:border-primary/40',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-[6px] gap-1',
    md: 'text-xs px-2.5 py-1 rounded-[6px] gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold border tracking-wide transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            variant === 'online' ? "bg-emerald-400" : variant === 'secondary' ? "bg-secondary" : "bg-primary"
          )}></span>
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            variant === 'online' ? "bg-emerald-500" : variant === 'secondary' ? "bg-secondary" : "bg-primary"
          )}></span>
        </span>
      )}

      {typeof icon === 'string' ? (
        <Icon icon={icon} width={size === 'sm' ? 12 : 14} height={size === 'sm' ? 12 : 14} />
      ) : (
        icon
      )}

      <span>{label}</span>
    </span>
  );
};

export interface MetricChipProps {
  value?: string;
  label: string;
  trend?: string;
  variant?: 'primary' | 'secondary' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const MetricChip: React.FC<MetricChipProps> = ({
  value,
  label,
  trend,
  variant = 'neutral',
  size = 'md',
  className,
}) => {
  return (
    <div className={cn(
      "inline-flex items-center rounded-[6px] border border-border-main shadow-xs",
      size === 'sm' ? "gap-1.5 px-2.5 py-1 text-[10px]" : "gap-2.5 px-3 py-1.5 text-xs",
      variant === 'primary' 
        ? "bg-primary/10 text-primary border-primary/20" 
        : variant === 'secondary'
        ? "bg-secondary/10 text-secondary border-secondary/20"
        : "bg-surface-2 dark:bg-[#181b22] text-text-muted",
      className
    )}>
      {value && <span className="font-extrabold text-primary font-mono">{value}</span>}
      <span className="font-medium text-text-muted">{label}</span>
      {trend && (
        <span className="text-[10px] font-bold text-emerald-500 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-[6px]">
          {trend} <ArrowUpRight size={10} />
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
