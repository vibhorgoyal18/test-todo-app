# Playground Todo App — Copilot Instructions

## Project Purpose
Frontend-only React app for Playwright end-to-end automation testing practice.
Deployed on GitHub Pages via HashRouter. No backend — all data lives in Zustand, seeded from `src/data/seed.json`.

---

## Tech Stack (do not substitute)

| Concern | Library | Version |
|---|---|---|
| Framework | React | 18/19 |
| Bundler | Vite + `@vitejs/plugin-react` | 7.x |
| Styling | Tailwind CSS via `@tailwindcss/vite` | 4.x |
| State | Zustand | 5.x |
| Routing | React Router v6 — **HashRouter only** | 7.x |
| Drag & Drop | `@dnd-kit/core` + `@dnd-kit/sortable` | installed |
| Icons | `lucide-react` | installed |
| Toasts | `sonner` `<Toaster>` | installed |
| UI utilities | `clsx` + `tailwind-merge` via `cn()` in `src/lib/utils.js` | installed |

**Never introduce:** Redux, MobX, React Query, axios, framer-motion, react-spring, Radix UI directly, Headless UI, Material UI, Ant Design, Bootstrap, or any CSS-in-JS library.

---

## File & Folder Architecture

```
src/
├── data/
│   └── seed.json               ← single source of truth for users + todos — never hardcode data elsewhere
├── store/
│   └── useAppStore.js          ← one Zustand store for all state (auth, todos, profile)
├── lib/
│   └── utils.js                ← cn() helper only
├── hooks/
│   └── useAuth.js              ← thin hook over useAppStore auth slice
├── router/
│   └── index.jsx               ← HashRouter, Routes, ProtectedRoute, PublicOnlyRoute
├── layouts/
│   └── AppLayout.jsx           ← sidebar + header shell; Outlet for child pages
├── components/
│   ├── CommandPalette.jsx      ← Ctrl+K / "/" modal stub
│   └── ui/                     ← shadcn-style primitives (see UI Components section)
├── features/
│   ├── auth/LoginForm.jsx
│   ├── dashboard/StatsCard.jsx
│   └── todos/
│       ├── TodoList.jsx        ← DndContext + SortableContext wrapper
│       ├── TodoItem.jsx        ← useSortable row with actions
│       ├── TodoForm.jsx        ← add/edit Dialog form
│       └── TodoFilters.jsx     ← search + dropdowns
└── pages/
    ├── LoginPage.jsx
    ├── DashboardPage.jsx
    ├── TodosPage.jsx
    ├── ProfilePage.jsx
    └── NotFoundPage.jsx
```

**Rules:**
- New feature components go under `src/features/{feature}/`.
- New pages go under `src/pages/` and must be registered in `src/router/index.jsx`.
- Do **not** create `context/`, `redux/`, `services/`, or `api/` folders — there is no backend.
- All reusable primitives go in `src/components/ui/` following the UI component patterns below.

---

## State Management Rules

- **Zustand only** — zero prop drilling. Components read state with `useAppStore(s => s.slice)`.
- Auth slice: `currentUser`, `login()`, `logout()` — session persisted to `sessionStorage`.
- Todos slice: `todos[]`, `addTodo()`, `updateTodo()`, `deleteTodo()`, `reorderTodos()`, `toggleTodo()`.
- Profile slice: `updateProfile()`, `changePassword()` — mutate `currentUser` in store + sessionStorage.
- Todos are always **filtered by `userId === currentUser.id`** in the component, never in the store.
- Never call `useAppStore` inside `src/router/` or `src/layouts/AppLayout.jsx` for todo data — only auth.

---

## UI Component Patterns (`src/components/ui/`)

All primitives are hand-crafted to match shadcn/ui API shape. Follow these conventions exactly when adding new ones:

```jsx
// Pattern: forwardRef + cn() + className prop last
const MyComponent = React.forwardRef(({ className, ...props }, ref) => (
  <element ref={ref} className={cn('base-classes', className)} {...props} />
))
MyComponent.displayName = 'MyComponent'
export { MyComponent }
```

**Existing primitives** — use these, do not replace with third-party alternatives:

