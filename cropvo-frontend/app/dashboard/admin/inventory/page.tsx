'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import MedicineFormModal from '@/components/store/MedicineFormModal';
import {
  createStoreItem,
  deleteStoreItem,
  getStoreItems,
  updateStoreItem,
  getStoreOrders,
  updateOrderStatus,
} from '@/lib/api';
import type { StoreItem, StoreItemFormValues, StoreOrder } from '@/lib/types/store';
import { Button, Table, Tag, Tabs, message, Popconfirm, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface User {
  id: string;
  name: string;
  role: string;
}

export default function AdminInventoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [items, setItems] = useState<StoreItem[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StoreItem | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const fetchData = useCallback(async (authToken: string) => {
    setLoading(true);
    try {
      const [itemsRes, ordersRes] = await Promise.all([
        getStoreItems(authToken, { includeInactive: true }),
        getStoreOrders(authToken),
      ]);
      if (itemsRes.success) setItems(itemsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
    } catch {
      messageApi.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedUser || !storedToken) {
      router.replace('/login');
      return;
    }

    const parsed = JSON.parse(storedUser) as User;
    if (parsed.role !== 'admin') {
      router.replace('/login');
      return;
    }

    Promise.resolve().then(() => {
      setUser(parsed);
      setToken(storedToken);
      fetchData(storedToken);
    });
  }, [router, fetchData]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item: StoreItem) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleSubmit = async (values: StoreItemFormValues) => {
    if (!token) return;
    setSaving(true);
    try {
      const body = { ...values };
      const res = editing
        ? await updateStoreItem(token, editing.id, body)
        : await createStoreItem(token, body);

      if (res.success) {
        messageApi.success(res.message || (editing ? 'Medicine updated' : 'Medicine added'));
        setModalOpen(false);
        fetchData(token);
      } else {
        messageApi.error(res.message || 'Save failed');
      }
    } catch (err) {
      messageApi.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      const res = await deleteStoreItem(token, id);
      if (res.success) {
        messageApi.success('Medicine removed from store');
        fetchData(token);
      }
    } catch {
      messageApi.error('Failed to remove medicine');
    }
  };

  const handleOrderStatus = async (orderId: string, status: string) => {
    if (!token) return;
    try {
      const res = await updateOrderStatus(token, orderId, status);
      if (res.success) {
        messageApi.success('Order status updated');
        fetchData(token);
      }
    } catch {
      messageApi.error('Failed to update order');
    }
  };

  const itemColumns: ColumnsType<StoreItem> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <div>
          <div className="font-medium text-[var(--text-primary)]">{name}</div>
          <div className="text-xs text-[var(--text-muted)]">{record.sku || '—'}</div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (c: string) => <Tag className="!rounded-full">{c}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (p: number) => <div style={{ color: 'var(--accent)' }}>₹{p.toFixed(2)}</div>,
    },
    {
      title: 'Stock',
      dataIndex: 'stockQuantity',
      key: 'stock',
      render: (s: number, record) => (
        <div className={s < 5 ? 'text-rose-500' : 'text-[var(--text-primary)]'}>
          {s} {record.unit}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, record) => (
        <Tag color={record.isActive ? 'green' : 'default'} className="!rounded-full">
          {record.isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_: unknown, record) => (
        <div className="flex justify-end gap-2">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Remove from store?"
            description="This will hide the medicine from patients and doctors."
            onConfirm={() => handleDelete(record.id)}
            okText="Remove"
            cancelText="Cancel"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Remove
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const orderColumns: ColumnsType<StoreOrder> = [
    {
      title: 'Order',
      key: 'id',
      render: (_: unknown, record) => {
        const orderId = record.id || (record as StoreOrder & { _id?: string })._id || '';
        return (
          <div className="text-xs text-[var(--text-muted)]">
            {String(orderId).slice(-8).toUpperCase()}
          </div>
        );
      },
    },
    {
      title: 'Role',
      dataIndex: 'userRole',
      key: 'userRole',
      render: (r: string) => <Tag className="!rounded-full">{r}</Tag>,
    },
    {
      title: 'Items',
      key: 'items',
      render: (_: unknown, record) => (
        <div className="text-sm text-[var(--text-secondary)]">
          {record.items.length} item(s)
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'total',
      render: (t: number) => <div style={{ color: 'var(--accent)' }}>₹{t.toFixed(2)}</div>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record) => (
        <Select
          value={status}
          size="small"
          style={{ width: 130 }}
          onChange={(val) => handleOrderStatus(record.id, val)}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'fulfilled', label: 'Fulfilled' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      ),
    },
  ];

  if (loading && !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      {contextHolder}
      <DashboardHeader userName={user?.name ?? ''} userRole="admin" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                Store inventory
              </div>
              <div className="pt-3 text-3xl font-bold text-[var(--text-primary)]">Manage medicines</div>
              <div className="pt-2 text-[var(--text-secondary)]">
                Add stock, set prices, and track orders from patients and doctors.
              </div>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={openCreate}
              className="!rounded-full"
              style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}
            >
              Add medicine
            </Button>
          </div>

          <div className="pt-8">
            <Tabs
              items={[
                {
                  key: 'inventory',
                  label: `Medicines (${items.length})`,
                  children: (
                    <Table
                      dataSource={items}
                      columns={itemColumns}
                      rowKey="id"
                      loading={loading}
                      pagination={{ pageSize: 8 }}
                    />
                  ),
                },
                {
                  key: 'orders',
                  label: `Orders (${orders.length})`,
                  children: (
                    <Table
                      dataSource={orders}
                      columns={orderColumns}
                      rowKey="id"
                      loading={loading}
                      pagination={{ pageSize: 8 }}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <MedicineFormModal
        open={modalOpen}
        editing={editing}
        loading={saving}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
