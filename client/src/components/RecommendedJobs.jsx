// client/src/components/RecommendedJobs.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import JobCard from "./JobCard";
import Skeleton from "./Skeleton";
import EmptyState from "./EmptyState";

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
        <Skeleton variant="job-card" count={3} />
      </div>
    </section>
  );

  if (isEmpty) return (
    <section style={{ padding: "32px 0" }}>
      <h2 style={{ color: "#F9EAD2", marginBottom: 8, fontFamily: "Georgia, serif" }}>
        ✦ Recommended for You
      </h2>
      <EmptyState
        icon="🧠"
        title="No skills yet"
        message="Extract skills from your bio to get personalised job recommendations."
        ctaLink="/profile"
        ctaText="Go to Profile →"
      />
    </section>
  );

  if (error) return (
    <section style={{ padding: "32px 0" }}>
      <h2 style={{ color: "#F9EAD2", marginBottom: 8, fontFamily: "Georgia, serif" }}>
        ✦ Recommended for You
      </h2>
      <EmptyState
        icon="⚠️"
        title="Could not load recommendations"
        message={error}
      />
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
            <JobCard
              job={job}
              isAuthenticated={true}
              userRole="jobSeeker"
            />
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