import React, { useState } from 'react'
import type { TaskStatus } from '../../types/task'
import { useTaskStore } from '../../hooks/useTaskStore'
import { KanbanColumn } from './KanbanColumn'
import { useKanbanDrag } from './useKanbanDrag'
import {
  Circle,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  X,
  SlidersHorizontal,
} from 'lucide-react'

export const KanbanBoard: React.FC = () => {
  const { tasks, addTask, moveTask, deleteTask } = useTaskStore()

  const {
    draggedTaskId,
    dragOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useKanbanDrag(moveTask)

  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  // Modal state for creating new tasks
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalStatus, setModalStatus] = useState<TaskStatus>('todo')
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium')

  const handleOpenModal = (status: TaskStatus = 'todo') => {
    setModalStatus(status)
    setNewTitle('')
    setNewDescription('')
    setNewPriority('medium')
    setIsModalOpen(true)
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    addTask({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      status: modalStatus,
      priority: newPriority,
    })

    setIsModalOpen(false)
  }

  // Filter tasks based on search query and priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter

    return matchesSearch && matchesPriority
  })

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo')
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in-progress')
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed')

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search bar */}
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-4 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-1.5 text-sm">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-transparent text-zinc-300 text-xs focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-zinc-900">All Priorities</option>
            <option value="high" className="bg-zinc-900">High</option>
            <option value="medium" className="bg-zinc-900">Medium</option>
            <option value="low" className="bg-zinc-900">Low</option>
          </select>
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => handleOpenModal('todo')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95 ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-w-0 overflow-x-auto">
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={todoTasks}
          draggedTaskId={draggedTaskId}
          dragOverColumn={dragOverColumn}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDeleteTask={deleteTask}
          onStatusChange={moveTask}
          onOpenNewTaskModal={handleOpenModal}
          icon={<Circle className="w-4 h-4 text-zinc-400" />}
        />

        <KanbanColumn
          title="In Progress"
          status="in-progress"
          tasks={inProgressTasks}
          draggedTaskId={draggedTaskId}
          dragOverColumn={dragOverColumn}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDeleteTask={deleteTask}
          onStatusChange={moveTask}
          onOpenNewTaskModal={handleOpenModal}
          icon={<Clock className="w-4 h-4 text-amber-400" />}
        />

        <KanbanColumn
          title="Completed"
          status="completed"
          tasks={completedTasks}
          draggedTaskId={draggedTaskId}
          dragOverColumn={dragOverColumn}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDeleteTask={deleteTask}
          onStatusChange={moveTask}
          onOpenNewTaskModal={handleOpenModal}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        />
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-zinc-100">Create New Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement authentication flow"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Description <span className="text-zinc-600">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Add details about this task..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Status</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as TaskStatus)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
