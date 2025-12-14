import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  gradient?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  gradient = true,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: gradient
      ? 'bg-orange hover:bg-orange-dark text-white shadow-lg hover:shadow-xl focus:ring-orange'
      : 'bg-orange hover:bg-orange-dark text-white shadow-lg hover:shadow-xl focus:ring-orange',
    secondary: gradient
      ? 'bg-dark-slate hover:bg-dark-slate-dark text-white shadow-md hover:shadow-lg focus:ring-dark-slate'
      : 'bg-dark-slate hover:bg-dark-slate-dark text-white shadow-md hover:shadow-lg focus:ring-dark-slate',
    success: gradient
      ? 'bg-dark-slate hover:bg-dark-slate-dark text-white shadow-lg hover:shadow-xl focus:ring-dark-slate'
      : 'bg-dark-slate hover:bg-dark-slate-dark text-white shadow-lg hover:shadow-xl focus:ring-dark-slate',
    danger: gradient
      ? 'bg-orange hover:bg-orange-dark text-white shadow-lg hover:shadow-xl focus:ring-orange'
      : 'bg-orange hover:bg-orange-dark text-white shadow-lg hover:shadow-xl focus:ring-orange',
    warning: gradient
      ? 'bg-orange hover:bg-orange-dark text-white shadow-lg hover:shadow-xl focus:ring-orange'
      : 'bg-orange hover:bg-orange-dark text-white shadow-lg hover:shadow-xl focus:ring-orange',
    ghost: 'bg-transparent hover:bg-flash-white text-dark-slate hover:text-orange focus:ring-dark-slate',
    outline: 'border-2 border-gray-300 hover:border-gray-400 bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900 focus:ring-gray-500'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner 
          size="sm" 
          variant={variant === 'primary' || variant === 'success' || variant === 'danger' || variant === 'warning' ? 'white' : 'primary'} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

// Icon button variant
export const IconButton: React.FC<{
  icon: React.ReactNode;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: string;
}> = ({ 
  icon, 
  variant = 'ghost', 
  size = 'md', 
  className = '', 
  tooltip,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
    xl: 'p-4'
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
      title={tooltip}
      {...props}
    >
      {icon}
    </button>
  );
};

// Floating Action Button
export const FloatingActionButton: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}> = ({ 
  icon, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-orange hover:bg-orange-dark shadow-orange/25',
    secondary: 'bg-dark-slate hover:bg-dark-slate-dark shadow-dark-slate/25',
    success: 'bg-dark-slate hover:bg-dark-slate-dark shadow-dark-slate/25',
    danger: 'bg-orange hover:bg-orange-dark shadow-orange/25'
  };

  return (
    <button
      className={`fixed bottom-6 right-6 w-14 h-14 ${variantClasses[variant]} text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 z-50 ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
