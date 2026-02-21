import * as React from 'react'
import useAppStore from '@/store/useAppStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectItem } from '@/components/ui/select'
import { toast } from 'sonner'

const defaultForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  tags: '',
}

export default function TodoForm({ open, onOpenChange, todo = null }) {
  const addTodo = useAppStore((s) => s.addTodo)
  const updateTodo = useAppStore((s) => s.updateTodo)
  const isEdit = !!todo

  const [form, setForm] = React.useState(defaultForm)
  const [errors, setErrors] = React.useState({})

  React.useEffect(() => {
    if (open) {
      if (todo) {
        setForm({
          title: todo.title || '',
          description: todo.description || '',
          status: todo.status || 'todo',
          priority: todo.priority || 'medium',
          dueDate: todo.dueDate || '',
          tags: Array.isArray(todo.tags) ? todo.tags.join(', ') : todo.tags || '',
        })
      } else {
        setForm(defaultForm)
      }
      setErrors({})
    }
  }, [open, todo])

  function set(field, value) {
    setForm((p) => ({ ...p, [field]: value }))
    setErrors((p) => ({ ...p, [field]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    if (isEdit) {
      updateTodo(todo.id, form)
      toast.success('Todo updated', { 'data-testid': 'toast-success' })
    } else {
      addTodo(form)
      toast.success('Todo added', { 'data-testid': 'toast-success' })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="add-todo-dialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Todo' : 'Add Todo'}</DialogTitle>
        </DialogHeader>
        <form id="todo-form" onSubmit={handleSubmit} noValidate className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="todo-title">Title *</Label>
            <Input
              id="todo-title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Todo title"
              data-testid="todo-title-input"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p id="title-error" className="text-xs text-red-500" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="todo-description">Description</Label>
            <Input
              id="todo-description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Optional description"
              data-testid="todo-description-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="todo-status">Status</Label>
              <Select
                id="todo-status"
                value={form.status}
                onValueChange={(v) => set('status', v)}
                data-testid="todo-status-select"
              >
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="todo-priority">Priority</Label>
              <Select
                id="todo-priority"
                value={form.priority}
                onValueChange={(v) => set('priority', v)}
                data-testid="todo-priority-select"
              >
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="todo-due-date">Due Date</Label>
            <Input
              id="todo-due-date"
              type="date"
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
              data-testid="todo-due-date-input"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="todo-tags">Tags</Label>
            <Input
              id="todo-tags"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              placeholder="testing, automation"
              data-testid="todo-tags-input"
            />
            <p className="text-xs text-gray-400">Comma-separated</p>
          </div>
        </form>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="todo-cancel-btn"
          >
            Cancel
          </Button>
          <Button type="submit" form="todo-form" data-testid="todo-save-btn">
            {isEdit ? 'Save Changes' : 'Add Todo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
