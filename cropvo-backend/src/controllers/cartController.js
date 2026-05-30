const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const StoreItem = require('../models/StoreItem');

const formatCartItem = async (cartItem) => {
  const medicine = await StoreItem.findById(cartItem.medicineId);
  if (!medicine || !medicine.isActive) {
    return null;
  }

  return {
    medicineId: medicine.id || medicine._id.toString(),
    name: medicine.name,
    sku: medicine.sku || '',
    price: medicine.price,
    unit: medicine.unit,
    stockQuantity: medicine.stockQuantity,
    requiresPrescription: medicine.requiresPrescription,
    imageUrl: medicine.imageUrl || '',
    quantity: cartItem.quantity,
    lineTotal: Number((medicine.price * cartItem.quantity).toFixed(2)),
    inStock: medicine.stockQuantity >= cartItem.quantity,
  };
};

const getOrCreateCart = async (userId, userRole) => {
  let cart = await Cart.findOne({ userId, userRole });
  if (!cart) {
    cart = await Cart.create({ userId, userRole, items: [] });
  }
  return cart;
};

const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId, req.userRole);
    const populated = (await Promise.all(cart.items.map(formatCartItem))).filter(Boolean);

    const subtotal = populated.reduce((sum, item) => sum + item.lineTotal, 0);

    res.json({
      success: true,
      data: {
        items: populated,
        itemCount: populated.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: Number(subtotal.toFixed(2)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch cart' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { medicineId, quantity = 1 } = req.body;
    const qty = Number(quantity);

    if (!mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ success: false, message: 'Invalid medicine id' });
    }

    const medicine = await StoreItem.findOne({ _id: medicineId, isActive: true });
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found or unavailable' });
    }

    if (medicine.stockQuantity < 1) {
      return res.status(400).json({ success: false, message: 'Medicine is out of stock' });
    }

    const cart = await getOrCreateCart(req.userId, req.userRole);
    const existing = cart.items.find((i) => i.medicineId.toString() === medicineId);

    const newQty = existing ? existing.quantity + qty : qty;
    if (newQty > medicine.stockQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${medicine.stockQuantity} units available in stock`,
      });
    }

    if (existing) {
      existing.quantity = newQty;
    } else {
      cart.items.push({ medicineId, quantity: qty });
    }

    await cart.save();

    const populated = (await Promise.all(cart.items.map(formatCartItem))).filter(Boolean);
    const subtotal = populated.reduce((sum, item) => sum + item.lineTotal, 0);

    res.json({
      success: true,
      message: 'Added to cart',
      data: {
        items: populated,
        itemCount: populated.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: Number(subtotal.toFixed(2)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to add to cart' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (!mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ success: false, message: 'Invalid medicine id' });
    }

    const medicine = await StoreItem.findOne({ _id: medicineId, isActive: true });
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    if (qty > medicine.stockQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${medicine.stockQuantity} units available in stock`,
      });
    }

    const cart = await getOrCreateCart(req.userId, req.userRole);
    const item = cart.items.find((i) => i.medicineId.toString() === medicineId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (qty < 1) {
      cart.items = cart.items.filter((i) => i.medicineId.toString() !== medicineId);
    } else {
      item.quantity = qty;
    }

    await cart.save();

    const populated = (await Promise.all(cart.items.map(formatCartItem))).filter(Boolean);
    const subtotal = populated.reduce((sum, i) => sum + i.lineTotal, 0);

    res.json({
      success: true,
      data: {
        items: populated,
        itemCount: populated.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: Number(subtotal.toFixed(2)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update cart' });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { medicineId } = req.params;

    const cart = await getOrCreateCart(req.userId, req.userRole);
    cart.items = cart.items.filter((i) => i.medicineId.toString() !== medicineId);
    await cart.save();

    const populated = (await Promise.all(cart.items.map(formatCartItem))).filter(Boolean);
    const subtotal = populated.reduce((sum, i) => sum + i.lineTotal, 0);

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        items: populated,
        itemCount: populated.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: Number(subtotal.toFixed(2)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to remove item' });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId, req.userRole);
    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: { items: [], itemCount: 0, subtotal: 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to clear cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
