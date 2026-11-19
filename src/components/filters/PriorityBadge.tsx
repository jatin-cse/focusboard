import React from 'react';
import type { TaskPriority } from '../../core/types';

export interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const getPriorityStyles = (p: TaskPriority): string => {
    switch (p) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50';
      case 'low':
        return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-medium'
      : 'px-2.5 py-1 text-xs font-semibold';

  const formatPriority = (p: TaskPriority): string => {
    return p.charAt(0).toUpperCase() + p.slice(1);
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${getPriorityStyles(
        priority
      )} ${sizeClasses}`}
      role="status"
      aria-label={`Priority: ${priority}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          priority === 'high'
            ? 'bg-red-500'
            : priority === 'medium'
            ? 'bg-amber-500'
            : 'bg-slate-400'
        }`}
      />
      {formatPriority(priority)}
    </span>
  );
};
