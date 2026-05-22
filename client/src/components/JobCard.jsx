import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getCategoryStyle } from '../utils/categoryColors';
import './JobCard.css';

const TYPE_LABELS = {
  'full-time': 'Full Time',
  'part-time': 'Part Time',
  'internship': 'Internship',
};

const JobCard = ({ job, onSaveToggle, isAuthenticated, userRole }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [saveLoading, setSaveLoading] = useState(false);

  const categoryStyle = getCategoryStyle(job.category);
  const isOpen = job.status === 'open';
  const showSaveButton = isAuthenticated && userRole === 'jobSeeker';

  const handleCardClick = () => {
    navigate(`/jobs/${job._id}`);
  };

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    if (!showSaveButton || !isOpen) return;
    setSaveLoading(true);
    const previousSaved = isSaved;
    setIsSaved(!isSaved);
    try {
      const { data } = await api.post(`/jobs/${job._id}/save`);
      setIsSaved(data.saved);
      if (onSaveToggle) onSaveToggle(job._id, data.saved);
    } catch (err) {
      setIsSaved(previousSaved);
      console.error('Save toggle failed:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div
      className="job-card"
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(79, 81, 39, 0.2)'; // theme shadow
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(79, 81, 39, 0.1)';
      }}
    >
      <div className="job-card__top">
        <div className="job-card__company-avatar">
          {job.company?.[0] || '?'}
        </div>
        <div className="job-card__title-group">
          <h4 className="job-card__title">{job.title}</h4>
          <p className="job-card__company">{job.company}</p>
        </div>
      </div>

      <div className="job-card__meta">
        <span className="job-card__location">📍 {job.location}</span>
        <span className="job-card__type">💼 {TYPE_LABELS[job.type] || job.type}</span>
      </div>

      <div className="job-card__footer">
        <span
          className="job-card__category-badge"
          style={{
            backgroundColor: categoryStyle.background,
            color: categoryStyle.color,
          }}
        >
          {job.category}
        </span>

        <div className="job-card__footer-right">
          {!isOpen && <span className="job-card__closed-tag">Closed</span>}
          {showSaveButton && (
            <button
              className={`job-card__save-btn ${isSaved ? 'job-card__save-btn--saved' : ''}`}
              onClick={handleSaveToggle}
              disabled={!isOpen || saveLoading}
              title={!isOpen ? 'Cannot save a closed job' : isSaved ? 'Remove from saved' : 'Save job'}
            >
              {saveLoading ? (
                <span className="job-card__save-spinner" />
              ) : isSaved ? (
                <span>🔖</span>
              ) : (
                <span>🏷️</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;