import * as React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useAppStore from '@/store/useAppStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function formatDate(d) {
  if (!d) return ''
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch {
    return d
  }
}

export default function TodoItem({ todo, onEdit }) {
  const toggleTodo = useAppStore((s) => s.toggleTodo)
  const deleteTodo = useAppStore((s) => s.deleteTodo)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function handleDelete() {
    if (window.confirm(`Delete "${todo.title}"?`)) {
      deleteTodo(todo.id)
      toast.success('Todo deleted', { 'data-testid': 'toast-success' })
    }
  }

  function handleToggle() {
    toggleTodo(todo.id)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`todo-item-${todo.id}`}
      className={cn(
        'flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm transition-shadow',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-gray-900'
      )}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        data-testid={`todo-drag-handle-${todo.id}`}
        aria-label="Drag to reorder"
        className="mt-0.5 cursor-grab touch-none text-gray-300 hover:text-gray-500 active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Checkbox */}
      <Checkbox
        checked={todo.status === 'done'}
        onCheckedChange={handleToggle}
        data-testid={`todo-checkbox-${todo.id}`}
        aria-label={`Mark "${todo.title}" as ${todo.status === 'done' ? 'incomplete' : 'done'}`}
        className="mt-0.5"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span
            className={cn(
              'font-medium text-gray-900 leading-tight',
              todo.status === 'done' && 'line-through text-gray-400'
            )}
          >
            {todo.title}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <Badge variant={todo.priority}>{todo.priority}</Badge>
            <Badge variant={todo.status}>{todo.status}</Badge>
          </div>
        </div>
        {todo.description && (
          <p className="mt-1 text-sm text-gray-500 truncate">{todo.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {todo.dueDate && (
            <span className="text-xs text-gray-400">📅 {formatDate(todo.dueDate)}</span>
          )}
          {Array.isArray(todo.tags) && todo.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
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
          onClick={handleDelete}
          data-testid={`todo-delete-${todo.id}`}
          aria-label={`Delete "${todo.title}"`}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
