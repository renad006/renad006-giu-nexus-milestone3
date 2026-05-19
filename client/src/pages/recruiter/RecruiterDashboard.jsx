import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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

  // if pending, show banner instead of job list
  if (user?.status === "pending") {
    return (
      <div>
        <div style={{ background: "#fff3cd", padding: "1rem", borderRadius: "8px" }}>
          ⚠️ Your recruiter account is pending admin approval. 
          You cannot post or manage jobs yet.
        </div>
      </div>
    );
  }

  if (loading) return <p>Loading your jobs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>My Job Postings</h2>
      <button onClick={() => navigate("/recruiter/jobs/create")}>+ Post New Job</button>
      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th><th>Status</th><th>Applicants</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.status}</td>
                <td>
                  <button onClick={() => navigate(`/recruiter/applicants/${job._id}`)}>
                    View Applicants
                  </button>
                </td>
                <td>
                  <button onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecruiterDashboard;