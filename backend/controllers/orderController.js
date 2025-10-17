const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

// ================== PLACE ORDER ==================
exports.placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      throw new Error('No order items provided');
    }

    let totalAmount = 0;
    const orderItems = [];

    // 1️⃣ Check stock, reduce inventory, and calculate totals
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      if (product.stock < item.quantity)
        throw new Error(`Insufficient stock for ${product.name}`);

      const price = product.sellingPrice;
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      // Decrease stock
      product.stock -= item.quantity;
      await product.save({ session });

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price,
        subtotal
      });
    }

    // 2️⃣ Create order document
    const order = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          shippingAddress,
          paymentMethod,
          totalAmount,
          paymentStatus: paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid'
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: order[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: error.message });
  }
};

// ================== GET USER ORDERS ==================
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.productId', 'name images')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
