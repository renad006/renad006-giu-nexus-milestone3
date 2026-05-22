const Application = require('../models/Application');
const JobPost = require('../models/JobPost'); // for main functions

// ========== ADMIN + STATUS UPDATE ==========

// @desc    Get all applications (paginated)
// @route   GET /api/v1/applications
// @access  Admin only
const getApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find()
        .populate({ path: 'user', select: '-password -__v' })
        .populate({ path: 'job', select: 'title company type status' })
        .skip(skip)
        .limit(limit)
        .sort('-appliedAt')
        .lean(),
      Application.countDocuments(),
    ]);

    res.status(200).json({ success: true, total, page, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an application's status
// @route   PATCH /api/v1/applications/:id/status
// @access  Recruiter (job owner only)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'shortlisted', 'rejected', 'approved']; // ✅ added 'approved'

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (!application.job) {
      return res.status(404).json({ success: false, message: 'Job associated with this application no longer exists' });
    }

    // Only the recruiter who created the job may change status
    if (application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// ========== APPLY + GET APPLICANTS (main branch) ==========

// @desc    Apply to a job (job seeker only, no duplicates)
// @route   POST /api/v1/jobs/:jobId/apply
// @access  Private (Job Seeker only)
const applyToJob = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This job is no longer open for applications' });
    }

    const application = await Application.create({
      user: req.user._id,
      job: req.params.jobId,
      coverLetter: req.body.coverLetter || '',
    });

    res.status(201).json({ success: true, application });
  } catch (err) {
    // Duplicate application
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }
    next(err);
  }
};

// @desc    Get all applicants for a job (recruiter must own the job)
// @route   GET /api/v1/jobs/:jobId/applicants
// @access  Private (Recruiter owner only)
const getApplicants = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Only the recruiting owner (or admin) can see applicants
    if (
      job.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorised to view applicants for this job',
      });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('user', 'name email skills')
      .lean();

    res.json({ success: true, count: applications.length, applications });
  } catch (err) {
    next(err);
  }
};

// ========== JOB SEEKER: MY APPLICATIONS ==========
// @desc    Get logged-in job seeker's own applications
// @route   GET /api/v1/applications/my
// @access  Private (jobSeeker)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('job', 'title company description location type status')
      .sort({ appliedAt: -1 });
    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// ========== EXPORT ALL ==========
module.exports = {
  getApplications,
  updateApplicationStatus,
  applyToJob,
  getApplicants,
  getMyApplications,
};