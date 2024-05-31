const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { secretKey } = require('../config');
//nodemailer
const nodemailer = require('nodemailer');

// Configure the transporter for Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'youvote7@gmail.com',
    pass: 'rkwx gatx akot myxd',
  },
});

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // Check for empty fields
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: 'All fields must be filled out.' });
    }

    // Custom validation for firstName
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      return res.status(400).json({ error: 'First name must only contain alphabetical characters.' });
    }

    // Custom validation for lastName
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      return res.status(400).json({ error: 'Last name must only contain alphabetical characters.' });
    }

    // Custom validation for email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check for unique email and phoneNumber
    const isEmailUnique = await User.findOne({ email });
    const isPhoneNumberUnique = await User.findOne({ phoneNumber });

    if (isEmailUnique) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    if (isPhoneNumberUnique) {
      return res.status(400).json({ error: 'Phone number is already in use.' });
    }

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Send the verification email
    const mailOptions = {
      from: 'your_email@gmail.com',
      to: email,
      subject: 'YouVote Email Verification Code',
      text: `Welcome to YouVote, ${firstName} ${lastName}!\n\nThank you for registering on our platform. To complete your registration, please verify your email address by entering the following verification code in the app:\n\nVerification Code: ${verificationCode}\n\nIf you did not request this code, please ignore this email.\n\nBest regards,\nThe YouVote Team`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to send verification email.' });
      }

      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        verificationCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email, verificationCode });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    user.verificationCode = null; // Clear the verification code
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and verify the password
    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if the user's email is verified
      if (user.verificationCode !== null) {
        return res.status(403).json({ error: 'Email not verified. Please check your email for the verification code.' });
      }

      // Create a JWT token
      const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token, user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
