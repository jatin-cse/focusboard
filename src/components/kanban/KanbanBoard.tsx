import React, { useMemo, useState } from 'react';
import type { Task, TaskStatus } from '../../core/types';
import { KanbanColumn } from './KanbanColumn';
import { useKanbanDrag } from './useKanbanDrag';
import { Circle, Clock, CheckCircle2, Search } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, targetStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onMoveTask,
  onDeleteTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    draggedTaskId,
    dragOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useKanbanDrag(onMoveTask);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return tasks;

    return tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      (task.description ?? '').toLowerCase().includes(query) ||
      task.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [tasks, searchQuery]);

  const columns: {
    title: string;
    status: TaskStatus;
    icon: React.ReactNode;
  }[] = [
    {
      title: 'To Do',
      status: 'todo',
      icon: <Circle className="w-4 h-4 text-zinc-400" />,
    },
    {
      title: 'In Progress',
      status: 'in_progress',
      icon: <Clock className="w-4 h-4 text-indigo-400" />,
    },
    {
      title: 'Completed',
      status: 'completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {columns.map(column => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            icon={column.icon}
            tasks={filteredTasks.filter(task => task.status === column.status)}
            draggedTaskId={draggedTaskId}
            dragOverColumn={dragOverColumn}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDeleteTask={onDeleteTask}
            onStatusChange={onMoveTask}
          />
        ))}
      </div>
    </div>
  );
};