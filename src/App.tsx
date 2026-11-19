import { useState } from 'react'
import { Shell } from './components/layout/Shell'
import type { View } from './components/layout/Sidebar'
import Dashboard from './components/dashboard/Dashboard'
import { KanbanBoard } from './components/kanban/KanbanBoard'
import { useTaskStore } from './hooks/useTaskStore'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState<View>('kanban')
  const { tasks, deleteTask } = useTaskStore()

  const handleAddTask = () => {
    setCurrentView('kanban')
  }

  const statusCounts = tasks.reduce(
    (acc, task) => {
      const statusKey = task.status === 'in-progress' ? 'in_progress' : task.status
      acc[statusKey] = (acc[statusKey] || 0) + 1
      return acc
    },
    { todo: 0, in_progress: 0, completed: 0 } as Record<string, number>
  )

  const pageTitle = currentView === 'dashboard' ? 'Dashboard' : 'Kanban Board'

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
          onEdit={() => {
            setCurrentView('kanban')
          }}
          onDelete={deleteTask}
          onAddTask={handleAddTask}
        />
      ) : (
        <KanbanBoard />
      )}
    </Shell>
  )
}

export default App
