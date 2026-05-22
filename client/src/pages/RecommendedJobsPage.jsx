import { useState, useEffect } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

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

  if (loading) return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#4F5127', marginBottom: '1.5rem' }}>✦ Recommended Jobs</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <Skeleton variant="job-card" count={3} />
      </div>
    </div>
  );

  if (isEmpty) return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#4F5127', marginBottom: '1.5rem' }}>✦ Recommended Jobs</h1>
      <EmptyState
        icon="🧠"
        title="No recommendations yet"
        message="Extract your skills first to get personalised job recommendations."
        ctaLink="/profile"
        ctaText="Extract Skills →"
      />
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#4F5127', marginBottom: '1.5rem' }}>✦ Recommended Jobs</h1>
      <EmptyState icon="⚠️" title="Could not load recommendations" message={error} />
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#4F5127', margin: '0 0 4px 0', fontSize: '2rem' }}>
          ✦ Recommended Jobs
        </h1>
        <p style={{ color: '#837534', margin: 0, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Ranked by AI match score
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {jobs.map(job => (
          <div key={job._id} style={{ position: 'relative' }}>
            <JobCard
              job={job}
              isAuthenticated={true}
              userRole="jobSeeker"
            />
            {job.score && (
              <div style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                backgroundColor: '#DB918F',
                color: '#4F5127',
                borderRadius: 999,
                padding: '3px 10px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}>
                {Math.round(job.score * 100)}% match
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobsPage;