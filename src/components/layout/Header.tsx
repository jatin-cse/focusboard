import { Bell, Plus, User, LayoutDashboard, KanbanSquare } from 'lucide-react';
import Button from '../ui/Button';
import type { View } from './Sidebar';

export interface HeaderProps {
  pageTitle: string;
  onAddTask?: () => void;
  currentView?: View;
  onNavigate?: (view: View) => void;
}

export default function Header({ pageTitle, onAddTask, currentView, onNavigate }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900/80 px-6 py-4 backdrop-blur-md sticky top-0 z-40">
      {/* Left: Logo + mobile nav + page title */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/20 ring-1 ring-indigo-500/30">
            <LayoutDashboard className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">FocusBoard</span>
        </div>

        {/* Mobile View Switcher */}
        {onNavigate && currentView && (
          <div className="flex items-center gap-1 bg-gray-800/60 p-1 rounded-xl border border-gray-800 lg:hidden">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentView === 'kanban' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <KanbanSquare className="h-3.5 w-3.5" />
              Kanban
            </button>
          </div>
        )}

        <h1 className="hidden sm:block text-xl font-bold text-white tracking-tight">{pageTitle}</h1>
      </div>

      {/* Right: actions + user */}
      <div className="flex items-center gap-3">
        {onAddTask && (
          <Button
            variant="default"
            size="sm"
            onClick={onAddTask}
            className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 px-4"
          >
            <Plus className="h-4 w-4" />
            <span className="font-semibold">New Task</span>
          </Button>
        )}

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/60 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-gray-900" />
        </button>

        <button
          type="button"
          aria-label="User account"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 ring-1 ring-indigo-500/30 text-indigo-300 transition-colors hover:bg-indigo-600/30"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
