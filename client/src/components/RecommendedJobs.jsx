// client/src/components/RecommendedJobs.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from './JobCard';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';

const RecommendedJobs = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'jobSeeker') {
      setLoading(false);
      return;
    }
    const fetchRecommended = async () => {
      try {
        const res = await api.get('/jobs/recommended');
        const jobList = res.data.jobs || res.data || [];
        setJobs(Array.isArray(jobList) ? jobList : []);
        if (jobList.length === 0) setIsEmpty(true);
      } catch (err) {
        if (err.response?.status === 400) {
          setIsEmpty(true);
        } else {
          setError('Could not load personalised recommendations.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== 'jobSeeker') return null;

  // Heading style that matches Trending Jobs exactly
  const headingStyle = {
    color: '#4F5127',
    borderBottom: '3px solid #DB918F',
    display: 'inline-block',
    paddingBottom: '6px',
    fontFamily: 'Georgia, serif',
    fontSize: '1.5rem',
    margin: '0 0 4px 0'
  };

  const subheadingStyle = {
    color: '#837534',
    fontSize: '0.8rem',
    margin: '0',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  };

  if (loading) {
    return (
      <section style={{ padding: '24px 0' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={headingStyle}>✨ Recommended for You</h2>
          <p style={subheadingStyle}>RANKED BY AI MATCH SCORE</p>
        </div>
        <div className="home-page__grid">
          <Skeleton variant="job-card" count={3} />
        </div>
      </section>
    );
  }

  if (isEmpty || error) {
    return (
      <section style={{ padding: '24px 0' }}>
        <EmptyState
          icon="🧠"
          title="No recommendations yet"
          message="Extract your skills from your bio to get AI‑powered job matches."
          ctaLink="/profile"
          ctaText="Extract Skills →"
        />
      </section>
    );
  }

  if (jobs.length === 0) return null;

  return (
    <section style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={headingStyle}>✦ Recommended for You</h2>
        <p style={subheadingStyle}>RANKED BY AI MATCH SCORE</p>
      </div>
      <div className="home-page__grid">
        {jobs.map(job => (
          <JobCard
            key={job._id}
            job={job}
            isAuthenticated={isAuthenticated}
            userRole={user?.role}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendedJobs;