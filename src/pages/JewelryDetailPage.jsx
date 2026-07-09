import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getJewelryPage } from '../data';

export default function JewelryDetailPage({ page }) {
  return (
    <div className="page-shell">
      <Header />

      <main className="detail-page">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">SEO landing page</p>
            <h2>{page.hero}</h2>
            <p>{page.description}</p>
            <p className="keyword-list">{page.keywords.join(' • ')}</p>
            <Link className="btn btn-primary" to="/contact">
              Request a custom piece
            </Link>
          </div>
          <div className="hero-panel">
            <div className="orb" />
          </div>
        </section>

        <section className="product-grid">
          {page.products.map((product) => (
            <article className="product-card" key={product.name}>
              <div className="product-meta">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <strong>${product.price}</strong>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function findJewelryPage(slug) {
  return getJewelryPage(slug);
}
