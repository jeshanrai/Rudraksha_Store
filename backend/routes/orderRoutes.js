// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/Order');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, shipping, paymentMethod, subtotal, tax, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    const order = new Order({
      user: req.user._id,
      // ✅ make sure this matches your schema field name
      orderItems: items.map(item => ({
        product: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
      },
      paymentMethod: paymentMethod || 'N/A',
      subtotal: subtotal || 0,
      tax: tax || 0,
      // ✅ use totalAmount from frontend instead of undefined `total`
      totalAmount: totalAmount || 0,
      paymentStatus: 'pending',
      orderStatus: 'Pending',
      createdAt: new Date()
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');
    res.json(orders);
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

module.exports = router;
