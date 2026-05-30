'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const doctors = [
  { name: 'Dr. Sarah Patel', specialty: 'Dermatologist', available: true },
  { name: 'Dr. Emily Larson', specialty: 'Gynecologist', available: true },
  { name: 'Dr. Andrew Williams', specialty: 'Gastroenterologist', available: false },
];

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const staggerFade = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const cardMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <motion.header
        className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
            Crovo
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-300">Logged in as {user.role}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      <motion.main
        className="relative overflow-hidden"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        transition={{ duration: 0.75, ease: 'easeOut' }}
      >
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_42%)]" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <motion.section
          className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
          variants={staggerFade}
        >
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex rounded-full bg-slate-800/60 px-4 py-1 text-sm font-semibold tracking-wide text-emerald-300">
                Trusted by 10,000+ patients worldwide
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                Book Appointments With
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">Trusted Doctors Online</span>
              </h1>

              <p className="max-w-2xl text-lg text-slate-300">
                Find experienced doctors, book appointments instantly, manage your medical records, and order medical products — all from one premium healthcare platform.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    aria-label="Search doctors"
                    placeholder="Search doctors, specialities, hospitals..."
                    className="w-full rounded-full border border-slate-800 bg-slate-900/70 py-3 pl-12 pr-36 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-lg">
                    Find Doctor
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link href="#doctors" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg">
                  Book Appointment
                </Link>
                <Link href="#features" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-100">
                  Explore Services
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-3">
                  <img src="/file.svg" className="h-9 w-9 rounded-full ring-1 ring-slate-800" alt="avatar" />
                  <img src="/next.svg" className="h-9 w-9 rounded-full ring-1 ring-slate-800" alt="avatar" />
                  <img src="/vercel.svg" className="h-9 w-9 rounded-full ring-1 ring-slate-800" alt="avatar" />
                </div>
                <p className="text-sm text-slate-300">Rated 4.9 by 2,000+ patients</p>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] bg-gradient-to-br from-indigo-900/40 to-violet-900/30 p-6 shadow-2xl">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 p-8">
                  <img
                    src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8b4a0b2b6a6d4f2e3e5a6f9c8a3e2b1a"
                    alt="Doctor"
                    className="w-full max-h-[420px] object-cover rounded-2xl shadow-lg"
                  />

                  <div className="absolute left-6 top-6 rounded-lg bg-slate-900/60 p-3 text-sm text-slate-200">
                    <div className="text-xs text-slate-300">Next appointment</div>
                    <div className="font-semibold">Tomorrow, 10:30 AM</div>
                  </div>

                  <div className="absolute right-6 bottom-6 rounded-lg bg-slate-900/60 p-3 text-sm text-slate-200">
                    <div className="text-xs text-slate-300">Health Score</div>
                    <div className="font-semibold">98/100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="grid gap-10 rounded-[2rem] border border-slate-800 bg-slate-900/85 p-10 shadow-2xl shadow-slate-950/30 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Why Crovo</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Built for every role in the healthcare cycle</h2>
              <p className="mt-4 text-slate-300 leading-8">
                Patients get a simple booking experience, doctors stay organized, and admins keep the system secure with one unified platform.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/85 p-6">
                <h3 className="text-lg font-semibold text-white">Patient Portal</h3>
                <p className="mt-3 text-slate-400">Book appointments, manage your profile, and access care details from one place.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/85 p-6">
                <h3 className="text-lg font-semibold text-white">Doctor workflows</h3>
                <p className="mt-3 text-slate-400">Review patient history, manage appointments, and keep notes in a unified workflow.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/85 p-6">
                <h3 className="text-lg font-semibold text-white">Admin control</h3>
                <p className="mt-3 text-slate-400">Approve users, assign roles, and monitor system activity with tight controls.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/85 p-6">
                <h3 className="text-lg font-semibold text-white">Secure access</h3>
                <p className="mt-3 text-slate-400">Role-based authorization keeps your data private and your teams protected.</p>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}
