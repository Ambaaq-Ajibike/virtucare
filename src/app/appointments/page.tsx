'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { CancelDialog } from '@/components/appointments/CancelDialog';
import { useAppointments } from '@/features/appointments/useAppointments';
import type { Appointment } from '@/types';

export default function AppointmentsPage() {
  const { upcoming, past, cancel, hydrated } = useAppointments();
  const [pendingCancel, setPendingCancel] = useState<Appointment | null>(null);

  function handleConfirmCancel() {
    if (pendingCancel) cancel(pendingCancel.id);
    setPendingCancel(null);
  }

  const isEmpty = hydrated && upcoming.length === 0 && past.length === 0;

  return (
    <main className="py-10 md:py-14">
      <Container>
        <header className="max-w-reading">
          <p className="text-sm uppercase tracking-[0.18em] text-ink-muted">
            Dashboard
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
            Your appointments.
          </h1>
          <p className="mt-4 text-base text-ink-muted">
            Everything you’ve booked, with past visits tucked below.
          </p>
        </header>

        <section className="mt-10">
          {!hydrated && <AppointmentsSkeleton />}

          {hydrated && isEmpty && (
            <EmptyState
              title="Nothing booked yet."
              description="Browse clinicians and pick a time that fits your week."
              action={
                <Link href="/doctors">
                  <Button>Find a doctor</Button>
                </Link>
              }
            />
          )}

          {hydrated && !isEmpty && (
            <div className="space-y-10">
              <section aria-labelledby="upcoming-heading">
                <div className="flex items-baseline justify-between">
                  <h2
                    id="upcoming-heading"
                    className="font-serif text-2xl text-ink"
                  >
                    Upcoming
                  </h2>
                  <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
                    {upcoming.length}{' '}
                    {upcoming.length === 1 ? 'appointment' : 'appointments'}
                  </p>
                </div>
                {upcoming.length === 0 ? (
                  <p className="mt-4 text-sm text-ink-muted">
                    No upcoming visits. Want to{' '}
                    <Link
                      href="/doctors"
                      className="text-accent hover:text-accent-ink"
                    >
                      book something
                    </Link>
                    ?
                  </p>
                ) : (
                  <div className="mt-4">
                    <AppointmentList
                      appointments={upcoming}
                      variant="upcoming"
                      onCancel={setPendingCancel}
                    />
                  </div>
                )}
              </section>

              {past.length > 0 && (
                <section aria-labelledby="past-heading">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-baseline justify-between border-t border-line pt-6 text-left marker:hidden">
                      <h2
                        id="past-heading"
                        className="font-serif text-2xl text-ink"
                      >
                        Past
                      </h2>
                      <span className="text-xs uppercase tracking-[0.12em] text-ink-muted transition-transform duration-150 ease-out group-open:opacity-60">
                        {past.length} · tap to {''}
                        <span className="group-open:hidden">expand</span>
                        <span className="hidden group-open:inline">hide</span>
                      </span>
                    </summary>
                    <div className="mt-4">
                      <AppointmentList appointments={past} variant="past" />
                    </div>
                  </details>
                </section>
              )}
            </div>
          )}
        </section>
      </Container>

      <CancelDialog
        appointment={pendingCancel}
        onConfirm={handleConfirmCancel}
        onClose={() => setPendingCancel(null)}
      />
    </main>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="space-y-4" aria-busy>
      <Skeleton className="h-7 w-32" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="rounded-md border border-line bg-surface p-5"
        >
          <div className="flex items-start gap-4">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
