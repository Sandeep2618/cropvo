'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';

const roleOptions = ['patient', 'doctor', 'admin'] as const;

type Role = (typeof roleOptions)[number];

type FormState = {
  email: string;
  password: string;
  role: Role;
};

export default function LoginPage() {
  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: '',
    role: 'patient',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const role = searchParams.get('role');
    if (roleOptions.includes(role as Role)) {
      setFormData((prev) => ({ ...prev, role: role as Role }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData.email.trim(), formData.password, formData.role);

      if (!data.success) {
        setError(data.message || 'Login failed. Please verify your credentials.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(`/dashboard/${data.user.role}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Crovo</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">Crovo</h1>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200 ring-1 ring-rose-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300">Role</label>
            <div className="mt-3 flex flex-wrap gap-3">
              {roleOptions.map((roleOption) => (
                <button
                  key={roleOption}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: roleOption }))}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    formData.role === roleOption
                      ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                      : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-cyan-500 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don’t have an account?{' '}
          <Link href="/signup" className="font-medium text-cyan-400 hover:text-cyan-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
