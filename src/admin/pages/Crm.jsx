import { useEffect, useState } from 'react';
import pb from '../../pb';

const empty = { name: '', email: '', phone: '', company: '', tags: [], notes: '' };

export default function Crm() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await pb.collection('customers').getList(1, 50, { sort: '-created' });
      setRows(res.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing('new'); setForm(empty); };
  const openEdit = (row) => { setEditing(row.id); setForm({ ...empty, ...row, tags: row.tags || [] }); };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: Array.isArray(form.tags) ? form.tags : String(form.tags).split(',').map((t) => t.trim()).filter(Boolean) };
    if (editing === 'new') await pb.collection('customers').create(payload);
    else await pb.collection('customers').update(editing, payload);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this customer?')) return;
    await pb.collection('customers').delete(id);
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-toolbar">
        <h3>Customers &amp; leads</h3>
        <button className="btn btn-primary" onClick={openNew}>+ New customer</button>
      </div>

      {loading ? <p>Loading…</p> : (
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Company</th><th>Tags</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.company}</td>
                <td>{(r.tags || []).join(', ')}</td>
                <td className="row-actions">
                  <button className="link-btn" onClick={() => openEdit(r)}>Edit</button>
                  <button className="link-btn danger" onClick={() => remove(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan="5" className="empty">No customers yet.</td></tr>}
          </tbody>
        </table>
      )}

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editing === 'new' ? 'New customer' : 'Edit customer'}</h3>
            <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
            <label>Company<input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label>
            <label>Tags (comma separated)<input value={(form.tags || []).join(', ')} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></label>
            <label>Notes<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
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
