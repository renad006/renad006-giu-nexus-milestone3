// src/pages/RecommendedJobsPage.jsx
import { useState, useEffect } from "react";
import api from "../services/api";

// TODO: swap for real JobCard once Member 3 is done
// import JobCard from "../components/JobCard";
const JobCard = ({ job }) => (
  <div style={{
    backgroundColor: "#1a1a1a",
    border: "1px solid #837534",
    borderRadius: 8,
    padding: 16,
    paddingBottom: 32,
    width: 260,
  }}>
    <h4 style={{ color: "#F9EAD2", margin: "0 0 4px 0" }}>{job.title}</h4>
    <p style={{ color: "#F8EEC2", margin: "0 0 4px 0", fontSize: "0.85rem" }}>{job.company}</p>
    <p style={{ color: "#837534", margin: 0, fontSize: "0.8rem" }}>{job.location}</p>
  </div>
);

const RecommendedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/recommended");
        setJobs(res.data.jobs || res.data);
      } catch (err) {
        if (err.response?.status === 400) {
          setIsEmpty(true);
        } else {
          setError("Could not load recommendations.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // TEMPORARY: mock data to test — remove after testing
  if (false) return (
    <div style={{ padding: 40 }}>
      <h1 style={{ color: "#F9EAD2", marginBottom: 24 }}>Recommended Jobs</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {[
          { _id: "1", title: "Frontend Developer", company: "Google", location: "Cairo", score: 0.92 },
          { _id: "2", title: "ML Engineer", company: "Meta", location: "Remote", score: 0.87 },
          { _id: "3", title: "DevOps Lead", company: "AWS", location: "Dubai", score: 0.75 },
          { _id: "4", title: "Data Engineer", company: "Netflix", location: "Berlin", score: 0.65 },
        ].map(job => (
          <div key={job._id} style={{ position: "relative" }}>
            <JobCard job={job} />
            {job.score && (
              <span style={{
                position: "absolute", bottom: 8, right: 8,
                backgroundColor: "#DB918F",
                color: "#4F5127",
                borderRadius: 999,
                padding: "2px 8px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}>
                {Math.round(job.score * 100)}% match
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Loading
  if (loading) return (
    <div style={{ padding: 40 }}>
      <h1 style={{ color: "#F9EAD2", marginBottom: 24 }}>Recommended Jobs</h1>
      <div style={{ display: "flex", gap: 16 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            width: 260,
            height: 120,
            backgroundColor: "#2a2a2a",
            borderRadius: 8,
            border: "1px solid #837534",
            opacity: 0.6,
          }} />
        ))}
      </div>
    </div>
  );

  // Empty state
  if (isEmpty) return (
    <div style={{ padding: 40 }}>
      <h1 style={{ color: "#F9EAD2", marginBottom: 8 }}>Recommended Jobs</h1>
      <p style={{ color: "#F8EEC2" }}>
        No recommendations yet.{" "}
        <a href="/profile" style={{ color: "#DB918F" }}>
          Extract your skills first →
        </a>
      </p>
    </div>
  );

  // Error
  if (error) return (
    <div style={{ padding: 40 }}>
      <h1 style={{ color: "#F9EAD2", marginBottom: 8 }}>Recommended Jobs</h1>
      <p style={{ color: "#DB918F" }}>{error}</p>
    </div>
  );

  // Success
  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ color: "#F9EAD2", marginBottom: 24 }}>Recommended Jobs</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {jobs.map(job => (
          <div key={job._id} style={{ position: "relative" }}>
            <JobCard job={job} />
            {job.score && (
              <span style={{
                position: "absolute", bottom: 8, right: 8,
                backgroundColor: "#DB918F",
                color: "#4F5127",
                borderRadius: 999,
                padding: "2px 8px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}>
                {Math.round(job.score * 100)}% match
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobsPage;