/* eslint-disable react-refresh/only-export-components */

import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center shrink-0 font-medium select-none',
  {
    variants: {
      variant: {
        lavender: 'bg-soft-lavender text-brand-dark',
        lilac: 'bg-soft-lilac text-brand-dark',
        secondary: 'bg-secondary text-white',
        outline: 'border border-soft-lavender text-brand-dark',
      },
      size: {
        sm: 'text-xs px-2 py-0.5 rounded',
        md: 'text-sm px-2.5 py-1 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'lavender',
      size: 'sm',
    },
  }
)

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }
