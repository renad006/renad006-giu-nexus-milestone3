import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (form.newPassword !== form.confirmPassword) {
    return setError('New passwords do not match');
  }
  if (form.newPassword.length < 6) {
    return setError('New password must be at least 6 characters');
  }

  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/v1/profile/change-password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    });

    if (res.status === 401) {
      return setError('Current password is incorrect');
    }
    if (!res.ok) {
      const data = await res.json();
      return setError(data.message || 'Failed to change password');
    }

    setSuccess('Password changed successfully!');
    setTimeout(() => navigate('/profile'), 1500);
  } catch (err) {
    setError('Something went wrong');
  } finally {
    setLoading(false);
  }
};

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
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#F9EAD2',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(80,82,39,0.1)',
    }}>
      <h2 style={{ color: '#4F5127', marginBottom: '1.5rem' }}>🔒 Change Password</h2>

      {error && <p style={{ color: '#DB918F', marginBottom: '1rem' }}>{error}</p>}
      {success && <p style={{ color: '#4F5127', fontWeight: '600', marginBottom: '1rem' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Enter current password"
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Enter new password"
            required
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Confirm new password"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#4F5127',
              color: '#F9EAD2',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Changing...' : 'Change Password'}
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

export default ChangePasswordPage;