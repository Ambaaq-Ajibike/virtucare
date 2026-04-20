import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-shell flex-col justify-center px-6 py-20 md:px-10">
      <p className="text-sm uppercase tracking-[0.18em] text-ink-muted">
        VirtuCare
      </p>
      <h1 className="mt-4 font-serif text-5xl text-ink text-balance md:text-6xl">
        Find care that fits your week.
      </h1>
      <p className="mt-5 max-w-reading text-lg text-ink-muted text-pretty">
        Browse clinicians, pick a time that works, and keep your upcoming visits
        in one place. No phone tag, no waiting rooms.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/doctors"
          className="inline-flex h-11 items-center rounded bg-accent px-5 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-accent-ink"
        >
          Browse doctors
        </Link>
        <Link
          href="/appointments"
          className="inline-flex h-11 items-center rounded border border-line bg-surface px-5 text-sm font-medium text-ink transition-colors duration-150 ease-out hover:border-ink/40"
        >
          My appointments
        </Link>
      </div>
    </main>
  );
}
