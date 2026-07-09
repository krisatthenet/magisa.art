import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { ProductCard, SeoCard } from '../components/ProductCard';
import { products, jewelryPages } from '../data';

export default function HomePage() {
  return (
    <div className="page-shell">
      <Header />

      <main>
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Norse, Baltic, and hand-forged</p>
            <h2>Every piece is cast like an oath sworn in firelight.</h2>
            <p>
              Discover rings, pendants, earrings, and custom commissions inspired by rune-carved stone, longship
              voyages, and Baltic amber pulled from the northern sea.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#shop">
                Browse the hoard
              </a>
              <a className="btn btn-secondary" href="#contact">
                Commission a rune piece
              </a>
            </div>
            <ul className="feature-list">
              <li>Hand-forged with intention</li>
              <li>Custom bind-runes welcome</li>
              <li>Raven-fast replies and shipping</li>
            </ul>
          </div>
          <div className="hero-panel">
            <div className="orb" />
            <div className="hero-badge">Limited amber drops</div>
          </div>
        </section>

        <section id="shop" className="content-grid">
          <div className="product-list">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Featured pieces</p>
                <h3>Choose your next ritual object</h3>
              </div>
              <span className="pill">New arrivals</span>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="section-heading" style={{ marginTop: '18px' }}>
              <div>
                <p className="eyebrow">SEO landing pages</p>
                <h3>Explore the collections</h3>
              </div>
            </div>
            <div className="product-grid">
              {jewelryPages.map((page) => (
                <SeoCard key={page.slug} page={page} />
              ))}
            </div>
          </div>

          <Cart />
        </section>
      </main>

      <Footer />
    </div>
  );
}
