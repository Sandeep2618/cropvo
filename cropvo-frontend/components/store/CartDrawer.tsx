'use client';

import { useState } from 'react';
import { Button, Drawer, Input, InputNumber, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCart } from '@/lib/cart-context';
import type { CartLineItem } from '@/lib/types/store';

interface Props {
  open: boolean;
  onClose: () => void;
  token: string;
  onOrderPlaced?: () => void;
}

export default function CartDrawer({ open, onClose, token, onOrderPlaced }: Props) {
  const { cart, loading, setQuantity, removeItem, checkout } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      messageApi.warning('Your cart is empty');
      return;
    }

    const hasStockIssue = cart.items.some((i) => !i.inStock);
    if (hasStockIssue) {
      messageApi.error('Some items exceed available stock. Update your cart.');
      return;
    }

    const result = await checkout(token, {
      deliveryAddress: deliveryAddress.trim(),
      notes: notes.trim(),
    });

    if (result.success) {
      messageApi.success(result.message || 'Order placed successfully');
      setDeliveryAddress('');
      setNotes('');
      onClose();
      onOrderPlaced?.();
    } else {
      messageApi.error(result.message || 'Checkout failed');
    }
  };

  const changeQty = async (item: CartLineItem, qty: number | null) => {
    if (qty === null || qty < 1) return;
    const ok = await setQuantity(token, item.medicineId, qty);
    if (!ok) messageApi.error('Could not update quantity');
  };

  const handleRemove = async (medicineId: string) => {
    const ok = await removeItem(token, medicineId);
    if (!ok) messageApi.error('Could not remove item');
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title={
          <div className="text-[var(--text-primary)]">
            Your cart
            <div className="text-sm font-normal text-[var(--text-muted)]">
              {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}
            </div>
          </div>
        }
        placement="right"
        width={420}
        onClose={onClose}
        open={open}
        className="store-cart-drawer"
      >
        {cart.items.length === 0 ? (
          <Empty description="No items in cart" className="pt-12" />
        ) : (
          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <div
                key={item.medicineId}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-inner)] p-4"
              >
                <div className="flex justify-between gap-2">
                  <div className="font-medium text-[var(--text-primary)]">{item.name}</div>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(item.medicineId)}
                  />
                </div>
                <div className="pt-1 text-xs text-[var(--text-muted)]">
                  ₹{item.price.toFixed(2)} / {item.unit}
                </div>
                {!item.inStock && (
                  <div className="pt-1 text-xs text-rose-500">Exceeds stock ({item.stockQuantity} left)</div>
                )}
                <div className="flex items-center justify-between pt-3">
                  <InputNumber
                    min={1}
                    max={item.stockQuantity}
                    value={item.quantity}
                    onChange={(v) => changeQty(item, v)}
                    size="small"
                  />
                  <div className="font-semibold" style={{ color: 'var(--accent)' }}>
                    ₹{item.lineTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
              <div className="text-sm font-medium text-[var(--text-secondary)]">Delivery address</div>
              <Input.TextArea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Street, city, postal code"
                rows={2}
                className="!pt-3"
              />
              <div className="pt-4 text-sm font-medium text-[var(--text-secondary)]">Order notes (optional)</div>
              <Input.TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special instructions"
                rows={2}
                className="!pt-3"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-inner)] px-4 py-3">
              <div className="text-[var(--text-secondary)]">Subtotal</div>
              <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
                ₹{cart.subtotal.toFixed(2)}
              </div>
            </div>

            <Button
              type="primary"
              block
              size="large"
              icon={<ShoppingOutlined />}
              loading={loading}
              onClick={handleCheckout}
              className="!rounded-full"
              style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}
            >
              Place order
            </Button>
          </div>
        )}
      </Drawer>
    </>
  );
}
