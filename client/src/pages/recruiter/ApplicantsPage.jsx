import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  red: "#c0392b",
};

const STATUS_OPTIONS = ["pending", "shortlisted", "rejected"];

const statusStyle = {
  pending: {
    background: colors.champagne,
    color: colors.bistre,
    border: `1px solid ${colors.bistre}`,
  },
  shortlisted: {
    background: colors.champagne,
    color: colors.bistre,
    border: `1px solid ${colors.bistre}`,
  },
  rejected: {
    background: "#fce4ec",
    color: "#c62828",
    border: "1px solid #ef9a9a",
  },
};

const styles = {
  page: {
    minHeight: "100vh",
    background: colors.ivory,
    padding: "2.5rem 1.5rem",
    fontFamily: "'Georgia', serif",
  },
  container: {
    maxWidth: "960px",
    margin: "0 auto",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "transparent",
    border: "none",
    color: colors.bistre,
    fontSize: "0.875rem",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    marginBottom: "1.5rem",
    padding: 0,
    fontStyle: "italic",
  },
  header: {
    marginBottom: "2rem",
  },
  sparkle: { color: colors.peach, marginRight: "8px" },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: colors.olive,
    margin: "0 0 4px",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: colors.gray,
    fontStyle: "italic",
    margin: 0,
  },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #ffcccc",
    color: colors.red,
    padding: "0.85rem 1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
  },
  emptyCard: {
    background: colors.white,
    borderRadius: "16px",
    padding: "4rem 2rem",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(79,81,39,0.08)",
  },
  emptyIcon: { fontSize: "2.5rem", marginBottom: "1rem" },
  emptyTitle: { color: colors.olive, fontSize: "1.1rem", fontWeight: "700", margin: "0 0 6px" },
  emptyText: { color: colors.gray, fontSize: "0.875rem", margin: 0, fontStyle: "italic" },
  table: {
    background: colors.white,
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(79,81,39,0.08)",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1.5fr 2fr 1.5fr 1.2fr",
    padding: "1rem 1.5rem",
    background: `linear-gradient(135deg, ${colors.olive}, ${colors.oliveLight})`,
    gap: "1rem",
  },
  tableHeaderCell: {
    fontSize: "0.75rem",
    fontWeight: "700",
    color: colors.ivory,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1.5fr 2fr 1.5fr 1.2fr",
    padding: "1rem 1.5rem",
    gap: "1rem",
    alignItems: "center",
  },
  name: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: colors.olive,
  },
  email: {
    fontSize: "0.875rem",
    color: "#555",
  },
  skillsCell: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
  skillChip: {
    background: colors.champagne,
    color: colors.bistre,
    border: `1px solid ${colors.bistre}`,
    padding: "2px 8px",
    borderRadius: "999px",
    fontSize: "0.72rem",
    fontWeight: "600",
  },
  noSkills: {
    fontSize: "0.8rem",
    color: colors.gray,
    fontStyle: "italic",
  },
  coverLetter: {
    fontSize: "0.8rem",
    color: "#555",
    fontStyle: "italic",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "200px",
  },
  statusSelect: {
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    outline: "none",
    width: "100%",
  },
  countBadge: {
    display: "inline-flex",
    alignItems: "center",
    background: colors.champagne,
    border: `1px solid ${colors.bistre}`,
    color: colors.bistre,
    padding: "3px 12px",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "600",
    marginLeft: "10px",
  },
};

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/jobs/${jobId}/applicants`);
        setApplications(res.data.applications);
      } catch (err) {
        setError("Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const res = await api.patch(`/applications/${applicationId}/status`, { status: newStatus });
      setApplications(prev =>
        prev.map(app =>
          app._id === applicationId ? { ...app, status: res.data.application.status } : app
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back button */}
        <button style={styles.backBtn} onClick={() => navigate("/recruiter/dashboard")}>
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            <span style={styles.sparkle}>✦</span>Applicants
            {!loading && (
              <span style={styles.countBadge}>{applications.length} total</span>
            )}
          </h1>
          <p style={styles.subtitle}>Review and update applicant statuses</p>
        </div>

        {error && <div style={styles.errorBox}>⚠ {error}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: colors.gray, fontStyle: "italic" }}>
            Loading applicants...
          </div>
        ) : applications.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>👥</div>
            <p style={styles.emptyTitle}>No applicants yet</p>
            <p style={styles.emptyText}>Applications will appear here once candidates apply</p>
          </div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span style={styles.tableHeaderCell}>Name</span>
              <span style={styles.tableHeaderCell}>Email</span>
              <span style={styles.tableHeaderCell}>Skills</span>
              <span style={styles.tableHeaderCell}>Cover Letter</span>
              <span style={styles.tableHeaderCell}>Status</span>
            </div>
            {applications.map((app, i) => (
              <div
                key={app._id}
                style={{
                  ...styles.tableRow,
                  background: i % 2 === 0 ? colors.white : "#fdfbf7",
                  borderBottom: i === applications.length - 1 ? "none" : `1px solid ${colors.ivory}`,
                }}
              >
                <span style={styles.name}>{app.user.name}</span>
                <span style={styles.email}>{app.user.email}</span>
                <div style={styles.skillsCell}>
                  {app.user.skills?.length > 0 ? (
                    app.user.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} style={styles.skillChip}>{skill}</span>
                    ))
                  ) : (
                    <span style={styles.noSkills}>No skills listed</span>
                  )}
                  {app.user.skills?.length > 3 && (
                    <span style={styles.skillChip}>+{app.user.skills.length - 3}</span>
                  )}
                </div>
                <span style={styles.coverLetter}>
                  {app.coverLetter || <em style={{ color: colors.gray }}>—</em>}
                </span>
                <select
                  style={{
                    ...styles.statusSelect,
                    ...statusStyle[app.status],
                  }}
                  value={app.status}
                  onChange={e => handleStatusChange(app._id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsPage;