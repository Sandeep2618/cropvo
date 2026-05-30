'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteUser, getUsers, updateUserRole } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({ patients: 0, doctors: 0, admins: 0 });
  const router = useRouter();

  const refreshStats = (items: User[]) => {
    setStats({
      patients: items.filter((item) => item.role === 'patient').length,
      doctors: items.filter((item) => item.role === 'doctor').length,
      admins: items.filter((item) => item.role === 'admin').length,
    });
  };

  const fetchUsers = async (token: string) => {
    setError('');
    setLoading(true);

    try {
      const response = await getUsers(token);
      if (response.success) {
        setUsers(response.data);
        refreshStats(response.data);
      } else {
        setError(response.message || 'Cannot load users');
      }
    } catch (err) {
      setError('Failed to fetch user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'admin') {
      router.push('/login');
      return;
    }

    setUser(parsedUser);
    fetchUsers(token);
  }, [router]);

  const handleDelete = async (userId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setActionLoading(true);
    setError('');

    try {
      const response = await deleteUser(userId, token);
      if (response.success) {
        const updated = users.filter((item) => item.id !== userId);
        setUsers(updated);
        refreshStats(updated);
      } else {
        setError(response.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setActionLoading(true);
    setError('');

    try {
      const response = await updateUserRole(userId, role, token);
      if (response.success) {
        const updated = users.map((item) => (item.id === userId ? { ...item, role } : item));
        setUsers(updated);
        refreshStats(updated);
      } else {
        setError(response.message || 'Failed to update role');
      }
    } catch (err) {
      setError('Failed to update role');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="text-lg font-medium">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Admin portal</p>
              <h1 className="mt-3 text-3xl font-bold text-white">Manage patients, doctors, and access rights</h1>
              <p className="mt-2 max-w-2xl text-slate-400">Use the table below to update roles, remove users, and review the current system state.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-right">
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="mt-2 text-lg font-semibold text-white">{user?.name}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Patients</p>
              <p className="mt-4 text-3xl font-bold text-white">{stats.patients}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Doctors</p>
              <p className="mt-4 text-3xl font-bold text-white">{stats.doctors}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Admins</p>
              <p className="mt-4 text-3xl font-bold text-white">{stats.admins}</p>
            </div>
          </div>

          {error && (
            <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200 ring-1 ring-rose-500/30">
              {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
              <thead className="bg-slate-900/90 text-slate-400">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Name</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Email</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Role</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/80">
                {users.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-white">{item.name}</td>
                    <td className="px-6 py-4 text-slate-400">{item.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={item.role}
                        onChange={(e) => handleRoleChange(item.id, e.target.value)}
                        disabled={actionLoading}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={actionLoading}
                        className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
