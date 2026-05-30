'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signup } from '@/lib/api';

const signupHighlights = [
  'Secure onboarding for patients and doctors.',
  'Smart role assignment with modern UI and validation.',
  'Easy account creation with clear success feedback.',
];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordsMatch = formData.password === formData.confirmPassword;

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'doctor' || role === 'patient') {
      setFormData((prev) => ({ ...prev, role }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordsMatch) {
      setError('Passwords must match. Please check the confirmation field.');
      return;
    }

    setLoading(true);

    try {
      const data = await signup(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.confirmPassword,
        formData.role
      );

      if (!data.success) {
        setError(data.message || 'Signup failed. Please check your input.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(`/dashboard/${data.user.role}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.'
      );
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Join Crovo</p>
          <h1 className="mt-6 text-4xl font-bold text-white">Create your clinic-ready account.</h1>
          <p className="mt-4 max-w-xl text-slate-400 leading-7">
            Use Crovo to build secure patient, doctor, and admin experiences. The sign-up flow is designed to feel fast, modern, and production-ready.
          </p>

          <div className="mt-10 grid gap-4">
            {signupHighlights.map((item) => (
              <div key={item} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">About this app</p>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li>• Product: Crovo Healthcare Platform</li>
              <li>• Goal: role-based login, secure access, and admin oversight</li>
              <li>• Built to support patient bookings, doctor schedules, and admin controls</li>
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">New account</p>
            <h2 className="mt-4 text-3xl font-bold text-white">Sign up for Crovo</h2>
          </div>

          {error && (
            <div className="mt-6 rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200 ring-1 ring-rose-500/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">User type</label>
              <div className="mt-3 flex flex-wrap gap-3">
                {['patient', 'doctor'].map((roleOption) => (
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

            <div>
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="mt-2 text-sm text-amber-300">
                  Passwords do not match. Please make sure both fields are identical.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-cyan-500 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
