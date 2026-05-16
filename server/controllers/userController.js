const User = require('../models/User');
const JobPost = require('../models/JobPost');
const Application = require('../models/Application');
// All controller functions are async because they talk to MongoDB
// We wrap everything in try/catch and call next(err) on failure
// That sends the error to the error handler middleware in server.js

// GET /api/v1/users
// Access: Admin only
// What it does: Returns all users, filterable by role and status
exports.getUsers = async (req, res, next) => {
    try {
    // Read optional query params from the URL
    // e.g. /users?role=recruiter&status=pending&page=2&limit=10
    const { role, status, page = 1, limit = 20 } = req.query;

    // Build a filter object — only add a field if it was provided
    const filter = {};
    if (role)   filter.role   = role;
    if (status) filter.status = status;

    // Count total matching users (for pagination info)
    const total = await User.countDocuments(filter);

    // Fetch the users for this page
    const users = await User.find(filter)
      .select('-password')             // NEVER return password hashes
      .skip((page - 1) * limit)        // skip pages before this one
      .limit(Number(limit));           // only return this many

    res.status(200).json({
        success: true,
        total,
        page: Number(page),
        users
    });

    } catch (err) {
    next(err); // sends to central error handler
    }
};

// GET /api/v1/users/:id
// Access: Admin only
// What it does: Returns one specific user by their MongoDB ID
exports.getUser = async (req, res, next) => {
    try {
    // req.params.id is the :id part of the URL
    // e.g. /users/64a1b2c3d4e5f6a7b8c9d0e1 → id = "64a1b2c3d4e5f6a7b8c9d0e1"
    const user = await User.findById(req.params.id).select('-password');

    // If no user found with that ID, return 404
    if (!user) {
        return res.status(404).json({
        success: false,
        message: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        user
    });

    } catch (err) {
    next(err);
    }
};

// PATCH /api/v1/users/:id/status
// Access: Admin only
// What it does: Changes a user's status (approve/reject/reset recruiters)
exports.updateUserStatus = async (req, res, next) => {
    try {
    const { status } = req.body;

    // Validate — only these three values are allowed
    const allowedStatuses = ['approved', 'rejected', 'pending'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
        success: false,
        message: "Status must be 'approved', 'rejected', or 'pending'"
        });
    }

    // Find the user and update their status in one operation
    // { new: true } means return the UPDATED document, not the old one
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    ).select('-password');

    if (!user) {
        return res.status(404).json({
        success: false,
        message: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        user
    });

    } catch (err) {
    next(err);
    }
};

// DELETE /api/v1/users/:id
// Access: Admin only
// What it does: Permanently removes a user from the database
exports.deleteUser = async (req, res, next) => {
    try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return res.status(404).json({
        success: false,
        message: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'User deleted'
    });

    } catch (err) {
    next(err);
    }
};

// GET /api/v1/admin/stats
// Access: Admin only
// What it does: Returns platform-wide statistics using MongoDB aggregation
exports.getAdminStats = async (req, res, next) => {
    try {

    // ── 1. Count users grouped by role ──────────────────────────────
    // aggregate() runs a pipeline of stages on the collection
    // $group groups all documents by the 'role' field
    // $sum: 1 adds 1 for every document in each group = count
    const usersByRoleRaw = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    // usersByRoleRaw looks like:
    // [{_id: 'jobSeeker', count: 120}, {_id: 'recruiter', count: 34}]
    // We convert it to a nicer object: {jobSeeker: 120, recruiter: 34}
    const usersByRole = {};
    usersByRoleRaw.forEach(item => {
        usersByRole[item._id] = item.count;
    });

    // ── 2. Count jobs grouped by status ─────────────────────────────
    const jobsByStatusRaw = await JobPost.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const jobsByStatus = {};
    jobsByStatusRaw.forEach(item => {
        jobsByStatus[item._id] = item.count;
    });

    // ── 3. Count applications grouped by status ──────────────────────
    const appsByStatusRaw = await Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const appsByStatus = {};
    appsByStatusRaw.forEach(item => {
        appsByStatus[item._id] = item.count;
    });

    // ── 4. Top 5 jobs by number of applications ──────────────────────
    // This is a multi-stage pipeline:
    // Stage 1 ($group): group applications by job ID, count them
    // Stage 2 ($sort): sort by count, highest first
    // Stage 3 ($limit): only keep top 5
    // Stage 4 ($lookup): JOIN the jobposts collection to get job details
    // Stage 5 ($unwind): flatten the joined array into a single object
    // Stage 6 ($project): pick which fields to return in the response
    const topJobs = await Application.aggregate([
        {
        $group: {
          _id: '$job',                        // group by job ID
          applicationCount: { $sum: 1 }       // count applications per job
        }
        },
      { $sort: { applicationCount: -1 } },    // -1 = descending (highest first)
      { $limit: 5 },                          // only top 5
        {
        $lookup: {
          from: 'jobposts',                   // the collection name in MongoDB
          localField: '_id',                  // field in Application (the job ID)
          foreignField: '_id',                // field in JobPost to match against
          as: 'jobInfo'                       // name of the result array
        }
        },
      { $unwind: '$jobInfo' },                // jobInfo comes as an array, flatten it
        {
        $project: {
            _id: 1,
            applicationCount: 1,
            title:   '$jobInfo.title',
            company: '$jobInfo.company'
        }
        }
    ]);

    res.status(200).json({
        success: true,
        stats: {
        usersByRole,
        jobsByStatus,
        appsByStatus,
        topJobs
        }
    });

    } catch (err) {
    next(err);
    }
};