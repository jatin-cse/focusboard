import { CheckCircle2, Clock, AlertCircle, ListTodo, Plus, Calendar, Tag } from 'lucide-react';
import StatCard from './StatCard';
import Button from '../ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import { PriorityBadge } from '../ui/Badge';

// Types according to ARCHITECTURE.md Section 2.1 contract
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardProps {
  tasks: Task[];
  statusCounts: Record<TaskStatus, number>;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onAddTask?: () => void;
}

export default function Dashboard({
  tasks,
  statusCounts,
  onEdit,
  onDelete,
  onAddTask,
}: DashboardProps) {
  const totalTasks = tasks.length;
  const completed = statusCounts.completed || 0;
  const inProgress = statusCounts.in_progress || 0;
  const todo = statusCounts.todo || 0;

  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  // Upcoming active tasks
  const upcomingTasks = tasks
    .filter((t) => t.status !== 'completed')
    .slice(0, 5);

  const statusLabels: Record<TaskStatus, { label: string; badgeClass: string }> = {
    todo: { label: 'To Do', badgeClass: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
    in_progress: { label: 'In Progress', badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    completed: { label: 'Completed', badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-indigo-950/50 via-gray-900/80 to-purple-950/40 p-8 shadow-2xl backdrop-blur-sm">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              FocusBoard Overview
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Focus on what matters most
            </h2>
            <p className="text-sm text-gray-400 max-w-xl">
              You have <span className="font-semibold text-indigo-300">{inProgress}</span> tasks in progress and{' '}
              <span className="font-semibold text-purple-300">{todo}</span> waiting in the queue.
            </p>
          </div>
          {onAddTask && (
            <Button
              onClick={onAddTask}
              className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 px-5 py-2.5 h-auto text-sm shrink-0 self-start sm:self-auto font-semibold"
            >
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={ListTodo}
          trend={`${totalTasks} recorded`}
          colorClass="text-blue-400 bg-blue-500/10 border-blue-500/20"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={Clock}
          trend={inProgress > 0 ? 'Actively working' : 'All clear'}
          trendUp={inProgress > 0}
          colorClass="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
        <StatCard
          title="Completed"
          value={completed}
          icon={CheckCircle2}
          trend={`${completionRate}% completion rate`}
          colorClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          title="To Do"
          value={todo}
          icon={AlertCircle}
          trend={todo > 0 ? 'Pending start' : 'Zero pending'}
          trendUp={false}
          colorClass="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent & Upcoming Tasks List */}
        <div className="lg:col-span-2">
          <Card className="h-full border-gray-800 bg-gray-900/60 shadow-xl">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming & Active Tasks</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Tasks requiring your immediate attention</p>
              </div>
              <span className="rounded-full bg-gray-800 px-2.5 py-1 text-xs font-semibold text-gray-400 border border-gray-700">
                {upcomingTasks.length} pending
              </span>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800/80 text-gray-400 mb-4 ring-1 ring-gray-700">
                    <ListTodo className="h-7 w-7 text-indigo-400" />
                  </div>
                  <p className="text-base font-semibold text-white">No active tasks right now</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    Great job! All tasks are completed or you haven't created any tasks yet.
                  </p>
                  {onAddTask && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAddTask}
                      className="mt-4 gap-1.5 text-xs text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/10"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add a new task
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-800/80 bg-gray-950/40 p-4 transition-all duration-200 hover:border-gray-700 hover:bg-gray-800/40"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-white truncate">{task.title}</h4>
                          <PriorityBadge priority={task.priority} />
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusLabels[task.status]?.badgeClass || ''}`}>
                            {statusLabels[task.status]?.label || task.status}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-400 line-clamp-1">{task.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-gray-500">
                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-gray-400">
                              <Calendar className="h-3 w-3" />
                              {task.dueDate}
                            </span>
                          )}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {task.tags.map((t) => (
                                <span key={t} className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(task)}
                            className="h-8 px-3 text-xs border-gray-700 bg-gray-800/40 hover:bg-gray-800 text-gray-300"
                          >
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(task.id)}
                            className="h-8 px-3 text-xs border-red-900/40 text-red-400 hover:bg-red-950/30 hover:border-red-800"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Productivity Overview Side Card */}
        <div>
          <Card className="h-full border-gray-800 bg-gray-900/60 shadow-xl flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle>Productivity Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-gray-400">
                    <span>Overall Completion</span>
                    <span className="text-white">{completionRate}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-800 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-800/80">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Completed
                    </span>
                    <span className="font-semibold text-white">{completed}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-800/80">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      In Progress
                    </span>
                    <span className="font-semibold text-white">{inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-400" />
                      To Do
                    </span>
                    <span className="font-semibold text-white">{todo}</span>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-5 pt-0">
              <div className="rounded-2xl border border-indigo-900/30 bg-indigo-950/20 p-4">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Focus Tip</h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Switch to the Kanban Board to drag & drop tasks across stages as your workflow progresses.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
