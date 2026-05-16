// client/src/components/Footer.jsx
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-bloom footer-bloom--left" />
      <div className="footer-bloom footer-bloom--right" />

      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">✦</span>
          <span className="footer-name">GIU Nexus</span>
          <span className="footer-logo">✦</span>
        </div>

        <p className="footer-tagline">AI-Powered Career &amp; Talent Platform</p>

        <div className="footer-divider-line" />

        <p className="footer-team">
          Software Engineering · Spring {currentYear} · German International University
        </p>
      </div>
    </footer>
  );
};

export default Footer;
