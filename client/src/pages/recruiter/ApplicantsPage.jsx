import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const STATUS_OPTIONS = ["pending", "shortlisted", "rejected"];

const ApplicantsPage = () => {
  const { jobId } = useParams();
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
      const res = await api.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
      });
      // Update state inline without refetching
      setApplications(prev =>
        prev.map(app =>
          app._id === applicationId
            ? { ...app, status: res.data.application.status }
            : app
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Applicants</h2>
      {applications.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Skills</th>
              <th>Cover Letter</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id}>
                <td>{app.user.name}</td>
                <td>{app.user.email}</td>
                <td>{app.user.skills?.join(", ") || "—"}</td>
                <td>{app.coverLetter || "—"}</td>
                <td>
                  <select
                    value={app.status}
                    onChange={e => handleStatusChange(app._id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicantsPage;