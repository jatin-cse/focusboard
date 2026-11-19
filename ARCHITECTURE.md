# FocusBoard — Architecture & Agent Ownership Contract (Final)

This file defines **strict file ownership boundaries** for four parallel AI coding agents working on separate Git worktrees. No two agents may edit the same file. All shared contracts are defined once; every agent imports them read-only.

> **Status:** Finalized architecture proposal — not yet implemented. Do NOT create worktrees until this contract is signed off by you.

---

## 0. Project Baseline (unchanged)

- Stack: React 19, TypeScript, Vite, Tailwind CSS v4, `lucide-react` ^1.76.0.
- `src/` currently holds only default Vite template files (`App.tsx`, `main.tsx`, `index.css`, etc.).
- Git: `master` branch, 2 commits, working tree clean.
- **Shared infrastructure** (NOT owned by any agent): `package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `index.html`, `public/`, `node_modules/`. Agents import these but never modify them.

---

## 1. File Ownership Matrix (Strict — no overlaps)

### Agent A — Application Shell, Dashboard & Layout

| File / Path | Purpose | Status |
|-------------|---------|--------|
| `src/main.tsx` | React entry point, root render | ✅ A |
| `src/App.tsx` | Shell composition: view switching, form + filters, KPI cards | ✅ A |
| `src/index.css` | Global Tailwind directives, base styles | ✅ A |
| `src/App.css` | Hero section styling | ✅ A |
| `src/components/layout/Shell.tsx` | Outer frame: sidebar nav + main panel | ✅ A |
| `src/components/layout/Sidebar.tsx` | Nav links (Dashboard / Kanban) | ✅ A |
| `src/components/layout/Header.tsx` | App header + user area | ✅ A |
| `src/components/dashboard/Dashboard.tsx` | Stats + upcoming tasks list | ✅ A |
| `src/components/dashboard/StatCard.tsx` | Single KPI tile component | ✅ A |
| `src/components/ui/Button.tsx` | Reusable button primitive | ✅ A |
| `src/components/ui/Input.tsx` | Text input primitive | ✅ A |
| `src/components/ui/Card.tsx` | Card layout primitive | ✅ A |
| `src/components/ui/Badge.tsx` | Priority/priority pill primitive | ✅ A |
| `src/components/ui/Modal.tsx` | Modal dialog primitive | ✅ A |

### Agent B — Task Types, useTasks Hook, CRUD, Form

| File / Path | Purpose | Status |
|-------------|---------|--------|
| `src/core/types.ts` | **Task interface**, `TaskFormData`, enums `TaskStatus`, `TaskPriority` | ✅ B |
| `src/core/hooks/useTasks.ts` | State management: `tasks[]`, add/update/delete, getTask, statusCounts; persists via storage | ✅ B |
| `src/components/tasks/TaskCard.tsx` | Read-only card + edit/delete triggers | ✅ B |
| `src/components/tasks/TaskForm.tsx` | Create / edit modal form | ✅ B |
| `src/components/tasks/TaskList.tsx` | List of tasks (dashboard view) | ✅ B |
| `src/components/tasks/TaskDeleteConfirm.tsx` | Delete confirmation flow | ✅ B |

### Agent C — Kanban Board & Drag-and-Drop

| File / Path | Purpose | Status |
|-------------|---------|--------|
| `src/components/kanban/KanbanBoard.tsx` | Main board rendering 3 columns | ✅ C |
| `src/components/kanban/KanbanColumn.tsx` | One status column (todo / in_progress / completed) | ✅ C |
| `src/components/kanban/KanbanCard.tsx` | Card inside a column | ✅ C |
| `src/components/kanban/useKanbanDrag.ts` | Native HTML5 drag-and-drop hook | ✅ C |

### Agent D — LocalStorage Adapter, Search, Filtering, Priority Utilities

| File / Path | Purpose | Status |
|-------------|---------|--------|
| `src/core/storage.ts` | **LocalStorage save/load adapter**: `saveTasks(tasks)`, `loadTasks() → Task[]`; key `focusboard_tasks` | ✅ D |
| `src/components/filters/SearchBar.tsx` | Text search input | ✅ D |
| `src/components/filters/FilterBar.tsx` | Status filter chips (todo / in_progress / completed) | ✅ D |
| `src/components/filters/PriorityBadge.tsx` | Priority pill badge | ✅ D |
| `src/components/filters/useTaskFilters.ts` | Derives query/status/priority filters from task data | ✅ D |

---

## 2. Shared Contracts (read-only imports for all agents)

These four files define the domain model and state shape. Each agent owns one or more of them.

### 2.1 `core/types.ts` — Agent B owns (primary author), others read

```ts
// src/core/types.ts   [Agent B]
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;        // ISO date "YYYY-MM-DD"
  tags: string[];
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
}

