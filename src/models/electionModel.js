const mongoose = require('mongoose');

// Election Schema
const electionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Election = mongoose.model('Election', electionSchema);

module.exports = Election;
