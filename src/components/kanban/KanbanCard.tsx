import React from 'react';
import type { Task } from '../../core/types';
import { Clock, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';

interface KanbanCardProps {
  task: Task;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: () => void;
  onDelete: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
}

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  low: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  medium: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
  high: 'bg-rose-950/40 text-rose-300 border-rose-800/50',
};

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  isDragging = false,
  onDragStart,
  onDragEnd,
  onDelete,
  onStatusChange,
}) => {
  const formattedDate = new Date(task.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      className={`group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-40 scale-95 border-dashed border-indigo-500' : 'opacity-100'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-zinc-100 text-sm leading-snug group-hover:text-indigo-300 transition-colors">
          {task.title}
        </h4>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 p-1 rounded transition-opacity"
          title="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-zinc-400 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium border uppercase tracking-wider ${PRIORITY_COLORS[task.priority]}`}
          >
            {task.priority}
          </span>

          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-zinc-600" />
            {formattedDate}
          </span>
        </div>

        {onStatusChange && (
          <div className="flex items-center gap-1">
            {task.status !== 'todo' && (
              <button
                type="button"
                onClick={() =>
                  onStatusChange(
                    task.id,
                    task.status === 'completed' ? 'in_progress' : 'todo'
                  )
                }
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded"
                title="Move back"
              >
                <ArrowRight className="w-3 h-3 rotate-180" />
              </button>
            )}

            {task.status !== 'completed' && (
              <button
                type="button"
                onClick={() =>
                  onStatusChange(
                    task.id,
                    task.status === 'todo' ? 'in_progress' : 'completed'
                  )
                }
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded"
                title="Advance task"
              >
                {task.status === 'in_progress' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ArrowRight className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
