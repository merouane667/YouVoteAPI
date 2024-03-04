const mongoose = require('mongoose');

// Vote Schema
const voteSchema = new mongoose.Schema({
    user: String,
    election: String,
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    createdAt: { type: Date, default: Date.now }
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;