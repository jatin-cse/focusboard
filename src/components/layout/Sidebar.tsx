import { LayoutDashboard, KanbanSquare, type LucideIcon } from 'lucide-react';

export type View = 'dashboard' | 'kanban';

export interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

interface NavItemDef {
  key: View;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItemDef[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'kanban', label: 'Kanban Board', icon: KanbanSquare },
];

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm m-6 mr-0">
      <div className="flex items-center gap-3 border-b border-gray-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 ring-1 ring-indigo-500/30">
          <LayoutDashboard className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <span className="text-sm font-bold text-white tracking-wide block">FocusBoard</span>
          <span className="text-[10px] text-indigo-400 font-medium">Task Management Shell</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 p-4" aria-label="Main navigation">
        {navItems.map(({ key, label, icon: Icon }) => {
          const active = currentView === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/30 shadow-sm'
                  : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-indigo-400' : 'text-gray-500'}`} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4 m-3 rounded-xl bg-gray-950/40">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Workspace</span>
          <span className="font-semibold text-white">Default</span>
        </div>
      </div>
    </aside>
  );
}
