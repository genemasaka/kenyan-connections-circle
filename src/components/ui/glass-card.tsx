
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark' | 'light';
  intensity?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, variant = 'default', intensity = 'medium', ...props }, ref) => {
    const baseClasses = 'rounded-xl backdrop-blur-md border shadow-soft overflow-hidden';
    
    const intensityClasses = {
      low: 'backdrop-blur-sm',
      medium: 'backdrop-blur-md',
      high: 'backdrop-blur-lg',
    };
    
    const variantClasses = {
      default: 'bg-white/80 border-white/20',
      dark: 'bg-black/40 border-white/10',
      light: 'bg-white/20 border-white/30',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          intensityClasses[intensity],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };
