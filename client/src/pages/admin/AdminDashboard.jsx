import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/admin/stats")
      .then(res => setStats(res.data))
      .catch(() => setError("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, color: "#fff" }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 40, color: "#fff" }}>
      <h1>Admin Dashboard</h1>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: 40 }}>

        <div style={cardStyle}>
          <h3>Users by Role</h3>
          {Object.entries(stats.usersByRole || {}).map(([role, count]) => (
            <p key={role}>{role}: <strong>{count}</strong></p>
          ))}
        </div>

        <div style={cardStyle}>
          <h3>Jobs by Status</h3>
          {Object.entries(stats.jobsByStatus || {}).map(([status, count]) => (
            <p key={status}>{status}: <strong>{count}</strong></p>
          ))}
        </div>

        <div style={cardStyle}>
          <h3>Applications by Status</h3>
          {Object.entries(stats.appsByStatus || {}).map(([status, count]) => (
            <p key={status}>{status}: <strong>{count}</strong></p>
          ))}
        </div>

      </div>

      {/* Top Jobs Leaderboard */}
      <h2>Top Jobs</h2>
      <div style={cardStyle}>
        {stats.topJobs?.length === 0 && <p>No jobs yet.</p>}
        {stats.topJobs?.map((job, i) => (
          <div key={job._id} style={{ marginBottom: 8 }}>
            <strong>#{i + 1}</strong> {job.title} — {job.company} &nbsp;
            <span style={{ color: "#aaa" }}>({job.applicationCount} applications)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#1e1e2e",
  border: "1px solid #333",
  borderRadius: 12,
  padding: "1.5rem",
  minWidth: 200,
};
