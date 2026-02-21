import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-900 text-white',
        secondary: 'border-transparent bg-gray-100 text-gray-800',
        destructive: 'border-transparent bg-red-500 text-white',
        outline: 'text-gray-800',
        high: 'border-transparent bg-red-100 text-red-700',
        medium: 'border-transparent bg-yellow-100 text-yellow-700',
        low: 'border-transparent bg-green-100 text-green-700',
        'in-progress': 'border-transparent bg-blue-100 text-blue-700',
        done: 'border-transparent bg-green-100 text-green-700',
        todo: 'border-transparent bg-gray-100 text-gray-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
