// scripts/seedAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rudraksha_store');
    console.log('Connected to MongoDB');

    // Create admin user
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

    // Create test user
    const testUser = await User.findOne({ email: 'user@example.com' });
    if (!testUser) {
      await User.create({
        username: 'testuser',
        email: 'user@example.com',
        password: 'password',
        role: 'user',
        firstName: 'Test',
        lastName: 'User'
      });
      console.log('Test user created');
    } else {
      console.log('Test user already exists');
    }

    // Create sample products
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      const sampleProducts = [
        {
          name: '1 Mukhi Rudraksha',
          images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&sat=-100'
          ],
          description: 'Rare 1 Mukhi Rudraksha bead, representing Lord Shiva. Excellent for meditation and spiritual growth.',
          benefits: 'Enhances concentration, removes obstacles, brings peace and prosperity.',
          price: 299.99,
          stock: 15,
          mukhi: '1 Mukhi',
          category: 'Premium'
        },
        {
          name: '5 Mukhi Rudraksha',
          images: [
            'https://images.unsplash.com/photo-1583037026961-07d7e086ca08?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1583037026961-07d7e086ca08?w=400&h=400&fit=crop&sat=-100'
          ],
          description: 'Most common and powerful 5 Mukhi Rudraksha, representing Lord Shiva and Goddess Parvati.',
          benefits: 'Reduces blood pressure, calms mind, enhances memory and concentration.',
          price: 49.99,
          stock: 100,
          mukhi: '5 Mukhi',
          category: 'Standard'
        },
        {
          name: '7 Mukhi Rudraksha',
          images: [
            'https://images.unsplash.com/photo-1611485988536-b929d9fb4537?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1611485988536-b929d9fb4537?w=400&h=400&fit=crop&sat=-100'
          ],
          description: '7 Mukhi Rudraksha associated with Goddess Lakshmi, brings wealth and prosperity.',
          benefits: 'Attracts wealth, removes poverty, enhances business success.',
          price: 79.99,
          stock: 50,
          mukhi: '7 Mukhi',
          category: 'Premium'
        },
        {
          name: '11 Mukhi Rudraksha',
          images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&brightness=0.9',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&sat=-100'
          ],
          description: 'Rare 11 Mukhi Rudraksha representing Lord Hanuman, provides protection and courage.',
          benefits: 'Increases courage, provides protection, enhances leadership qualities.',
          price: 199.99,
          stock: 8,
          mukhi: '11 Mukhi',
          category: 'Rare'
        },
        {
          name: 'Rudraksha Mala 108 Beads',
          images: [
            'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop&sat=-100'
          ],
          description: 'Complete Rudraksha mala with 108 authentic 5 Mukhi beads for meditation and chanting.',
          benefits: 'Perfect for meditation, chanting mantras, spiritual practices.',
          price: 149.99,
          stock: 25,
          mukhi: '5 Mukhi',
          category: 'Mala'
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log('Sample products created');
    } else {
      console.log('Products already exist');
    }

    console.log('\nSeed data completed successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@example.com / password');
    console.log('User: user@example.com / password');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();