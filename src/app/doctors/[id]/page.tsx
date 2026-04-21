import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { DoctorAvatar } from '@/components/doctors/DoctorAvatar';
import { SpecialtyBadge } from '@/components/doctors/SpecialtyBadge';
import { BookingForm } from '@/components/booking/BookingForm';
import { doctors, getDoctorById } from '@/data/doctors';

type PageProps = { params: { id: string } };

export function generateStaticParams() {
  return doctors.map((d) => ({ id: d.id }));
}

export function generateMetadata({ params }: PageProps) {
  const doctor = getDoctorById(params.id);
  return {
    title: doctor ? `Book ${doctor.name} — VirtuCare` : 'Doctor — VirtuCare',
  };
}

export default function DoctorDetailPage({ params }: PageProps) {
  const doctor = getDoctorById(params.id);
  if (!doctor) notFound();

  return (
    <main className="py-10 md:py-14">
      <Container>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors duration-150 ease-out hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          All doctors
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <section>
            <div className="flex items-start gap-4">
              <DoctorAvatar name={doctor.name} size="lg" />
              <div className="min-w-0">
                <h1 className="font-serif text-3xl leading-tight text-ink md:text-4xl">
                  {doctor.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <SpecialtyBadge specialty={doctor.specialty} />
                  <span className="text-xs text-ink-muted">
                    {doctor.yearsExperience} yrs experience
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-reading text-base leading-relaxed text-ink-muted">
              {doctor.bio}
            </p>

            <div className="mt-8 border-t border-line pt-6">
              <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
                Weekly hours
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
                {WEEKDAYS.map(({ index, label }) => {
                  const slots = doctor.availability[index];
                  if (!slots || slots.length === 0) return null;
                  return (
                    <li key={index} className="flex gap-3">
                      <span className="w-16 shrink-0 text-ink">{label}</span>
                      <span>
                        {slots.length} slot{slots.length === 1 ? '' : 's'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section aria-labelledby="booking-heading">
            <h2
              id="booking-heading"
              className="font-serif text-2xl text-ink"
            >
              Book a time
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Choose a day in the next 30 days, pick an open slot, and tell us
              briefly what you’d like to discuss.
            </p>
            <div className="mt-6">
              <BookingForm doctor={doctor} />
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}

const WEEKDAYS: Array<{ index: 0 | 1 | 2 | 3 | 4 | 5 | 6; label: string }> = [
  { index: 1, label: 'Mon' },
  { index: 2, label: 'Tue' },
  { index: 3, label: 'Wed' },
  { index: 4, label: 'Thu' },
  { index: 5, label: 'Fri' },
  { index: 6, label: 'Sat' },
  { index: 0, label: 'Sun' },
];
