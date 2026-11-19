import React from 'react';
import type { TaskStatus, TaskPriority } from '../../core/types';

export interface FilterBarProps {
  active: TaskStatus | 'all';
  onChange: (status: TaskStatus | 'all') => void;
  priorityFilter?: TaskPriority | 'all';
  onPriorityChange?: (priority: TaskPriority | 'all') => void;
  totalCount?: number;
  filteredCount?: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  active,
  onChange,
  priorityFilter = 'all',
  onPriorityChange,
  totalCount,
  filteredCount,
}) => {
  const statuses: { label: string; value: TaskStatus | 'all' }[] = [
    { label: 'All Tasks', value: 'all' },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
  ];

  const priorities: { label: string; value: TaskPriority | 'all' }[] = [
    { label: 'All Priorities', value: 'all' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-2">
      {/* Status Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Task status filters">
        {statuses.map((s) => {
          const isActive = active === s.value;
          return (
            <button
              key={s.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(s.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Priority Filter & Counter */}
      <div className="flex items-center gap-3">
        {onPriorityChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              Priority:
            </span>
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              aria-label="Filter by priority"
            >
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {totalCount !== undefined && filteredCount !== undefined && (
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredCount}</span> of {totalCount}
          </div>
        )}
      </div>
    </div>
  );
};
