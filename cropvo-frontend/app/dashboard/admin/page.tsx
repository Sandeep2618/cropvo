'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { deleteUser, getUsers, updateUserRole } from '@/lib/api';
import DashboardHeader from '@/components/DashboardHeader';
import { Button, Select, message, Popconfirm, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Read auth from localStorage synchronously at module evaluation time
function getAuthState() {
  if (typeof window === 'undefined') return { user: null, token: null, isAuthorized: false };
  try {
    const raw = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const user = raw ? (JSON.parse(raw) as User) : null;
    return { user, token, isAuthorized: user?.role === 'admin' && !!token };
  } catch {
    return { user: null, token: null, isAuthorized: false };
  }
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const initialized = useRef(false);
  const { user, token, isAuthorized } = getAuthState();

  const [users, setUsers] = useState<User[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({ patients: 0, doctors: 0, admins: 0 });
  const [messageApi, contextHolder] = message.useMessage();

  const refreshStats = (items: User[]) => {
    setStats({
      patients: items.filter((i) => i.role === 'patient').length,
      doctors:  items.filter((i) => i.role === 'doctor').length,
      admins:   items.filter((i) => i.role === 'admin').length,
    });
  };

  const fetchUsers = useCallback(async (t: string) => {
    setTableLoading(true);
    try {
      const response = await getUsers(t);
      if (response.success) {
        setUsers(response.data);
        refreshStats(response.data);
      } else {
        messageApi.error(response.message || 'Cannot load users');
      }
    } catch {
      messageApi.error('Failed to fetch user list.');
    } finally {
      setTableLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!isAuthorized) {
      router.replace('/login');
      return;
    }

    // Defer the API call so it runs after the first paint — avoids setState-in-effect warning
    const id = setTimeout(() => fetchUsers(token!), 0);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (userId: string) => {
    const t = localStorage.getItem('token');
    if (!t) return;
    setActionLoading(true);
    try {
      const response = await deleteUser(userId, t);
      if (response.success) {
        const updated = users.filter((i) => i.id !== userId);
        setUsers(updated);
        refreshStats(updated);
        messageApi.success('User deleted successfully.');
      } else {
        messageApi.error(response.message || 'Failed to delete user');
      }
    } catch {
      messageApi.error('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    const t = localStorage.getItem('token');
    if (!t) return;
    setActionLoading(true);
    try {
      const response = await updateUserRole(userId, role, t);
      if (response.success) {
        const updated = users.map((i) => (i.id === userId ? { ...i, role } : i));
        setUsers(updated);
        refreshStats(updated);
        messageApi.success('Role updated successfully.');
      } else {
        messageApi.error(response.message || 'Failed to update role');
      }
    } catch {
      messageApi.error('Failed to update role');
    } finally {
      setActionLoading(false);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div className="font-medium text-[var(--text-primary)]">{name}</div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <div className="text-[var(--text-secondary)]">{email}</div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: User) => (
        <Select
          value={role}
          onChange={(val) => handleRoleChange(record.id, val)}
          disabled={actionLoading}
          size="small"
          style={{ width: 120 }}
          options={[
            { value: 'patient', label: 'Patient' },
            { value: 'doctor',  label: 'Doctor' },
            { value: 'admin',   label: 'Admin' },
          ]}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_: unknown, record: User) => (
        <Popconfirm
          title="Delete user"
          description={`Are you sure you want to delete ${record.name}?`}
          onConfirm={() => handleDelete(record.id)}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <Button danger size="small" icon={<DeleteOutlined />} loading={actionLoading}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Not authorized — show spinner while redirect fires
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-page)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      {contextHolder}
      <DashboardHeader userName={user?.name ?? ''} userRole="admin" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-xl">

          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>Admin portal</div>
            <div className="pt-3 text-3xl font-bold text-[var(--text-primary)]">Manage patients, doctors, and access rights</div>
            <div className="pt-2 text-[var(--text-secondary)]">Update roles, remove users, and review the current system state.</div>
          </div>

          <Link
            href="/dashboard/admin/inventory"
            className="flex items-center justify-between rounded-2xl border border-[var(--accent)] bg-[var(--accent-light)] px-6 py-4 transition hover:opacity-90"
          >
            <div>
              <div className="font-semibold text-[var(--text-primary)]">Medical store inventory</div>
              <div className="pt-1 text-sm text-[var(--text-secondary)]">Add medicines, manage stock, prices, and customer orders</div>
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Manage →</div>
          </Link>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Patients', value: stats.patients },
              { label: 'Doctors',  value: stats.doctors },
              { label: 'Admins',   value: stats.admins },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-inner)] p-6">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{stat.label}</div>
                <div className="pt-3 text-3xl font-bold" style={{ color: 'var(--accent)' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            loading={tableLoading}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            className="rounded-2xl overflow-hidden"
          />

        </div>
      </div>
    </div>
  );
}
