import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectItem } from '@/components/ui/select'
import { X } from 'lucide-react'

export default function TodoFilters({ filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  function clearAll() {
    onChange({ search: '', status: 'all', priority: 'all', sort: 'dueDate' })
  }

  const hasActive =
    filters.search || filters.status !== 'all' || filters.priority !== 'all'

  return (
    <div
      data-testid="filters-bar"
      className="flex flex-wrap items-end gap-3"
    >
      <div className="flex-1 min-w-[180px]">
        <Input
          placeholder="Search todos…"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          data-testid="search-input"
          aria-label="Search todos"
        />
      </div>

      <div className="min-w-[130px]">
        <Select
          value={filters.status}
          onValueChange={(v) => set('status', v)}
          data-testid="status-filter"
          aria-label="Filter by status"
        >
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="todo">Todo</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </Select>
      </div>

      <div className="min-w-[130px]">
        <Select
          value={filters.priority}
          onValueChange={(v) => set('priority', v)}
          data-testid="priority-filter"
          aria-label="Filter by priority"
        >
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </Select>
      </div>

      <div className="min-w-[130px]">
        <Select
          value={filters.sort}
          onValueChange={(v) => set('sort', v)}
          data-testid="sort-select"
          aria-label="Sort todos"
        >
          <SelectItem value="dueDate">Due Date</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="title">Title</SelectItem>
        </Select>
      </div>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          data-testid="clear-filters-btn"
          className="gap-1"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
