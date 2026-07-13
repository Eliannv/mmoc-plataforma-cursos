/* eslint-disable react-refresh/only-export-components */

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 select-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/85',
        accent: 'bg-accent text-brand-dark hover:bg-accent/85',
        secondary: 'bg-secondary text-white hover:bg-secondary/85',
        ghost: 'bg-transparent text-primary hover:bg-soft-lavender/25',
        outline: 'border border-primary text-primary hover:bg-soft-lavender/20',
      },
      size: {
        sm: 'text-xs rounded px-3 py-1.5',
        md: 'text-sm rounded-md px-4 py-2',
        lg: 'text-base rounded-lg px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
export type { ButtonProps }
