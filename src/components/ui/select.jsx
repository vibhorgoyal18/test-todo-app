import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

// Lightweight select built on native <select> for simplicity and Playwright testability
const Select = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        className={cn(
          'flex h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-1 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  )
})
Select.displayName = 'Select'

const SelectItem = ({ value, children, ...props }) => (
  <option value={value} {...props}>
    {children}
  </option>
)

export { Select, SelectItem }
