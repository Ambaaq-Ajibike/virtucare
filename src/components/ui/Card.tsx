import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-line bg-surface',
        interactive &&
          'transition-colors duration-150 ease-out hover:border-ink/35',
        className,
      )}
      {...props}
    />
  );
}
