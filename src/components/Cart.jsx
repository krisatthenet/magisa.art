import { useState } from 'react';
import { useCart } from '../cart/CartContext';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Cart() {
  const { cart, changeQuantity, subtotal, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', notes: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    const payload = {
      ...form,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: subtotal,
    };

    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Order request failed');
      }

      setMessage(
        `Skål, ${form.name || 'wanderer'}! Your order has been sworn to the forge — a reply will come by raven soon.`,
      );
      setForm({ name: '', email: '', address: '', notes: '' });
      clearCart();
      setCheckoutOpen(false);
    } catch {
      setMessage('The raven lost your request. Please try again or reach us on social.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="cart-card">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Your hoard</p>
          <h3>Shopping cart</h3>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <p>Your hoard is empty.</p>
          <p>Start with a favorite ring or pendant.</p>
        </div>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div>
                <strong>{item.name}</strong>
                <p>${item.price} each</p>
              </div>
              <div className="qty-controls">
                <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label="Decrease quantity">
                  −
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label="Increase quantity">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-summary">
        <div>
          <span>Subtotal</span>
          <strong>${subtotal}</strong>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            className="btn btn-primary full"
            onClick={() => setCheckoutOpen((open) => !open)}
          >
            {checkoutOpen ? 'Hide checkout' : 'Swear the order'}
          </button>
        )}
      </div>

      {checkoutOpen && cart.length > 0 && (
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Shipping address
            <textarea
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              required
            />
          </label>
          <label>
            Notes
            <textarea
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              placeholder="Tell us about size, stones, or custom bind-runes."
            />
          </label>
          <button type="submit" className="btn btn-primary full" disabled={submitting}>
            {submitting ? 'Sending...' : 'Place request'}
          </button>
        </form>
      )}

      {message && <p className="status-message">{message}</p>}
    </aside>
  );
}
