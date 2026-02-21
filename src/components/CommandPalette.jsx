import * as React from 'react'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef(null)

  React.useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  React.useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        data-testid="command-palette"
        className="fixed left-1/2 top-1/3 z-50 w-full max-w-md -translate-x-1/2 rounded-xl border bg-white shadow-2xl"
      >
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="border-0 shadow-none focus-visible:ring-0 py-4 h-12"
            data-testid="command-palette-input"
          />
          <button
            type="button"
            onClick={onClose}
            className="ml-2 rounded-sm p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close command palette"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 text-sm text-gray-500">
          {query ? (
            <p>No results for &ldquo;{query}&rdquo;</p>
          ) : (
            <p>Start typing to search commands...</p>
          )}
        </div>
      </div>
    </>
  )
}
