// routes/admin.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sales = require('../models/Sales');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply middleware to all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// ----------------------------
// INVENTORY MANAGEMENT ROUTES
// ----------------------------

// GET /api/admin/products - List all products
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// POST /api/admin/products - Add new product
router.post('/products', async (req, res) => {
  try {
    const {
      name,
      images,
      description,
      benefits,
      costPrice,
      sellingPrice,
      discountRate,
      price,
      stock,
      mukhi,
      category
    } = req.body;

    // Validation
    if (!name || !images || !description || sellingPrice === undefined || costPrice === undefined || stock === undefined) {
      return res.status(400).json({
        message: 'Required fields: name, images, description, costPrice, sellingPrice, stock'
      });
    }

    if (costPrice < 0 || sellingPrice < 0 || discountRate < 0 || discountRate > 100 || stock < 0) {
      return res.status(400).json({
        message: 'Cost price, selling price, discount (0-100), and stock must be non-negative'
      });
    }

    const product = new Product({
      name,
      images: Array.isArray(images) ? images : [images],
      description,
      benefits,
      costPrice,
      sellingPrice,
      discountRate,
      price: sellingPrice, // keep price field backward-compatible
      stock,
      mukhi,
      category
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate non-negative values
    const nonNegativeFields = ['price', 'stock', 'costPrice', 'sellingPrice', 'discountRate'];
    for (const field of nonNegativeFields) {
      if (updates[field] !== undefined && updates[field] < 0) {
        return res.status(400).json({ message: `${field} must be non-negative` });
      }
      if (field === 'discountRate' && updates.discountRate > 100) {
        return res.status(400).json({ message: 'discountRate cannot exceed 100%' });
      }
    }

    // Sync price field if sellingPrice is updated
    if (updates.sellingPrice !== undefined) updates.price = updates.sellingPrice;

    const product = await Product.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// ----------------------------
// SALES MANAGEMENT ROUTES
// ----------------------------

// GET /api/admin/sales - List all sales
router.get('/sales', async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sales = await Sales.find(query)
      .populate('productId', 'name sellingPrice costPrice discountRate images')
      .populate('userId', 'username email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await Sales.countDocuments(query);

    // Calculate summary stats including profit
    const summaryAgg = await Sales.aggregate([
      { $match: query },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, totalProfit: { $sum: '$profit' } } }
    ]);

    res.json({
      sales,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      summary: {
        totalRevenue: summaryAgg[0]?.totalRevenue || 0,
        totalProfit: summaryAgg[0]?.totalProfit || 0,
        totalSales: total
      }
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Error fetching sales', error: error.message });
  }
});

// POST /api/admin/sales - Add new sales entry
router.post('/sales', async (req, res) => {
  try {
    const { productId, quantity, totalAmount, userId, notes } = req.body;

    if (!productId || !quantity || !totalAmount) {
      return res.status(400).json({ message: 'Required fields: productId, quantity, totalAmount' });
    }

    if (quantity <= 0 || totalAmount <= 0) {
      return res.status(400).json({ message: 'Quantity and total amount must be positive' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: `Insufficient stock. Available: ${product.stock}` });

    // Effective selling price after discount
    const effectivePrice = product.sellingPrice * (1 - (product.discountRate || 0) / 100);
    const profit = (effectivePrice - product.costPrice) * quantity;

    const sales = new Sales({
      productId,
      quantity,
      totalAmount,
      profit,
      userId,
      notes
    });

    await sales.save();

    // Reduce product stock
    product.stock -= quantity;
    await product.save();

    await sales.populate('productId', 'name sellingPrice costPrice discountRate images');
    if (userId) await sales.populate('userId', 'username email');

    res.status(201).json({ message: 'Sales entry created successfully', sales });
  } catch (error) {
    console.error('Error creating sales entry:', error);
    res.status(500).json({ message: 'Error creating sales entry', error: error.message });
  }
});

// GET /api/admin/dashboard/stats - Dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });

    // Monthly sales
    const monthlySalesAgg = await Sales.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, totalProfit: { $sum: '$profit' }, count: { $sum: 1 } } }
    ]);

    // Total revenue & profit
    const totalAgg = await Sales.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, totalProfit: { $sum: '$profit' } } }
    ]);

    res.json({
      totalProducts,
      lowStockProducts,
      monthlySales: monthlySalesAgg[0]?.count || 0,
      monthlyRevenue: monthlySalesAgg[0]?.totalRevenue || 0,
      monthlyProfit: monthlySalesAgg[0]?.totalProfit || 0,
      totalRevenue: totalAgg[0]?.totalRevenue || 0,
      totalProfit: totalAgg[0]?.totalProfit || 0
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

module.exports = router;
