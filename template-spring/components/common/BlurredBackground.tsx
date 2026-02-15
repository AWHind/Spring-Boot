'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface BlurredBackgroundProps {
  imageUrl?: string;
  fallbackGradient?: string;
  blurAmount?: number;
  overlayOpacity?: number;
  pageType?: 'home' | 'login' | 'register';
}

export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({
  imageUrl,
  fallbackGradient = 'from-primary/5 via-background to-secondary/5',
  blurAmount = 30,
  overlayOpacity = 0.92,
  pageType = 'home'
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Professional restaurant images from Unsplash
  const defaultImages = {
    home: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80&auto=format&fit=crop',
    login: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80&auto=format&fit=crop',
    register: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80&auto=format&fit=crop'
  };

  const finalImageUrl = imageUrl || defaultImages[pageType];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Professional Restaurant Image */}
      {!imageError && (
        <div className="absolute inset-0">
          <Image
            src={finalImageUrl}
            alt="Restaurant background"
            fill
            className={`object-cover transition-opacity duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              filter: `blur(${blurAmount}px)`,
              transform: 'scale(1.1)'
            }}
            quality={85}
            priority
            sizes="100vw"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            unoptimized={finalImageUrl.startsWith('http')}
          />
        </div>
      )}

      {/* Fallback Gradient - Shows while loading or on error */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient} ${
          imageError || !imageLoaded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-700`}
      />

      {/* Overlay for readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-background transition-opacity duration-300"
        style={{ opacity: overlayOpacity }}
      />

      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};

