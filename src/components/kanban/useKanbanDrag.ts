import { useState, useCallback } from 'react';
import type { DragEvent } from 'react';
import type { TaskStatus } from '../../core/types';

export function useKanbanDrag(
  onMoveTask: (taskId: string, targetStatus: TaskStatus) => void
) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = useCallback((e: DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent, status: TaskStatus) => {
    const relatedTarget = e.relatedTarget as Node | null;

    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(current => current === status ? null : current);
    }
  }, []);

  const handleDrop = useCallback((
    e: DragEvent,
    targetStatus: TaskStatus
  ) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;

    if (taskId) {
      onMoveTask(taskId, targetStatus);
    }

    setDraggedTaskId(null);
    setDragOverColumn(null);
  }, [draggedTaskId, onMoveTask]);

  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  }, []);

  return {
    draggedTaskId,
    dragOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
}
