const mongoose = require('mongoose');

// Vote Schema
const voteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
