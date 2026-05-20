import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form with existing job data
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Edit Job</h2>
      <p style={{ color: "#888", fontSize: "0.85rem" }}>
        ℹ️ Editing the description will re-trigger AI category classification automatically.
      </p>
      <form onSubmit={handleSubmit}>
        <input value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})} required />
        <input value={formData.company}
          onChange={e => setFormData({...formData, company: e.target.value})} required />
        <textarea value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})} required />
        <input value={formData.requirements}
          onChange={e => setFormData({...formData, requirements: e.target.value})} />
        <input value={formData.location}
          onChange={e => setFormData({...formData, location: e.target.value})} />
        <select value={formData.type}
          onChange={e => setFormData({...formData, type: e.target.value})}>
          <option value="internship">Internship</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
        </select>
        <select value={formData.status}
          onChange={e => setFormData({...formData, status: e.target.value})}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <input type="number" value={formData.salary}
          onChange={e => setFormData({...formData, salary: e.target.value})} />
        <input type="number" value={formData.totalSlots}
          onChange={e => setFormData({...formData, totalSlots: e.target.value})} />
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={() => navigate("/recruiter/dashboard")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditJobPage;