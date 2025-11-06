// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import route files
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // ✅ new route
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();



// ===== Middleware =====
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ===== MongoDB connection =====
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rudraksha_store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ===== API Routes =====
app.use("/api/payment", paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // ✅ added order management route

// ===== Health Check =====
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running fine ✅', timestamp: new Date().toISOString() });
});

// ===== Error Handling Middleware =====
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// ===== Handle 404 =====
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
