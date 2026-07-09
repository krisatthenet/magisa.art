import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import pb from '../../pb';

async function count(name, filter) {
  try {
    const res = await pb.collection(name).getList(1, 1, filter ? { filter } : {});
    return res.totalItems;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const [customers, openTickets, lowStock, activeCampaigns, orders] = await Promise.all([
        count('customers'),
        count('tickets', 'status = "open"'),
        count('inventory', 'quantity <= reorderLevel'),
        count('campaigns', 'status = "active"'),
        fetch('/api/orders').then((r) => r.json()).catch(() => []),
      ]);
      setStats({ customers, openTickets, lowStock, activeCampaigns, orders: Array.isArray(orders) ? orders.length : 0 });
    })();
  }, []);

  if (!stats) return <p>Loading the war table…</p>;

  const cards = [
    { label: 'Customers', value: stats.customers, to: '/admin/crm', icon: '✦' },
    { label: 'Open tickets', value: stats.openTickets, to: '/admin/tickets', icon: '✉' },
    { label: 'Low stock', value: stats.lowStock, to: '/admin/warehouse', icon: '▣' },
    { label: 'Active campaigns', value: stats.activeCampaigns, to: '/admin/marketing', icon: '❖' },
    { label: 'Store orders', value: stats.orders, to: '/admin/tracking', icon: '⊡' },
  ];

  return (
    <div className="admin-page">
      <div className="stat-grid">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="stat-card">
            <span className="stat-icon">{c.icon}</span>
            <span className="stat-value">{c.value ?? '—'}</span>
            <span className="stat-label">{c.label}</span>
          </Link>
        ))}
      </div>

      <section className="admin-card">
        <h3>Quick actions</h3>
        <div className="quick-actions">
          <Link className="btn btn-secondary" to="/admin/crm">Add customer</Link>
          <Link className="btn btn-secondary" to="/admin/tickets">Open ticket</Link>
          <Link className="btn btn-secondary" to="/admin/tracking">Generate label</Link>
          <Link className="btn btn-secondary" to="/admin/marketing">New campaign</Link>
        </div>
      </section>
    </div>
  );
}
