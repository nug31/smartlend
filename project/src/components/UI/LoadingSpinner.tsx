import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  text,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variantClasses = {
    primary: 'border-blue-500',
    secondary: 'border-gray-500',
    white: 'border-white'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Main spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin`}>
          <div className={`absolute inset-0 ${sizeClasses[size]} border-4 ${variantClasses[variant]} border-t-transparent rounded-full animate-spin`}></div>
        </div>
        
        {/* Glow effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} ${variantClasses[variant]} rounded-full blur-sm opacity-20 animate-pulse`}></div>
      </div>

      {/* Floating dots */}
      <div className="flex space-x-2">
        <div className={`w-2 h-2 ${variant === 'white' ? 'bg-white' : 'bg-blue-500'} rounded-full animate-bounce`}></div>
        <div className={`w-2 h-2 ${variant === 'white' ? 'bg-white' : 'bg-blue-500'} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
        <div className={`w-2 h-2 ${variant === 'white' ? 'bg-white' : 'bg-blue-500'} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
      </div>

      {text && (
        <p className={`text-sm font-medium ${variant === 'white' ? 'text-white' : 'text-gray-600'} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeleton loader component
export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded-lg ${className}`} 
       style={{ animation: 'shimmer 2s infinite linear' }}>
  </div>
);

// Card skeleton
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <SkeletonLoader className="w-12 h-12 rounded-2xl" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader className="h-4 w-3/4" />
        <SkeletonLoader className="h-3 w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <SkeletonLoader className="h-3 w-full" />
      <SkeletonLoader className="h-3 w-5/6" />
      <SkeletonLoader className="h-3 w-4/6" />
    </div>
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-100">
      <SkeletonLoader className="h-6 w-48" />
    </div>
    <div className="p-6 space-y-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <SkeletonLoader 
              key={colIndex} 
              className={`h-4 ${colIndex === 0 ? 'w-1/4' : colIndex === 1 ? 'w-1/3' : 'w-1/6'}`} 
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);
