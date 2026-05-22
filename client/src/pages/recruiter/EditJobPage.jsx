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

const styles = {
  page: {
    minHeight: "100vh",
    background: colors.ivory,
    padding: "3rem 1rem",
    fontFamily: "'Georgia', serif",
  },
  container: {
    maxWidth: "680px",
    margin: "0 auto",
    background: colors.white,
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(79,81,39,0.15)",
  },
  header: {
    background: `linear-gradient(135deg, ${colors.olive} 0%, ${colors.oliveLight} 100%)`,
    padding: "2.5rem 2.5rem 2rem",
    position: "relative",
    overflow: "hidden",
  },
  headerAccent: {
    position: "absolute",
    top: "-30px",
    right: "-30px",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "rgba(219,145,143,0.15)",
  },
  sparkle: { color: colors.peach, marginRight: "8px" },
  headerTitle: {
    color: colors.ivory,
    fontSize: "1.8rem",
    fontWeight: "700",
    margin: "0 0 6px",
  },
  headerSubtitle: {
    color: "rgba(249,234,210,0.65)",
    fontSize: "0.875rem",
    margin: 0,
    fontStyle: "italic",
  },
  aiBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: colors.champagne,
    border: `1px solid ${colors.bistre}`,
    borderRadius: "8px",
    padding: "0.65rem 1rem",
    margin: "2.5rem 2.5rem 0",
    fontSize: "0.85rem",
    color: colors.bistre,
    fontStyle: "italic",
  },
  body: {
    padding: "1.5rem 2.5rem 2.5rem",
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
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "1rem",
  },
  fieldGroup: {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.78rem",
    fontWeight: "600",
    color: colors.olive,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  required: { color: colors.peach, marginLeft: "3px" },
  input: {
    padding: "0.75rem 1rem",
    border: `1.5px solid #e8e0d5`,
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#2c2c2c",
    background: "#fafaf8",
    outline: "none",
    fontFamily: "'Georgia', serif",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  textarea: {
    padding: "0.75rem 1rem",
    border: `1.5px solid #e8e0d5`,
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#2c2c2c",
    background: "#fafaf8",
    outline: "none",
    fontFamily: "'Georgia', serif",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "110px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  select: {
    padding: "0.75rem 1rem",
    border: `1.5px solid #e8e0d5`,
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#2c2c2c",
    background: "#fafaf8",
    outline: "none",
    fontFamily: "'Georgia', serif",
    width: "100%",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  hint: {
    fontSize: "0.78rem",
    color: colors.gray,
    fontStyle: "italic",
  },
  divider: {
    border: "none",
    borderTop: `1px solid ${colors.ivory}`,
    margin: "1.5rem 0",
  },
  sectionLabel: {
    fontSize: "0.75rem",
    fontWeight: "700",
    color: colors.gray,
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "1rem",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "0.5rem",
  },
  saveBtn: {
    flex: 1,
    padding: "1rem",
    background: `linear-gradient(135deg, ${colors.olive}, ${colors.oliveLight})`,
    color: colors.ivory,
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
  cancelBtn: {
    flex: 1,
    padding: "1rem",
    background: "transparent",
    color: colors.olive,
    border: `1.5px solid ${colors.olive}`,
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
  loadingBox: {
    minHeight: "100vh",
    background: colors.ivory,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Georgia', serif",
    color: colors.gray,
    fontSize: "1rem",
    fontStyle: "italic",
  },
};

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const job = res.data.job;
        setFormData({
          title: job.title,
          company: job.company,
          description: job.description,
          requirements: job.requirements.join(", "),
          location: job.location,
          type: job.type,
          salary: job.salary || "",
          totalSlots: job.totalSlots || 1,
          status: job.status,
        });
      } catch (err) {
        setError("Failed to load job.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value });

  const focusStyle = (e) => {
    e.target.style.borderColor = colors.oliveLight;
    e.target.style.boxShadow = "0 0 0 3px rgba(107,115,85,0.12)";
    e.target.style.background = "#fff";
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = "#e8e0d5";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#fafaf8";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(",").map(r => r.trim()).filter(Boolean),
        salary: formData.salary ? Number(formData.salary) : undefined,
        totalSlots: Number(formData.totalSlots),
      };
      await api.patch(`/jobs/${id}`, payload);
      navigate("/recruiter/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={styles.loadingBox}>Loading job details...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerAccent} />
          <h1 style={styles.headerTitle}>
            <span style={styles.sparkle}>✦</span>Edit Job
          </h1>
          <p style={styles.headerSubtitle}>Update your listing details</p>
        </div>

        {/* AI notice */}
        <div style={styles.aiBanner}>
          <span>✦</span>
          Editing the description will re-trigger AI category classification automatically.
        </div>

        {/* Form */}
        <div style={styles.body}>
          {error && <div style={styles.errorBox}>⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Job Title <span style={styles.required}>*</span></label>
                <input style={styles.input} value={formData.title}
                  onChange={handleChange("title")} onFocus={focusStyle} onBlur={blurStyle} required />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Company <span style={styles.required}>*</span></label>
                <input style={styles.input} value={formData.company}
                  onChange={handleChange("company")} onFocus={focusStyle} onBlur={blurStyle} required />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Description <span style={styles.required}>*</span></label>
              <textarea style={styles.textarea} value={formData.description}
                onChange={handleChange("description")} onFocus={focusStyle} onBlur={blurStyle} required />
              <span style={styles.hint}>Changing this re-triggers AI category classification</span>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Requirements</label>
              <input style={styles.input} value={formData.requirements}
                onChange={handleChange("requirements")} onFocus={focusStyle} onBlur={blurStyle} />
              <span style={styles.hint}>Separate skills with commas</span>
            </div>

            <hr style={styles.divider} />
            <p style={styles.sectionLabel}>Position Details</p>

            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Location <span style={styles.required}>*</span></label>
                <input style={styles.input} value={formData.location}
                  onChange={handleChange("location")} onFocus={focusStyle} onBlur={blurStyle} required />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Job Type</label>
                <select style={styles.select} value={formData.type} onChange={handleChange("type")}>
                  <option value="internship">Internship</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Status</label>
                <select style={styles.select} value={formData.status} onChange={handleChange("status")}>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Salary</label>
                <input style={styles.input} type="number" value={formData.salary}
                  onChange={handleChange("salary")} onFocus={focusStyle} onBlur={blurStyle}
                  placeholder="Monthly (optional)" />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Total Slots</label>
              <input style={{ ...styles.input, maxWidth: "200px" }} type="number" min="1"
                value={formData.totalSlots} onChange={handleChange("totalSlots")}
                onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div style={styles.actions}>
              <button type="submit" style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                {saving ? "Saving..." : "✦ Save Changes"}
              </button>
              <button type="button" style={styles.cancelBtn}
                onClick={() => navigate("/recruiter/dashboard")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJobPage;