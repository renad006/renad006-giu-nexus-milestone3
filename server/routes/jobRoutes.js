const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getSavedJobs,
  toggleSaveJob,
  getRecommendedJobs
} = require("../controllers/jobController");

const {
  applyToJob,
  getApplicants,
} = require("../controllers/applicationController");

// ========== Static / fixed-path routes (must come first) ==========
router.get("/my-jobs", protect, authorize("recruiter"), getMyJobs);
router.get("/saved", protect, authorize("jobSeeker"), getSavedJobs);
router.get("/recommended", protect, authorize("jobSeeker"), getRecommendedJobs);

// ========== Parameterized routes ==========
router.post("/:id/save", protect, authorize("jobSeeker"), toggleSaveJob);
router.post("/:jobId/apply", protect, authorize("jobSeeker"), applyToJob);
router.get("/:jobId/applicants", protect, authorize("recruiter"), getApplicants);

// ========== Core CRUD routes ==========
router.post("/", protect, authorize("recruiter"), createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.patch("/:id", protect, authorize("recruiter"), updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;