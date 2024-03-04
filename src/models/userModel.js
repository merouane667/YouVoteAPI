const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,  
    lastName: String,
    email: String,
    password: String,
    phoneNumber: String,
    createdAt: Date,
    updatedAt: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;