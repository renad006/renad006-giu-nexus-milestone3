import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SkillChip from '../components/SkillChip';
import Spinner from '../components/Spinner';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');
  const [extractError, setExtractError] = useState('');
  const [extractSuccess, setExtractSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setUser(res.data.user);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleExtractSkills = async () => {
    setExtractError('');
    setExtractSuccess('');
    setExtracting(true);
    try {
      const res = await api.post('/profile/extract-skills');
      setUser(prev => ({ ...prev, skills: res.data.skills }));
      setExtractSuccess('Skills extracted successfully!');
    } catch (err) {
      if (err.response?.status === 400) {
        setExtractError(err.response.data.message);
      } else {
        setExtractError('Failed to extract skills');
      }
    } finally {
      setExtracting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div style={{ color: '#DB918F', textAlign: 'center', marginTop: '2rem' }}>{error}</div>;

  return (
    <div style={{
      maxWidth: '700px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#F9EAD2',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(80,82,39,0.1)',
    }}>
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <img
          src={user.profilePicture || 'https://via.placeholder.com/80'}
          alt="Profile"
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #837534' }}
        />
        <div>
          <h1 style={{ color: '#4F5127', margin: 0 }}>{user.name}</h1>
          <p style={{ color: '#837534', margin: '4px 0' }}>{user.email}</p>
          <span style={{
            backgroundColor: '#F8EEC2',
            color: '#4F5127',
            padding: '2px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600',
            border: '1px solid #837534',
          }}>
            {user.role}
          </span>
        </div>
      </div>

      {/* Bio */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#4F5127', borderBottom: '2px solid #DB918F', paddingBottom: '8px' }}>Bio</h3>
        {user.bio ? (
          <p style={{ color: '#837534', lineHeight: '1.6' }}>{user.bio}</p>
        ) : (
          <p style={{ color: '#DB918F' }}>
            No bio yet. <Link to="/profile/edit" style={{ color: '#4F5127', fontWeight: '600' }}>Add one now</Link>
          </p>
        )}
      </div>

      {/* Skills */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#4F5127', borderBottom: '2px solid #DB918F', paddingBottom: '8px' }}>Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, index) => <SkillChip key={index} skill={skill} />)
          ) : (
            <p style={{ color: '#DB918F' }}>No skills extracted yet.</p>
          )}
        </div>

        {/* Extract Skills Button */}
        <button
          onClick={handleExtractSkills}
          disabled={extracting}
          style={{
            backgroundColor: '#4F5127',
            color: '#F9EAD2',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: extracting ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            opacity: extracting ? 0.7 : 1,
          }}
        >
          {extracting ? 'Extracting...' : '✨ Extract Skills from Bio'}
        </button>

        {/* Extract error */}
        {extractError && (
          <p style={{ color: '#DB918F', marginTop: '8px' }}>
            {extractError}{' '}
            {extractError.includes('Bio') && (
              <Link to="/profile/edit" style={{ color: '#4F5127', fontWeight: '600' }}>Update your bio</Link>
            )}
          </p>
        )}

        {/* Extract success */}
        {extractSuccess && (
          <p style={{ color: '#4F5127', marginTop: '8px', fontWeight: '600' }}>{extractSuccess}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/profile/edit" style={{
          backgroundColor: '#837534',
          color: '#F9EAD2',
          padding: '10px 20px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
        }}>
          ✏️ Edit Profile
        </Link>
        <Link to="/profile/change-password" style={{
          backgroundColor: '#DB918F',
          color: '#F9EAD2',
          padding: '10px 20px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
        }}>
          🔒 Change Password
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;