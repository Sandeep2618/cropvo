'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  addToCart as apiAddToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  checkoutCart,
} from '@/lib/api';
import type { CartSummary } from '@/lib/types/store';

interface CartContextValue {
  cart: CartSummary;
  loading: boolean;
  refreshCart: (token: string) => Promise<void>;
  addItem: (token: string, medicineId: string, quantity?: number) => Promise<boolean>;
  setQuantity: (token: string, medicineId: string, quantity: number) => Promise<boolean>;
  removeItem: (token: string, medicineId: string) => Promise<boolean>;
  checkout: (
    token: string,
    payload?: { deliveryAddress?: string; notes?: string }
  ) => Promise<{ success: boolean; message?: string }>;
}

const emptyCart: CartSummary = { items: [], itemCount: 0, subtotal: 0 };

const CartContext = createContext<CartContextValue>({
  cart: emptyCart,
  loading: false,
  refreshCart: async () => {},
  addItem: async () => false,
  setQuantity: async () => false,
  removeItem: async () => false,
  checkout: async () => ({ success: false }),
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartSummary>(emptyCart);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async (token: string) => {
    setLoading(true);
    try {
      const res = await getCart(token);
      if (res.success) setCart(res.data);
    } catch {
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (token: string, medicineId: string, quantity = 1) => {
    setLoading(true);
    try {
      const res = await apiAddToCart(token, medicineId, quantity);
      if (res.success) {
        setCart(res.data);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const setQuantity = useCallback(async (token: string, medicineId: string, quantity: number) => {
    setLoading(true);
    try {
      const res = await updateCartItem(token, medicineId, quantity);
      if (res.success) {
        setCart(res.data);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (token: string, medicineId: string) => {
    setLoading(true);
    try {
      const res = await removeFromCart(token, medicineId);
      if (res.success) {
        setCart(res.data);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkout = useCallback(
    async (token: string, payload?: { deliveryAddress?: string; notes?: string }) => {
      setLoading(true);
      try {
        const res = await checkoutCart(token, payload);
        if (res.success) {
          setCart(emptyCart);
          return { success: true, message: res.message };
        }
        return { success: false, message: res.message };
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Checkout failed',
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      cart,
      loading,
      refreshCart,
      addItem,
      setQuantity,
      removeItem,
      checkout,
    }),
    [cart, loading, refreshCart, addItem, setQuantity, removeItem, checkout]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
