'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/lib/date';
import type { Appointment } from '@/types';

type CancelDialogProps = {
  appointment: Appointment | null;
  onConfirm: () => void;
  onClose: () => void;
};

export function CancelDialog({
  appointment,
  onConfirm,
  onClose,
}: CancelDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // Sync imperative <dialog> open state with React state.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (appointment && !dialog.open) {
      dialog.showModal();
    } else if (!appointment && dialog.open) {
      dialog.close();
    }
  }, [appointment]);

  // ESC / backdrop dismiss fires the native `close` event — route it to onClose.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handler = () => onClose();
    dialog.addEventListener('close', handler);
    return () => dialog.removeEventListener('close', handler);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <dialog
      ref={ref}
      onClick={handleBackdropClick}
      className="w-full max-w-md rounded-md border border-line bg-surface p-0 text-ink shadow-xl backdrop:bg-ink/40"
    >
      {appointment && (
        <div className="p-6">
          <h2 className="font-serif text-xl text-ink">
            Cancel this appointment?
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            You’re about to cancel with{' '}
            <span className="text-ink">{appointment.doctorName}</span> on{' '}
            <span className="text-ink">
              {formatDateTime(appointment.date, appointment.time)}
            </span>
            . This can’t be undone — you’ll need to rebook.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Keep it
            </Button>
            <Button variant="danger" size="sm" onClick={onConfirm}>
              Cancel appointment
            </Button>
          </div>
        </div>
      )}
    </dialog>
  );
}
