import type { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 select-none ' +
    'disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-ink hover:bg-brand-hover',
        secondary: 'border border-line bg-surface text-ink hover:bg-surface-subtle',
        ghost: 'text-ink hover:bg-surface-subtle',
        // destructive action, always behind a confirm dialog
        danger: 'bg-accent text-white hover:bg-accent/90',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-[15px]',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  // renders the child element with button styles e.g. a Link
  asChild?: boolean;
  // shows a spinner and disables repeat clicks
  loading?: boolean;
}

export function Button({ className, variant, size, asChild, loading, disabled, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {/* Slot requires a single child so asChild links do not get the spinner */}
      {asChild ? children : (
        <>
          {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
          {children}
        </>
      )}
    </Comp>
  );
}
