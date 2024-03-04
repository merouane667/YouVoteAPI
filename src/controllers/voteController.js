const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const Vote = require('../models/voteModel');

// Controller for casting a vote
exports.vote = async (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    // Extract the email from decoded token
    const userEmail = decoded.email;


    // Extract vote details from request body
    const { election, candidate } = req.body;

    // Check if the user has already voted for the specified election
    const existingVote = await Vote.findOne({ user: userEmail, election: election });
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
    // Handle errors
    res.status(500).json({ error: 'Unauthorized Action!' });
  }
};

// Controller for getting all votes
exports.getAllVotes = async (req, res) => {
  try {
    const votes = await Vote.find();
    res.status(200).json(votes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
