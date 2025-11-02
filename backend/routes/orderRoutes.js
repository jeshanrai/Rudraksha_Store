// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// ----------------------------
// GET /api/orders - List all orders (with pagination)
// ----------------------------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name sellingPrice images costPrice discountRate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      orders,
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// -------------------------------------------
// ✅ GET /api/orders/my-orders  (User's own orders)
// -------------------------------------------
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // from decoded token

    const orders = await Order.find({ user: userId })
      .populate("orderItems.product", "name sellingPrice images")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------
// POST /api/orders - Create a new order
// ----------------------------
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, items, shipping, paymentMethod, subtotal, tax, totalAmount, status } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'User and order items are required' });
    }

    // Check stock availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product: ${product.name}` });
      }
    }

    // Create order
    const order = new Order({
      user: userId,
      orderItems: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      shipping,
      paymentMethod,
      subtotal,
      tax,
      totalAmount,
      status: status || 'Pending',
      createdAt: new Date()
    });

    await order.save();

    // Reduce stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    // Populate for response
    await order.populate('user', 'name email');
    await order.populate('orderItems.product', 'name sellingPrice images costPrice discountRate');

    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
