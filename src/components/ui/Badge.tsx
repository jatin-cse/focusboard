import { type HTMLAttributes } from 'react';
import type { TaskPriority } from '../../core/types';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  secondary: 'bg-gray-800 text-gray-300 border border-gray-700',
  destructive: 'bg-red-500/20 text-red-300 border border-red-500/30',
  outline: 'border border-gray-700 text-gray-300',
};

export default function Badge({
  variant = 'default',
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config: Record<TaskPriority, { label: string; classes: string }> = {
    low: {
      label: 'Low',
      classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    medium: {
      label: 'Medium',
      classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    high: {
      label: 'High',
      classes: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    },
  };

  const { label, classes } = config[priority];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
