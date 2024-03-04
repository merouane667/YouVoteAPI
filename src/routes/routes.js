const express = require('express');
const authController = require('../controllers/authController');
const candidateController = require('../controllers/candidateController');
const voteController = require('../controllers/voteController');
const router = express.Router();

// User routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Candidate routes
router.get('/candidates', candidateController.getAllCandidates);

// Vote routes
router.post('/votes', voteController.vote);
router.get('/votes', voteController.getAllVotes);

module.exports = router;