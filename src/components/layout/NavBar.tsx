import Link from 'next/link';
import { Container } from './Container';

const NAV_LINKS = [
  { href: '/doctors', label: 'Doctors' },
  { href: '/appointments', label: 'Appointments' },
];

export function NavBar() {
  return (
    <header className="border-b border-line bg-canvas/85 backdrop-blur supports-[backdrop-filter]:bg-canvas/70">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-baseline gap-1.5 text-ink transition-opacity duration-150 ease-out hover:opacity-80"
        >
          <span className="font-serif text-xl tracking-tight">VirtuCare</span>
          <span
            aria-hidden
            className="h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-accent"
          />
        </Link>
        <nav className="flex items-center gap-0.5 text-sm sm:gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-2.5 py-2 text-ink-muted transition-colors duration-150 ease-out hover:text-ink sm:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
