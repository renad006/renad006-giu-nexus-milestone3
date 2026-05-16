const JobPost = require("../models/JobPost");
const hf = require("../services/hfService");

/////////////////////////////////GET/api/v1/jobs/////////////////////////////////////////////////
//returning filtered all jobs
exports.getJobs = async (req, res) => {
  try {
    const {
      location,
      type,
      category,
      status,
      keyword,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (location) filter.location = location;
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }

    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const jobs = await JobPost.find(filter).skip(skip).limit(pageSize);
    const total = await JobPost.countDocuments(filter);

    res.json({ success: true, total, page: pageNumber, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//////////////////////////////////POST/api/v1/jobs/////////////////////////////////////////////
//Create a new jobpost
exports.createJob = async (req, res) => {
  try {
    const user = req.user;

    if (user.status !== "approved" || user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval. Wait for admin approval before posting jobs."
      });
    }

    let category = "Other";
    try {
      const result = await hf.zeroShotClassification({
        model: "facebook/bart-large-mnli",
        inputs: [req.body.description],
        parameters: {
          candidate_labels: [
            "Frontend",
            "Backend",
            "AI/ML",
            "DevOps",
            "Data Engineering",
            "Other"
          ]
        }
      });
      category = result[0].labels[0];
    } catch (error) {
      console.error("HF Error:", error.message);
    }

    const jobData = {
      title: req.body.title,
      company: req.body.company,
      description: req.body.description,
      requirements: req.body.requirements,
      location: req.body.location,
      type: req.body.type,
      salary: req.body.salary,
      totalSlots: req.body.totalSlots || 1,
      createdBy: user._id,
      category,
      status: "open"
    };
    const job = await JobPost.create(jobData);
    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//////////////////////////////////////GET/api/v1/jobs/recommended//////////////////////////////////////////////////
// Job Seeker only. Returns jobs ranked by cosine similarity between
// the user's skills and job requirements via HuggingFace sentence embeddings.
exports.getRecommendedJobs = async (req, res) => {
  try {
    const user = req.user;

    // Build student text from skills array
    const studentText = user.skills && user.skills.length > 0
      ? user.skills.join(", ")
      : "";

    // Fetch all open jobs
    const openJobs = await JobPost.find({ status: "open" });

    if (openJobs.length === 0) {
      return res.json({ success: true, jobs: [] });
    }

    // Build a summary string for each job
    const jobTexts = openJobs.map(job =>
      `${job.title} ${job.requirements ? job.requirements.join(" ") : ""}`
    );

    try {
      // Send student text + all job texts in a single featureExtraction call
      const embeddings = await hf.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: [studentText, ...jobTexts]
      });

      // Cosine similarity helper
      function cosineSimilarity(vecA, vecB) {
        const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dot / (magA * magB);
      }

      // Student vector is index 0, job vectors start at index 1
      const studentVector = embeddings[0];
      const rankedJobs = openJobs.map((job, i) => ({
        ...job.toObject(),
        score: cosineSimilarity(studentVector, embeddings[i + 1])
      }));

      // Sort by score descending
      rankedJobs.sort((a, b) => b.score - a.score);

      return res.json({ success: true, jobs: rankedJobs });
    } catch (error) {
      // Graceful failure: return all open jobs without scores
      console.error("HF Embedding Error:", error.message);
      return res.json({ success: true, jobs: openJobs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//////////////////////////////////////GET/api/v1/jobs/:id//////////////////////////////////////////////////
exports.getJobById = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id).populate("createdBy", "name email");
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

///////////////////////////////////////////PATCH/api/v1/jobs/:id/////////////////////////////////
exports.updateJob = async (req, res) => {
  try {
    const user = req.user;
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this job" });
    }

    const newDescription = req.body.description || job.description;
    let category = job.category;

    if (req.body.title || req.body.description) {
      try {
        const result = await hf.zeroShotClassification({
          model: "facebook/bart-large-mnli",
          inputs: [newDescription],
          parameters: {
            candidate_labels: [
              "Frontend",
              "Backend",
              "AI/ML",
              "DevOps",
              "Data Engineering",
              "Other"
            ]
          }
        });
        category = result[0].labels[0];
      } catch (error) {
        console.error("HF Error:", error.message);
      }
    }

    const updatedJob = await JobPost.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        company: req.body.company,
        description: req.body.description,
        requirements: req.body.requirements,
        location: req.body.location,
        type: req.body.type,
        salary: req.body.salary,
        totalSlots: req.body.totalSlots,
        status: req.body.status,
        category
      },
      { new: true, runValidators: true }
    );
    res.json({ success: true, job: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/////////////////////////////////////DELETE/api/v1/jobs/:id///////////////////////////////////////
exports.deleteJob = async (req, res) => {
  try {
    const user = req.user;
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.createdBy.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
    }
    await job.deleteOne();
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs created by the logged-in recruiter
// @route   GET /api/v1/jobs/my-jobs
// @access  Private (Recruiter only)
exports.getMyJobs = async (req, res, next) => {
  try {
    const jobs = await JobPost.find({ createdBy: req.user._id }).lean();
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all jobs saved/bookmarked by the logged-in job seeker
// @route   GET /api/v1/jobs/saved
// @access  Private (Job Seeker only)
exports.getSavedJobs = async (req, res, next) => {
  try {
    const jobs = await JobPost.find({ savedBy: req.user._id }).lean();
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle save/unsave a job for the logged-in job seeker
// @route   POST /api/v1/jobs/:id/save
// @access  Private (Job Seeker only)
exports.toggleSaveJob = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Cannot save a closed job' });
    }
    const userId = req.user._id;
    const alreadySaved = job.savedBy.some(id => id.toString() === userId.toString());
    if (alreadySaved) {
      job.savedBy.pull(userId);
      await job.save();
      return res.json({ success: true, message: 'Job removed from saved', saved: false });
    } else {
      job.savedBy.push(userId);
      await job.save();
      return res.json({ success: true, message: 'Job saved', saved: true });
    }
  } catch (err) {
    next(err);
  }
};