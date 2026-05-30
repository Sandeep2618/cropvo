const express = require('express');
const {
  listStoreItems,
  getStoreItem,
  createStoreItem,
  updateStoreItem,
  deleteStoreItem,
  listCategories,
} = require('../controllers/storeItemController');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');
const {
  checkout,
  listOrders,
  getOrder,
  updateOrderStatus,
} = require('../controllers/storeOrderController');
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  validateStoreItemBody,
  validateStoreItemUpdate,
  validateCartItemBody,
  validateCartQuantity,
  validateCheckoutBody,
} = require('../middleware/validateStore');

const router = express.Router();

// ── Store catalog ───────────────────────────────────────────────────────────
router.get(
  '/store/items',
  verifyToken,
  requireRole('admin', 'patient', 'doctor'),
  listStoreItems
);

router.get(
  '/store/categories',
  verifyToken,
  requireRole('admin', 'patient', 'doctor'),
  listCategories
);

router.get(
  '/store/items/:id',
  verifyToken,
  requireRole('admin', 'patient', 'doctor'),
  getStoreItem
);

router.post(
  '/store/items',
  verifyToken,
  requireRole('admin'),
  validateStoreItemBody,
  createStoreItem
);

router.patch(
  '/store/items/:id',
  verifyToken,
  requireRole('admin'),
  validateStoreItemUpdate,
  updateStoreItem
);

router.delete(
  '/store/items/:id',
  verifyToken,
  requireRole('admin'),
  deleteStoreItem
);

// ── Cart (patient & doctor) ─────────────────────────────────────────────────
router.get(
  '/store/cart',
  verifyToken,
  requireRole('patient', 'doctor'),
  getCart
);

router.post(
  '/store/cart/items',
  verifyToken,
  requireRole('patient', 'doctor'),
  validateCartItemBody,
  addToCart
);

router.patch(
  '/store/cart/items/:medicineId',
  verifyToken,
  requireRole('patient', 'doctor'),
  validateCartQuantity,
  updateCartItem
);

router.delete(
  '/store/cart/items/:medicineId',
  verifyToken,
  requireRole('patient', 'doctor'),
  removeCartItem
);

router.delete(
  '/store/cart',
  verifyToken,
  requireRole('patient', 'doctor'),
  clearCart
);

// ── Orders ──────────────────────────────────────────────────────────────────
router.post(
  '/store/orders/checkout',
  verifyToken,
  requireRole('patient', 'doctor'),
  validateCheckoutBody,
  checkout
);

router.get(
  '/store/orders',
  verifyToken,
  requireRole('admin', 'patient', 'doctor'),
  listOrders
);

router.get(
  '/store/orders/:id',
  verifyToken,
  requireRole('admin', 'patient', 'doctor'),
  getOrder
);

router.patch(
  '/store/orders/:id/status',
  verifyToken,
  requireRole('admin'),
  updateOrderStatus
);

module.exports = router;
