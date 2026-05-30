'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function PatientDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      router.replace('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser) as User;
    if (parsedUser.role !== 'patient') {
      router.replace('/login');
      return;
    }

    // Schedule state updates in a microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => {
      setUser(parsedUser);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-page)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <DashboardHeader userName={user?.name ?? ''} userRole="patient" />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-xl">

          {/* ── Page title ── */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>Patient dashboard</div>
            <div className="pt-3 text-3xl font-bold text-[var(--text-primary)]">Welcome back, {user?.name}</div>
            <div className="pt-2 text-[var(--text-secondary)]">Book appointments, view medicines, and keep your profile up to date.</div>
          </div>

          {/* ── Cards ── */}
          <div className="pt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Book Doctor',  desc: 'Browse available specialists and schedule appointments with confidence.' },
              { title: 'Medicine',     desc: 'View prescriptions and treatment details created by your care team.' },
              { title: 'Profile',      desc: 'Update your personal information and contact preferences.' },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-inner)] p-6 transition hover:border-[var(--accent)]">
                <div className="text-lg font-semibold text-[var(--text-primary)]">{card.title}</div>
                <div className="pt-3 text-sm text-[var(--text-secondary)]">{card.desc}</div>
              </div>
            ))}
          </div>

          {/* ── Profile info ── */}
          <div className="pt-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-inner)] p-6">
            <div className="text-lg font-semibold text-[var(--text-primary)]">Your profile</div>
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
