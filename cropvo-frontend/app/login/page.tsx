'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import { Button, Input, Form, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

const roleOptions = ['patient', 'doctor', 'admin'] as const;
type Role = (typeof roleOptions)[number];

export default function LoginPage() {
  const searchParams = useSearchParams();
  const initialRole = roleOptions.includes(searchParams.get('role') as Role)
    ? (searchParams.get('role') as Role)
    : 'patient';

  const [role, setRole] = useState<Role>(initialRole);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const data = await login(values.email.trim(), values.password, role);

      if (!data.success) {
        messageApi.error(data.message || 'Login failed. Please verify your credentials.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      messageApi.success('Login successful! Redirecting...');
      router.push(`/dashboard/${data.user.role}`);
    } catch (err) {
      messageApi.error(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col">
      {contextHolder}

      <div className="flex justify-end px-6 py-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-10 shadow-2xl">

          <div className="pb-10 text-center">
            <div className="text-xs uppercase tracking-[0.35em]" style={{ color: 'var(--accent)' }}>Crovo</div>
            <div className="pt-4 text-5xl font-semibold tracking-tight text-[var(--text-primary)]">Crovo</div>
          </div>

          <div className="pb-6">
            <div className="text-sm font-medium pb-3 text-[var(--text-secondary)]">Select Role</div>
            <div className="flex flex-wrap gap-3">
              {roleOptions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    role === r
                      ? 'border-[var(--accent)] text-white'
                      : 'border-[var(--border)] bg-[var(--bg-inner)] text-[var(--text-secondary)] hover:border-[var(--accent)]'
                  }`}
                  style={role === r ? { background: 'var(--accent)' } : {}}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              name="email"
              label={<div className="text-sm font-medium text-[var(--text-secondary)]">Email</div>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="john@example.com"
                size="large"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<div className="text-sm font-medium text-[var(--text-secondary)]">Password</div>}
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                size="large"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item className="pt-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}
              >
                {loading ? 'Signing in...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center text-sm text-[var(--text-muted)]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--accent)' }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
