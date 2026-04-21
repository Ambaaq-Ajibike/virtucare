import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'h-11 w-full rounded border bg-surface px-3 text-sm text-ink placeholder:text-ink-muted/70',
          'transition-colors duration-150 ease-out',
          invalid
            ? 'border-danger/60 focus:border-danger'
            : 'border-line hover:border-ink/30 focus:border-accent',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
