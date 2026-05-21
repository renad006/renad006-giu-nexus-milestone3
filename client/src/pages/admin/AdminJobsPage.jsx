import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    api.get("/jobs")
      .then(res => setJobs(res.data.jobs || res.data))
      .catch(() => setError("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  const deleteJob = (id) => {
    api.delete(`/jobs/${id}`)
      .then(() => {
        setJobs(prev => prev.filter(j => j._id !== id));
        setConfirmId(null);
      })
      .catch(() => alert("Delete failed, try again"));
  };

  if (loading) return <div style={{ padding: 40, color: "#fff" }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 40, color: "#fff" }}>
      <h1>All Jobs</h1>

      {jobs.length === 0 && <p style={{ color: "#aaa" }}>No jobs found.</p>}

      {jobs.map(job => (
        <div key={job._id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p><strong>{job.title}</strong> — {job.company}</p>
              <p style={{ color: "#aaa" }}>{job.location} | {job.type} | Status: {job.status}</p>
            </div>
            <button
              onClick={() => setConfirmId(job._id)}
              style={deleteBtn}
            >
              Delete
            </button>
          </div>

          {/* Confirmation */}
          {confirmId === job._id && (
            <div style={confirmBox}>
              <p>Are you sure you want to delete this job?</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => deleteJob(job._id)} style={approveBtn}>Yes, Delete</button>
                <button onClick={() => setConfirmId(null)} style={cancelBtn}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  background: "#1e1e2e",
  border: "1px solid #333",
  borderRadius: 12,
  padding: "1.5rem",
  marginBottom: 16,
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const approveBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const cancelBtn = {
  background: "#555",
  color: "#fff",
  border: "none",
  padding: "8px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const confirmBox = {
  marginTop: 12,
  padding: 12,
  background: "#2a2a3e",
  borderRadius: 8,
  border: "1px solid #ef4444",
};
