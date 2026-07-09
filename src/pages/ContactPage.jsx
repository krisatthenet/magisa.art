import Header from '../components/Header';
import Footer from '../components/Footer';
import { socials } from '../data';

export default function ContactPage() {
  return (
    <div className="page-shell">
      <Header />

      <main className="contact-layout">
        <section className="about-card contact-card">
          <img
            className="maker-photo"
            src="/owner.jpeg"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/magisa-portrait.svg';
            }}
            alt="Portrait of Magisa, the jewelry maker and owner"
          />
          <div>
            <p className="eyebrow">Let's connect</p>
            <h2>Commission a piece or ask about availability.</h2>
            <p>Use the links below to follow the forge, message on social, or request a custom Norse commission.</p>
            <div className="social-links">
              {socials.map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
