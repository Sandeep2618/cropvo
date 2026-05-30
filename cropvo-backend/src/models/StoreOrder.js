const mongoose = require('mongoose');

const ORDER_STATUSES = ['pending', 'confirmed', 'cancelled', 'fulfilled'];

const orderItemSchema = new mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StoreItem',
      required: true,
    },
    name: { type: String, required: true },
    sku: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'strip' },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    requiresPrescription: { type: Boolean, default: false },
  },
  { _id: false }
);

const storeOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userRole: {
      type: String,
      enum: ['patient', 'doctor'],
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    deliveryAddress: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

storeOrderSchema.index({ userId: 1, createdAt: -1 });
storeOrderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('StoreOrder', storeOrderSchema, 'store_orders');
module.exports.ORDER_STATUSES = ORDER_STATUSES;
