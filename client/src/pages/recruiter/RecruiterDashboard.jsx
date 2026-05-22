import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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

const styles = {
  page: {
    minHeight: "100vh",
    background: colors.ivory,
    padding: "2.5rem 1.5rem",
    fontFamily: "'Georgia', serif",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  titleGroup: {},
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
  postBtn: {
    padding: "0.75rem 1.5rem",
    background: `linear-gradient(135deg, ${colors.olive}, ${colors.oliveLight})`,
    color: colors.ivory,
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    letterSpacing: "0.3px",
  },
  banner: {
    background: colors.champagne,
    border: `1.5px solid ${colors.bistre}`,
    borderRadius: "12px",
    padding: "1.5rem 2rem",
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
  },
  bannerIcon: {
    fontSize: "1.5rem",
    flexShrink: 0,
  },
  bannerTitle: {
    color: colors.olive,
    fontWeight: "700",
    fontSize: "1rem",
    margin: "0 0 4px",
  },
  bannerText: {
    color: colors.bistre,
    fontSize: "0.875rem",
    margin: 0,
    lineHeight: "1.5",
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
  emptyIcon: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  emptyTitle: {
    color: colors.olive,
    fontSize: "1.1rem",
    fontWeight: "700",
    margin: "0 0 6px",
  },
  emptyText: {
    color: colors.gray,
    fontSize: "0.875rem",
    margin: "0 0 1.5rem",
    fontStyle: "italic",
  },
  emptyBtn: {
    padding: "0.75rem 1.5rem",
    background: `linear-gradient(135deg, ${colors.olive}, ${colors.oliveLight})`,
    color: colors.ivory,
    border: "none",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    background: colors.white,
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
    boxShadow: "0 2px 12px rgba(79,81,39,0.07)",
    borderTop: `3px solid ${colors.olive}`,
  },
  statNumber: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: colors.olive,
    margin: "0 0 4px",
  },
  statLabel: {
    fontSize: "0.78rem",
    color: colors.gray,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    margin: 0,
  },
  table: {
    background: colors.white,
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(79,81,39,0.08)",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
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
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    padding: "1rem 1.5rem",
    gap: "1rem",
    alignItems: "center",
    borderBottom: `1px solid ${colors.ivory}`,
    transition: "background 0.15s",
  },
  jobTitle: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: colors.olive,
  },
  statusOpen: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#e8f5e9",
    color: "#2e7d32",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: "600",
  },
  statusClosed: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#fce4ec",
    color: "#c62828",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: "600",
  },
  actionsCell: {
    display: "flex",
    gap: "8px",
  },
  viewBtn: {
    padding: "5px 12px",
    background: colors.champagne,
    color: colors.bistre,
    border: `1px solid ${colors.bistre}`,
    borderRadius: "6px",
    fontSize: "0.78rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
  editBtn: {
    padding: "5px 12px",
    background: `linear-gradient(135deg, ${colors.olive}, ${colors.oliveLight})`,
    color: colors.ivory,
    border: "none",
    borderRadius: "6px",
    fontSize: "0.78rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
};

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/my-jobs");
        setJobs(res.data.jobs);
      } catch (err) {
        setError("Failed to load your jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (user?.status === "pending") {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.banner}>
            <span style={styles.bannerIcon}>⏳</span>
            <div>
              <p style={styles.bannerTitle}>Account Pending Approval</p>
              <p style={styles.bannerText}>
                Your recruiter account is currently under review by an admin.
                You'll be able to post and manage jobs once approved.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const openCount = jobs.filter(j => j.status === "open").length;
  const closedCount = jobs.filter(j => j.status === "closed").length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <h1 style={styles.title}>
              <span style={styles.sparkle}>✦</span>My Job Postings
            </h1>
            <p style={styles.subtitle}>Manage your listings and review applicants</p>
          </div>
          <button style={styles.postBtn} onClick={() => navigate("/recruiter/jobs/create")}>
            + Post New Job
          </button>
        </div>

        {error && <div style={styles.errorBox}>⚠ {error}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: colors.gray }}>
            Loading your jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>📋</div>
            <p style={styles.emptyTitle}>No job postings yet</p>
            <p style={styles.emptyText}>Create your first listing to start finding candidates</p>
            <button style={styles.emptyBtn} onClick={() => navigate("/recruiter/jobs/create")}>
              + Post Your First Job
            </button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={styles.statsRow}>
              <div style={styles.statCard}>
                <p style={styles.statNumber}>{jobs.length}</p>
                <p style={styles.statLabel}>Total Listings</p>
              </div>
              <div style={{ ...styles.statCard, borderTopColor: "#2e7d32" }}>
                <p style={{ ...styles.statNumber, color: "#2e7d32" }}>{openCount}</p>
                <p style={styles.statLabel}>Open</p>
              </div>
              <div style={{ ...styles.statCard, borderTopColor: colors.peach }}>
                <p style={{ ...styles.statNumber, color: colors.peach }}>{closedCount}</p>
                <p style={styles.statLabel}>Closed</p>
              </div>
            </div>

            {/* Table */}
            <div style={styles.table}>
              <div style={styles.tableHeader}>
                <span style={styles.tableHeaderCell}>Job Title</span>
                <span style={styles.tableHeaderCell}>Status</span>
                <span style={styles.tableHeaderCell}>Type</span>
                <span style={styles.tableHeaderCell}>Actions</span>
              </div>
              {jobs.map((job, i) => (
                <div
                  key={job._id}
                  style={{
                    ...styles.tableRow,
                    background: i % 2 === 0 ? colors.white : "#fdfbf7",
                    borderBottom: i === jobs.length - 1 ? "none" : `1px solid ${colors.ivory}`,
                  }}
                >
                  <span style={styles.jobTitle}>{job.title}</span>
                  <span style={job.status === "open" ? styles.statusOpen : styles.statusClosed}>
                    {job.status === "open" ? "● Open" : "● Closed"}
                  </span>
                  <span style={{ fontSize: "0.875rem", color: colors.gray, textTransform: "capitalize" }}>
                    {job.type}
                  </span>
                  <div style={styles.actionsCell}>
                    <button style={styles.viewBtn} onClick={() => navigate(`/recruiter/applicants/${job._id}`)}>
                      Applicants
                    </button>
                    <button style={styles.editBtn} onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;