# Cropvo Frontend — Project Rules & Coding Standards

Read this file before writing any code for this project.

---

## Project Overview

**Cropvo** is a healthcare platform with three user roles: `patient`, `doctor`, and `admin`. The frontend is a Next.js 16 App Router project using React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

---

## Tech Stack

| Tool | Version | Notes |
|---|---|---|
| Next.js | 16.2.6 | App Router only |
| React | 19.2.4 | |
| TypeScript | ^5 | strict mode on |
| Tailwind CSS | ^4 | via `@tailwindcss/postcss` |
| Framer Motion | ^11 | for animations |

---

## Folder Structure

```
cropvo-frontend/
├── app/
│   ├── layout.tsx               # Root layout (wraps ThemeProvider)
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles + CSS variables (light/dark)
│   ├── login/page.tsx           # Login page
│   ├── signup/page.tsx          # Signup page
│   └── dashboard/
│       ├── admin/page.tsx       # Admin dashboard
│       ├── doctor/page.tsx      # Doctor dashboard
│       └── patient/page.tsx     # Patient dashboard
├── components/
│   ├── DashboardHeader.tsx      # Shared header for all dashboard pages
│   └── ThemeToggle.tsx          # Sun/moon toggle button
├── lib/
│   ├── api.ts                   # All API calls (centralized)
│   └── theme.tsx                # ThemeProvider + useTheme hook
└── public/
    └── assets/
        ├── images/              # jpg, png, webp — use kebab-case names
        └── svg/                 # SVG icon files — use kebab-case names
```

## Asset Rules

- All images go in `public/assets/images/` — reference as `/assets/images/filename.ext`
- All SVG icons go in `public/assets/svg/` — reference as `/assets/svg/filename.svg`
- Always use `<Image />` from `next/image` — never bare `<img>` tags
- Remote image domains must be whitelisted in `next.config.ts` under `images.remotePatterns`
- File naming: kebab-case lowercase — `hero-doctor.png`, `search-icon.svg`

```tsx
// Correct — local asset
import Image from 'next/image';
<Image src="/assets/images/hero-doctor.png" alt="Doctor" width={600} height={420} />

// Correct — remote asset (domain must be in next.config.ts)
<Image src="https://example.com/photo.jpg" alt="Photo" width={400} height={300} />

// Wrong — never use bare img
<img src="/assets/images/hero.png" alt="Hero" />
```

---

## HTML Tag Rules

**Only use `div` for layout and text content. Do not use `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, or `span` for text.**

Allowed tags:
- `div` — all layout and text blocks
- `header`, `main`, `section`, `nav`, `footer` — semantic structure only
- `form`, `label`, `input`, `button`, `select`, `textarea`, `option` — form elements (required for accessibility)
- `table`, `thead`, `tbody`, `tr`, `th`, `td` — tables
- `img`, `svg`, `path` — media
- `Link` (Next.js) — navigation
- `span` — only inside inline text when no other option works (e.g. gradient text inside a sentence)

**Wrong:**
```tsx
<h1 className="text-3xl font-bold">Title</h1>
<p className="text-slate-400">Description</p>
```

**Correct:**
```tsx
<div className="text-3xl font-bold">Title</div>
<div className="text-slate-400">Description</div>
```

---

## Spacing Rules

**Never use margin utilities. Use padding instead.**

- Replace `mt-*` → `pt-*` on the element or a wrapper `div`
- Replace `mb-*` → `pb-*`
- Replace `my-*` → `py-*`
- Replace `mx-*` → `px-*` (exception: `mx-auto` for centering is allowed)
- Replace `m-*` → `p-*`
- Use `gap-*` inside flex/grid containers for spacing between children

**Wrong:**
```tsx
<div className="mt-4 text-white">Hello</div>
```

**Correct:**
```tsx
<div className="pt-4 text-white">Hello</div>
```

---

## Theme System

The project uses a **CSS variable + Tailwind dark class** approach. Dark mode is toggled by adding/removing the `dark` class on `<html>`.

### Files
- `lib/theme.tsx` — `ThemeProvider` context + `useTheme()` hook
- `components/ThemeToggle.tsx` — sun/moon toggle button, drop into any page header
- `app/globals.css` — CSS variable definitions for both modes

### CSS Variables (use these everywhere, not hardcoded Tailwind colors)

| Variable | Light | Dark | Usage |
|---|---|---|---|
| `--bg-page` | `#f0faf8` | `#0a0f1a` | Page background |
| `--bg-surface` | `#ffffff` | `#111827` | Cards, modals |
| `--bg-inner` | `#e8f8f5` | `#1a2535` | Inner cards, table rows |
| `--bg-input` | `#ffffff` | `#0d1520` | Input backgrounds |
| `--border` | `#b2dfdb` | `#1e3040` | All borders |
| `--text-primary` | `#0d2b26` | `#e8f8f5` | Headings, main text |
| `--text-secondary` | `#3d6b63` | `#7ecdc4` | Descriptions, labels |
| `--text-muted` | `#7aada4` | `#4a8a82` | Placeholders, hints |
| `--accent` | `#00b894` | `#00b894` | Brand teal (same both modes) |
| `--accent-hover` | `#00a381` | `#00d4a8` | Hover state of accent |
| `--accent-light` | `#e0f7f4` | `#00b89415` | Accent tint for backgrounds |