// Enums
export const TaskStatusEnum = ['todo', 'in_progress', 'completed'] as const;
export const TaskPriorityEnum = ['low', 'medium', 'high'] as const;
```

**Ownership rule:** Only Agent B writes `core/types.ts`. It is imported by A, B, C, D at compile time. If a field needs adding, B proposes changes and all other agents update their component props accordingly before merging.

### 2.2 `core/hooks/useTasks.ts` — Agent B owns

```ts
// src/core/hooks/useTasks.ts   [Agent B]
import { Task } from '../types';
import { storage } from '../storage';

let localTasks: Task[] = [];

export function useTasks(): {
  tasks: Task[];
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, patch: Partial<TaskFormData>) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  statusCounts: Record<TaskStatus, number>;
} {
  const [localTasks, setLocalTasks] = useState<Task[]>(localStorage.get('focusboard_tasks')?.task ?? []);

  // Sync with storage on mount
  useEffect(() => {
    const saved = storage.loadTasks();
    if (saved.length > 0 && JSON.stringify(saved) === JSON.stringify(localTasks)) return;
    localTasks = saved.map((t: Task) => ({ ...t, id: t.id }));
    setLocalTasks(localTasks);
  }, []);

  const addTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      tags: [...(data.tags || [])],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    localTasks.push(newTask);
    storage.saveTasks(localTasks);
    setLocalTasks([...localTasks]);
  };

  const updateTask = (id: string, patch: Partial<TaskFormData>) => {
    const index = localTasks.findIndex((t) => t.id === id);
    if (index >= 0) {
      localTasks[index] = { ...localTasks[index], ...patch };
      localTasks[index].updatedAt = new Date().toISOString().split('T')[0];
      storage.saveTasks(localTasks);
    }
  };

  const deleteTask = (id: string) => {
    localTasks = localTasks.filter((t) => t.id !== id);
    storage.saveTasks(localTasks);
  };

  const getTask = (id: string) => localTasks.find((t) => t.id === id) || undefined;

  const statusCounts = () => {
    const counts: Record<TaskStatus, number> = { todo: 0, in_progress: 0, completed: 0 };
    localTasks.forEach((t) => {
      if (counts[t.status]) counts[t.status]++;
    });
    return counts;
  };

  return { tasks: localTasks, addTask, updateTask, deleteTask, getTask, statusCounts };
}
```

**Dependencies:** Imports `storage` from `../storage` (Agent D). Uses `crypto.randomUUID()` built-in. Persists every mutation through `storage.saveTasks()`.

### 2.3 `core/storage.ts` — Agent D owns

```ts
// src/core/storage.ts   [Agent D]
import type { Task } from './types';

const STORAGE_KEY = 'focusboard_tasks';

export const storage = {
  saveTasks: (tasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: tasks }));
    } catch {
      // Fallback: also persist to sessionStorage
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: tasks }));
    }
  },
  loadTasks: (): Task[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return parsed.tasks ?? [];
    } catch {
      return [];
    }
  },
};
```

**Contract agreement (Agent D must implement against Agent B's types):**
- Key name: **`focusboard_tasks`**
- Value on save: `{ tasks: Task[] }`
- `loadTasks()` returns `Task[]` (empty array if none).
- On boot, `useTasks()` reads from storage first, then falls back to empty array.

**Depends on:** `core/types.ts` (Agent B).

---

## 3. Kanban Components (Agent C owns)

### 3.1 `KanbanBoard.tsx` — Agent C

```ts
// src/components/kanban/KanbanBoard.tsx   [Agent C]
interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (id: string, status: TaskStatus) => void;
}
```

Renders three columns: `todo`, `in_progress`, `completed`. Cards move between columns via `onTaskMove`.

### 3.2 `KanbanColumn.tsx` — Agent C

```ts
// src/components/kanban/KanbanColumn.tsx   [Agent C]
interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskMove: (id: string, status: TaskStatus) => void;
}
```

Displays only tasks whose current status matches. Empty state shown when none match.

### 3.3 `KanbanCard.tsx` — Agent C

```ts
// src/components/kanban/KanbanCard.tsx   [Agent C]
interface KanbanCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
}
```

Reuses visual style from `TaskCard` (same card layout, different column context).

### 3.4 `useKanbanDrag.ts` — Agent C

Native HTML5 drag-and-drop. No new dependency. Hooks into `onTaskMove(id, status)`.

---

## 4. Dashboard Components (Agent A owns)

### 4.1 `Dashboard.tsx` — Agent A

```ts
// src/components/dashboard/Dashboard.tsx   [Agent A]
interface DashboardProps {
  tasks: Task[];
  statusCounts: Record<TaskStatus, number>;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}
