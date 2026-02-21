import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      ref={ref}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-gray-900 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
        checked ? 'bg-gray-900 text-white' : 'bg-white',
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      {checked && <Check className="h-3 w-3 mx-auto" strokeWidth={3} />}
    </button>
  )
})
Checkbox.displayName = 'Checkbox'

export { Checkbox }
