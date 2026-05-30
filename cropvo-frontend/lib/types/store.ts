export type MedicineUnit = 'tablet' | 'strip' | 'bottle' | 'tube' | 'box' | 'vial' | 'other';

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'fulfilled';

export interface StoreItem {
  id: string;
  name: string;
  sku?: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: MedicineUnit;
  manufacturer: string;
  dosageInfo: string;
  requiresPrescription: boolean;
  imageUrl: string;
  expiryDate?: string;
  isActive: boolean;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartLineItem {
  medicineId: string;
  name: string;
  sku: string;
  price: number;
  unit: MedicineUnit;
  stockQuantity: number;
  requiresPrescription: boolean;
  imageUrl: string;
  quantity: number;
  lineTotal: number;
  inStock: boolean;
}

export interface CartSummary {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
}

export interface StoreOrderItem {
  medicineId: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
  requiresPrescription: boolean;
}

export interface StoreOrder {
  id: string;
  userId: string;
  userRole: string;
  items: StoreOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  notes: string;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreItemFormValues {
  name: string;
  sku?: string;
  description?: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: MedicineUnit;
  manufacturer?: string;
  dosageInfo?: string;
  requiresPrescription: boolean;
  imageUrl?: string;
  expiryDate?: string;
  isActive: boolean;
}

export const MEDICINE_UNITS: { value: MedicineUnit; label: string }[] = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'strip', label: 'Strip' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'tube', label: 'Tube' },
  { value: 'box', label: 'Box' },
  { value: 'vial', label: 'Vial' },
  { value: 'other', label: 'Other' },
];

export const DEFAULT_CATEGORIES = [
  'Pain Relief',
  'Antibiotic',
  'Vitamins',
  'Diabetes',
  'Cardiac',
  'Skin Care',
  'Cold & Flu',
  'Digestive',
];