### How to use in JSX

```tsx
// Background
className="bg-[var(--bg-page)]"
className="bg-[var(--bg-surface)]"
className="bg-[var(--bg-inner)]"

// Text
className="text-[var(--text-primary)]"
className="text-[var(--text-secondary)]"
className="text-[var(--text-muted)]"

// Border
className="border border-[var(--border)]"

// Input
className="bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)]"
```

### When to use `dark:` variant

Only use `dark:` for things that can't be expressed as a CSS variable — e.g. opacity variants, gradient directions, or one-off overrides:

```tsx
// Accent label that differs between modes
className="text-cyan-500 dark:text-cyan-300"

// Error banner
className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-200 ring-rose-200 dark:ring-rose-500/30"

// Gradient card wrapper
className="bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/30"
```

### ThemeToggle usage

Import and place in any page header:

```tsx
import ThemeToggle from '@/components/ThemeToggle';

// In header
<div className="flex items-center gap-3">
  <ThemeToggle />
  {/* other nav items */}
</div>
```

### DO NOT use hardcoded dark Tailwind colors

**Wrong:**
```tsx
<div className="bg-slate-950 text-white border-slate-800">
```

**Correct:**
```tsx
<div className="bg-[var(--bg-page)] text-[var(--text-primary)] border-[var(--border)]">
```

### Border Radius

- Cards: `rounded-[2rem]` or `rounded-3xl`
- Inner cards: `rounded-2xl`
- Inputs / buttons: `rounded-3xl` or `rounded-full`
- Small elements: `rounded-lg`

### Shadows

- Outer cards: `shadow-2xl shadow-slate-950/40`
- Subtle: `shadow-lg`

---

## Component Patterns

### Page wrapper
```tsx
<div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    {/* content */}
  </div>
</div>
```

### Card
```tsx
<div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-xl">
  {/* content */}
</div>
```

### Inner card / info block
```tsx
<div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-inner)] p-6">
  <div className="text-lg font-semibold text-[var(--text-primary)]">Title</div>
  <div className="pt-3 text-[var(--text-secondary)]">Description</div>
</div>
```

### Section label + heading
```tsx
<div className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500 dark:text-cyan-300">Label</div>
<div className="pt-3 text-3xl font-bold text-[var(--text-primary)]">Heading</div>
<div className="pt-2 text-[var(--text-secondary)]">Subtext</div>
```

### Primary button
```tsx
<button className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:opacity-60">
  Action
</button>
```

### Gradient button
```tsx
<button className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg">
  Action
</button>
```

### Ghost button
```tsx
<button className="rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)]">
  Action
</button>
```

### Form input
```tsx
<label className="block text-sm font-medium text-[var(--text-secondary)]">Field</label>
<input
  className="mt-2 w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-input)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
/>
```

### Error banner
```tsx
<div className="rounded-3xl bg-rose-50 dark:bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-200 ring-1 ring-rose-200 dark:ring-rose-500/30">
  {error}
</div>
```

---

## Auth & Routing

