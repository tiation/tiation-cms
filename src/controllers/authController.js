const jwt = require('jsonwebtoken');
const { User, Tenant } = require('../models');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, tenantName, tenantSlug } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Check if tenant slug already exists
    const existingTenant = await Tenant.findOne({ where: { slug: tenantSlug } });
    if (existingTenant) {
      return res.status(400).json({ error: 'Tenant slug already exists' });
    }

    // Create tenant first
    const tenant = await Tenant.create({
      name: tenantName,
      slug: tenantSlug,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
    });

    // Create user with admin role for new tenant
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      tenantId: tenant.id,
      role: 'admin',
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'User and tenant created successfully',
      user: user.toJSON(),
      tenant: tenant.toJSON(),
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user with tenant
    const user = await User.findOne({
      where: { email, isActive: true },
      include: [{
        model: Tenant,
        as: 'tenant',
        where: { isActive: true },
      }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      tenant: user.tenant.toJSON(),
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [{
        model: Tenant,
        as: 'tenant',
      }],
    });

    res.json({
      user: user.toJSON(),
      tenant: user.tenant.toJSON(),
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName } = req.body;
    
    await req.user.update({ firstName, lastName });

    res.json({
      message: 'Profile updated successfully',
      user: req.user.toJSON(),
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await req.user.checkPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Server error changing password' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = generateToken(req.user);
    res.json({ token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Server error refreshing token' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
};
