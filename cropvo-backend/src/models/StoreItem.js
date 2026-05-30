const mongoose = require('mongoose');

const UNITS = ['tablet', 'strip', 'bottle', 'tube', 'box', 'vial', 'other'];

const storeItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
      maxlength: 120,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: 80,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: UNITS,
      default: 'strip',
    },
    manufacturer: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    dosageInfo: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    requiresPrescription: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

storeItemSchema.index({ name: 'text', category: 'text', manufacturer: 'text' });
storeItemSchema.index({ isActive: 1, category: 1 });

module.exports = mongoose.model('StoreItem', storeItemSchema, 'store_items');
module.exports.STORE_UNITS = UNITS;
