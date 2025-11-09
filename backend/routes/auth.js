const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ==================== REGISTER ====================
router.post('/register', async (req, res) => {
  try {
    let { username, email, password, firstName, lastName, role } = req.body;

    username = username?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    firstName = firstName?.trim();
    lastName = lastName?.trim();

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ❌ REMOVE: manual hashing
    // const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ Just pass raw password; model will hash automatically
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || 'user'
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ==================== LOGIN ====================
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log('🔹 Incoming login request:', { email, passwordProvided: !!password });

    // Sanitize input
    email = email?.trim().toLowerCase();
    password = password?.trim();
    console.log('🔹 Sanitized input:', { email });

    if (!email || !password) {
      console.warn('⚠️ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    console.log('🔍 Searching for user in database...');
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`❌ User not found for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found:', { id: user._id, email: user.email, role: user.role });

    // Compare password
    console.log('🔐 Comparing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🧩 Password match result:', isMatch);

    if (!isMatch) {
      console.warn('❌ Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    console.log('🔑 Generating JWT token...');
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Token generated successfully for user:', user.email);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('💥 Login error (catch block):', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== GET CURRENT USER ====================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== UPDATE PROFILE ====================
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.role;
    delete updates.password; // Prevent changing password here

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
