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

export default function PendingRecruitersPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const res = await api.get("/users?role=recruiter&status=pending");
      setRecruiters(res.data.users || []);
    } catch (err) {
      setError("Failed to load pending recruiters.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (userId, newStatus) => {
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      setRecruiters(prev => prev.filter(r => r._id !== userId));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center", color: colors.olive }}>Loading...</div>;
  if (error) return <div style={{ padding: "2rem", textAlign: "center", color: colors.peach }}>{error}</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem", fontFamily: "'Georgia', serif" }}>
      <h1 style={headlineStyle}>✦ Pending Recruiters</h1>

      {recruiters.length === 0 ? (
        <p style={{ textAlign: "center", color: colors.gray }}>No pending recruiters.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {recruiters.map(rec => (
            <div key={rec._id} style={{
              backgroundColor: colors.ivory,
              border: `1px solid ${colors.bistre}`,
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}>
              <div>
                <h3 style={{ margin: 0, color: colors.olive }}>{rec.name}</h3>
                <p style={{ margin: "4px 0 0", color: colors.bistre }}>{rec.email}</p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => handleStatus(rec._id, "approved")} style={{
                  backgroundColor: colors.olive,
                  color: colors.ivory,
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 16px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}>Approve</button>
                <button onClick={() => handleStatus(rec._id, "rejected")} style={{
                  backgroundColor: colors.peach,
                  color: colors.ivory,
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 16px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}