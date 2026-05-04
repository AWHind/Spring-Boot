'use client';

import React from 'react';

interface ImagePlaceholderProps {
  category: 'appetizers' | 'main' | 'desserts' | 'beverages' | 'specials';
  dishName: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ category, dishName }) => {
  // Category-specific configurations with professional SVG icons
  const categoryConfig = {
    appetizers: {
      bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20',
      accentColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100/50 dark:bg-amber-950/30',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    main: {
      bgGradient: 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20',
      accentColor: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100/50 dark:bg-red-950/30',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    desserts: {
      bgGradient: 'from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20',
      accentColor: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100/50 dark:bg-pink-950/30',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    beverages: {
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      accentColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100/50 dark:bg-blue-950/30',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    specials: {
      bgGradient: 'from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20',
      accentColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100/50 dark:bg-purple-950/30',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  };

  const config = categoryConfig[category];

  // Direct icon-based placeholder (no image loading attempt)
  return (
    <div className={`w-full h-40 bg-gradient-to-br ${config.bgGradient} flex flex-col items-center justify-center border-b border-border relative overflow-hidden`}>
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-2 right-4 w-16 h-16 rounded-full" style={{ backgroundColor: 'currentColor' }}></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full" style={{ backgroundColor: 'currentColor' }}></div>
      </div>
      
      {/* Main Icon */}
      <div className={`${config.accentColor} z-10 mb-2`}>
        {config.icon}
      </div>
      
      {/* Dish Name Preview */}
      <p className="text-xs text-muted-foreground text-center px-3 line-clamp-2 font-medium z-10 max-w-full">
        {dishName}
      </p>
    </div>
  );
};
