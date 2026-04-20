import { Suspense } from 'react';
import { Container } from '@/components/layout/Container';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { doctors } from '@/data/doctors';

export const metadata = {
  title: 'Doctors — VirtuCare',
};

function DoctorGrid() {
  return (
    <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {doctors.map((doctor) => (
        <li key={doctor.id}>
          <DoctorCard doctor={doctor} />
        </li>
      ))}
    </ul>
  );
}

function DoctorCardSkeleton() {
  return (
    <div className="rounded-md border border-line bg-surface p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="mt-5 space-y-2">
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
      <div className="mt-6 border-t border-line pt-4">
        <Skeleton className="ml-auto h-4 w-32" />
      </div>
    </div>
  );
}

function DoctorGridFallback() {
  return (
    <ul className="grid grid-cols-1 gap-5 md:grid-cols-2" aria-busy>
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i}>
          <DoctorCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export default function DoctorsPage() {
  return (
    <main className="py-12 md:py-16">
      <Container>
        <header className="max-w-reading">
          <p className="text-sm uppercase tracking-[0.18em] text-ink-muted">
            Clinicians
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
            Find a doctor that fits your week.
          </h1>
          <p className="mt-4 text-base text-ink-muted">
            {doctors.length} clinicians currently taking new appointments. Pick
            a name to see openings in the next two weeks.
          </p>
        </header>

        <section className="mt-10">
          <Suspense fallback={<DoctorGridFallback />}>
            <DoctorGrid />
          </Suspense>
        </section>
      </Container>
    </main>
  );
}
