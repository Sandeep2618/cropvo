'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

// ── Data ──────────────────────────────────────────────────────────────────

const stats = [
  { value: '10K+', label: 'Happy Patients' },
  { value: '500+', label: 'Verified Doctors' },
  { value: '50+',  label: 'Partner Hospitals' },
  { value: '24/7', label: 'Customer Support' },
];

const specialities = [
  { name: 'Dentist',       emoji: '🦷' },
  { name: 'Cardiologist',  emoji: '❤️' },
  { name: 'Neurologist',   emoji: '🧠' },
  { name: 'Dermatologist', emoji: '🩺' },
  { name: 'Pediatrician',  emoji: '👶' },
  { name: 'Orthopedic',    emoji: '🦴' },
];

const doctors = [
  { name: 'Dr. Aarav Sharma',  specialty: 'Cardiologist',   exp: 12, rating: 4.9, next: '10:30 AM', img: 'https://crovo-landing.lovable.app/assets/doctor-1-CpI3LroS.jpg' },
  { name: 'Dr. Sophia Lee',    specialty: 'Dermatologist',  exp: 8,  rating: 4.8, next: '1:00 PM',  img: 'https://crovo-landing.lovable.app/assets/doctor-2-0naQ4cSG.jpg' },
  { name: 'Dr. Kenji Tanaka',  specialty: 'Neurologist',    exp: 15, rating: 5.0, next: '3:15 PM',  img: 'https://crovo-landing.lovable.app/assets/doctor-3-Do9VbZYR.jpg' },
  { name: 'Dr. Amara Okafor',  specialty: 'Pediatrician',   exp: 10, rating: 4.9, next: '5:00 PM',  img: 'https://crovo-landing.lovable.app/assets/doctor-4-BvIp_mX4.jpg' },
];

const products = [
  { tag: 'SUPPLEMENT', name: 'Vitamin D3 Supplements',        price: 24 },
  { tag: 'DEVICE',     name: 'Digital Blood Pressure Monitor', price: 89 },
  { tag: 'MEDICINE',   name: 'Pain Relief Tablets',            price: 12 },
  { tag: 'DEVICE',     name: 'Smart Pulse Oximeter',           price: 45 },
];

const features = [
  { icon: '📅', title: 'Easy Appointment Booking',  desc: 'Book in under 30 seconds with real-time availability.' },
  { icon: '✅', title: 'Verified Doctors',           desc: 'Every doctor is hand-verified with medical credentials.' },
  { icon: '🔒', title: 'Secure Medical Records',    desc: 'Bank-grade encryption keeps your records private.' },
  { icon: '🎥', title: 'Online Consultation',        desc: 'HD video calls with doctors from anywhere.' },
  { icon: '🚚', title: 'Fast Medicine Delivery',     desc: 'Same-day delivery on prescription medicines.' },
  { icon: '🤖', title: 'AI Health Assistant',        desc: '24/7 symptom checker powered by medical AI.' },
];

const steps = [
  { step: '01', title: 'Search Doctor',      desc: 'Browse by speciality, location or rating.' },
  { step: '02', title: 'Book Appointment',   desc: 'Pick a slot and confirm in one tap.' },
  { step: '03', title: 'Get Treatment',      desc: 'Visit in person or consult online.' },
];

const testimonials = [
  { quote: 'Booked a cardiologist in 2 minutes. The doctor was kind, on time and the records sync was seamless.', name: 'Priya Mehta',   role: 'Patient' },
  { quote: 'The medicine delivery is unreal — arrived same day. Crovo is now my default healthcare app.',         name: 'James Carter', role: 'Patient' },
  { quote: 'Video consult worked flawlessly. Loved the clean UI and that everything lives in one place.',          name: 'Anaya Singh',  role: 'Patient' },
];

