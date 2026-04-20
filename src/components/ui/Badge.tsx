import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'accent';
};

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        tone === 'neutral' && 'border-line bg-canvas text-ink-muted',
        tone === 'accent' && 'border-accent/25 bg-accent/10 text-accent-ink',
        className,
      )}
      {...props}
    />
  );
}
