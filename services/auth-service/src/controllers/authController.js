const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const PasswordResetToken = require('../models/PasswordResetToken');
const generateToken = require('../utils/generateToken');
const { sendPasswordResetEmail } = require('../services/emailService');
const { secret } = require('../config/jwt-config');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user);

    res.status(200).json({
      token,
      role: user.role,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req, res) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secret, { ignoreExpiration: true });
    const expiresAt = new Date(decoded.exp * 1000);

    await TokenBlacklist.create({ token, expiresAt });

    res.status(200).json({ message: 'Successfully logged out' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const rawToken = await PasswordResetToken.createTokenForUser(user._id);

    await sendPasswordResetEmail(user.email, rawToken);

    return res
      .status(200)
      .json({ message: 'Password reset link sent to email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
//--------------------------------------------------------------------------------------------- for test
const addManyUsers = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Expected an array of users.' });
    }

    const createdUsers = [];

    for (const userData of req.body) {
      const { _id, email, password, role } = userData;
      
      if (!_id || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing email, password, or role.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        continue;
      }
      const user = await User.create({_id, email, password, role });
      const token = generateToken(user);

      createdUsers.push({
        user,
        token,
        role: user.role,
      });
    }

    if (createdUsers.length === 0) {
      return res.status(409).json({ message: 'All provided users already exist.' });
    }

    return res.status(201).json({
      message: 'Users registered successfully.',
      users: createdUsers,
    });

  } catch (err) {
    console.error('Add users error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
//--------------------------------------------------------------------------------------------- for test

module.exports = {
  login,
  logout,
  forgotPassword,
  addManyUsers,
};
