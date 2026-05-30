const StoreItem = require('../models/StoreItem');

const formatItem = (doc) => {
  const item = doc.toJSON ? doc.toJSON() : doc;
  return {
    ...item,
    id: item.id || item._id?.toString(),
    inStock: item.stockQuantity > 0,
  };
};

const listStoreItems = async (req, res) => {
  try {
    const { category, search, includeInactive } = req.query;
    const isAdmin = req.userRole === 'admin';

    const filter = {};
    if (!isAdmin || includeInactive !== 'true') {
      filter.isActive = true;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search && String(search).trim()) {
      const term = String(search).trim();
      filter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
        { manufacturer: { $regex: term, $options: 'i' } },
        { sku: { $regex: term, $options: 'i' } },
      ];
    }

    const items = await StoreItem.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: items.map(formatItem) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch store items' });
  }
};

const getStoreItem = async (req, res) => {
  try {
    const item = await StoreItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    if (!item.isActive && req.userRole !== 'admin') {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.json({ success: true, data: formatItem(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch medicine' });
  }
};

const createStoreItem = async (req, res) => {
  try {
    const payload = {
      name: req.body.name.trim(),
      sku: req.body.sku?.trim() || undefined,
      description: req.body.description?.trim() || '',
      category: req.body.category.trim(),
      price: Number(req.body.price),
      stockQuantity: Number(req.body.stockQuantity),
      unit: req.body.unit || 'strip',
      manufacturer: req.body.manufacturer?.trim() || '',
      dosageInfo: req.body.dosageInfo?.trim() || '',
      requiresPrescription: Boolean(req.body.requiresPrescription),
      imageUrl: req.body.imageUrl?.trim() || '',
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined,
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
      createdBy: req.userId,
    };

    const item = await StoreItem.create(payload);
    res.status(201).json({ success: true, data: formatItem(item), message: 'Medicine added to store' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'SKU already exists' });
    }
    res.status(500).json({ success: false, message: error.message || 'Failed to create medicine' });
  }
};

const updateStoreItem = async (req, res) => {
  try {
    const updates = {};
    const fields = [
      'name',
      'sku',
      'description',
      'category',
      'price',
      'stockQuantity',
      'unit',
      'manufacturer',
      'dosageInfo',
      'requiresPrescription',
      'imageUrl',
      'isActive',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (['name', 'sku', 'description', 'category', 'manufacturer', 'dosageInfo', 'imageUrl'].includes(field)) {
          updates[field] = String(req.body[field]).trim();
        } else if (field === 'requiresPrescription' || field === 'isActive') {
          updates[field] = Boolean(req.body[field]);
        } else if (field === 'price' || field === 'stockQuantity') {
          updates[field] = Number(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    if (req.body.expiryDate !== undefined) {
      updates.expiryDate = req.body.expiryDate ? new Date(req.body.expiryDate) : null;
    }

    const item = await StoreItem.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.json({ success: true, data: formatItem(item), message: 'Medicine updated' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'SKU already exists' });
    }
    res.status(500).json({ success: false, message: error.message || 'Failed to update medicine' });
  }
};

const deleteStoreItem = async (req, res) => {
  try {
    const item = await StoreItem.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.json({ success: true, message: 'Medicine removed from store' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to remove medicine' });
  }
};

const listCategories = async (_req, res) => {
  try {
    const categories = await StoreItem.distinct('category', { isActive: true });
    res.json({ success: true, data: categories.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch categories' });
  }
};

module.exports = {
  listStoreItems,
  getStoreItem,
  createStoreItem,
  updateStoreItem,
  deleteStoreItem,
  listCategories,
};
