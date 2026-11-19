import { useState, useMemo } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../../core/types';

export function useTaskFilters(
  tasks: Task[],
  initialQuery: string = '',
  initialStatus: TaskStatus | 'all' = 'all',
  initialPriority: TaskPriority | 'all' = 'all'
): {
  query: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  filteredTasks: Task[];
  setQuery: (q: string) => void;
  setStatus: (s: TaskStatus | 'all') => void;
  setPriority: (p: TaskPriority | 'all') => void;
} {
  const [query, setQuery] = useState<string>(initialQuery);
  const [status, setStatus] = useState<TaskStatus | 'all'>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority | 'all'>(initialPriority);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by status
      if (status !== 'all' && task.status !== status) {
        return false;
      }

      // Filter by priority
      if (priority !== 'all' && task.priority !== priority) {
        return false;
      }

      // Filter by search query (title, description, tags)
      if (query && query.trim() !== '') {
        const q = query.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description.toLowerCase().includes(q);
        const matchesTags =
          Array.isArray(task.tags) &&
          task.tags.some((tag) => tag.toLowerCase().includes(q));

        if (!matchesTitle && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, query, status, priority]);

  return {
    query,
    status,
    priority,
    filteredTasks,
    setQuery,
    setStatus,
    setPriority,
  };
}
