import React, { useEffect, useState } from 'react';
import { Handshake } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Start fade out animation
          setTimeout(() => {
            setFadeOut(true);
            // Complete loading after fade out
            setTimeout(() => {
              onLoadingComplete();
            }, 500);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-ping-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo with Animation */}
        <div className="relative">
          {/* Outer Ring - Rotating */}
          <div className="absolute inset-0 w-32 h-32 border-4 border-white/30 rounded-full animate-spin-slow"></div>
          
          {/* Middle Ring - Counter Rotating */}
          <div className="absolute inset-2 w-28 h-28 border-4 border-white/20 border-t-white/60 rounded-full animate-spin-reverse"></div>
          
          {/* Logo Container */}
          <div className="relative w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
            {/* Icon with Bounce Animation */}
            <div className="animate-bounce-slow">
              <Handshake size={64} className="text-orange-600" strokeWidth={2} />
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent rounded-3xl"></div>
          </div>

          {/* Pulse Rings */}
          <div className="absolute inset-0 w-32 h-32 bg-white/20 rounded-full animate-ping"></div>
        </div>

        {/* Brand Name with Slide Up Animation */}
        <div className="text-center space-y-2 animate-slide-up">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg tracking-tight">
            SmartLend
          </h1>
          <p className="text-white/90 text-lg font-medium tracking-wide">
            Asset Management System
          </p>
          <div className="flex items-center justify-center space-x-2 text-white/70 text-sm">
            <span>Developed by</span>
            <span className="font-bold text-white">NUG</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 space-y-2 animate-fade-in">
          {/* Progress Bar Container */}
          <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-white to-orange-200 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Effect */}
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          {/* Progress Text */}
          <div className="flex justify-between text-white/80 text-xs font-medium">
            <span>Loading...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-2 animate-fade-in">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="text-white/50 text-xs animate-pulse">
          Preparing your workspace...
        </div>
      </div>
    </div>
  );
};

