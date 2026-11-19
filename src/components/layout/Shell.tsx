import Sidebar, { type View } from './Sidebar';
import Header from './Header';
import { type ReactNode } from 'react';

export interface ShellProps {
  currentView: View;
  onNavigate: (view: View) => void;
  pageTitle: string;
  onAddTask?: () => void;
  children: ReactNode;
}

export default function Shell({
  currentView,
  onNavigate,
  pageTitle,
  onAddTask,
  children,
}: ShellProps) {
  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <Header
        pageTitle={pageTitle}
        onAddTask={onAddTask}
        currentView={currentView}
        onNavigate={onNavigate}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onNavigate={onNavigate} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
