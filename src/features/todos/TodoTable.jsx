import * as React from 'react'
import useAppStore from '@/store/useAppStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch {
    return d
  }
}

export default function TodoTable({ todos, onEdit }) {
  const toggleTodo = useAppStore((s) => s.toggleTodo)
  const deleteTodo = useAppStore((s) => s.deleteTodo)

  function handleDelete(todo) {
    if (window.confirm(`Delete "${todo.title}"?`)) {
      deleteTodo(todo.id)
      toast.success('Todo deleted')
    }
  }

  if (todos.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-16 text-center"
      >
        <p className="text-sm font-medium text-gray-500">No todos found</p>
        <p className="text-xs text-gray-400">Try adjusting your filters or add a new todo.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm" data-testid="todo-table">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="w-10 px-4 py-3">Done</th>
            <th className="px-4 py-3">Title</th>
            <th className="hidden px-4 py-3 md:table-cell">Description</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="hidden px-4 py-3 lg:table-cell">Due Date</th>
            <th className="hidden px-4 py-3 lg:table-cell">Tags</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {todos.map((todo) => (
            <tr
              key={todo.id}
              data-testid={`todo-item-${todo.id}`}
              className={cn(
                'transition-colors hover:bg-gray-50',
                todo.status === 'done' && 'opacity-60'
              )}
            >
              <td className="px-4 py-3">
                <Checkbox
                  checked={todo.status === 'done'}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  data-testid={`todo-checkbox-${todo.id}`}
                  aria-label={`Mark "${todo.title}" as ${todo.status === 'done' ? 'incomplete' : 'done'}`}
                />
              </td>
              <td className="max-w-[200px] px-4 py-3 font-medium text-gray-900">
                <span className={cn(todo.status === 'done' && 'line-through text-gray-400')}>
                  {todo.title}
                </span>
              </td>
              <td className="hidden max-w-[240px] px-4 py-3 text-gray-500 md:table-cell">
                <span className="line-clamp-2">{todo.description || '—'}</span>
              </td>
              <td className="px-4 py-3">
                <Badge variant={todo.priority}>{todo.priority}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={todo.status}>{todo.status}</Badge>
              </td>
              <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">
                {formatDate(todo.dueDate)}
              </td>
              <td className="hidden px-4 py-3 lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(todo.tags) && todo.tags.length > 0
                    ? todo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))
                    : '—'}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(todo)}
                    data-testid={`todo-edit-${todo.id}`}
                    aria-label={`Edit "${todo.title}"`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(todo)}
                    data-testid={`todo-delete-${todo.id}`}
                    aria-label={`Delete "${todo.title}"`}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
