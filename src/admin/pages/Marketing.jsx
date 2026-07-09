import { useEffect, useState } from 'react';
import pb from '../../pb';

const empty = { name: '', channel: 'instagram', status: 'draft', budget: 0, spent: 0, impressions: 0, clicks: 0, conversions: 0 };
const CHANNELS = ['instagram', 'facebook', 'tiktok', 'email', 'etsy'];
const STATUSES = ['draft', 'active', 'paused', 'ended'];

export default function Marketing() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const res = await pb.collection('campaigns').getList(1, 50, { sort: '-created' });
    setRows(res.items);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing('new'); setForm(empty); };
  const openEdit = (r) => { setEditing(r.id); setForm({ ...empty, ...r }); };
  const num = (v) => Number(v) || 0;
  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, budget: num(form.budget), spent: num(form.spent), impressions: num(form.impressions), clicks: num(form.clicks), conversions: num(form.conversions) };
    if (editing === 'new') await pb.collection('campaigns').create(payload);
    else await pb.collection('campaigns').update(editing, payload);
    setEditing(null);
    load();
  };
  const remove = async (id) => { if (confirm('Delete campaign?')) { await pb.collection('campaigns').delete(id); load(); } };

  const maxImp = Math.max(1, ...rows.map((r) => num(r.impressions)));

  return (
    <div className="admin-page">
      <div className="admin-toolbar">
        <h3>Campaigns</h3>
        <button className="btn btn-primary" onClick={openNew}>+ New campaign</button>
      </div>

      <section className="admin-card">
        <h3>Performance</h3>
        <div className="bar-chart">
          {rows.map((r) => (
            <div key={r.id} className="bar-row">
              <span className="bar-label">{r.name}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(num(r.impressions) / maxImp) * 100}%` }} />
              </div>
              <span className="bar-value">{num(r.impressions).toLocaleString()} imp</span>
            </div>
          ))}
          {rows.length === 0 && <p className="empty">No campaigns yet.</p>}
        </div>
      </section>

      <table className="admin-table">
        <thead><tr><th>Name</th><th>Channel</th><th>Status</th><th>Budget</th><th>Spent</th><th>Clicks</th><th>Conv.</th><th></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.channel}</td>
              <td><span className={`pill status-${r.status}`}>{r.status}</span></td>
              <td>€{num(r.budget)}</td>
              <td>€{num(r.spent)}</td>
              <td>{num(r.clicks)}</td>
              <td>{num(r.conversions)}</td>
              <td className="row-actions">
                <button className="link-btn" onClick={() => openEdit(r)}>Edit</button>
                <button className="link-btn danger" onClick={() => remove(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editing === 'new' ? 'New campaign' : 'Edit campaign'}</h3>
            <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Channel
              <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
                {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label>Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label>Budget (€)<input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></label>
            <label>Spent (€)<input type="number" value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} /></label>
            <label>Impressions<input type="number" value={form.impressions} onChange={(e) => setForm({ ...form, impressions: e.target.value })} /></label>
            <label>Clicks<input type="number" value={form.clicks} onChange={(e) => setForm({ ...form, clicks: e.target.value })} /></label>
            <label>Conversions<input type="number" value={form.conversions} onChange={(e) => setForm({ ...form, conversions: e.target.value })} /></label>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
