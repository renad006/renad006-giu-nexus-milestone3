// client/src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import RecommendedJobs from '../components/RecommendedJobs';
import './HomePage.css';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  // ── Trending Jobs State ──────────────────────────────
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/jobs?status=open&limit=6');
        // Normalise response — backend may return { jobs: [...] } or array
        const jobList = data.jobs || data || [];
        setJobs(Array.isArray(jobList) ? jobList : []);
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
        console.error('Trending jobs fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingJobs();
  }, []);

  // ── Save Toggle Handler ──────────────────────────────
  const handleSaveToggle = (jobId, isSaved) => {
    setJobs(prev =>
      prev.map(job =>
        job._id === jobId ? { ...job, isSaved } : job
      )
    );
  };

  // ── Render: Loading ──────────────────────────────────
  if (loading) {
    return (
      <div className="home-page">
        <section className="home-page__hero">
          <h1 className="home-page__hero-title">
            Find Your Next <span className="home-page__hero-accent">Opportunity</span>
          </h1>
          <p className="home-page__hero-subtitle">
            AI-powered job matching for GIU students and graduates
          </p>
        </section>

        <section className="home-page__section">
          <h2 className="home-page__section-title">✦ Trending Jobs</h2>
          <div className="home-page__grid">
            <Skeleton variant="job-card" count={6} />
          </div>
        </section>
      </div>
    );
  }

  // ── Render: Error ────────────────────────────────────
  if (error) {
    return (
      <div className="home-page">
        <section className="home-page__hero">
          <h1 className="home-page__hero-title">
            Find Your Next <span className="home-page__hero-accent">Opportunity</span>
          </h1>
          <p className="home-page__hero-subtitle">
            AI-powered job matching for GIU students and graduates
          </p>
        </section>

        <section className="home-page__section">
          <EmptyState
            icon="⚠️"
            title="Something went wrong"
            message={error}
          />
        </section>
      </div>
    );
  }

  // ── Render: Empty ────────────────────────────────────
  if (jobs.length === 0) {
    return (
      <div className="home-page">
        <section className="home-page__hero">
          <h1 className="home-page__hero-title">
            Find Your Next <span className="home-page__hero-accent">Opportunity</span>
          </h1>
          <p className="home-page__hero-subtitle">
            AI-powered job matching for GIU students and graduates
          </p>
        </section>

        <section className="home-page__section">
          <h2 className="home-page__section-title">✦ Trending Jobs</h2>
          <EmptyState
            icon="📋"
            title="No jobs available"
            message="Check back soon for new opportunities."
          />
        </section>
      </div>
    );
  }

  // ── Render: Success ──────────────────────────────────
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-page__hero">
        <h1 className="home-page__hero-title">
          Find Your Next <span className="home-page__hero-accent">Opportunity</span>
        </h1>
        <p className="home-page__hero-subtitle">
          AI-powered job matching for GIU students and graduates
        </p>
      </section>

      {/* Trending Jobs */}
      <section className="home-page__section">
        <div className="home-page__section-header">
          <h2 className="home-page__section-title">✦ Trending Jobs</h2>
          <p className="home-page__section-subtitle">
            Latest opportunities from top employers
          </p>
        </div>
        <div className="home-page__grid">
          {jobs.map(job => (
            <JobCard
              key={job._id}
              job={job}
              isAuthenticated={isAuthenticated}
              userRole={user?.role}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      </section>

      {/* Recommended for You — only for authenticated job seekers */}
      {isAuthenticated && user?.role === 'jobSeeker' && (
        <RecommendedJobs />
      )}
    </div>
  );
};

export default HomePage;