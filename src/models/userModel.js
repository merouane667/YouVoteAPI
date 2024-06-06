const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
  firstName: String,  
  lastName: String,
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  emailVerificationCode: String,
  phoneVerificationCode: String,
  loginId: String,
  loginPassword: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

