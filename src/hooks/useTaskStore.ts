import { useState, useCallback, useEffect } from 'react'
import type { Task, TaskStatus } from '../types/task'

const STORAGE_KEY = 'focusboard_tasks_v1'

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design system review',
    description: 'Ensure Tailwind v4 colors and typography match brand guidelines across all views.',
    status: 'todo',
    priority: 'high',
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'task-2',
    title: 'Implement Kanban board',
    description: 'Build KanbanBoard, KanbanColumn, KanbanCard, and useKanbanDrag with drag-and-drop support.',
    status: 'in-progress',
    priority: 'high',
    createdAt: Date.now() - 3600000 * 3,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'task-3',
    title: 'Project initialization',
    description: 'Set up Vite, React 19, TypeScript, and Tailwind CSS v4.',
    status: 'completed',
    priority: 'medium',
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 12,
  },
]

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as Task[]
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e)
    }
    return INITIAL_TASKS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e)
    }
  }, [tasks])

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setTasks((prev) => [newTask, ...prev])
    return newTask
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
              updatedAt: Date.now(),
            }
          : t
      )
    )
  }, [])

  const moveTask = useCallback((id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: newStatus,
              updatedAt: Date.now(),
            }
          : t
      )
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    tasks,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
  }
}
