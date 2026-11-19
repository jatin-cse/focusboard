import { useState, useCallback } from 'react';
import type { Task, TaskFormData, TaskStatus } from '../types';
import { storage } from '../storage';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const loaded = storage.loadTasks();
      return Array.isArray(loaded) ? loaded : [];
    } catch {
      return [];
    }
  });

  const persist = (next: Task[]) => {
    try {
      storage.saveTasks(next);
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  const addTask = useCallback((data: TaskFormData) => {
    const now = new Date().toISOString();

    const newTask: Task = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
      ...data,
      tags: [...(data.tags ?? [])],
      createdAt: now,
      updatedAt: now,
    };

    setTasks(prev => {
      const next = [newTask, ...prev];
      persist(next);
      return next;
    });
  }, []);

  const updateTask = useCallback((
    id: string,
    patch: Partial<TaskFormData>
  ) => {
    setTasks(prev => {
      const next = prev.map(task =>
        task.id === id
          ? { ...task, ...patch, updatedAt: new Date().toISOString() }
          : task
      );

      persist(next);
      return next;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const next = prev.filter(task => task.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const getTask = useCallback(
    (id: string) => tasks.find(task => task.id === id),
    [tasks]
  );

  const statusCounts = useCallback((): Record<TaskStatus, number> => {
    const counts: Record<TaskStatus, number> = {
      todo: 0,
      in_progress: 0,
      completed: 0,
    };

    tasks.forEach(task => {
      counts[task.status]++;
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