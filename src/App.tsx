import { useState, useEffect, useMemo } from 'react';
import Shell from './components/layout/Shell';
import type { View } from './components/layout/Sidebar';
import Dashboard, { type Task, type TaskStatus, type TaskPriority } from './components/dashboard/Dashboard';
import Modal from './components/ui/Modal';
import Input from './components/ui/Input';
import Button from './components/ui/Button';
import { PriorityBadge } from './components/ui/Badge';
import Card from './components/ui/Card';
import { ArrowRight, ArrowLeft, Trash2, Calendar } from 'lucide-react';
import './App.css';

// Contract definitions according to ARCHITECTURE.md
export interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (id: string, status: TaskStatus) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

const STORAGE_KEY = 'focusboard_tasks';

const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: 'sample-task-1',
    title: 'Design Dark Theme Application Shell',
    description: 'Build a polished, responsive application shell with dark theme and modern layout.',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-11-20',
    tags: ['design', 'ui', 'shell'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-task-2',
    title: 'Implement Kanban Board & Drag-Drop',
    description: 'Integrate the 3-column kanban board with interactive status transitions.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-11-22',
    tags: ['kanban', 'feature'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-task-3',
    title: 'Connect LocalStorage Adapter & Filter Bar',
    description: 'Support multi-criteria search, status chips, and priority filtering.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-11-23',
    tags: ['storage', 'filters'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-task-4',
    title: 'Write Unit Tests & Verification Suite',
    description: 'Ensure cross-agent contracts, state synchronization, and UI flows are validated.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-11-25',
    tags: ['testing', 'qa'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<TaskStatus>('todo');
  const [formPriority, setFormPriority] = useState<TaskPriority>('medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formTags, setFormTags] = useState('');

  // Tasks state synchronized with localStorage (contract: key 'focusboard_tasks', { tasks: Task[] })
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
          return parsed.tasks;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_SAMPLE_TASKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks }));
    } catch {
      // Ignore storage errors
    }
  }, [tasks]);

  const statusCounts = useMemo<Record<TaskStatus, number>>(() => {
    const counts: Record<TaskStatus, number> = { todo: 0, in_progress: 0, completed: 0 };
    tasks.forEach((t) => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      }
    });
    return counts;
  }, [tasks]);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormStatus('todo');
    setFormPriority('medium');
    setFormDueDate('');
    setFormTags('');
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormStatus(task.status);
    setFormPriority(task.priority);
    setFormDueDate(task.dueDate || '');
    setFormTags(task.tags.join(', '));
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const now = new Date().toISOString();

    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: formTitle.trim(),
                description: formDescription.trim(),
                status: formStatus,
                priority: formPriority,
                dueDate: formDueDate || undefined,
                tags: tagsArray,
                updatedAt: now,
              }
            : t
        )
      );
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: formTitle.trim(),
        description: formDescription.trim(),
        status: formStatus,
        priority: formPriority,
        dueDate: formDueDate || undefined,
        tags: tagsArray,
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTaskMove = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t))
    );
  };

  const pageTitle = currentView === 'dashboard' ? 'Overview Dashboard' : 'Kanban Task Board';

  return (
    <Shell
      currentView={currentView}
      onNavigate={setCurrentView}
      pageTitle={pageTitle}
      onAddTask={handleOpenCreateModal}
    >
      {currentView === 'dashboard' ? (
        <Dashboard
          tasks={tasks}
          statusCounts={statusCounts}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
          onAddTask={handleOpenCreateModal}
        />
      ) : (
        /* Kanban Board Integration matching KanbanBoardProps */
        <DefaultKanbanBoard
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Task Creation / Edit Modal */}
      <Modal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <form onSubmit={handleSaveTask} className="space-y-4">
          <Input
            label="Title *"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="e.g., Implement Search Bar"
            required
            autoFocus
          />

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-300">Description</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Add details, acceptance criteria, or notes..."
              rows={3}
              className="block w-full rounded-lg border border-gray-700 bg-gray-900/50 px-3.5 py-2 text-sm text-white placeholder-gray-500 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                className="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                className="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
            />
            <Input
              label="Tags (comma separated)"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              placeholder="e.g. ui, backend, high-priority"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTaskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" className="bg-indigo-600 hover:bg-indigo-500">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </Shell>
  );
}

// Integrated Kanban Board conforming to KanbanBoardProps
function DefaultKanbanBoard({ tasks, onTaskMove, onEdit, onDelete }: KanbanBoardProps) {
  const columns: Array<{ status: TaskStatus; label: string; color: string; badge: string }> = [
    { status: 'todo', label: 'To Do', color: 'border-purple-500/30', badge: 'bg-purple-500/15 text-purple-300' },
    { status: 'in_progress', label: 'In Progress', color: 'border-amber-500/30', badge: 'bg-amber-500/15 text-amber-300' },
    { status: 'completed', label: 'Completed', color: 'border-emerald-500/30', badge: 'bg-emerald-500/15 text-emerald-300' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Kanban Task Board</h2>
          <p className="text-xs text-gray-400">Track and advance tasks through workflow stages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(({ status, label, color, badge }) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          return (
            <div
              key={status}
              className={`flex flex-col rounded-2xl border ${color} bg-gray-900/50 backdrop-blur-sm p-4 min-h-[500px] shadow-lg`}
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">{label}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge}`}>
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-800/80 rounded-xl text-center p-4">
                    <p className="text-xs text-gray-500 font-medium">No tasks in {label.toLowerCase()}</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="border-gray-800/90 bg-gray-950/70 p-4 transition-all hover:border-gray-700 shadow-md group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-white leading-snug">{task.title}</h4>
                          <PriorityBadge priority={task.priority} />
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-500">
                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-gray-400">
                              <Calendar className="h-3 w-3" />
                              {task.dueDate}
                            </span>
                          )}
                          {task.tags?.map((t) => (
                            <span key={t} className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">
                              #{t}
                            </span>
                          ))}
                        </div>

                        {/* Actions & Column Navigation */}
                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-800/80 text-xs">
                          <div className="flex items-center gap-1.5">
                            {onEdit && (
                              <button
                                type="button"
                                onClick={() => onEdit(task)}
                                className="text-gray-400 hover:text-indigo-400 text-xs transition-colors"
                              >
                                Edit
                              </button>
                            )}
                            {onDelete && (
                              <button
                                type="button"
                                onClick={() => onDelete(task.id)}
                                className="text-gray-400 hover:text-rose-400 text-xs transition-colors ml-2"
                                title="Delete task"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {status !== 'todo' && (
                              <button
                                type="button"
                                onClick={() =>
                                  onTaskMove(
                                    task.id,
                                    status === 'completed' ? 'in_progress' : 'todo'
                                  )
                                }
                                className="flex items-center gap-1 p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
                                title="Move back"
                              >
                                <ArrowLeft className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {status !== 'completed' && (
                              <button
                                type="button"
                                onClick={() =>
                                  onTaskMove(
                                    task.id,
                                    status === 'todo' ? 'in_progress' : 'completed'
                                  )
                                }
                                className="flex items-center gap-1 p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
                                title="Advance status"
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
