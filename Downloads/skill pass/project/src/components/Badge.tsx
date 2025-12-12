import { Award } from 'lucide-react';

interface BadgeProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({ name, color, size = 'md' }: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1.5px solid ${color}`,
      }}
    >
      <Award className={iconSizes[size]} />
      <span>{name}</span>
    </div>
  );
}
