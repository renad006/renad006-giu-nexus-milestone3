import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', bio: '', profilePicture: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        const { name, bio, profilePicture } = res.data.user;
        setForm({ name: name || '', bio: bio || '', profilePicture: profilePicture || '' });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.patch('/profile', form);
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #837534',
    backgroundColor: '#fff',
    color: '#4F5127',
    fontSize: '14px',
    marginTop: '6px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    color: '#4F5127',
    fontWeight: '600',
    fontSize: '14px',
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#F9EAD2',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(80,82,39,0.1)',
    }}>
      <h2 style={{ color: '#4F5127', marginBottom: '1.5rem' }}>✏️ Edit Profile</h2>

      {error && <p style={{ color: '#DB918F', marginBottom: '1rem' }}>{error}</p>}
      {success && <p style={{ color: '#4F5127', fontWeight: '600', marginBottom: '1rem' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Your name"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Write about your experience and skills..."
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Profile Picture URL</label>
          <input
            type="text"
            name="profilePicture"
            value={form.profilePicture}
            onChange={handleChange}
            style={inputStyle}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: '#4F5127',
              color: '#F9EAD2',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            style={{
              backgroundColor: '#DB918F',
              color: '#F9EAD2',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;