const faqs = [
  { q: 'How do I book an appointment?',  a: 'Search a doctor, pick a slot, and confirm — it takes under 30 seconds.' },
  { q: 'Are all doctors verified?',      a: 'Yes. Every doctor goes through a credential verification process before joining Crovo.' },
  { q: 'Is my medical data secure?',     a: 'Absolutely. We use bank-grade AES-256 encryption and are fully HIPAA compliant.' },
  { q: 'How fast is medicine delivery?', a: 'Same-day delivery is available in major cities. Most orders arrive within 4–6 hours.' },
  { q: 'Can I consult online?',          a: 'Yes. HD video consultations are available with all verified doctors on the platform.' },
];

const patientFeatures = [
  'Find the right doctor in seconds',
  'HD video consultations from home',
  'Same-day medicine delivery',
  'Your records, securely in one place',
];

const doctorFeatures = [
  'Smart scheduling & reminders',
  'Unified patient history & notes',
  'Transparent payouts & analytics',
  'HIPAA-grade security built-in',
];

// ── Component ─────────────────────────────────────────────────────────────

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const router = useRouter();
  const checked = useRef(false);

  // Check for existing session — redirect before any render
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.role) {
          router.replace(`/dashboard/${parsed.role}`);
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">

      {/* ── Navbar ── */}
      <motion.header
        className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-page)]/90 backdrop-blur-xl"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
            Crovo.
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <Link href="#doctors" className="hover:text-[var(--accent)] transition-colors">Doctors</Link>
            <Link href="#specialities" className="hover:text-[var(--accent)] transition-colors">Specialities</Link>
            <Link href="#features" className="hover:text-[var(--accent)] transition-colors">Features</Link>
            <Link href="#store" className="hover:text-[var(--accent)] transition-colors">Store</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <motion.section
        className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 overflow-hidden"
        initial="initial" animate="animate" variants={stagger}
      >
        {/* background glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: 'var(--accent)' }} />

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <motion.div variants={fadeUp} className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--accent-light)] px-4 py-1.5 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
              Trusted by 10,000+ patients worldwide
            </div>

            <div className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-[var(--text-primary)]">
              Book Appointments With{' '}
              <span style={{ color: 'var(--accent)' }}>Trusted Doctors</span>{' '}
              Online
            </div>

            <div className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Find experienced doctors, book appointments instantly, manage your medical records, and order medical products — all from one premium healthcare platform.
            </div>

            {/* Search bar */}
            <div className="relative max-w-lg">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                aria-label="Search doctors"
                placeholder="Search doctors, specialities..."
                className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-surface)] py-3.5 pl-11 pr-36 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
              />
              <button
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full px-5 py-2 text-sm font-semibold text-white"
                style={{ background: 'var(--accent)' }}
              >
                Find Doctor
              </button>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="#doctors"
                className="rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                style={{ background: 'var(--accent)' }}
              >
                Book Appointment
              </Link>
              <Link
                href="#features"
                className="rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)]"
              >
                Explore Services
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[var(--bg-page)] bg-[var(--bg-inner)] flex items-center justify-center text-xs font-bold" style={{ color: 'var(--accent)' }}>
                    {['P','D','A','M'][i-1]}
                  </div>
                ))}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">Rated 4.9</span> by 2,000+ patients
              </div>
            </div>
          </motion.div>

          {/* Right — hero card */}
          <motion.div variants={fadeUp} className="relative">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-2xl">
              <Image
                src="https://crovo-landing.lovable.app/assets/hero-doctor-CufPyMT2.png"
                alt="Trusted doctor available on Crovo"
                width={600}
                height={420}
                className="w-full rounded-2xl object-cover max-h-[420px]"
                priority
              />
              {/* floating card — appointment */}
              <div className="absolute left-2 top-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 shadow-xl text-sm">
                <div className="text-xs text-[var(--text-muted)]">Next appointment</div>
                <div className="pt-1 font-semibold text-[var(--text-primary)]">Tomorrow, 10:30 AM</div>
                <div className="pt-0.5 text-xs" style={{ color: 'var(--accent)' }}>Dr. Aarav Sharma · Confirmed</div>
              </div>
              {/* floating card — health score */}
              <div className="absolute right-2 bottom-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 shadow-xl text-sm">
                <div className="text-xs text-[var(--text-muted)]">Health Score</div>
                <div className="pt-1 text-2xl font-bold" style={{ color: 'var(--accent)' }}>98/100</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          variants={fadeUp}
          className="pt-16 grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-5 text-center">
              <div className="text-3xl font-extrabold" style={{ color: 'var(--accent)' }}>{s.value}</div>
              <div className="pt-1 text-sm text-[var(--text-secondary)]">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── For Patients / For Doctors ── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="pb-12 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>BUILT FOR EVERYONE</div>
          <div className="pt-3 text-4xl font-extrabold text-[var(--text-primary)]">One platform, two experiences</div>
          <div className="pt-3 text-[var(--text-secondary)]">Whether you&apos;re seeking care or providing it — Crovo is designed around you.</div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Patients */}
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8">
            <div className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>FOR PATIENTS</div>
            <div className="pt-4 text-2xl font-bold text-[var(--text-primary)]">Care that actually feels personal</div>
            <div className="pt-3 text-[var(--text-secondary)]">Book verified doctors, consult online, manage prescriptions and order medicines — all in one place.</div>
            <div className="pt-6 space-y-3">
              {patientFeatures.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>✓</div>
                  {f}
                </div>
              ))}
            </div>
            <div className="pt-8">
              <Link href="/signup?role=patient" className="rounded-full px-6 py-3 text-sm font-semibold text-white inline-block" style={{ background: 'var(--accent)' }}>
                Book an Appointment
              </Link>
            </div>
          </div>
          {/* Doctors */}
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-inner)] p-8">
            <div className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>FOR DOCTORS</div>
            <div className="pt-4 text-2xl font-bold text-[var(--text-primary)]">Grow your practice, not your paperwork</div>
            <div className="pt-3 text-[var(--text-secondary)]">A modern clinical workspace to manage appointments, patients and revenue — designed to give you time back.</div>
            <div className="pt-6 space-y-3">
              {doctorFeatures.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>✓</div>
                  {f}
                </div>
              ))}
            </div>
            <div className="pt-8">
              <Link href="/signup?role=doctor" className="rounded-full border border-[var(--accent)] px-6 py-3 text-sm font-semibold inline-block transition hover:bg-[var(--accent)] hover:text-white" style={{ color: 'var(--accent)' }}>
                Join as a Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Specialities ── */}
      <section id="specialities" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="pb-12 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>SPECIALITIES</div>
          <div className="pt-3 text-4xl font-extrabold text-[var(--text-primary)]">Find by Top Specialities</div>
          <div className="pt-3 text-[var(--text-secondary)]">Browse trusted doctors by speciality and book appointments instantly.</div>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {specialities.map((s) => (
            <button key={s.name} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-6 text-center transition hover:border-[var(--accent)] hover:bg-[var(--accent-light)] group">
              <div className="text-3xl">{s.emoji}</div>
              <div className="pt-3 text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">{s.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Top Doctors ── */}
      <section id="doctors" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="pb-12 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>TOP DOCTORS</div>
          <div className="pt-3 text-4xl font-extrabold text-[var(--text-primary)]">Meet our Verified Doctors</div>
          <div className="pt-3 text-[var(--text-secondary)]">Hand-picked professionals from leading hospitals — ready when you need them.</div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doc) => (
            <div key={doc.name} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden group">
              <div className="relative overflow-hidden">
                <Image src={doc.img} alt={doc.name} width={400} height={208} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: 'var(--accent)' }}>
                  Available
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-[var(--bg-surface)] px-2 py-1 text-xs font-bold flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-[var(--text-primary)]">{doc.rating}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>{doc.specialty}</div>
                <div className="pt-1 text-lg font-bold text-[var(--text-primary)]">{doc.name}</div>
                <div className="pt-1 text-sm text-[var(--text-muted)]">{doc.exp} yrs experience</div>
                <div className="pt-3 flex items-center justify-between">
                  <div className="text-xs text-[var(--text-secondary)]">Next: {doc.next}</div>
                  <button className="rounded-full px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90" style={{ background: 'var(--accent)' }}>
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Medical Store ── */}
      <section id="store" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="pb-12 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>MEDICAL STORE</div>
          <div className="pt-3 text-4xl font-extrabold text-[var(--text-primary)]">Medicines & devices, delivered fast</div>
          <div className="pt-3 text-[var(--text-secondary)]">Shop authentic medical products with same-day delivery in major cities.</div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.name} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 flex flex-col gap-4">
              <div className="w-full h-36 rounded-xl bg-[var(--bg-inner)] flex items-center justify-center text-5xl">
                {p.tag === 'SUPPLEMENT' ? '💊' : p.tag === 'DEVICE' ? '🩺' : '💉'}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>{p.tag}</div>
                <div className="pt-1 font-semibold text-[var(--text-primary)]">{p.name}</div>
              </div>
              <div className="flex items-center justify-between pt-auto">
                <div className="text-xl font-bold text-[var(--text-primary)]">${p.price}</div>
                <button className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: 'var(--accent)' }}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="pb-12 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>FEATURES</div>
          <div className="pt-3 text-4xl font-extrabold text-[var(--text-primary)]">Everything you need for better health</div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'var(--accent-light)' }}>
                {f.icon}
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]">{f.title}</div>
                <div className="pt-1 text-sm text-[var(--text-secondary)]">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="pb-12 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>HOW IT WORKS</div>
          <div className="pt-3 text-4xl font-extrabold text-[var(--text-primary)]">Care in 3 simple steps</div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.step} className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center">
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-1/2 -right-4 -translate-y-1/2 text-[var(--border)] text-2xl z-10">→</div>
              )}
              <div className="text-xs font-bold tracking-[0.3em]" style={{ color: 'var(--accent)' }}>STEP {s.step}</div>
              <div className="pt-4 text-xl font-bold text-[var(--text-primary)]">{s.title}</div>
              <div className="pt-2 text-sm text-[var(--text-secondary)]">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="pb-12 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>TESTIMONIALS</div>
          <div className="pt-3 text-4xl font-extrabold text-[var(--text-primary)]">Loved by patients everywhere</div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-7 flex flex-col gap-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((i) => <div key={i} className="text-yellow-400 text-sm">★</div>)}
              </div>
              <div className="text-[var(--text-secondary)] leading-relaxed italic">&ldquo;{t.quote}&rdquo;</div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]">{t.name}</div>
                <div className="text-xs text-[var(--text-muted)]">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="pb-12 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>FAQ</div>
          <div className="pt-3 text-4xl font-extrabold text-[var(--text-primary)]">Questions, answered</div>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-medium text-[var(--text-primary)] hover:bg-[var(--bg-inner)] transition-colors"
              >
                <div>{faq.q}</div>
                <div className="text-xl transition-transform" style={{ color: 'var(--accent)', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</div>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-[var(--text-secondary)]">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>Crovo.</div>
              <div className="pt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                A premium healthcare platform for booking doctors, managing records and ordering medicines.
              </div>
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">Company</div>
              <div className="pt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                {['About Us', 'Careers', 'Press', 'Blog'].map((l) => (
                  <div key={l}><Link href="#" className="hover:text-[var(--accent)] transition-colors">{l}</Link></div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">Services</div>
              <div className="pt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                {['Find Doctors', 'Online Consult', 'Medical Store', 'Lab Tests'].map((l) => (
                  <div key={l}><Link href="#" className="hover:text-[var(--accent)] transition-colors">{l}</Link></div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">Contact</div>
              <div className="pt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                <div>📧 hello@crovo.app</div>
                <div>📞 +1 (555) 010-2030</div>
                <div>📍 San Francisco, CA</div>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
            <div>© 2026 Crovo. All rights reserved.</div>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Cookies'].map((l) => (
                <Link key={l} href="#" className="hover:text-[var(--accent)] transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
