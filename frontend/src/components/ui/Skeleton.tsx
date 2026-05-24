import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'circle' | 'rect';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'line' 
}) => {
  const baseClass = "bg-cream-100 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";
  
  const variants = {
    line: "h-4 rounded-sm",
    circle: "rounded-full",
    rect: "rounded-md",
  };

  return (
    <div className={`${baseClass} ${variants[variant]} ${className}`} />
  );
};
