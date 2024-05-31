const express = require('express');
const authController = require('../controllers/authController');
const candidateController = require('../controllers/candidateController');
const voteController = require('../controllers/voteController');
const electionController = require('../controllers/electionController');
const router = express.Router();

// User routes
router.post('/register', authController.registerUser);
router.post('/verifyUser', authController.verifyUser);
router.post('/login', authController.loginUser);

// Election routes
router.post('/elections', electionController.createElection);
router.get('/elections', electionController.getAllElections);
router.get('/elections/:id', electionController.getElectionById);
router.put('/elections/:id', electionController.updateElection);
router.delete('/elections/:id', electionController.deleteElection);
router.get('/elections/:electionId/results', electionController.getElectionResults);

// Candidate routes
router.post('/candidates/:electionId', candidateController.addCandidateToElection);
router.get('/candidates/:electionId', candidateController.getCandidatesByElection);
router.put('/candidates/:electionId/:candidateId', candidateController.updateCandidateInElection);
router.delete('/candidates/:electionId/:candidateId', candidateController.deleteCandidateFromElection);

// Vote routes
router.post('/votes', voteController.vote);

module.exports = router;
