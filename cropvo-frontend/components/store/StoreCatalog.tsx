'use client';

import { useCallback, useEffect, useState } from 'react';
import { getStoreCategories, getStoreItems } from '@/lib/api';
import { useCart } from '@/lib/cart-context';
import type { StoreItem } from '@/lib/types/store';
import StoreItemCard from '@/components/store/StoreItemCard';
import CartDrawer from '@/components/store/CartDrawer';
import { Button, Input, Select, message, Badge } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';

interface Props {
  token: string;
}

export default function StoreCatalog({ token }: Props) {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { cart, refreshCart, addItem } = useCart();

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, catRes] = await Promise.all([
        getStoreItems(token, { category, search: search.trim() || undefined }),
        getStoreCategories(token),
      ]);
      if (itemsRes.success) setItems(itemsRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch {
      messageApi.error('Failed to load store items');
    } finally {
      setLoading(false);
    }
  }, [token, category, search, messageApi]);

  useEffect(() => {
    refreshCart(token);
  }, [token, refreshCart]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAddToCart = async (item: StoreItem) => {
    setAddingId(item.id);
    const ok = await addItem(token, item.id, 1);
    setAddingId(null);
    if (ok) {
      messageApi.success(`${item.name} added to cart`);
    } else {
      messageApi.error('Could not add to cart');
    }
  };

  return (
    <div>
      {contextHolder}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Input
            prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={loadItems}
            size="large"
            className="max-w-md"
          />
          <Select
            value={category}
            onChange={setCategory}
            size="large"
            className="min-w-[180px]"
            options={[
              { value: 'all', label: 'All categories' },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
          />
          <Button size="large" onClick={loadItems} className="!rounded-full">
            Search
          </Button>
        </div>

        <Badge count={cart.itemCount} offset={[-4, 4]}>
          <Button
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={() => setCartOpen(true)}
            className="!rounded-full"
            style={{ background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' }}
          >
            Cart
          </Button>
        </Badge>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-inner)] py-16 text-center text-[var(--text-secondary)]">
          No medicines found. Try another search or category.
        </div>
      ) : (
        <div className="grid gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <StoreItemCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
              adding={addingId === item.id}
            />
          ))}
        </div>
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        token={token}
        onOrderPlaced={loadItems}
      />
    </div>
  );
}
