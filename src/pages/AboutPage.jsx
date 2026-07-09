import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="page-shell">
      <Header />

      <main className="about-layout">
        <section className="about-card">
          <div>
            <p className="eyebrow">Who is Magisa</p>
            <h2>Every piece is born from iron, myth, and quiet ritual.</h2>
            <p>
              Magisa creates jewelry that feels pulled from a longship's hold — intimate, protective, and unmistakably
              northern. Her work draws on Norse mythology, Baltic amber craft, and the weathered honesty of
              hand-forged metal.
            </p>
            <p>Each commission is shaped by the wearer's own story, symbol, and bind-rune.</p>
          </div>
          <img
            className="maker-photo"
            src="/owner.jpeg"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/magisa-portrait.svg';
            }}
            alt="Magisa, the maker and owner of Magisa Art"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
