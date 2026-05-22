import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';

const JobListPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/jobs?status=open')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.jobs) {
          setJobs(data.jobs);
        } else {
          setError('Unexpected response format');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading jobs...</div>;
  if (error) return <div style={{ color: '#991b1b', textAlign: 'center', padding: '2rem' }}>Error: {error}</div>;
  if (jobs.length === 0) return <div style={{ textAlign: 'center', padding: '2rem' }}>No jobs available</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#4F5127', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Browse Jobs</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {jobs.map(job => (
          <JobCard
            key={job._id}
            job={job}
            isAuthenticated={isAuthenticated}
            userRole={user?.role}
          />
        ))}
      </div>
    </div>
  );
};

export default JobListPage;