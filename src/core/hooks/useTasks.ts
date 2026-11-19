import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskFormData, TaskStatus } from '../types';

// Ambient declaration in case Agent D's storage.ts is not yet merged in this worktree
declare module '../storage' {
  import type { Task } from '../types';
  export const storage: {
    saveTasks: (tasks: Task[]) => void;
    loadTasks: () => Task[];
  };
}

import { storage } from '../storage';

// Fallback storage if module resolution fails or storage is not initialized
const FALLBACK_KEY = 'focusboard_tasks';
const fallbackStorage = {
  saveTasks: (tasks: Task[]) => {
    try {
      localStorage.setItem(FALLBACK_KEY, JSON.stringify({ tasks }));
    } catch {
      try {
        sessionStorage.setItem(FALLBACK_KEY, JSON.stringify({ tasks }));
      } catch {}
    }
  },
  loadTasks: (): Task[] => {
    try {
      const raw = localStorage.getItem(FALLBACK_KEY) || sessionStorage.getItem(FALLBACK_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return parsed.tasks ?? [];
    } catch {
      return [];
    }
  }
};

const activeStorage = typeof storage !== 'undefined' && storage.loadTasks ? storage : fallbackStorage;

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      return activeStorage.loadTasks();
    } catch {
      return [];
    }
  });

  // Sync with storage on mount
  useEffect(() => {
    try {
      const loaded = activeStorage.loadTasks();
      if (loaded && Array.isArray(loaded)) {
        setTasks(loaded);
      }
    } catch {}
  }, []);

  const addTask = useCallback((data: TaskFormData) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      tags: [...(data.tags || [])],
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => {
      const next = [newTask, ...prev];
      try {
        activeStorage.saveTasks(next);
      } catch {}
      return next;
    });
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<TaskFormData & { status: TaskStatus }>) => {
    const now = new Date().toISOString();
    setTasks(prev => {
      const next = prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            ...patch,
            updatedAt: now,
          };
        }
        return t;
      });
      try {
        activeStorage.saveTasks(next);
      } catch {}
      return next;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const next = prev.filter(t => t.id !== id);
      try {
        activeStorage.saveTasks(next);
      } catch {}
      return next;
    });
  }, []);

  const getTask = useCallback((id: string) => {
    return tasks.find(t => t.id === id);
  }, [tasks]);

  const statusCounts = useCallback((): Record<TaskStatus, number> => {
    const counts: Record<TaskStatus, number> = { todo: 0, in_progress: 0, completed: 0 };
    tasks.forEach(t => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      }
    });
    return counts;
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTask,
    statusCounts,
  };
}
