'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import StoreCatalog from '@/components/store/StoreCatalog';
import { CartProvider } from '@/lib/cart-context';

interface User {
  id: string;
  name: string;
  role: string;
}

export default function DoctorStorePage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedUser || !storedToken) {
      router.replace('/login');
      return;
    }

    const parsed = JSON.parse(storedUser) as User;
    if (parsed.role !== 'doctor') {
      router.replace('/login');
      return;
    }

    Promise.resolve().then(() => {
      setUser(parsed);
      setToken(storedToken);
      setLoading(false);
    });
  }, [router]);

  if (loading || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
        <DashboardHeader userName={user?.name ?? ''} userRole="doctor" />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-xl">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                Medical store
              </div>
              <div className="pt-3 text-3xl font-bold text-[var(--text-primary)]">Clinic supplies & medicines</div>
              <div className="pt-2 text-[var(--text-secondary)]">
                Order medicines for your practice or patient recommendations from the Crovo store.
              </div>
            </div>

            <div className="pt-8">
              <StoreCatalog token={token} />
            </div>
          </div>
        </div>
      </div>
    </CartProvider>
  );
}
