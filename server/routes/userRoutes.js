const express = require('express');
const router  = express.Router();

// These middleware functions come from Member 1 & 2's work
// protect  = checks the JWT token, rejects if missing/invalid
// authorize = checks if the user has the right role
const { protect, authorize } = require('../middleware/auth');

// These are the 5 functions you'll write in userController.js
const {
    getUsers,
    getUser,
    updateUserStatus,
    deleteUser,
    getAdminStats
} = require('../controllers/userController');

// Apply protect + authorize('admin') to EVERY route in this file
// This means: you must be logged in AND be an admin to use any of these
router.use(protect, authorize('admin'));

// IMPORTANT: /stats must come BEFORE /:id
// Why? Express reads routes top to bottom. If /:id came first,
// a request to /stats would match /:id with id = "stats" — wrong!
router.get('/stats', getAdminStats);

router.get('/',              getUsers);
router.get('/:id',           getUser);
router.patch('/:id/status',  updateUserStatus);
router.delete('/:id',        deleteUser);

module.exports = router;