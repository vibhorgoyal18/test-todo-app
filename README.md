# Playwright Practice Todo App

A frontend-only React application designed as a **Playwright automation testing playground**.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:5173/test-todo-app/
```

## Test Credentials

| Username   | Password    | Role   |
|------------|-------------|--------|
| `testuser` | `Test@1234` | admin  |
| `viewer`   | `View@5678` | viewer |

## Tech Stack

React 18 · Vite · Tailwind CSS v4 · Zustand · React Router v6 (HashRouter) · @dnd-kit · Sonner

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
