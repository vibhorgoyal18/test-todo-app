import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import useAppStore from '@/store/useAppStore'
import TodoItem from './TodoItem'
import { Package } from 'lucide-react'

export default function TodoList({ todos, onEdit }) {
  const reorderTodos = useAppStore((s) => s.reorderTodos)
  const allTodos = useAppStore((s) => s.todos)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    // Find positions in the full todos array and reorder
    const oldIndex = allTodos.findIndex((t) => t.id === active.id)
    const newIndex = allTodos.findIndex((t) => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    reorderTodos(arrayMove(allTodos, oldIndex, newIndex))
  }

  if (todos.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-16 text-center"
      >
        <Package className="mb-3 h-10 w-10 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">No todos found</p>
        <p className="text-xs text-gray-400">Try adjusting your filters or add a new todo.</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
