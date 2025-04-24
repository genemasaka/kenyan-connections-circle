
import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({
  variant = 'default',
  size = 'md',
  className
}) => {
  const textColorClass = variant === 'light' 
    ? 'text-white' 
    : variant === 'dark' 
      ? 'text-gray-900' 
      : 'text-primary';

  const iconColorClass = variant === 'light'
    ? 'text-white'
    : variant === 'dark'
      ? 'text-gray-900'
      : 'text-secondary';
  
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Heart 
        size={iconSizes[size]} 
        className={cn('fill-current', iconColorClass)}
      />
      <span className={cn('font-display font-bold tracking-tight', sizeClasses[size], textColorClass)}>
        LoveConnect
      </span>
    </div>
  );
};

export default AppLogo;
