
import { useMemo, useState } from 'react';
import Shell from './components/layout/Shell';
import type { View } from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { TaskForm } from './components/tasks/TaskForm';
import { FilterBar } from './components/filters/FilterBar';
import { useTasks } from './core/hooks/useTasks';
import type {
  Task,
  TaskFormData,
  TaskStatus,
  TaskPriority,
} from './core/types';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<TaskStatus | 'all'>('all');

  const [priorityFilter, setPriorityFilter] =
    useState<TaskPriority | 'all'>('all');

  const statusCounts = useMemo(() => {
    const counts: Record<TaskStatus, number> = {
      todo: 0,
      in_progress: 0,
      completed: 0,
    };

    tasks.forEach(task => {
      counts[task.status]++;
    });

    return counts;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus =
        statusFilter === 'all' || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter;

      return matchesStatus && matchesPriority;
    });
  }, [tasks, statusFilter, priorityFilter]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }

    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleCancel = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const pageTitle =
    currentView === 'dashboard' ? 'Dashboard' : 'Kanban Board';

  return (
    <Shell
      currentView={currentView}
      onNavigate={setCurrentView}
      pageTitle={pageTitle}
      onAddTask={handleAddTask}
    >
      {currentView === 'dashboard' ? (
        <Dashboard
          tasks={tasks}
          statusCounts={statusCounts}
          onEdit={handleEditTask}
          onDelete={deleteTask}
          onAddTask={handleAddTask}
        />
      ) : (
        <>
          <FilterBar
            active={statusFilter}
            onChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            totalCount={tasks.length}
            filteredCount={filteredTasks.length}
          />

          <KanbanBoard
            tasks={filteredTasks}
            onMoveTask={(id, status) => updateTask(id, { status })}
            onDeleteTask={deleteTask}
          />
        </>
      )}

      <TaskForm
        key={`${isTaskFormOpen}-${editingTask?.id ?? 'new'}`}
        initialData={editingTask}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isOpen={isTaskFormOpen}
      />
    </Shell>
  );
}

export default App;
