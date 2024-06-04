const mongoose = require('mongoose');

// Candidate Schema
const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    party: { type: String, required: true },
    election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
