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
      style={{ backgroundColor: '#E9631A' }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
        ></div>
        <div
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo with Animation */}
        <div className="relative">
          {/* Outer Ring - Rotating */}
          <div
            style={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}
            className="absolute inset-0 w-32 h-32 border-4 rounded-full animate-spin-slow"
          ></div>

          {/* Middle Ring - Counter Rotating */}
          <div
            style={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderTopColor: 'rgba(255, 255, 255, 0.8)'
            }}
            className="absolute inset-2 w-28 h-28 border-4 rounded-full animate-spin-reverse"
          ></div>

          {/* Logo Container */}
          <div
            style={{ backgroundColor: '#FFFFFF' }}
            className="relative w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl"
          >
            {/* Icon with Bounce Animation */}
            <div className="animate-bounce-slow">
              <Handshake size={64} style={{ color: '#E9631A' }} strokeWidth={2} />
            </div>
          </div>

          {/* Pulse Rings */}
          <div
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            className="absolute inset-0 w-32 h-32 rounded-full animate-ping"
          ></div>
        </div>

        {/* Brand Name with Slide Up Animation */}
        <div className="text-center space-y-2 animate-slide-up">
          <h1
            style={{ color: '#FFFFFF' }}
            className="text-5xl font-bold drop-shadow-lg tracking-tight"
          >
            SmartLend
          </h1>
          <p
            style={{ color: '#FFFFFF' }}
            className="text-lg font-medium tracking-wide opacity-90"
          >
            Asset Management System
          </p>
          <div
            style={{ color: '#FFFFFF' }}
            className="flex items-center justify-center space-x-2 text-sm opacity-80"
          >
            <span>Developed by</span>
            <span className="font-bold">NUG</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 space-y-2 animate-fade-in">
          {/* Progress Bar Container */}
          <div
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
            className="h-2 rounded-full overflow-hidden"
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                width: `${progress}%`
              }}
              className="h-full rounded-full transition-all duration-300 ease-out shadow-lg"
            >
            </div>
          </div>

          {/* Progress Text */}
          <div
            style={{ color: '#FFFFFF' }}
            className="flex justify-between text-xs font-medium opacity-90"
          >
            <span>Loading...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-2 animate-fade-in">
          <div
            style={{ backgroundColor: '#FFFFFF' }}
            className="w-3 h-3 rounded-full animate-bounce"
          ></div>
          <div
            style={{ backgroundColor: '#FFFFFF', animationDelay: '150ms' }}
            className="w-3 h-3 rounded-full animate-bounce"
          ></div>
          <div
            style={{ backgroundColor: '#FFFFFF', animationDelay: '300ms' }}
            className="w-3 h-3 rounded-full animate-bounce"
          ></div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div
          style={{ color: '#FFFFFF' }}
          className="text-xs animate-pulse opacity-60"
        >
          Preparing your workspace...
        </div>
      </div>
    </div>
  );
};

