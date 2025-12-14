import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-lg',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-xl',
    elevated: 'bg-white shadow-2xl border-0'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${clickableClasses} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

// Card Header
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}> = ({ children, className = '', divider = true }) => (
  <div className={`${divider ? 'border-b border-gray-100 pb-4 mb-6' : ''} ${className}`}>
    {children}
  </div>
);

// Card Title
export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ children, className = '', size = 'lg' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <h3 className={`font-bold text-gray-900 ${sizeClasses[size]} ${className}`}>
      {children}
    </h3>
  );
};

// Card Content
export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`text-gray-600 ${className}`}>
    {children}
  </div>
);

// Card Footer
export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}> = ({ children, className = '', divider = true }) => (
  <div className={`${divider ? 'border-t border-gray-100 pt-4 mt-6' : ''} ${className}`}>
    {children}
  </div>
);

// Stats Card
export const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  gradient?: string;
  className?: string;
}> = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral', 
  gradient = 'from-orange to-orange-dark',
  className = '' 
}) => {
  const changeClasses = {
    positive: 'text-dark-slate',
    negative: 'text-orange',
    neutral: 'text-gray-600'
  };

  return (
    <Card variant="glass" hover className={`group relative overflow-hidden ${className}`}>
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 group-hover:text-white/80 transition-colors">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 group-hover:text-white transition-colors">
            {value}
          </p>
          {change && (
            <p className={`text-sm ${changeClasses[changeType]} group-hover:text-white/90 transition-colors`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-4 rounded-2xl bg-gray-100 group-hover:bg-white/20 transition-colors">
          <div className="text-gray-600 group-hover:text-white transition-colors">
            {icon}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
    </Card>
  );
};

// Feature Card
export const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  gradient?: string;
  className?: string;
}> = ({ 
  icon, 
  title, 
  description, 
  action, 
  gradient = 'from-blue-500 to-purple-600',
  className = '' 
}) => (
  <Card variant="glass" hover className={`group text-center ${className}`}>
    <div className="space-y-4">
      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      {action && (
        <div className="pt-2">
          {action}
        </div>
      )}
    </div>
  </Card>
);

// Image Card
export const ImageCard: React.FC<{
  image: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ image, title, description, action, className = '' }) => (
  <Card padding="none" hover className={`overflow-hidden ${className}`}>
    <div className="aspect-w-16 aspect-h-9">
      <img 
        src={image} 
        alt={title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      {action && action}
    </div>
  </Card>
);
