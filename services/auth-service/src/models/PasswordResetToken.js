const mongoose = require('mongoose');
const crypto = require('crypto');

const passwordResetTokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  resetToken: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
});

passwordResetTokenSchema.statics.createTokenForUser = async function (userId) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expires = Date.now() + 1000 * 60 * 60;

  await this.create({
    userId,
    resetToken: hashedToken,
    expiresAt: new Date(expires),
  });

  return rawToken;
};

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);
module.exports = PasswordResetToken;
