
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'purple' | 'dark';
  children: React.ReactNode;
  className?: string;
  showBokeh?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = 'purple',
  children,
  className,
  showBokeh = true
}) => {
  // Generate random bokeh lights
  const generateBokehLights = (count: number) => {
    const lights = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 30 + 10; // Random size between 10-40px
      const positionX = Math.random() * 100; // Random X position 0-100%
      const positionY = Math.random() * 100; // Random Y position 0-100%
      const opacity = Math.random() * 0.4 + 0.1; // Random opacity between 0.1-0.5
      const animationDelay = Math.random() * 7; // Random animation delay 0-7s
      
      lights.push(
        <div
          key={i}
          className="absolute rounded-full blur-xl animate-pulse-slow"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${positionX}%`,
            top: `${positionY}%`,
            opacity: opacity,
            background: variant === 'purple' 
              ? `rgba(142, 45, 226, ${opacity})` 
              : variant === 'dark'
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(142, 91, 255, ${opacity})`,
            animationDelay: `${animationDelay}s`,
          }}
        />
      );
    }
    return lights;
  };

  const bgClasses = {
    default: 'bg-background',
    purple: 'bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600',
    dark: 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900',
  };

  return (
    <div className={cn('relative min-h-screen flex flex-col overflow-hidden', bgClasses[variant], className)}>
      {/* Bokeh effect */}
      {showBokeh && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {generateBokehLights(15)}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
