import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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
      const params = new URLSearchParams();
      if (filterParams.keyword) params.append('keyword', filterParams.keyword);
      if (filterParams.location) params.append('location', filterParams.location);
      if (filterParams.type) params.append('type', filterParams.type);
      if (filterParams.status) params.append('status', filterParams.status);
      const queryString = params.toString();
      const url = `http://localhost:5000/api/v1/jobs${queryString ? '?' + queryString : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.jobs) {
        setJobs(data.jobs);
      } else {
        setJobs([]);
        if (data.jobs?.length === 0) setError('');
        else setError('Unexpected response format');
      }
    } catch (err) {
      setError(err.message);
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