import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export interface TaskDeleteConfirmProps {
  isOpen: boolean;
  taskTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TaskDeleteConfirm: React.FC<TaskDeleteConfirmProps> = ({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Confirm Deletion</span>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-1">
            Are you sure you want to delete this task?
          </p>
          {taskTitle && (
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 line-clamp-2">
              "{taskTitle}"
            </p>
          )}
          <p className="text-xs text-rose-500 font-medium">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
