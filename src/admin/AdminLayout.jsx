import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true, icon: '◈' },
  { to: '/admin/crm', label: 'CRM', icon: '✦' },
  { to: '/admin/tickets', label: 'Support & Tickets', icon: '✉' },
  { to: '/admin/warehouse', label: 'Warehouse', icon: '▣' },
  { to: '/admin/tracking', label: 'Tracking & Labels', icon: '⊡' },
  { to: '/admin/marketing', label: 'Marketing', icon: '❖' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-rune">ᛟ</span>
          <div>
            <strong>Magisa</strong>
            <small>Console</small>
          </div>
        </div>
        <nav>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="admin-nav-link">
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link className="admin-store-link" to="/">← View store</Link>
          <button className="admin-logout" onClick={logout}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Operations</p>
            <h1>Magisa Art platform</h1>
          </div>
          {user && (
            <div className="admin-user">
              <span>{user.name || user.email || 'Operator'}</span>
            </div>
          )}
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
