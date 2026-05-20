import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';
import Spinner from '../components/Spinner';

const categoryColors = {
  Frontend: { backgroundColor: '#4F5127', color: '#F9EAD2' },
  Backend: { backgroundColor: '#837534', color: '#F9EAD2' },
  'AI/ML': { backgroundColor: '#DB918F', color: '#F9EAD2' },
  DevOps: { backgroundColor: '#F8EEC2', color: '#4F5127' },
  'Data Engineering': { backgroundColor: '#F9EAD2', color: '#837534' },
  Other: { backgroundColor: '#ccc', color: '#333' },
};

const JobDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);

        // Check if already applied
        if (isAuthenticated && user?.role === 'jobSeeker') {
          try {
            const appRes = await api.get('/applications/my');
            const existing = appRes.data.applications.find(a => a.job?._id === id);
            if (existing) setApplicationStatus(existing.status);
          } catch {}
        }
      } catch (err) {
        setError('Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, isAuthenticated, user]);

  const handleApply = async () => {
    setApplyError('');
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`, { coverLetter });
      setApplicationStatus('pending');
      setApplySuccess('Application submitted successfully!');
      setShowModal(false);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.post(`/jobs/${id}/save`);
      setSaved(res.data.saved);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div style={{ color: '#DB918F', textAlign: 'center', marginTop: '2rem' }}>{error}</div>;

  const categoryStyle = categoryColors[job.category] || categoryColors.Other;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#F9EAD2',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(80,82,39,0.1)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ color: '#4F5127', margin: '0 0 8px 0' }}>{job.title}</h1>
            <p style={{ color: '#837534', fontSize: '18px', margin: '0 0 8px 0' }}>{job.company}</p>
            <p style={{ color: '#837534', margin: '0 0 8px 0' }}>📍 {job.location}</p>
          </div>
          {/* Save button for job seekers */}
          {isAuthenticated && user?.role === 'jobSeeker' && (
            <button
              onClick={handleSave}
              disabled={saving || job.status !== 'open'}
              style={{
                backgroundColor: saved ? '#837534' : '#F8EEC2',
                color: saved ? '#F9EAD2' : '#4F5127',
                border: '1px solid #837534',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              {saved ? '🔖 Saved' : '🔖 Save Job'}
            </button>
          )}
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          <span style={{
            ...categoryStyle,
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            {job.category}
          </span>
          <span style={{
            backgroundColor: '#F8EEC2',
            color: '#4F5127',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: '600',
            border: '1px solid #837534',
          }}>
            {job.type}
          </span>
          <span style={{
            backgroundColor: job.status === 'open' ? '#4F5127' : '#DB918F',
            color: '#F9EAD2',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            {job.status}
          </span>
        </div>
      </div>

      {/* Salary */}
      {job.salary && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#4F5127', borderBottom: '2px solid #DB918F', paddingBottom: '8px' }}>Salary</h3>
          <p style={{ color: '#837534', fontSize: '18px', fontWeight: '600' }}>${job.salary}/month</p>
        </div>
      )}

      {/* Description */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#4F5127', borderBottom: '2px solid #DB918F', paddingBottom: '8px' }}>Description</h3>
        <p style={{ color: '#837534', lineHeight: '1.7' }}>{job.description}</p>
      </div>

      {/* Requirements */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#4F5127', borderBottom: '2px solid #DB918F', paddingBottom: '8px' }}>Requirements</h3>
        <ul style={{ color: '#837534', lineHeight: '2' }}>
          {job.requirements?.map((req, i) => <li key={i}>{req}</li>)}
        </ul>
      </div>

      {/* Posted by */}
      {job.createdBy && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#4F5127', borderBottom: '2px solid #DB918F', paddingBottom: '8px' }}>Posted By</h3>
          <p style={{ color: '#837534' }}>{job.createdBy.name} — {job.createdBy.email}</p>
        </div>
      )}

      {/* Apply section */}
      {isAuthenticated && user?.role === 'jobSeeker' && job.status === 'open' && (
        <div style={{ marginTop: '2rem' }}>
          {applicationStatus ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#4F5127', fontWeight: '600' }}>Your application status:</span>
              <ApplicationStatusBadge status={applicationStatus} />
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: '#4F5127',
                color: '#F9EAD2',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 28px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
              }}
            >
              Apply Now
            </button>
          )}
          {applySuccess && <p style={{ color: '#4F5127', fontWeight: '600', marginTop: '8px' }}>{applySuccess}</p>}
        </div>
      )}

      {/* Apply Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#F9EAD2',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
          }}>
            <h3 style={{ color: '#4F5127', marginBottom: '1rem' }}>Apply for {job.title}</h3>
            <textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              rows={5}
              placeholder="Write an optional cover letter..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #837534',
                backgroundColor: '#fff',
                color: '#4F5127',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
            {applyError && <p style={{ color: '#DB918F', marginTop: '8px' }}>{applyError}</p>}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={handleApply}
                disabled={applying}
                style={{
                  backgroundColor: '#4F5127',
                  color: '#F9EAD2',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  cursor: applying ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: applying ? 0.7 : 1,
                }}
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: '#DB918F',
                  color: '#F9EAD2',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;