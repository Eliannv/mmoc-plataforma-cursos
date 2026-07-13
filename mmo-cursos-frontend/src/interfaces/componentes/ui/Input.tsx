import { forwardRef, type InputHTMLAttributes, type LabelHTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-brand-dark placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:opacity-60 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-sm font-medium text-brand-dark mb-1', className)}
      {...props}
    />
  )
)
Label.displayName = 'Label'

function InputError({ className, children, ...props }: { className?: string; children?: React.ReactNode }) {
  if (!children) return null
  return (
    <p className={cn('text-xs text-error mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export { Input, Label, InputError }
