'use client';

import type { StoreItem } from '@/lib/types/store';
import { Button, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

interface Props {
  item: StoreItem;
  onAddToCart: (item: StoreItem) => void;
  adding?: boolean;
}

export default function StoreItemCard({ item, onAddToCart, adding }: Props) {
  const outOfStock = !item.inStock || item.stockQuantity < 1;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-inner)] p-5 transition hover:border-[var(--accent)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Tag color="cyan" className="!rounded-full !border-[var(--border)]">
          {item.category}
        </Tag>
        {item.requiresPrescription && (
          <Tag color="orange" className="!rounded-full">
            Rx required
          </Tag>
        )}
      </div>

      <div className="pt-4 text-lg font-semibold text-[var(--text-primary)]">{item.name}</div>

      {item.manufacturer && (
        <div className="pt-1 text-xs text-[var(--text-muted)]">{item.manufacturer}</div>
      )}

      <div className="flex-1 pt-3 text-sm text-[var(--text-secondary)] line-clamp-3">
        {item.description || 'No description provided.'}
      </div>

      {item.dosageInfo && (
        <div className="pt-2 text-xs text-[var(--text-muted)]">Dosage: {item.dosageInfo}</div>
      )}

      <div className="flex items-end justify-between pt-5">
        <div>
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            ₹{item.price.toFixed(2)}
          </div>
          <div className="pt-1 text-xs text-[var(--text-muted)]">
            per {item.unit} · {outOfStock ? 'Out of stock' : `${item.stockQuantity} in stock`}
          </div>
        </div>

        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          disabled={outOfStock}
          loading={adding}
          onClick={() => onAddToCart(item)}
          className="!rounded-full"
          style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
