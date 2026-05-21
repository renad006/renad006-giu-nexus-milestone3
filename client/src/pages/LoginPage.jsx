import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      login(token, user);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      // Do NOT clear the form – leave email/password as they were
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Login</h2>
      {/* Stack fields vertically */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.5rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Error message – show in red */}
      {error && (
        <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p style={{ textAlign: 'center' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;