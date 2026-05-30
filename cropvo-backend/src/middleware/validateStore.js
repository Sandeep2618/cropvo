const { STORE_UNITS } = require('../models/StoreItem');

const validateStoreItemBody = (req, res, next) => {
  const {
    name,
    category,
    price,
    stockQuantity,
    unit,
    description,
    manufacturer,
    dosageInfo,
    requiresPrescription,
    imageUrl,
    expiryDate,
    sku,
    isActive,
  } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: 'Medicine name is required' });
  }

  if (!category || !String(category).trim()) {
    return res.status(400).json({ success: false, message: 'Category is required' });
  }

  if (price === undefined || price === null || Number(price) < 0) {
    return res.status(400).json({ success: false, message: 'Valid price is required' });
  }

  if (stockQuantity === undefined || stockQuantity === null || Number(stockQuantity) < 0) {
    return res.status(400).json({ success: false, message: 'Valid stock quantity is required' });
  }

  if (unit && !STORE_UNITS.includes(unit)) {
    return res.status(400).json({
      success: false,
      message: `Unit must be one of: ${STORE_UNITS.join(', ')}`,
    });
  }

  if (description && String(description).length > 2000) {
    return res.status(400).json({ success: false, message: 'Description is too long' });
  }

  if (manufacturer && String(manufacturer).length > 120) {
    return res.status(400).json({ success: false, message: 'Manufacturer name is too long' });
  }

  if (dosageInfo && String(dosageInfo).length > 500) {
    return res.status(400).json({ success: false, message: 'Dosage info is too long' });
  }

  if (requiresPrescription !== undefined && typeof requiresPrescription !== 'boolean') {
    return res.status(400).json({ success: false, message: 'requiresPrescription must be a boolean' });
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
  }

  if (expiryDate && Number.isNaN(Date.parse(expiryDate))) {
    return res.status(400).json({ success: false, message: 'Invalid expiry date' });
  }

  if (sku && String(sku).length > 64) {
    return res.status(400).json({ success: false, message: 'SKU is too long' });
  }

  if (imageUrl && String(imageUrl).length > 500) {
    return res.status(400).json({ success: false, message: 'Image URL is too long' });
  }

  next();
};

const validateCartItemBody = (req, res, next) => {
  const { medicineId, quantity } = req.body;

  if (!medicineId) {
    return res.status(400).json({ success: false, message: 'medicineId is required' });
  }

  if (quantity !== undefined && (Number(quantity) < 1 || !Number.isInteger(Number(quantity)))) {
    return res.status(400).json({ success: false, message: 'Quantity must be a positive integer' });
  }

  next();
};

const validateCheckoutBody = (req, res, next) => {
  const { deliveryAddress, notes } = req.body;

  if (deliveryAddress && String(deliveryAddress).length > 500) {
    return res.status(400).json({ success: false, message: 'Delivery address is too long' });
  }

  if (notes && String(notes).length > 500) {
    return res.status(400).json({ success: false, message: 'Notes are too long' });
  }

  next();
};

const validateStoreItemUpdate = (req, res, next) => {
  const { price, stockQuantity, unit, expiryDate, isActive, requiresPrescription } = req.body;

  if (price !== undefined && Number(price) < 0) {
    return res.status(400).json({ success: false, message: 'Price cannot be negative' });
  }

  if (stockQuantity !== undefined && Number(stockQuantity) < 0) {
    return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
  }

  if (unit && !STORE_UNITS.includes(unit)) {
    return res.status(400).json({
      success: false,
      message: `Unit must be one of: ${STORE_UNITS.join(', ')}`,
    });
  }

  if (expiryDate !== undefined && expiryDate !== null && Number.isNaN(Date.parse(expiryDate))) {
    return res.status(400).json({ success: false, message: 'Invalid expiry date' });
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
  }

  if (requiresPrescription !== undefined && typeof requiresPrescription !== 'boolean') {
    return res.status(400).json({ success: false, message: 'requiresPrescription must be a boolean' });
  }

  next();
};

const validateCartQuantity = (req, res, next) => {
  const { quantity } = req.body;

  if (quantity === undefined || Number(quantity) < 1 || !Number.isInteger(Number(quantity))) {
    return res.status(400).json({ success: false, message: 'Quantity must be a positive integer' });
  }

  next();
};

module.exports = {
  validateStoreItemBody,
  validateStoreItemUpdate,
  validateCartItemBody,
  validateCartQuantity,
  validateCheckoutBody,
};
