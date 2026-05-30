'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { clearCache } from '@/lib/api';

interface Props {
  userName: string;
  userRole: string;
}

const navLinks = [
  { label: 'Doctors',      href: '#doctors' },
  { label: 'Specialities', href: '#specialities' },
  { label: 'Features',     href: '#features' },
  { label: 'Store',        href: '#store' },
];

export default function DashboardHeader({ userName, userRole }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearCache();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-page)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href={`/dashboard/${userRole}`}
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--accent)' }}
        >
          Crovo.
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-[var(--accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* User name pill */}
          <div className="hidden sm:block text-sm text-[var(--text-secondary)]">
            {userName}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
}