- Auth state is stored in `localStorage` as `token` (JWT string) and `user` (JSON object)
- User object shape: `{ id, name, email, role }`
- Role values: `'patient'` | `'doctor'` | `'admin'`
- After login/signup, redirect to `/dashboard/${role}`
- Dashboard pages guard themselves: check `localStorage` on mount, redirect to `/login` if missing or wrong role

---

## API Layer (`lib/api.ts`)

All backend calls go through `lib/api.ts`. Never use `fetch` directly in components.

Backend base URL: `process.env.NEXT_PUBLIC_BACKEND_URL` (defaults to `http://localhost:5000`)

Available functions:
- `login(email, password, role)` — POST `/auth/login`
- `signup(name, email, password, confirmPassword, role)` — POST `/auth/signup`
- `getUsers(token)` — GET `/users`
- `deleteUser(userId, token)` — DELETE `/users/:id`
- `updateUserRole(userId, role, token)` — PATCH `/users/:id`
- `getUserProfile(token)` — GET `/user/profile`
- `clearCache()` — clears in-memory request cache (call on logout)

---

## Animations

Use Framer Motion for page-level animations. Keep it subtle.

Standard variants used in this project:
```ts
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const staggerFade = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1, y: 0,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};
```

---

## Ant Design Integration

Ant Design (`antd`) is installed and configured. Use it for:
- Form inputs, password fields, buttons
- Success/error/warning messages (`message.useMessage()`)
- Confirmation dialogs (`Popconfirm`)
- Tables (`Table` with `ColumnsType`)
- Select dropdowns

### AntD Theme Setup

The theme is split into two exports in `lib/antd-theme.ts`:
- `antdDarkTheme` — used when `.dark` class is on `<html>`
- `antdLightTheme` — used in light mode

`lib/antd-config-provider.tsx` reads the current theme from `useTheme()` and passes the correct one to `ConfigProvider`. **Never import `antdTheme` — it does not exist.**

`app/layout.tsx` wraps the app as: `AntdRegistry → ThemeProvider → AntdConfigProvider → children`

A blocking inline script in `<head>` applies the `.dark` class before first paint to prevent flash.

### Message notifications
```tsx
const [messageApi, contextHolder] = message.useMessage();
// Place {contextHolder} at the top of the JSX return
// Then call:
messageApi.success('Login successful!');
messageApi.error('Something went wrong.');
messageApi.warning('Please check your input.');
```

### Form validation
Use `antd` `Form` + `Form.Item` with `rules` for inline validation — no manual error state needed for field-level errors. Use `messageApi` for API-level errors.

```tsx
<Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
  <Form.Item
    name="email"
    rules={[{ required: true, message: 'Please enter your email' }, { type: 'email' }]}
  >
    <Input prefix={<MailOutlined />} placeholder="john@example.com" size="large" />
  </Form.Item>
</Form>
```

### Style AntD inputs to match theme
Pass inline `style` to match CSS variables:
```tsx
<Input
  style={{
    background: 'var(--bg-input)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  }}
/>
```

### Delete confirmations
Use `Popconfirm` instead of `window.confirm`:
```tsx
<Popconfirm
  title="Delete user"
  description="Are you sure?"
  onConfirm={handleDelete}
  okText="Delete"
  cancelText="Cancel"
  okButtonProps={{ danger: true }}
>
  <Button danger icon={<DeleteOutlined />}>Delete</Button>
</Popconfirm>
```

## TypeScript

- Always type component props and state explicitly
- Use `interface` for object shapes
- Avoid `any` — use `unknown` and narrow types
- `'use client'` directive required on all interactive pages

---

## What NOT to Do

- Do not use `h1`–`h6` or `p` tags — use `div` instead
- Do not use margin utilities (`mt-`, `mb-`, `mx-`, `my-`, `m-`) — use padding or `gap-`
- Do not call `fetch` directly in components — use `lib/api.ts`
- Do not hardcode the backend URL — use `NEXT_PUBLIC_BACKEND_URL`
- Do not use `pages/` directory — this project uses App Router only
- Do not use hardcoded dark Tailwind colors (`bg-slate-950`, `text-white`, `border-slate-800`, etc.) — use CSS variables instead
- Do not add new dependencies without checking if an existing one covers the need
