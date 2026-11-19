import type { Task } from './types';

const STORAGE_KEY = 'focusboard_tasks';

export const storage = {
  saveTasks: (tasks: Task[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks }));
    } catch {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks }));
      } catch {
        // Storage failed (quota or private mode restrictions)
      }
    }
  },

  loadTasks: (): Task[] => {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        raw = sessionStorage.getItem(STORAGE_KEY);
      }
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.tasks)) {
        return parsed.tasks;
      }
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  },
};
