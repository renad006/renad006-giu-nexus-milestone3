import { useState, useEffect } from "react";
import api from "../../services/api";

export default function PendingRecruitersPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/users?role=recruiter&status=pending")
      .then(res => setRecruiters(res.data))
      .catch(() => setError("Failed to load recruiters"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = (id, status) => {
    api.patch(`/users/${id}/status`, { status })
      .then(() => setRecruiters(prev => prev.filter(r => r._id !== id)))
      .catch(() => alert("Action failed, try again"));
  };

  if (loading) return <div style={{ padding: 40, color: "#fff" }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 40, color: "#fff" }}>
      <h1>Pending Recruiters</h1>

      {recruiters.length === 0 && (
        <p style={{ color: "#aaa" }}>No pending recruiters right now.</p>
      )}

      {recruiters.map(r => (
        <div key={r._id} style={cardStyle}>
          <p><strong>{r.name}</strong></p>
          <p style={{ color: "#aaa" }}>{r.email}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button
              onClick={() => updateStatus(r._id, "approved")}
              style={approveBtn}
            >
              Approve
            </button>
            <button
              onClick={() => updateStatus(r._id, "rejected")}
              style={rejectBtn}
            >
              Reject
            </button>
          </div>
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

const approveBtn = {
  background: "#22c55e",
  color: "#fff",
  border: "none",
  padding: "8px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const rejectBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};
