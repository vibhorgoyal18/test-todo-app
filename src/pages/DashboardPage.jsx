import * as React from 'react'
import useAppStore from '@/store/useAppStore'
import { useAuth } from '@/hooks/useAuth'
import StatsCard from '@/features/dashboard/StatsCard'
import { Button } from '@/components/ui/button'
import TodoForm from '@/features/todos/TodoForm'
import { ListTodo, CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react'

function isOverdue(todo) {
  if (!todo.dueDate) return false
  if (todo.status === 'done') return false
  return new Date(todo.dueDate) < new Date(new Date().toDateString())
}

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const todos = useAppStore((s) => s.todos)
  const [addOpen, setAddOpen] = React.useState(false)

  const userTodos = todos.filter((t) => t.userId === currentUser?.id)

  const stats = {
    total: userTodos.length,
    completed: userTodos.filter((t) => t.status === 'done').length,
    inProgress: userTodos.filter((t) => t.status === 'in-progress').length,
    overdue: userTodos.filter(isOverdue).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {currentUser?.name}</p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          data-testid="quick-add-btn"
        >
          <Plus className="h-4 w-4" />
          Quick Add
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          testid="stat-total"
          label="Total Todos"
          value={stats.total}
          icon={ListTodo}
          color="bg-blue-100 text-blue-600"
        />
        <StatsCard
          testid="stat-completed"
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="bg-green-100 text-green-600"
        />
        <StatsCard
          testid="stat-in-progress"
          label="In Progress"
          value={stats.inProgress}
          icon={Clock}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatsCard
          testid="stat-overdue"
          label="Overdue"
          value={stats.overdue}
          icon={AlertCircle}
          color="bg-red-100 text-red-600"
        />
      </div>

      <TodoForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
