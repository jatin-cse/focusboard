import { type HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  secondary: 'bg-gray-700/50 text-gray-300 border border-gray-600',
  destructive: 'bg-red-500/20 text-red-300 border border-red-500/30',
  outline: 'border border-gray-600 text-gray-300',
};

export default function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${variantClasses[variant]} ${className || ''}`}
      {...props}
    />
  );
}

export function PriorityBadge({ priority }: { priority: 'low' | 'medium' | 'high' }) {
  const config = {
    low: { label: 'Low', classes: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    medium: { label: 'Medium', classes: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    high: { label: 'High', classes: 'bg-red-500/20 text-red-300 border-red-500/30' },
  };
  const { label, classes } = config[priority];
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}>{label}</span>;
}