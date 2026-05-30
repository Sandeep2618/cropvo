const Cart = require('../models/Cart');
const StoreItem = require('../models/StoreItem');
const StoreOrder = require('../models/StoreOrder');

const formatOrder = (order) => {
  const obj = order.toObject ? order.toObject() : order;
  return {
    ...obj,
    id: obj._id?.toString() || obj.id,
  };
};

const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId, userRole: req.userRole });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const medicineIds = cart.items.map((i) => i.medicineId);
    const medicines = await StoreItem.find({ _id: { $in: medicineIds }, isActive: true });
    const medMap = new Map(medicines.map((m) => [m._id.toString(), m]));

    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const medicine = medMap.get(cartItem.medicineId.toString());

      if (!medicine) {
        return res.status(400).json({
          success: false,
          message: 'One or more items are no longer available',
        });
      }

      if (medicine.stockQuantity < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stockQuantity}`,
        });
      }

      const lineTotal = Number((medicine.price * cartItem.quantity).toFixed(2));
      orderItems.push({
        medicineId: medicine._id,
        name: medicine.name,
        sku: medicine.sku || '',
        quantity: cartItem.quantity,
        unit: medicine.unit,
        unitPrice: medicine.price,
        lineTotal,
        requiresPrescription: medicine.requiresPrescription,
      });

      totalAmount += lineTotal;
    }

    for (const cartItem of cart.items) {
      const medicine = medMap.get(cartItem.medicineId.toString());
      medicine.stockQuantity -= cartItem.quantity;
      await medicine.save();
    }

    const order = await StoreOrder.create({
      userId: req.userId,
      userRole: req.userRole,
      items: orderItems,
      totalAmount: Number(totalAmount.toFixed(2)),
      status: 'pending',
      notes: req.body.notes?.trim() || '',
      deliveryAddress: req.body.deliveryAddress?.trim() || '',
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: formatOrder(order),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Checkout failed' });
  }
};

const listOrders = async (req, res) => {
  try {
    const filter =
      req.userRole === 'admin'
        ? {}
        : { userId: req.userId, userRole: req.userRole };

    const orders = await StoreOrder.find(filter).sort({ createdAt: -1 }).limit(100);

    res.json({ success: true, data: orders.map(formatOrder) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch orders' });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await StoreOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isOwner =
      order.userId.toString() === req.userId.toString() && order.userRole === req.userRole;

    if (!isOwner && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: formatOrder(order) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch order' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = StoreOrder.ORDER_STATUSES || ['pending', 'confirmed', 'cancelled', 'fulfilled'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(', ')}`,
      });
    }

    const order = await StoreOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: formatOrder(order), message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update order' });
  }
};

module.exports = {
  checkout,
  listOrders,
  getOrder,
  updateOrderStatus,
};
