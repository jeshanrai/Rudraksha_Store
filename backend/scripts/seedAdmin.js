// scripts/seedAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rudraksha_store');
    console.log('Connected to MongoDB');

    // Check if admin exists
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    console.log('\nSeed completed successfully!');
    console.log('Admin login credentials: admin@example.com / password');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedAdmin();
