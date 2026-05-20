// src/components/RecommendedJobs.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// TODO: swap for real JobCard once Member 3 is done
const JobCard = ({ job }) => (
  <div style={{
    backgroundColor: "#0f0f0f",
    border: "1px solid #837534",
    borderRadius: 12,
    padding: "20px 20px 40px 20px",
    width: 240,
    boxShadow: "0 4px 20px rgba(131, 117, 52, 0.12)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    position: "relative",
  }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 8px 28px rgba(131, 117, 52, 0.25)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 20px rgba(131, 117, 52, 0.12)";
    }}
  >
    <div style={{
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: "#837534",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      fontSize: "1rem",
      fontWeight: 700,
      color: "#F9EAD2",
      fontFamily: "Georgia, serif",
    }}>
      {job.company?.[0] || "?"}
    </div>

    <h4 style={{
      color: "#F9EAD2",
      margin: "0 0 6px 0",
      fontSize: "1rem",
      fontFamily: "Georgia, serif",
      lineHeight: 1.3,
    }}>
      {job.title}
    </h4>

    <p style={{
      color: "#F8EEC2",
      margin: "0 0 4px 0",
      fontSize: "0.82rem",
      fontWeight: 600,
    }}>
      {job.company}
    </p>

    <p style={{
      color: "#837534",
      margin: 0,
      fontSize: "0.78rem",
      letterSpacing: "0.5px",
    }}>
      📍 {job.location}
    </p>
  </div>
);

const RecommendedJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const fetchRecommended = async () => {
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

    if (user) fetchRecommended();
    else setLoading(false);
  }, [user]);

  if (!user) return null;

  if (loading) return (
    <section style={{ padding: "32px 0" }}>
      <h2 style={{ color: "#F9EAD2", marginBottom: 16, fontFamily: "Georgia, serif" }}>
        ✦ Recommended for You
      </h2>
      <div style={{ display: "flex", gap: 16 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            width: 240,
            height: 140,
            backgroundColor: "#1a1a1a",
            borderRadius: 12,
            border: "1px solid #837534",
            opacity: 0.5,
          }} />
        ))}
      </div>
    </section>
  );

  if (isEmpty) return (
    <section style={{ padding: "32px 0" }}>
      <h2 style={{ color: "#F9EAD2", marginBottom: 8, fontFamily: "Georgia, serif" }}>
        ✦ Recommended for You
      </h2>
      <p style={{ color: "#F8EEC2" }}>
        We need your skills to recommend jobs.{" "}
        <a href="/profile" style={{ color: "#DB918F" }}>
          Extract your skills from your bio →
        </a>
      </p>
    </section>
  );

  if (error) return (
    <section style={{ padding: "32px 0" }}>
      <h2 style={{ color: "#F9EAD2", marginBottom: 8, fontFamily: "Georgia, serif" }}>
        ✦ Recommended for You
      </h2>
      <p style={{ color: "#DB918F" }}>{error}</p>
    </section>
  );

  return (
    <section style={{ padding: "32px 0" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          color: "#F9EAD2",
          margin: "0 0 4px 0",
          fontFamily: "Georgia, serif",
          fontSize: "1.5rem",
        }}>
          ✦ Recommended for You
        </h2>
        <p style={{
          color: "#837534",
          margin: 0,
          fontSize: "0.8rem",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          Ranked by AI match score
        </p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {jobs.map(job => (
          <div key={job._id} style={{ position: "relative" }}>
            <JobCard job={job} />
            {job.score && (
              <div style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                backgroundColor: "#DB918F",
                color: "#4F5127",
                borderRadius: 999,
                padding: "3px 10px",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}>
                {Math.round(job.score * 100)}% match
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedJobs;