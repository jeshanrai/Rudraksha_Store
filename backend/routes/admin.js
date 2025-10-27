// routes/admin.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sales = require('../models/Sales');
const Order = require('../models/Order'); // ✅ import Order model
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply middleware to all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// ----------------------------
// INVENTORY MANAGEMENT ROUTES
// ----------------------------

// GET /api/admin/products
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

// POST /api/admin/products
router.post('/products', async (req, res) => {
  try {
    const { name, images, description, benefits, costPrice, sellingPrice, discountRate, stock, mukhi, category } = req.body;
    if (!name || !images || !description || sellingPrice === undefined || costPrice === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    const product = new Product({
      name,
      images: Array.isArray(images) ? images : [images],
      description,
      benefits,
      costPrice,
      sellingPrice,
      discountRate,
      stock,
      mukhi,
      category
    });
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// ----------------------------
// ORDER MANAGEMENT ROUTES
// ----------------------------

// GET all orders with pagination and optional date filter
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;
    let query = {};
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const orders = await Order.find(query)
      .populate('orderItems.product', 'name sellingPrice costPrice discountRate')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);
    res.json({ 
      orders,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// PATCH /api/admin/orders/:id - update paymentStatus or orderStatus
router.patch('/orders/:id', async (req, res) => {
  try {
    const { paymentStatus, orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (orderStatus) order.orderStatus = orderStatus;

    await order.save();
    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/orders - create new order
router.post('/orders', async (req, res) => {
  try {
    const { user, orderItems, shippingAddress, paymentMethod, subtotal, tax, totalAmount, notes } = req.body;
    if (!user || !orderItems || !paymentMethod) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const order = new Order({ user, orderItems, shippingAddress, paymentMethod, subtotal, tax, totalAmount });
    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
});

// ----------------------------
// SALES ROUTES (optional)
// ----------------------------

// GET /api/admin/sales
router.get('/sales', async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;
    let query = {};
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    const sales = await Sales.find(query)
      .populate('productId', 'name sellingPrice costPrice discountRate')
      .populate('userId', 'username email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });
    const total = await Sales.countDocuments(query);
    res.json({ sales, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching sales', error: error.message });
  }
});

module.exports = router;
