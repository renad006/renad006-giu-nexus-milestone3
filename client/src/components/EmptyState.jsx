// client/src/components/EmptyState.jsx
import { Link } from 'react-router-dom';
import './EmptyState.css';

/**
 * EmptyState — Reusable empty state placeholder
 *
 * Usage:
 *   <EmptyState
 *     icon="🧠"
 *     title="No skills yet"
 *     message="Extract skills from your bio to get job recommendations."
 *     ctaLink="/profile"
 *     ctaText="Go to Profile →"
 *   />
 *
 * Props:
 *  icon      {string}  — Emoji or icon character
 *  title     {string}  — Heading text
 *  message   {string}  — Description text
 *  ctaLink   {string}  — Optional link path (react-router)
 *  ctaText   {string}  — Optional link text
 */
const EmptyState = ({
  icon = '📭',
  title,
  message,
  ctaLink,
  ctaText,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
      {ctaLink && ctaText && (
        <Link to={ctaLink} className="empty-state__cta">
          {ctaText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;