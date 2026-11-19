# FocusBoard

### A modern task management dashboard built with React, TypeScript, and AI-assisted multi-agent development.

<p align="center">
  <strong>Plan smarter. Stay organized. Get things done.</strong>
</p>

---

## Overview

**FocusBoard** is a task management application designed to simplify productivity through an intuitive dashboard, organized task workflows, and visual task tracking.

The project was developed using a multi-agent AI-assisted software engineering workflow, where four specialized AI agents contributed to different parts of the application. Their work was integrated into a unified application using Git branches, shared architecture, and integration testing.

## Features

- **Dashboard:** Get an overview of tasks, productivity, and task progress.
- **Task Management:** Create, edit, and delete tasks.
- **Kanban Board:** Organize tasks into To Do, In Progress, and Completed columns.
- **Drag and Drop:** Move tasks between workflow stages.
- **Priority Management:** Categorize tasks by Low, Medium, and High priority.
- **Filtering:** Filter tasks by status and priority.
- **LocalStorage Persistence:** Retain task data across browser refreshes.
- **Responsive Interface:** A clean application layout with sidebar navigation.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type safety |
| Vite | Development and build tooling |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| LocalStorage | Client-side data persistence |
| Git & GitHub | Version control and collaboration |

## Multi-Agent AI Development

One of the main objectives of this project was to explore how multiple AI coding agents can contribute to a shared software project.

Development responsibilities were divided into four specialized workstreams.

| Agent | Responsibility | Contribution |
|---|---|---|
| Agent A | Dashboard & Layout | Dashboard, application shell, sidebar, and UI layout |
| Agent B | Task Management | Task CRUD, task types, hooks, and task form |
| Agent C | Kanban Board | Kanban columns, task cards, and drag-and-drop |
| Agent D | Filters & Storage | Task filtering and LocalStorage integration |

### Agent Branches

Each development workstream has a corresponding GitHub branch:

- `feature/agent-a-layout-dashboard`
- `feature/agent-b-task-crud`
- `feature/agent-c-kanban`
- `feature/agent-d-filters-storage`

The integrated application is maintained on the `master` branch.

**Integration note:** Agent C's implementation was committed directly to `master`, rather than integrated through a separate branch merge. The Agent C branch is also preserved in the repository.

### Development Workflow

1. Divide application requirements into independent development tasks.
2. Assign specialized responsibilities to AI agents.
3. Develop components using shared architectural conventions.
4. Track changes using Git branches and worktrees.
5. Integrate the implementations into the main application.
6. Resolve merge conflicts and type inconsistencies.
7. Run linting, production builds, and functional checks.
8. Verify the final integrated application.

This workflow demonstrates how AI-assisted development can support parallel implementation while keeping architecture, integration, and verification under developer supervision.

## Project Structure

```text
FocusBoard/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── filters/
│   │   ├── kanban/
│   │   ├── layout/
│   │   ├── tasks/
│   │   └── ui/
│   │
│   ├── core/
│   │   ├── hooks/
│   │   ├── storage.ts
│   │   └── types.ts
│   │
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/jatin-cse/focusboard.git
```

Navigate into the project:

```bash
cd focusboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## Quality Checks

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## What This Project Demonstrates

- Multi-agent AI-assisted software development.
- Parallel development and task delegation.
- Component-based React architecture.
- TypeScript-based application development.
- Git branching, worktrees, and integration.
- Debugging and merge conflict resolution.
- Frontend state management and browser storage.
- Application verification and production builds.

## Future Improvements

- User authentication and individual workspaces.
- Cloud-based task synchronization.
- Team collaboration and shared boards.
- Task deadlines and notifications.
- Productivity analytics and reporting.
- Dark and light themes.

## Author

**Jatin Kumar**

Computer Science & Engineering Student | Software Developer | Machine Learning Enthusiast

- GitHub: https://github.com/jatin-cse
- LinkedIn: https://www.linkedin.com/in/jatin-kumar-104559318

---

<p align="center">
  <strong>FocusBoard — Think clearly. Work purposefully. Stay productive.</strong>
</p>
