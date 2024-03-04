const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,  
    lastName: String,
    email: String,
    password: String,
    phoneNumber: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;