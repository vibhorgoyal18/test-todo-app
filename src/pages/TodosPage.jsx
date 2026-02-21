import * as React from 'react'
import useAppStore from '@/store/useAppStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import TodoList from '@/features/todos/TodoList'
import TodoFilters from '@/features/todos/TodoFilters'
import TodoForm from '@/features/todos/TodoForm'
import { Plus } from 'lucide-react'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

const defaultFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  sort: 'dueDate',
}

function applyFiltersAndSort(todos, filters) {
  let result = [...todos]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter((t) => t.title.toLowerCase().includes(q))
  }
  if (filters.status !== 'all') {
    result = result.filter((t) => t.status === filters.status)
  }
  if (filters.priority !== 'all') {
    result = result.filter((t) => t.priority === filters.priority)
  }

  result.sort((a, b) => {
    switch (filters.sort) {
      case 'priority':
        return (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'dueDate':
      default:
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
    }
  })

  return result
}

export default function TodosPage() {
  const { currentUser } = useAuth()
  const todos = useAppStore((s) => s.todos)
  const [filters, setFilters] = React.useState(defaultFilters)
  const [addOpen, setAddOpen] = React.useState(false)
  const [editTodo, setEditTodo] = React.useState(null)

  const userTodos = todos.filter((t) => t.userId === currentUser?.id)
  const filtered = applyFiltersAndSort(userTodos, filters)

  function handleEdit(todo) {
    setEditTodo(todo)
  }

  function handleEditClose(val) {
    if (!val) setEditTodo(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Todos</h1>
        <Button onClick={() => setAddOpen(true)} data-testid="add-todo-btn">
          <Plus className="h-4 w-4" />
          Add Todo
        </Button>
      </div>

      <TodoFilters filters={filters} onChange={setFilters} />

      <TodoList todos={filtered} onEdit={handleEdit} />

      <TodoForm open={addOpen} onOpenChange={setAddOpen} />

      {editTodo && (
        <TodoForm
          open={!!editTodo}
          onOpenChange={handleEditClose}
          todo={editTodo}
        />
      )}
    </div>
  )
}