| File | Exports | Notes |
|---|---|---|
| `button.jsx` | `Button`, `buttonVariants` | variants: `default` `destructive` `outline` `secondary` `ghost` `link` |
| `input.jsx` | `Input` | standard text/date input |
| `label.jsx` | `Label` | |
| `checkbox.jsx` | `Checkbox` | `checked` + `onCheckedChange` props |
| `badge.jsx` | `Badge`, `badgeVariants` | variants include `high` `medium` `low` `in-progress` `done` `todo` |
| `card.jsx` | `Card` `CardHeader` `CardTitle` `CardDescription` `CardContent` `CardFooter` | |
| `select.jsx` | `Select` `SelectItem` | native `<select>` wrapper — **keeps Playwright testability** |
| `dialog.jsx` | `Dialog` `DialogTrigger` `DialogContent` `DialogHeader` `DialogTitle` `DialogDescription` `DialogFooter` | includes focus trap + Escape close |

When creating a new UI primitive, follow the same pattern and add it to this table.

---

## Styling Rules

- **Tailwind utility classes only** — no inline styles, no CSS modules, no `styled-components`.
- CSS variables for colors are defined in `src/index.css` under `@layer base { :root { ... } }`.
- Use the `cn()` helper from `src/lib/utils.js` to merge Tailwind classes conditionally.
- Animations: **Tailwind transition/animation classes only** — e.g. `transition-colors`, `animate-[fadeIn_0.4s_ease-out_forwards]`. The `fadeIn` keyframe is defined in `src/index.css`.
- Color palette is neutral gray (`gray-*`) with semantic accents: red for destructive, green for success, blue for info, yellow for warning.
- No dark mode — single light theme only.

---

## `data-testid` Convention

**Pattern:** `{page/feature}-{element-type}-{qualifier}`

```
login-username-input      login-password-input      login-submit-btn
login-error-message       toggle-password           remember-me-checkbox
stat-total                stat-completed            stat-in-progress          stat-overdue
quick-add-btn             add-todo-btn
filters-bar               search-input              status-filter
priority-filter           sort-select               clear-filters-btn
todo-item-{id}            todo-checkbox-{id}        todo-edit-{id}
todo-delete-{id}          todo-drag-handle-{id}     empty-state
add-todo-dialog           todo-title-input          todo-description-input
todo-status-select        todo-priority-select      todo-due-date-input
todo-tags-input           todo-save-btn             todo-cancel-btn
profile-name-input        profile-email-input       profile-save-btn
old-password-input        new-password-input        confirm-password-input
change-password-btn       password-error-msg        password-success-msg
logout-btn                header-username
command-palette           command-palette-input
```

**Rules:**
- Every interactive element and meaningful output element must have a `data-testid`.
- Dynamic IDs use the todo's `id` field, e.g. `todo-item-t1`.
- Do not use `id`, `class`, or text content as Playwright selectors — `data-testid` only.
- Toast testid is set via the Sonner `toastOptions` on `<Toaster>` in `main.jsx`.

---

## Routing Rules

- `HashRouter` — **never** switch to `BrowserRouter` (GitHub Pages has no server-side routing).
- `/` redirects to `/dashboard`.
- Unauthenticated access to any protected route → redirect to `/login`.
- Already-authenticated visit to `/login` → redirect to `/dashboard`.
- `ProtectedRoute` and `PublicOnlyRoute` are in `src/router/index.jsx`.

---

## Drag & Drop Pattern

Uses `@dnd-kit`. Follow this exact pattern:

```jsx
// TodoList.jsx — container
<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
    {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
  </SortableContext>
</DndContext>

// TodoItem.jsx — item
const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id })
```

- `reorderTodos(arrayMove(allTodos, oldIndex, newIndex))` is called in `onDragEnd`.
- The drag handle must have both `{...attributes}` and `{...listeners}` and `data-testid="todo-drag-handle-{id}"`.

---

## Toast Pattern

```jsx
import { toast } from 'sonner'

toast.success('Message')   // on add, update, delete, profile save, password change
toast.error('Message')     // on failures
```

`<Toaster>` is mounted once in `src/main.jsx`. Do not add it elsewhere.

---

## Delete Confirmation Pattern

Delete actions must use `window.confirm()` — this is intentional for Playwright dialog event testing:

```jsx
function handleDelete() {
  if (window.confirm(`Delete "${todo.title}"?`)) {
    deleteTodo(todo.id)
    toast.success('Todo deleted')
  }
}
```

---

## Form Validation Pattern

- Validate on submit, not on change.
- Show inline error messages below the field with `role="alert"`.
- Clear field error when the user modifies that field.
- Title is required in the todo form. Both fields required on login.

---

## Accessibility Requirements

- All interactive elements must be keyboard-accessible with correct tab order.
- Focus must be trapped inside all Dialogs (`dialog.jsx` handles this).
- Use `aria-label` on icon-only buttons.
- Use `role="alert"` on inline error messages and `role="status"` on success messages.
- Use `aria-invalid` + `aria-describedby` on invalid inputs.