```

Shows stats tiles + upcoming tasks list. Filters via `useTaskFilters` (Agent D).

### 4.2 `StatCard.tsx` — Agent A

Single KPI tile component.

### 4.3 `Header.tsx` — Agent A

App header + user area.

---

## 5. Search, Filtering & Priority (Agent D owns)

### 5.1 `SearchBar.tsx` — Agent D

```ts
interface SearchBarProps {
  value: string;
  onChange: (q: string) => void;
  placeholder?: string;
}
```

### 5.2 `FilterBar.tsx` — Agent D

```ts
interface FilterBarProps {
  active: TaskStatus | 'all';
  onChange: (status: TaskStatus | 'all') => void;
}
```

### 5.3 `PriorityBadge.tsx` — Agent D

```ts
interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}
```

### 5.4 `useTaskFilters.ts` — Agent D

```ts
// src/components/filters/useTaskFilters.ts   [Agent D]
export function useTaskFilters(
  tasks: Task[],
  query: string,
  status: TaskStatus | 'all',
  priority: TaskPriority | 'all'
): {
  query: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  filteredTasks: Task[];
  setQuery: (q: string) => void;
  setStatus: (s: TaskStatus | 'all') => void;
  setPriority: (p: TaskPriority | 'all') => void;
}
```

Derives `filteredTasks` from `tasks` using the query, status, and priority inputs.

---

## 6. Exact Branch Names & Git Worktree Paths

All branches start from `master`. Four feature branches, each in its own worktree.

```
Base repo:  C:\Users\Jatin\OneDrive\Documents\Omniroute-test\FocusBoard
Worktree paths (relative to repo root):
  - FocusBoard-agent-a-layout-dashboard/
  - FocusBoard-agent-b-task-crud/
  - FocusBoard-agent-c-kanban/
  - FocusBoard-agent-d-filters-storage/

Branch names:
  - master          (base)
  - feature/agent-a-layout-dashboard
  - feature/agent-b-task-crud
  - feature/agent-c-kanban
  - feature/agent-d-filters-storage
