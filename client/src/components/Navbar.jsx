// client/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" className="navbar-brand">
        <span className="navbar-brand-star">✦</span>
        GIU Nexus
      </Link>

      {/* Links */}
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/jobs" className="navbar-link">Jobs</Link>

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-btn">Register</Link>
          </>
        ) : (
          <>
            {user?.role === 'jobSeeker' && (
              <>
                <Link to="/jobs/recommended" className="navbar-link">Recommended</Link>
                <Link to="/jobs/saved" className="navbar-link">Saved Jobs</Link>
                <Link to="/profile" className="navbar-link">Profile</Link>
              </>
            )}
            {user?.role === 'recruiter' && (
              <>
                <Link to="/recruiter/dashboard" className="navbar-link">Dashboard</Link>
                <Link to="/recruiter/jobs/create" className="navbar-link">Post Job</Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin/stats" className="navbar-link">Admin Stats</Link>
            )}
            <button onClick={handleLogout} className="navbar-logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;