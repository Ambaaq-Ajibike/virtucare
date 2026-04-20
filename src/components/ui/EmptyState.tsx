import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-line bg-surface/60 px-6 py-12 text-center">
      <p className="font-serif text-xl text-ink">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-reading text-sm text-ink-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