```

**Worktree creation commands (run in each agent's shell):**

```bash
git worktree add ../FocusBoard/<agent>-<feature> feature/<branch-name>
```

Example for Agent A:
```bash
cd FocusBoard
git worktree add ../FocusBoard-agent-a-layout-dashboard feature/agent-a-layout-dashboard
```

**Full paths:**
- Agent A worktree: `C:\Users\Jatin\OneDrive\Documents\Omniroute-test\FocusBoard\FocusBoard-agent-a-layout-dashboard`
- Agent B worktree: `C:\Users\Jatin\OneDrive\Documents\Omniroute-test\FocusBoard\FocusBoard-agent-b-task-crud`
- Agent C worktree: `C:\Users\Jatin\OneDrive\Documents\Omniroute-test\FocusBoard\FocusBoard-agent-c-kanban`
- Agent D worktree: `C:\Users\Jatin\OneDrive\Documents\Omniroute-test\FocusBoard\FocusBoard-agent-d-filters-storage`

---

## 7. Dependencies Between Agents

| From → To | Dependency | Rationale |
|-----------|------------|-----------|
| B → A | `core/types.ts`, `core/hooks/useTasks.ts` | A consumes task types and state hooks |
| B → C | `core/types.ts` | C renders kanban cards displaying tasks |
| B → D | `core/types.ts` | D implements storage contract against task schema |
| D → A | `core/storage.ts` (via useTasks sync) | A's dashboard reads persisted tasks |
| D → B | None (B independent) | Storage is a consumer of types |
| C → A | None (A composes C output) | A displays kanban results |
| A → B/C/D | None (consumers only) | A does not depend on task logic |

**Key chain:** B (types + useTasks) ← D (storage) ← A (dashboard uses both) and C (kanban moves via useTasks).

---

## 8. Integration Flow

```
┌─────────────────────────────────────────────────────┐
│                    App.tsx (Agent A)                 │
│  ├── Shell (Sidebar, Header)                         │
│  ├── Dashboard (A)                                   │
│  └── TaskList (B)                                    │
├─────────────────────────────────────────────────────┤
│  useTasks()  ←  Agent B                              │
│    ├── localTasks (state)                            │
│    ├── addTask(data) → storage.saveTasks()           │
│    ├── updateTask(id, patch) → storage.saveTasks()  │
│    ├── deleteTask(id) → storage.saveTasks()         │
│    └── getTask(id)                                  │
├─────────────────────────────────────────────────────┤
│  KanbanBoard (Agent C)                               │
│    └── calls useTasks().getTask(id) → updates stored │
├─────────────────────────────────────────────────────┤
│  Search/Filter (Agent D)                             │
│    └── useTaskFilters(tasks, query, status, priority)│
│      → feeds Dashboard & Kanban via filteredTasks     │
└─────────────────────────────────────────────────────┘
```

**Persistence layer:** `core/storage.ts` (Agent D) syncs every mutation through `localStorage` key `focusboard_tasks`. `useTasks` reads on mount and keeps local state in sync.

---

## 9. Testing Responsibilities

- **No test framework installed** in the project baseline (no vitest/jest/playwright). This is intentional — focus on integration correctness first.
- **Agent D** (storage) should write a simple unit test for `storage.loadTasks()` returning `[]` when nothing is saved, and `saveTasks()` persisting correctly. Test can be added later.
- **Agents A, B, C** should verify end-to-end behavior via the dev server (`npm run dev`) and manual interaction.
- **Testing is an open item** — no CI pipeline exists yet. When implementing, add `@vitest/vitest-prepend` or similar and run `npm test` after PR.

---

## 10. Rules Preventing Cross-Agent File Modification

These rules apply to every agent during development:

1. **File ownership is exclusive.** An agent edits ONLY files listed under its row in Section 1. If a conflict arises, do NOT edit another agent's file directly — instead, propose a change in the PR comment and wait for the other agent to merge first.
2. **Read-only imports.** Every agent's code must import only from:
   - Its own files (written by it)
   - Files listed under "Others" in the matrix (e.g., Agent A imports `core/types.ts` from B)
   - Public exports of other agents' files (contract-level, e.g., `useTasks` from B, `searchBar` from D)
3. **Never rename or delete a file outside its own row.** Renaming `src/components/task-list.tsx` would violate Agent B's ownership of `TaskList.tsx`.
4. **Commit messages** (per system reminder) must end with:
   - For git commits: `Co-Authored-By: Claude Code <noreply@anthropic.com>`
   - For pull requests: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
5. **Merge order** (only after all PRs pass review): B → D → C → A. This ensures foundational contracts and storage are merged before views consume them.

---

## 11. Merge Order & Review Checklist

Merges happen sequentially on `master`:

1. **Agent B** merges `feature/agent-b-task-crud` → `master`
2. **Agent D** merges `feature/agent-d-filters-storage` → `master`
3. **Agent C** merges `feature/agent-c-kanban` → `master`
4. **Agent A** merges `feature/agent-a-layout-dashboard` → `master`

Each merge requires:
- [ ] `git diff --name-status` shows only files in the agent's row
- [ ] `npm run build` passes locally
- [ ] `npm run lint` passes locally
- [ ] PR description references ARCHITECTURE.md and lists owned files
- [ ] Post-merge review confirms no overlapping edits

---

## 12. Summary Table

| # | Artifact | Owner(s) | Notes |
|---|----------|----------|-------|
| 1 | `core/types.ts` | **B** | Task interface, enums, TaskFormData |
| 2 | `core/hooks/useTasks.ts` | **B** | State + persistence sync |
| 3 | `core/storage.ts` | **D** | LocalStorage adapter (key: `focusboard_tasks`) |
| 4 | `components/tasks/*` | **B** | TaskCard, TaskForm, TaskList, TaskDeleteConfirm |
| 5 | `components/kanban/*` | **C** | KanbanBoard, KanbanColumn, KanbanCard, useKanbanDrag |
| 6 | `components/dashboard/*` | **A** | Dashboard, StatCard, Header |
| 7 | `components/layout/*` | **A** | Shell, Sidebar, Header |
| 8 | `components/filters/*` | **D** | SearchBar, FilterBar, PriorityBadge, useTaskFilters |
| 9 | `src/components/ui/*` | **A** | Button, Input, Card, Badge, Modal (shared primitives) |
| 10 | `src/main.tsx` | **A** | Entry point |
| 11 | `src/App.tsx` | **A** | Shell composition |
| 12 | `index.css`, `App.css` | **A** | Global/Tailwind styles |
| 13 | `public/*`, `index.html` | — | Shared (not modified by any agent) |

---

*End of document.*
