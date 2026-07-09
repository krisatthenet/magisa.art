import { socials } from '../data';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contact" className="footer-card">
      <div>
        <p className="eyebrow">Stay connected</p>
        <h3>Follow the raven's path across social channels.</h3>
      </div>
      <div className="social-links">
        {socials.map((social) => (
          <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
            {social.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
