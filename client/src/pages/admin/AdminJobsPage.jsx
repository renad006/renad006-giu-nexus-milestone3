import { useState, useEffect } from "react";
import api from "../../services/api";

const colors = {
  ivory: "#F9EAD2",
  champagne: "#FBEEC2",
  peach: "#DB918F",
  bistre: "#837534",
  olive: "#4F5127",
  oliveLight: "#6b7355",
  white: "#ffffff",
  gray: "#9a9a8a",
};

const headlineStyle = {
  color: colors.olive,
  fontFamily: "'Georgia', serif",
  fontSize: "1.8rem",
  fontWeight: "700",
  marginBottom: "1.5rem",
  textAlign: "center",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs");
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(prev => prev.filter(job => job._id !== jobId));
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center", color: colors.olive }}>Loading jobs...</div>;
  if (error) return <div style={{ padding: "2rem", textAlign: "center", color: colors.peach }}>{error}</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem", fontFamily: "'Georgia', serif" }}>
      <h1 style={headlineStyle}>✦ All Jobs</h1>

      {jobs.length === 0 ? (
        <p style={{ textAlign: "center", color: colors.gray }}>No jobs found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {jobs.map(job => (
            <div
              key={job._id}
              style={{
                backgroundColor: colors.ivory,
                border: `1px solid ${colors.bistre}`,
                borderRadius: "12px",
                padding: "1rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <h3 style={{ margin: 0, color: colors.olive }}>{job.title} — {job.company}</h3>
                <p style={{ margin: "4px 0 0", color: colors.bistre }}>
                  {job.location} | {job.type} | Status: <span style={{ fontWeight: "bold", color: job.status === "open" ? colors.olive : colors.peach }}>{job.status}</span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(job._id)}
                style={{
                  backgroundColor: colors.peach,
                  color: colors.ivory,
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 16px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}