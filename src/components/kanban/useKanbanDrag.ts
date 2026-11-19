import { useState, useCallback } from 'react'
import type { TaskStatus } from '../../types/task'

export function useKanbanDrag(onMoveTask: (taskId: string, targetStatus: TaskStatus) => void) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, columnStatus: TaskStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColumn !== columnStatus) {
      setDragOverColumn(columnStatus)
    }
  }, [dragOverColumn])

  const handleDragLeave = useCallback((e: React.DragEvent, columnStatus: TaskStatus) => {
    e.preventDefault()
    // Only clear if leaving the column itself, not entering a child element
    const relatedTarget = e.relatedTarget as HTMLElement | null
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      if (dragOverColumn === columnStatus) {
        setDragOverColumn(null)
      }
    }
  }, [dragOverColumn])

  const handleDrop = useCallback((e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault()
    setDragOverColumn(null)
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId
    if (taskId) {
      onMoveTask(taskId, targetStatus)
    }
    setDraggedTaskId(null)
  }, [draggedTaskId, onMoveTask])

  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null)
    setDragOverColumn(null)
  }, [])

  return {
    draggedTaskId,
    dragOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  }
}
