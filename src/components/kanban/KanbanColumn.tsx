import React from 'react'
import type { Task, TaskStatus } from '../../types/task'
import { KanbanCard } from './KanbanCard'
import { Plus } from 'lucide-react'

interface KanbanColumnProps {
  title: string
  status: TaskStatus
  tasks: Task[]
  draggedTaskId: string | null
  dragOverColumn: TaskStatus | null
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, status: TaskStatus) => void
  onDragLeave: (e: React.DragEvent, status: TaskStatus) => void
  onDrop: (e: React.DragEvent, status: TaskStatus) => void
  onDeleteTask: (taskId: string) => void
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
  onOpenNewTaskModal?: (status: TaskStatus) => void
  icon?: React.ReactNode
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  draggedTaskId,
  dragOverColumn,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onDeleteTask,
  onStatusChange,
  onOpenNewTaskModal,
  icon,
}) => {
  const isDragOver = dragOverColumn === status

  return (
    <div
      onDragOver={(e) => onDragOver(e, status)}
      onDragLeave={(e) => onDragLeave(e, status)}
      onDrop={(e) => onDrop(e, status)}
      className={`flex flex-col h-full bg-zinc-950/60 border rounded-2xl transition-all duration-200 ${
        isDragOver
          ? 'border-indigo-500/80 bg-indigo-950/10 ring-2 ring-indigo-500/20'
          : 'border-zinc-800/80 hover:border-zinc-700/80'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          {icon}
          <h3 className="font-semibold text-zinc-200 text-sm">{title}</h3>
          <span className="px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 text-xs font-medium">
            {tasks.length}
          </span>
        </div>

        {onOpenNewTaskModal && (
          <button
            onClick={() => onOpenNewTaskModal(status)}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            title={`Add task to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Cards container */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[320px]">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-zinc-900 rounded-xl text-center p-6 text-zinc-600">
            <p className="text-xs">No tasks in {title}</p>
            <p className="text-[11px] mt-1 opacity-60">Drag tasks here or create new ones</p>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              isDragging={draggedTaskId === task.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  )
}
