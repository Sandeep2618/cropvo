'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardHeader from '@/components/DashboardHeader';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const initialized = useRef(false);

  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const user = storedUser ? (JSON.parse(storedUser) as User) : null;
  const isAuthorized = user?.role === 'doctor' && !!token;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (!isAuthorized) router.replace('/login');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-page)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <DashboardHeader userName={user?.name ?? ''} userRole="doctor" />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-xl">

          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>Doctor dashboard</div>
            <div className="pt-3 text-3xl font-bold text-[var(--text-primary)]">Hello Dr. {user?.name}</div>
            <div className="pt-2 text-[var(--text-secondary)]">Review patient appointments, manage records, and stay organized.</div>
          </div>

          <div className="pt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: 'My Appointments', desc: 'Stay on top of upcoming patient slots and scheduled visits.', href: '#' },
              { title: 'Medical Store',   desc: 'Order clinic supplies and medicines from the Crovo store.', href: '/dashboard/doctor/store' },
              { title: 'Profile',         desc: 'Update specialty and contact details in your professional profile.', href: '#' },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-inner)] p-6 transition hover:border-[var(--accent)] block"
              >
                <div className="text-lg font-semibold text-[var(--text-primary)]">{card.title}</div>
                <div className="pt-3 text-sm text-[var(--text-secondary)]">{card.desc}</div>
              </Link>
            ))}
          </div>

          <div className="pt-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-inner)] p-6">
            <div className="text-lg font-semibold text-[var(--text-primary)]">Doctor information</div>
            <div className="pt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Name',  value: user?.name },
                { label: 'Email', value: user?.email },
                { label: 'Role',  value: user?.role },
              ].map((field) => (
                <div key={field.label} className="rounded-xl bg-[var(--bg-surface)] p-4">
                  <div className="text-xs text-[var(--text-muted)]">{field.label}</div>
                  <div className="pt-1.5 font-medium text-[var(--text-primary)]">{field.value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
