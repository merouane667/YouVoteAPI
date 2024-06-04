const express = require('express');
const authController = require('../controllers/authController');
const candidateController = require('../controllers/candidateController');
const voteController = require('../controllers/voteController');
const electionController = require('../controllers/electionController');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');

// User routes
router.post('/register', authController.registerUser);
router.post('/verifyUser', authController.verifyUser);
router.post('/login', authController.loginUser);

// Election routes
router.post('/elections', authenticateUser, electionController.createElection);
router.get('/elections', authenticateUser, electionController.getAllElections);
router.get('/elections/:id', authenticateUser, electionController.getElectionById);
router.put('/elections/:id', authenticateUser, electionController.updateElection);
router.delete('/elections/:id', authenticateUser, electionController.deleteElection);
router.get('/elections/:electionId/results', authenticateUser, electionController.getElectionResults);

// Candidate routes
router.post('/candidates/:electionId', authenticateUser, candidateController.addCandidateToElection);
router.get('/candidates/:electionId', authenticateUser, candidateController.getCandidatesByElection);
router.put('/candidates/:electionId/:candidateId', authenticateUser, candidateController.updateCandidateInElection);
router.delete('/candidates/:electionId/:candidateId', authenticateUser, candidateController.deleteCandidateFromElection);

// Vote routes
router.post('/votes', authenticateUser, voteController.vote);

module.exports = router;
