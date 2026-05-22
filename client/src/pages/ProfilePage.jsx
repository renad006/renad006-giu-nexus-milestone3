import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SkillChip from '../components/SkillChip';
import Spinner from '../components/Spinner';

const colors = {
  ivory: "#F9EAD2",
  champagne: "#FBEEC2",
  peach: "#DB918F",
  bistre: "#837534",
  olive: "#4F5127",
  white: "#ffffff",
  gray: "#9a9a8a",
};

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
  if (error) return <div style={{ color: colors.peach, textAlign: 'center', marginTop: '2rem' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{
        backgroundColor: colors.white,
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 20px rgba(79,81,39,0.1)',
      }}>
        {/* Header with theme gradient */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.olive}, #6b7355)`,
          padding: '2rem',
          color: colors.ivory,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <img
              src={user.profilePicture || 'https://via.placeholder.com/100'}
              alt="Profile"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${colors.peach}`,
              }}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{user.name}</h1>
              <p style={{ margin: '4px 0', opacity: 0.85 }}>{user.email}</p>
              <span style={{
                background: colors.champagne,
                color: colors.olive,
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '2rem' }}>
          {/* Bio */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: colors.olive, borderBottom: `2px solid ${colors.peach}`, paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Bio
            </h3>
            {user.bio ? (
              <p style={{ color: colors.bistre, lineHeight: '1.6' }}>{user.bio}</p>
            ) : (
              <p style={{ color: colors.peach }}>
                No bio yet. <Link to="/profile/edit" style={{ color: colors.olive, fontWeight: 'bold' }}>Add one now</Link>
              </p>
            )}
          </div>

          {/* Skills */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ color: colors.olive, borderBottom: `2px solid ${colors.peach}`, paddingBottom: '0.5rem', margin: 0 }}>
                Skills
              </h3>
              <button
                onClick={handleExtractSkills}
                disabled={extracting}
                style={{
                  backgroundColor: colors.olive,
                  color: colors.ivory,
                  border: 'none',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: extracting ? 'not-allowed' : 'pointer',
                  opacity: extracting ? 0.7 : 1,
                  transition: '0.2s',
                }}
              >
                ✨ {extracting ? 'Extracting...' : 'Extract Skills from Bio'}
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, idx) => <SkillChip key={idx} skill={skill} />)
              ) : (
                <p style={{ color: colors.gray }}>No skills extracted yet.</p>
              )}
            </div>

            {extractError && (
              <p style={{ color: colors.peach, marginTop: '8px' }}>
                {extractError}{' '}
                {extractError.includes('Bio') && (
                  <Link to="/profile/edit" style={{ color: colors.olive, fontWeight: 'bold' }}>Update your bio</Link>
                )}
              </p>
            )}
            {extractSuccess && (
              <p style={{ color: colors.olive, marginTop: '8px', fontWeight: '600' }}>{extractSuccess}</p>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <Link to="/profile/edit" style={{
              backgroundColor: colors.bistre,
              color: colors.ivory,
              padding: '8px 20px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.85rem',
              display: 'inline-block',
            }}>
              ✏️ Edit Profile
            </Link>
            <Link to="/profile/change-password" style={{
              backgroundColor: colors.peach,
              color: colors.ivory,
              padding: '8px 20px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.85rem',
              display: 'inline-block',
            }}>
              🔒 Change Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;