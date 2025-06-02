const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt-config');

/**
 * Generates JWT containing:
 *   - user ID
 *   - user role
 */
const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateToken;
