import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (roleFilter) params.append("role", roleFilter);
    if (statusFilter) params.append("status", statusFilter);
    api.get(`/users?${params}`)
      .then(res => setUsers(res.data.users || []))
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [roleFilter, statusFilter]);

  const deleteUser = (id) => {
    api.delete(`/users/${id}`)
      .then(() => {
        setUsers(prev => prev.filter(u => u._id !== id));
        setConfirmId(null);
      })
      .catch(() => alert("Delete failed, try again"));
  };

  const changeStatus = (id, status) => {
    api.patch(`/users/${id}/status`, { status })
      .then(() => fetchUsers())
      .catch(() => alert("Status change failed, try again"));
  };

  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 40, color: "#fff" }}>
      <h1>All Users</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Roles</option>
          <option value="jobSeeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && users.length === 0 && <p style={{ color: "#aaa" }}>No users found.</p>}

      {users.map(u => (
        <div key={u._id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p><strong>{u.name}</strong> — {u.email}</p>
              <p style={{ color: "#aaa" }}>Role: {u.role} | Status: {u.status}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {u.status !== "approved" && (
                <button onClick={() => changeStatus(u._id, "approved")} style={approveBtn}>
                  Approve
                </button>
              )}
              {u.status !== "rejected" && (
                <button onClick={() => changeStatus(u._id, "rejected")} style={rejectBtn}>
                  Reject
                </button>
              )}
              <button onClick={() => setConfirmId(u._id)} style={deleteBtn}>
                Delete
              </button>
            </div>
          </div>

          {/* Confirmation */}
          {confirmId === u._id && (
            <div style={confirmBox}>
              <p>Are you sure you want to delete <strong>{u.name}</strong>?</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => deleteUser(u._id)} style={rejectBtn}>Yes, Delete</button>
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

const selectStyle = {
  background: "#1e1e2e",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
};

const approveBtn = {
  background: "#22c55e",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const rejectBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const deleteBtn = {
  background: "#7c3aed",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const cancelBtn = {
  background: "#555",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
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
