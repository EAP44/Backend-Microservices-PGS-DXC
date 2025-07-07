const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const PasswordResetToken = require('../models/PasswordResetToken');
const generateToken = require('../utils/generateToken');
const { sendPasswordResetEmail } = require('../services/emailService');
const { secret } = require('../config/jwt-config');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
      user: {
        _id: user._id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        specialite: user.specialite,
        phoneNumber: user.phoneNumber,
      }
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
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const newPassword = crypto.randomBytes(6).toString('hex');
    user.password = newPassword;
    await user.save();

    const token = generateToken(user);

    await sendPasswordResetEmail(user.email, newPassword, token);

    return res.status(200).json({ message: 'New password sent to email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addManyUsers = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Expected an array of users.' });
    }

    const createdUsers = [];

    for (const userData of req.body) {
      const { _id, email, password, role, nom, prenom, phoneNumber, specialite } = userData;

      if (!_id || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing _id, email, password, or role.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        continue; 
      }

      const user = await User.create({
        _id,
        email,
        password,
        role,
        nom,
        prenom,
        phoneNumber,
        specialite,
      });

      const token = generateToken(user);

      createdUsers.push({
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          nom: user.nom,
          prenom: user.prenom,
          phoneNumber: user.phoneNumber,
          specialite: user.specialite,
        },
        token,
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

const getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Get profile error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


const cleanDatabase = async (req, res) => {
  try {
    await Promise.all([
      User.deleteMany({}),
      TokenBlacklist.deleteMany({}),
      PasswordResetToken.deleteMany({}),
    ]);

    res.status(200).json({ message: 'Database cleaned successfully' });
  } catch (err) {
    console.error('Clean DB error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




const changePassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { changePassword };


module.exports = {
  login,
  logout,
  forgotPassword,
  addManyUsers,
  getProfile,
  cleanDatabase,
  changePassword
};
