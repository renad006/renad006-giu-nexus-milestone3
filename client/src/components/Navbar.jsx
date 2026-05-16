import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <Link to="/">Home</Link>
      {!isAuthenticated ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          {user?.role === 'jobSeeker' && (
            <>
              <Link to="/jobs/recommended">Recommended</Link>
              <Link to="/jobs/saved">Saved Jobs</Link>
              <Link to="/profile">Profile</Link>
            </>
          )}
          {user?.role === 'recruiter' && (
            <>
              <Link to="/recruiter/dashboard">Dashboard</Link>
              <Link to="/recruiter/jobs/create">Post Job</Link>
            </>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin/stats">Admin Stats</Link>
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;