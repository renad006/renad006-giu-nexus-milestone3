import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import JobCard from '../components/JobCard';

const JobListPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    type: '',
    status: 'open',
  });

  const fetchJobs = async (filterParams = {}) => {
    setLoading(true);
    setError('');
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (filterParams.keyword) queryParams.append('keyword', filterParams.keyword);
      if (filterParams.location) queryParams.append('location', filterParams.location);
      if (filterParams.type) queryParams.append('type', filterParams.type);
      if (filterParams.status) queryParams.append('status', filterParams.status);
      const queryString = queryParams.toString();
      const url = `/jobs${queryString ? '?' + queryString : ''}`;
      console.log('Fetching:', url); // debug

      const res = await api.get(url);
      console.log('API response:', res.data); // debug

      // Backend returns { success: true, jobs: [...] }
      const jobList = res.data.jobs || res.data || [];
      setJobs(Array.isArray(jobList) ? jobList : []);
      if (jobList.length === 0 && !filterParams.keyword && !filterParams.location && !filterParams.type) {
        // Only show a message if there are truly no jobs (not just filtered out)
        setError('No jobs found in the database.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #837534',
    backgroundColor: '#fff',
    color: '#4F5127',
    fontSize: '14px',
    outline: 'none',
  };
  const buttonStyle = {
    backgroundColor: '#4F5127',
    color: '#F9EAD2',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading jobs...</div>;
  if (error) return <div style={{ color: '#DB918F', textAlign: 'center', padding: '2rem' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#4F5127', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Browse Jobs</h1>

      {/* Filter bar */}
      <form onSubmit={handleSearch} style={{
        display: 'flex', flexWrap: 'wrap', gap: '1rem',
        marginBottom: '2rem', backgroundColor: '#F9EAD2',
        padding: '1rem', borderRadius: '12px',
      }}>
        <input
          type="text"
          name="keyword"
          placeholder="Search keyword..."
          value={filters.keyword}
          onChange={handleFilterChange}
          style={inputStyle}
        />
        <input
          type="text"
          name="location"
          placeholder="Location..."
          value={filters.location}
          onChange={handleFilterChange}
          style={inputStyle}
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          style={inputStyle}
        >
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="internship">Internship</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          style={inputStyle}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="">All</option>
        </select>
        <button type="submit" style={buttonStyle}>Search</button>
      </form>

      {jobs.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>No jobs match your filters.</div>
      )}

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