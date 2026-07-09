import { useCart } from '../cart/CartContext';
import { Link } from 'react-router-dom';

export function ProductCard({ product, to }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      {product.image && (
        <div className="product-image">
          <img src={product.image} alt={product.name || product.title || ''} loading="lazy" />
        </div>
      )}
      {!product.image && product.emoji && (
        <div className="product-emoji" aria-hidden="true">
          {product.emoji}
        </div>
      )}
      <div className="product-meta">
        {product.category && <p className="product-category">{product.category}</p>}
        {product.title && <h4>{product.title}</h4>}
        {product.name && <h4>{product.name}</h4>}
        <p>{product.description}</p>
        {to ? (
          <Link className="btn btn-secondary" to={to}>
            View page
          </Link>
        ) : (
          <div className="product-footer">
            <strong>${product.price}</strong>
            <button type="button" onClick={() => addToCart(product)}>
              Add to hoard
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export function SeoCard({ page }) {
  return <ProductCard product={{ title: page.title, description: page.description }} to={`/jewelry/${page.slug}`} />;
}
