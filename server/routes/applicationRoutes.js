const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getApplications, 
  updateApplicationStatus,
  getMyApplications
} = require('../controllers/applicationController');

// Admin: get all applications (paginated)
router.get('/', protect, authorize('admin'), getApplications);

// Job seeker: get my own applications
router.get('/my', protect, authorize('jobSeeker'), getMyApplications);

// Recruiter: update application status (must own the job)
router.patch('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;