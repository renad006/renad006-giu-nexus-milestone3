// client/src/components/Skeleton.jsx
import './Skeleton.css';

/**
 * Skeleton — loading placeholder
 *
 * Usage 1 – generic block (any shape you define via className/style):
 *   <Skeleton width="100%" height="20px" borderRadius="8px" />
 *
 * Usage 2 – pre-built job card placeholder:
 *   <Skeleton variant="job-card" />
 *
 * Usage 3 – pre-built profile placeholder:
 *   <Skeleton variant="profile" />
 *
 * Props:
 *  variant      {string}        – 'block' (default) | 'job-card' | 'profile'
 *  width        {string}        – CSS width  (only for variant="block")
 *  height       {string}        – CSS height (only for variant="block")
 *  borderRadius {string}        – CSS border-radius (only for variant="block")
 *  count        {number}        – repeat job-card N times (only for variant="job-card")
 */
const SkeletonBlock = ({ width = '100%', height = '16px', borderRadius = '6px', style = {} }) => (
  <div
    className="skeleton-block"
    style={{ width, height, borderRadius, ...style }}
  />
);

const JobCardSkeleton = () => (
  <div className="skeleton-job-card">
    {/* top row: logo placeholder + title lines */}
    <div className="skeleton-job-card__top">
      <SkeletonBlock width="48px" height="48px" borderRadius="12px" />
      <div className="skeleton-job-card__title-group">
        <SkeletonBlock width="60%" height="16px" />
        <SkeletonBlock width="40%" height="13px" style={{ marginTop: '8px' }} />
      </div>
    </div>
    {/* tag pills */}
    <div className="skeleton-job-card__tags">
      <SkeletonBlock width="72px" height="24px" borderRadius="20px" />
      <SkeletonBlock width="88px" height="24px" borderRadius="20px" />
      <SkeletonBlock width="60px" height="24px" borderRadius="20px" />
    </div>
    {/* description lines */}
    <SkeletonBlock width="100%" height="12px" />
    <SkeletonBlock width="80%"  height="12px" style={{ marginTop: '6px' }} />
    {/* bottom row */}
    <div className="skeleton-job-card__footer">
      <SkeletonBlock width="90px" height="12px" />
      <SkeletonBlock width="80px" height="32px" borderRadius="20px" />
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="skeleton-profile">
    {/* avatar */}
    <SkeletonBlock width="90px" height="90px" borderRadius="50%" />
    {/* name + role */}
    <div className="skeleton-profile__info">
      <SkeletonBlock width="160px" height="20px" />
      <SkeletonBlock width="100px" height="14px" style={{ marginTop: '8px' }} />
    </div>
    {/* bio lines */}
    <div className="skeleton-profile__bio">
      <SkeletonBlock width="100%" height="13px" />
      <SkeletonBlock width="90%"  height="13px" style={{ marginTop: '6px' }} />
      <SkeletonBlock width="70%"  height="13px" style={{ marginTop: '6px' }} />
    </div>
    {/* skill pills */}
    <div className="skeleton-profile__skills">
      {[80, 65, 90, 55, 75].map((w, i) => (
        <SkeletonBlock key={i} width={`${w}px`} height="26px" borderRadius="20px" />
      ))}
    </div>
  </div>
);

const Skeleton = ({ variant = 'block', count = 1, ...rest }) => {
  if (variant === 'job-card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </>
    );
  }

  if (variant === 'profile') return <ProfileSkeleton />;

  return <SkeletonBlock {...rest} />;
};

export default Skeleton;