import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const SavedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await api.get('/jobs/saved');
        setJobs(res.data.jobs || res.data || []);
      } catch (err) {
        setError('Failed to load saved jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  const handleUnsave = (jobId) => {
    setJobs(prev => prev.filter(job => job._id !== jobId));
  };

  if (loading) return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#4F5127', marginBottom: '1.5rem' }}>🔖 Saved Jobs</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <Skeleton variant="job-card" count={4} />
      </div>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#4F5127', marginBottom: '1.5rem' }}>🔖 Saved Jobs</h1>
      <EmptyState icon="⚠️" title="Something went wrong" message={error} />
    </div>
  );

  if (jobs.length === 0) return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#4F5127', marginBottom: '1.5rem' }}>🔖 Saved Jobs</h1>
      <EmptyState
        icon="🔖"
        title="No saved jobs yet"
        message="Browse jobs and save the ones you're interested in."
        ctaLink="/jobs"
        ctaText="Browse Jobs →"
      />
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#4F5127', marginBottom: '1.5rem' }}>🔖 Saved Jobs</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {jobs.map(job => (
          <JobCard
            key={job._id}
            job={job}
            isAuthenticated={true}
            userRole="jobSeeker"
            onSaveToggle={(jobId, isSaved) => {
              if (!isSaved) handleUnsave(jobId);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedJobsPage;