'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'patient') {
      router.push('/login');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="text-lg font-medium">Loading patient dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Patient dashboard</p>
              <h1 className="mt-4 text-3xl font-bold text-white">Welcome back, {user?.name}</h1>
              <p className="mt-2 text-slate-400">Book appointments, view medicines, and keep your profile up to date.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-right">
              <p className="text-sm text-slate-400">Current role</p>
              <p className="mt-2 text-lg font-semibold text-white">{user?.role}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="text-lg font-semibold text-white">Book Doctor</h2>
              <p className="mt-3 text-slate-400">Browse available specialists and schedule appointments with confidence.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="text-lg font-semibold text-white">Medicine</h2>
              <p className="mt-3 text-slate-400">View prescriptions and treatment details created by your care team.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="text-lg font-semibold text-white">Profile</h2>
              <p className="mt-3 text-slate-400">Update your personal information and contact preferences.</p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Your profile</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">Name</p>
                <p className="mt-2 text-white">{user?.name}</p>
              </div>
              <div className="rounded-2xl bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">Email</p>
                <p className="mt-2 text-white">{user?.email}</p>
              </div>
              <div className="rounded-2xl bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">Role</p>
                <p className="mt-2 text-white">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
