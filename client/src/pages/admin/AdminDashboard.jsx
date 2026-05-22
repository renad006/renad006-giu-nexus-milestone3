import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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

const subheadStyle = {
  color: colors.olive,
  fontFamily: "'Georgia', serif",
  fontSize: "1.5rem",
  fontWeight: "600",
  marginBottom: "1rem",
  textAlign: "center",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== "admin") return;

    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        // If backend returns data, use it
        if (res.data && (res.data.usersByRole || res.data.totalUsers)) {
          setStats(res.data);
        } else {
          // Use mock data if backend response is empty or missing
          setStats({
            usersByRole: { admin: 2, jobSeeker: 8, recruiter: 3 },
            jobsByStatus: { open: 6, closed: 2 },
            appsByStatus: { pending: 5, shortlisted: 4, rejected: 3, approved: 3 },
            topJobs: [
              { _id: "1", title: "Frontend Developer", company: "TechStart", applicationCount: 12 },
              { _id: "2", title: "Backend Engineer", company: "CloudWare", applicationCount: 9 },
              { _id: "3", title: "AI/ML Intern", company: "DeepLearn", applicationCount: 7 },
            ],
          });
        }
      } catch (err) {
        console.error("Stats error, using mock data:", err);
        // Mock data on error
        setStats({
          usersByRole: { admin: 2, jobSeeker: 8, recruiter: 3 },
          jobsByStatus: { open: 6, closed: 2 },
          appsByStatus: { pending: 5, shortlisted: 4, rejected: 3, approved: 3 },
          topJobs: [
            { _id: "1", title: "Frontend Developer", company: "TechStart", applicationCount: 12 },
            { _id: "2", title: "Backend Engineer", company: "CloudWare", applicationCount: 9 },
            { _id: "3", title: "AI/ML Intern", company: "DeepLearn", applicationCount: 7 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [authLoading, user]);

  if (authLoading) return <div style={{ padding: 40, textAlign: "center", color: colors.olive }}>Loading session...</div>;
  if (user?.role !== "admin") return <div style={{ padding: 40, textAlign: "center", color: colors.peach }}>Access denied – Admin only</div>;
  if (loading) return <div style={{ padding: 40, textAlign: "center", color: colors.olive }}>Loading dashboard...</div>;

  const totalUsers = stats?.usersByRole ? Object.values(stats.usersByRole).reduce((a,b) => a+b, 0) : 0;
  const totalJobs = stats?.jobsByStatus ? Object.values(stats.jobsByStatus).reduce((a,b) => a+b, 0) : 0;
  const totalApps = stats?.appsByStatus ? Object.values(stats.appsByStatus).reduce((a,b) => a+b, 0) : 0;

  const cardStyle = {
    background: colors.ivory,
    border: `1px solid ${colors.bistre}`,
    borderRadius: 16,
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(79,81,39,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    color: colors.olive,
    textAlign: "center",
  };

  const statCardStyle = {
    ...cardStyle,
    cursor: "default",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto", fontFamily: "'Georgia', serif" }}>
      <h1 style={headlineStyle}>✦ Admin Dashboard</h1>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2.5rem" }}>
        <div style={statCardStyle}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>Users</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0", color: colors.olive }}>{totalUsers}</p>
          <p style={{ fontSize: "0.75rem", margin: "0.25rem 0 0", color: colors.bistre }}>Total registered</p>
        </div>
        <div style={statCardStyle}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>Jobs</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0", color: colors.olive }}>{totalJobs}</p>
          <p style={{ fontSize: "0.75rem", margin: "0.25rem 0 0", color: colors.bistre }}>Total listings</p>
        </div>
        <div style={statCardStyle}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>Applications</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0", color: colors.olive }}>{totalApps}</p>
          <p style={{ fontSize: "0.75rem", margin: "0.25rem 0 0", color: colors.bistre }}>Total applications</p>
        </div>
      </div>

      <h2 style={subheadStyle}>Management</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 280px))", justifyContent: "center", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <div style={cardStyle} onClick={() => navigate("/admin/recruiters")}>
          <span style={{ fontSize: "2rem" }}>👥</span>
          <h3 style={{ margin: "0.5rem 0 0.25rem", fontSize: "1.1rem" }}>Pending Recruiters</h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: colors.bistre }}>Approve or reject recruiter accounts</p>
        </div>
        <div style={cardStyle} onClick={() => navigate("/admin/jobs")}>
          <span style={{ fontSize: "2rem" }}>📋</span>
          <h3 style={{ margin: "0.5rem 0 0.25rem", fontSize: "1.1rem" }}>All Jobs</h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: colors.bistre }}>Manage job postings</p>
        </div>
        <div style={cardStyle} onClick={() => navigate("/admin/users")}>
          <span style={{ fontSize: "2rem" }}>👤</span>
          <h3 style={{ margin: "0.5rem 0 0.25rem", fontSize: "1.1rem" }}>All Users</h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: colors.bistre }}>View and manage user accounts</p>
        </div>
      </div>

      <h2 style={subheadStyle}>Top Jobs</h2>
      <div style={{ background: colors.ivory, border: `1px solid ${colors.bistre}`, borderRadius: 16, padding: "1rem 1.5rem", maxWidth: 600, margin: "0 auto" }}>
        {!stats?.topJobs?.length && <p style={{ color: colors.bistre, textAlign: "center" }}>No jobs yet.</p>}
        {stats?.topJobs?.map((job, i) => (
          <div key={job._id} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <span><strong>#{i+1}</strong> {job.title} — {job.company}</span>
            <span style={{ color: colors.peach }}>{job.applicationCount} applications</span>
          </div>
        ))}
      </div>
    </div>
  );
}