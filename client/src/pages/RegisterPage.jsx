import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobSeeker');
  const [error, setError] = useState('');
  const [pendingNotice, setPendingNotice] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPendingNotice(false);
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { user } = response.data;

      if (role === 'recruiter' && user.status === 'pending') {
        setPendingNotice(true);
        // Stay on the page – do NOT redirect
      } else {
        // Job seekers go to login page
        navigate('/login');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Register</h2>

      {/* Pending notice for recruiters */}
      {pendingNotice && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
          Your account has been created and is pending admin approval. You will be able to post jobs once approved.
        </div>
      )}

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      {/* Stack fields vertically */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        >
          <option value="jobSeeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.5rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;