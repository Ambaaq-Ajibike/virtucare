import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { NavBar } from '@/components/layout/NavBar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  axes: ['opsz'],
});

export const metadata: Metadata = {
  title: 'VirtuCare — Book a doctor, on your time',
  description:
    'Browse clinicians, pick a slot that fits your week, and keep track of your visits.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
