// client/src/components/Spinner.jsx
import './Spinner.css';

/**
 * Spinner — circular loading indicator
 *
 * Props:
 *  size    {string} – 'sm' | 'md' (default) | 'lg'
 *  overlay {boolean} – if true, centers spinner over the full page with a soft backdrop
 */
const Spinner = ({ size = 'md', overlay = false }) => {
  if (overlay) {
    return (
      <div className="spinner-overlay">
        <div className={`spinner spinner--${size}`}>
          <div className="spinner-ring spinner-ring--outer" />
          <div className="spinner-ring spinner-ring--inner" />
          <div className="spinner-dot" />
        </div>
      </div>
    );
  }

  return (
    <div className={`spinner spinner--${size}`}>
      <div className="spinner-ring spinner-ring--outer" />
      <div className="spinner-ring spinner-ring--inner" />
      <div className="spinner-dot" />
    </div>
  );
};

export default Spinner;