import { useEffect, useState } from 'react';
import pb from '../../pb';

const empty = { sku: '', name: '', quantity: 0, location: '', reorderLevel: 0 };

export default function Warehouse() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const res = await pb.collection('inventory').getList(1, 100, { sort: 'sku' });
    setRows(res.items);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing('new'); setForm(empty); };
  const openEdit = (r) => { setEditing(r.id); setForm({ ...empty, ...r }); };
  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, quantity: Number(form.quantity), reorderLevel: Number(form.reorderLevel) };
    if (editing === 'new') await pb.collection('inventory').create(payload);
    else await pb.collection('inventory').update(editing, payload);
    setEditing(null);
    load();
  };
  const remove = async (id) => { if (confirm('Delete item?')) { await pb.collection('inventory').delete(id); load(); } };
  const adjust = async (r, delta) => {
    await pb.collection('inventory').update(r.id, { quantity: Math.max(0, Number(r.quantity) + delta) });
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-toolbar">
        <h3>Inventory</h3>
        <button className="btn btn-primary" onClick={openNew}>+ Add item</button>
      </div>
      <table className="admin-table">
        <thead><tr><th>SKU</th><th>Name</th><th>Qty</th><th>Location</th><th>Reorder</th><th></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={Number(r.quantity) <= Number(r.reorderLevel) ? 'low-stock' : ''}>
              <td>{r.sku}</td>
              <td>{r.name}</td>
              <td>
                <span className="qty-controls">
                  <button onClick={() => adjust(r, -1)}>−</button>
                  <span>{r.quantity}</span>
                  <button onClick={() => adjust(r, 1)}>+</button>
                </span>
              </td>
              <td>{r.location}</td>
              <td>{r.reorderLevel}</td>
              <td className="row-actions">
                <button className="link-btn" onClick={() => openEdit(r)}>Edit</button>
                <button className="link-btn danger" onClick={() => remove(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="6" className="empty">No inventory yet.</td></tr>}
        </tbody>
      </table>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editing === 'new' ? 'Add inventory item' : 'Edit item'}</h3>
            <label>SKU<input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required /></label>
            <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Quantity<input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
            <label>Location<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
            <label>Reorder level<input type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} /></label>
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
