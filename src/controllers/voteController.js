const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const Vote = require('../models/voteModel');
const User = require('../models/userModel');

// Controller for casting a vote
exports.vote = async (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied, token missing' });
    }

    const decoded = jwt.verify(token, secretKey);
    const userEmail = decoded.email;

    // Check if the user is an admin
    const user = await User.findOne({ email: userEmail });
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Admins are not allowed to vote' });
    }

    // Extract vote details from request body
    const { election, candidate } = req.body;

    // Check if the user has already voted for the specified election
    const existingVote = await Vote.findOne({ user: userEmail, election });
    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted for this election' });
    }

    // Create new vote object
    const vote = new Vote({ user: userEmail, election, candidate });

    // Save vote to database
    await vote.save();

    // Send response
    res.status(201).json({ message: 'Vote made successfully', vote });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};
