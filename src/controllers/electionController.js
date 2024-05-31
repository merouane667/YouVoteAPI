const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const Election = require('../models/electionModel');
const Vote = require('../models/voteModel');
const User = require('../models/userModel'); // Import User model

// Create a new election
exports.createElection = async (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied, token missing' });
    }
    
    const decoded = jwt.verify(token, secretKey);
    
    // Find user by decoded email
    const user = await User.findOne({ email: decoded.email });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, admins only' });
    }

    const { title, description, startDate, endDate } = req.body;

    const newElection = new Election({
      title,
      description,
      startDate,
      endDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newElection.save();
    res.status(201).json({ message: 'Election created successfully', election: newElection });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all elections
exports.getAllElections = async (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied, token missing' });
    }
    
    jwt.verify(token, secretKey);

    const elections = await Election.find();
    res.status(200).json(elections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific election by ID
exports.getElectionById = async (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied, token missing' });
    }
    
    jwt.verify(token, secretKey);

    const { id } = req.params;
    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    res.status(200).json(election);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an election
exports.updateElection = async (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied, token missing' });
    }
    
    const decoded = jwt.verify(token, secretKey);
    
    // Find user by decoded email
    const user = await User.findOne({ email: decoded.email });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, admins only' });
    }

    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;

    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    election.title = title || election.title;
    election.description = description || election.description;
    election.startDate = startDate || election.startDate;
    election.endDate = endDate || election.endDate;
    election.updatedAt = new Date();

    await election.save();
    res.status(200).json({ message: 'Election updated successfully', election });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an election
exports.deleteElection = async (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied, token missing' });
    }

    const decoded = jwt.verify(token, secretKey);
    
    // Find user by decoded email
    const user = await User.findOne({ email: decoded.email });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, admins only' });
    }

    const { id } = req.params;
    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    await Election.findByIdAndDelete(id); // Use findByIdAndDelete to delete the document
    res.status(200).json({ message: 'Election deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for getting election results
exports.getElectionResults = async (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied, token missing' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { electionId } = req.params;

    // Check if election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    // Fetch votes and populate candidate information
    const votes = await Vote.find({ election: electionId }).populate('candidate');

    // Check if there are no votes
    if (votes.length === 0) {
      return res.status(200).json({ message: 'No votes cast for this election yet.' });
    }

    // Aggregate results
    const results = votes.reduce((acc, vote) => {
      const candidateId = vote.candidate._id.toString();
      if (!acc[candidateId]) {
        acc[candidateId] = { candidate: vote.candidate, count: 0 };
      }
      acc[candidateId].count += 1;
      return acc;
    }, {});

    // Convert results to array
    const resultsArray = Object.values(results);

    res.status(200).json(resultsArray);
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};