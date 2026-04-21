import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
          'block w-full resize-y rounded border bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink placeholder:text-ink-muted/70',
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
Textarea.displayName = 'Textarea';
