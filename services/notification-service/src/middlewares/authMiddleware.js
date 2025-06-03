const jwt = require('jsonwebtoken');
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
// const TokenBlacklist = require('path-to-your-auth-service-models/TokenBlacklist'); 
const { secret } = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
};

const authMiddleware = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // const blacklisted = await TokenBlacklist.findOne({ token });
    // if (blacklisted) {
    //   return res.status(401).json({ message: 'Token has been logged out' });
    // }
    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authMiddleware };
