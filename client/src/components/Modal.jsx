// client/src/components/Modal.jsx
import { useEffect } from 'react';
import './Modal.css';

/**
 * Reusable Modal
 *
 * Props:
 *  isOpen   {boolean}  – controls visibility
 *  onClose  {function} – called when user clicks backdrop or ✕
 *  title    {string}   – modal heading (optional)
 *  children {node}     – body content
 *  size     {string}   – 'sm' | 'md' (default) | 'lg'
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {

  // close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`modal-box modal-box--${size}`}
        onClick={(e) => e.stopPropagation()}   // prevent backdrop click closing when clicking inside
      >
        {/* decorative petal top-right */}
        <span className="modal-petal" aria-hidden="true">✿</span>

        {/* header */}
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        )}

        {/* if no title, still show close button */}
        {!title && (
          <button className="modal-close modal-close--notitle" onClick={onClose} aria-label="Close">✕</button>
        )}

        {/* body */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;