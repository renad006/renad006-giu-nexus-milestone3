// client/src/pages/MyApplicationsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';

const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my');
        const apps = res.data.applications || res.data || [];
        setApplications(apps);
      } catch (err) {
        console.error(err);
        setError('Failed to load your applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleCardClick = (jobId) => {
    if (jobId) navigate(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem', textAlign: 'center' }}>
        Loading your applications...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem', color: '#DB918F', textAlign: 'center' }}>
        {error}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '2rem', textAlign: 'center', backgroundColor: '#F9EAD2', borderRadius: '12px' }}>
        <h2 style={{ color: '#4F5127' }}>✦ No Applications Yet</h2>
        <p style={{ color: '#837534' }}>You haven't applied to any jobs. Browse jobs and apply to see them here.</p>
        <a href="/jobs" style={{ color: '#4F5127', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid #DB918F' }}>Browse Jobs →</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#4F5127', marginBottom: '1.5rem', fontSize: '2rem', fontWeight: '500' }}>
        ✦ My Applications
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {applications.map(app => {
          let appliedDate = 'Date unknown';
          if (app.createdAt) {
            try {
              appliedDate = new Date(app.createdAt).toLocaleDateString();
            } catch (e) { /* keep default */ }
          }
          const jobId = app.job?._id || app.jobId;
          return (
            <div
              key={app._id}
              onClick={() => handleCardClick(jobId)}
              style={{
                border: '1px solid #837534',
                borderRadius: '16px',
                padding: '1.2rem',
                backgroundColor: '#DB918F',   // Juicy Peach – constant
                boxShadow: '0 2px 8px rgba(130, 116, 52, 0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: jobId ? 'pointer' : 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(79, 81, 39, 0.15)';
                // Background stays #DB918F – no color change
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(130, 116, 52, 0.08)';
                // Background stays #DB918F
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', color: '#4F5127', fontSize: '1.2rem' }}>
                    {app.job?.title || 'Job Position'}
                  </h3>
                  <p style={{ margin: '0', color: '#F9EAD2' }}>
                    <strong>Company:</strong> {app.job?.company || 'N/A'}
                  </p>
                </div>
                <ApplicationStatusBadge status={app.status} />
              </div>
              <p style={{ margin: '0.75rem 0 0', color: '#F9EAD2', fontSize: '0.85rem' }}>
                <strong>Applied on:</strong> {appliedDate}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyApplicationsPage;