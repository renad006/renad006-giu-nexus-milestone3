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
  marginBottom: "1rem",
  textAlign: "center",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];
    if (roleFilter) filtered = filtered.filter(user => user.role === roleFilter);
    if (statusFilter) filtered = filtered.filter(user => user.status === statusFilter);
    setFilteredUsers(filtered);
  }, [users, roleFilter, statusFilter]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      alert(`User status changed to ${newStatus}`);
      // Force a full page reload to ensure UI reflects the change
      window.location.reload();
    } catch (err) {
      console.error("Status update error:", err);
      alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center", color: colors.olive }}>Loading users...</div>;
  if (error) return <div style={{ padding: "2rem", textAlign: "center", color: colors.peach }}>{error}</div>;

  const inputStyle = {
    padding: "6px 12px",
    borderRadius: "8px",
    border: `1px solid ${colors.bistre}`,
    backgroundColor: colors.white,
    color: colors.olive,
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem", fontFamily: "'Georgia', serif" }}>
      <h1 style={headlineStyle}>✦ All Users</h1>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={inputStyle}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="jobSeeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <p style={{ textAlign: "center", color: colors.gray }}>No users match filters.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredUsers.map(user => (
            <div key={user._id} style={{
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
                <h3 style={{ margin: 0, color: colors.olive }}>{user.name}</h3>
                <p style={{ margin: "4px 0", color: colors.bistre }}>{user.email}</p>
                <p style={{ margin: 0, fontSize: "0.85rem" }}>
                  Role: <span style={{ fontWeight: "bold", color: colors.olive }}>{user.role}</span> | 
                  Status: <span style={{ fontWeight: "bold", color: user.status === "approved" ? colors.olive : colors.peach }}>{user.status}</span>
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => handleStatusChange(user._id, "rejected")}
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
                  Reject
                </button>
                <button
                  onClick={() => handleStatusChange(user._id, "approved")}
                  style={{
                    backgroundColor: colors.olive,
                    color: colors.ivory,
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}