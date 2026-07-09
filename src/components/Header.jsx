import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../cart/CartContext';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/jewelry/viking-rings', label: 'Rings' },
];

export default function Header() {
  const { cart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Magisa Art</p>
        <h1>Iron and amber, forged for the wolf at your door.</h1>
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}>
            {item.label}
            {item.label === 'Rings' && count > 0 ? ` (${count})` : ''}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
