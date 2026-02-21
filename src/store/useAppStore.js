import { create } from 'zustand'
import seedData from '@/data/seed.json'

const SESSION_KEY = 'todo_app_user'

function generateId() {
  return 't' + Date.now() + Math.random().toString(36).slice(2, 7)
}

function restoreSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const useAppStore = create((set, get) => ({
  // ── Auth ──────────────────────────────────────────────
  currentUser: restoreSession(),

  login: (username, password) => {
    const user = seedData.users.find(
      (u) => u.username === username && u.password === password
    )
    if (!user) return false
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
    set({ currentUser: user })
    return true
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY)
    set({ currentUser: null })
  },

  // ── Todos ─────────────────────────────────────────────
  todos: [...seedData.todos],

  addTodo: (data) => {
    const currentUser = get().currentUser
    const newTodo = {
      id: generateId(),
      userId: currentUser?.id,
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || '',
      tags: Array.isArray(data.tags)
        ? data.tags
        : data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    }
    set((state) => ({ todos: [...state.todos, newTodo] }))
    return newTodo
  },

  updateTodo: (id, data) => {
    set((state) => ({
      todos: state.todos.map((t) => {
        if (t.id !== id) return t
        return {
          ...t,
          ...data,
          tags: Array.isArray(data.tags)
            ? data.tags
            : data.tags !== undefined
            ? data.tags.split(',').map((s) => s.trim()).filter(Boolean)
            : t.tags,
        }
      }),
    }))
  },

  deleteTodo: (id) => {
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }))
  },

  reorderTodos: (newOrder) => {
    set({ todos: newOrder })
  },

  toggleTodo: (id) => {
    set((state) => ({
      todos: state.todos.map((t) => {
        if (t.id !== id) return t
        const next = t.status === 'done' ? 'todo' : 'done'
        return { ...t, status: next }
      }),
    }))
  },

  // ── Profile ───────────────────────────────────────────
  updateProfile: ({ name, email }) => {
    set((state) => {
      const updated = { ...state.currentUser, name, email }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated))
      return { currentUser: updated }
    })
  },

  changePassword: (oldPassword, newPassword) => {
    const { currentUser } = get()
    if (!currentUser) return false
    if (currentUser.password !== oldPassword) return false
    set((state) => {
      const updated = { ...state.currentUser, password: newPassword }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated))
      return { currentUser: updated }
    })
    return true
  },
}))

export default useAppStore
