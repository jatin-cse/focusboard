export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'in-progress'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  createdAt: number
  updatedAt: number
  dueDate?: string
}
