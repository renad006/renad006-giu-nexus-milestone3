import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f2ed",
    padding: "3rem 1rem",
    fontFamily: "'Georgia', serif",
  },
  container: {
    maxWidth: "680px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },
  header: {
    background: "linear-gradient(135deg, #4a5240 0%, #6b7355 100%)",
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
    background: "rgba(232, 180, 160, 0.15)",
  },
  headerAccent2: {
    position: "absolute",
    bottom: "-20px",
    left: "40%",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(232, 180, 160, 0.1)",
  },
  sparkle: {
    color: "#e8b4a0",
    marginRight: "8px",
    fontSize: "1rem",
  },
  headerTitle: {
    color: "#f5e6d3",
    fontSize: "1.8rem",
    fontWeight: "700",
    margin: "0 0 6px 0",
    letterSpacing: "0.5px",
  },
  headerSubtitle: {
    color: "rgba(245, 230, 211, 0.65)",
    fontSize: "0.9rem",
    margin: 0,
    fontStyle: "italic",
  },
  body: {
    padding: "2.5rem",
    background: "#ffffff",
  },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #ffcccc",
    color: "#c0392b",
    padding: "0.85rem 1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
    color: "#4a5240",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  required: {
    color: "#e8b4a0",
    marginLeft: "3px",
  },
  input: {
    padding: "0.75rem 1rem",
    border: "1.5px solid #e8e0d5",
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#2c2c2c",
    background: "#fafaf8",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "'Georgia', serif",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "0.75rem 1rem",
    border: "1.5px solid #e8e0d5",
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#2c2c2c",
    background: "#fafaf8",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "'Georgia', serif",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "110px",
  },
  select: {
    padding: "0.75rem 1rem",
    border: "1.5px solid #e8e0d5",
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#2c2c2c",
    background: "#fafaf8",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "'Georgia', serif",
    width: "100%",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  hint: {
    fontSize: "0.78rem",
    color: "#9a9a8a",
    fontStyle: "italic",
    marginTop: "2px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #f0ece5",
    margin: "1.5rem 0",
  },
  sectionLabel: {
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#9a9a8a",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "1rem",
  },
  submitBtn: {
    width: "100%",
    padding: "1rem",
    background: "linear-gradient(135deg, #4a5240 0%, #6b7355 100%)",
    color: "#f5e6d3",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.5px",
    fontFamily: "'Georgia', serif",
    marginTop: "0.5rem",
    transition: "opacity 0.2s, transform 0.1s",
  },
  successPage: {
    minHeight: "100vh",
    background: "#f5f2ed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'Georgia', serif",
  },
  successCard: {
    background: "#ffffff",
    borderRadius: "16px",
    maxWidth: "520px",
    width: "100%",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },
  successHeader: {
    background: "linear-gradient(135deg, #4a5240 0%, #6b7355 100%)",
    padding: "2.5rem",
    textAlign: "center",
  },
  successIcon: {
    width: "64px",
    height: "64px",
    background: "rgba(232, 180, 160, 0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
    fontSize: "1.8rem",
  },
  successTitle: {
    color: "#f5e6d3",
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: "0 0 6px",
  },
  successSubtitle: {
    color: "rgba(245, 230, 211, 0.65)",
    fontSize: "0.875rem",
    margin: 0,
    fontStyle: "italic",
  },
  successBody: {
    padding: "2rem",
  },
  successField: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 0",
    borderBottom: "1px solid #f0ece5",
  },
  successFieldLabel: {
    fontSize: "0.8rem",
    color: "#9a9a8a",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    fontWeight: "600",
  },
  successFieldValue: {
    fontSize: "0.95rem",
    color: "#2c2c2c",
    fontWeight: "500",
    textAlign: "right",
    maxWidth: "60%",
  },
  categoryBadge: {
    background: "linear-gradient(135deg, #4a5240, #6b7355)",
    color: "#f5e6d3",
    padding: "4px 14px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: "600",
    letterSpacing: "0.3px",
  },
  aiBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#fff8f0",
    border: "1px solid #e8b4a0",
    color: "#b5765a",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    marginLeft: "8px",
  },
  successActions: {
    display: "flex",
    gap: "12px",
    marginTop: "1.5rem",
  },
  btnPrimary: {
    flex: 1,
    padding: "0.85rem",
    background: "linear-gradient(135deg, #4a5240 0%, #6b7355 100%)",
    color: "#f5e6d3",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
  btnSecondary: {
    flex: 1,
    padding: "0.85rem",
    background: "transparent",
    color: "#4a5240",
    border: "1.5px solid #4a5240",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
};

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    location: "",
    type: "internship",
    salary: "",
    totalSlots: 1,
  });
  const [successJob, setSuccessJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value });

  const focusStyle = (e) => {
    e.target.style.borderColor = "#6b7355";
    e.target.style.boxShadow = "0 0 0 3px rgba(107, 115, 85, 0.12)";
    e.target.style.background = "#fff";
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = "#e8e0d5";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#fafaf8";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
        salary: formData.salary ? Number(formData.salary) : undefined,
        totalSlots: Number(formData.totalSlots),
      };
      const res = await api.post("/jobs", payload);
      setSuccessJob(res.data.job);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (successJob) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successCard}>
          <div style={styles.successHeader}>
            <div style={styles.successIcon}>✦</div>
            <h2 style={styles.successTitle}>Job Posted!</h2>
            <p style={styles.successSubtitle}>Your listing is now live on GIU Nexus</p>
          </div>
          <div style={styles.successBody}>
            <div style={styles.successField}>
              <span style={styles.successFieldLabel}>Title</span>
              <span style={styles.successFieldValue}>{successJob.title}</span>
            </div>
            <div style={styles.successField}>
              <span style={styles.successFieldLabel}>Company</span>
              <span style={styles.successFieldValue}>{successJob.company}</span>
            </div>
            <div style={styles.successField}>
              <span style={styles.successFieldLabel}>Location</span>
              <span style={styles.successFieldValue}>{successJob.location}</span>
            </div>
            <div style={styles.successField}>
              <span style={styles.successFieldLabel}>Type</span>
              <span style={styles.successFieldValue} style={{ textTransform: "capitalize" }}>{successJob.type}</span>
            </div>
            <div style={styles.successField}>
              <span style={styles.successFieldLabel}>
                Category
                <span style={styles.aiBadge}>✦ AI</span>
              </span>
              <span style={styles.categoryBadge}>{successJob.category}</span>
            </div>
            <div style={{ ...styles.successField, borderBottom: "none" }}>
              <span style={styles.successFieldLabel}>Status</span>
              <span style={{ ...styles.successFieldValue, color: "#4a5240", fontWeight: "700" }}>
                ● Open
              </span>
            </div>
            <div style={styles.successActions}>
              <button style={styles.btnPrimary} onClick={() => navigate("/recruiter/dashboard")}>
                Go to Dashboard
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => {
                  setSuccessJob(null);
                  setFormData({ title: "", company: "", description: "", requirements: "", location: "", type: "internship", salary: "", totalSlots: 1 });
                }}
              >
                Post Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerAccent} />
          <div style={styles.headerAccent2} />
          <h1 style={styles.headerTitle}>
            <span style={styles.sparkle}>✦</span>Post a New Job
          </h1>
          <p style={styles.headerSubtitle}>
            Fill in the details — AI will auto-assign the category
          </p>
        </div>

        {/* Form */}
        <div style={styles.body}>
          {error && (
            <div style={styles.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row 1: Title + Company */}
            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Job Title <span style={styles.required}>*</span></label>
                <input
                  style={styles.input}
                  placeholder="e.g. Backend Intern"
                  value={formData.title}
                  onChange={handleChange("title")}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  required
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Company <span style={styles.required}>*</span></label>
                <input
                  style={styles.input}
                  placeholder="e.g. TechCo"
                  value={formData.company}
                  onChange={handleChange("company")}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Description <span style={styles.required}>*</span></label>
              <textarea
                style={styles.textarea}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                value={formData.description}
                onChange={handleChange("description")}
                onFocus={focusStyle}
                onBlur={blurStyle}
                required
              />
              <span style={styles.hint}>Used by AI to auto-classify the job category</span>
            </div>

            {/* Requirements */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Requirements <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                placeholder="e.g. React, Node.js, MongoDB"
                value={formData.requirements}
                onChange={handleChange("requirements")}
                onFocus={focusStyle}
                onBlur={blurStyle}
                required
              />
              <span style={styles.hint}>Separate skills with commas</span>
            </div>

            <hr style={styles.divider} />
            <p style={styles.sectionLabel}>Position Details</p>

            {/* Row 2: Location + Type */}
            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Location <span style={styles.required}>*</span></label>
                <input
                  style={styles.input}
                  placeholder="e.g. Cairo or Remote"
                  value={formData.location}
                  onChange={handleChange("location")}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  required
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Job Type <span style={styles.required}>*</span></label>
                <select
                  style={styles.select}
                  value={formData.type}
                  onChange={handleChange("type")}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                >
                  <option value="internship">Internship</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>
            </div>

            {/* Row 3: Salary + Slots */}
            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Salary</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="Monthly (optional)"
                  value={formData.salary}
                  onChange={handleChange("salary")}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Total Slots</label>
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  value={formData.totalSlots}
                  onChange={handleChange("totalSlots")}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Posting & Classifying..." : "✦ Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;