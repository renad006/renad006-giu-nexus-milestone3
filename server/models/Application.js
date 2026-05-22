const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job:  { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    coverLetter: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'shortlisted', 'rejected', 'approved'],
        default: 'pending'
    }
    },
    { timestamps: { createdAt: 'appliedAt', updatedAt: false } }
);

// Prevent duplicate applications
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);