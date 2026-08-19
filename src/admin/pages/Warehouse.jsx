import { useEffect, useState } from 'react';
import pb from '../../pb';

const empty = {
  sku: '',
  name: '',
  price: 0,
  description: '',
  category: '',
  image: '',
  active: true,
};

export default function Warehouse() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const res = await pb.collection('products').getList(1, 100, { sort: 'sku' });
    setRows(res.items);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing('new'); setForm(empty); };
  const openEdit = (r) => { setEditing(r.id); setForm({ ...empty, ...r }); };
  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (editing === 'new') await pb.collection('products').create(payload);
    else await pb.collection('products').update(editing, payload);
    setEditing(null);
    load();
  };
  const remove = async (id) => { if (confirm('Delete product?')) { await pb.collection('products').delete(id); load(); } };

  return (
    <div className="admin-page">
      <div className="admin-toolbar">
        <h3>Products</h3>
        <button className="btn btn-primary" onClick={openNew}>+ Add product</button>
      </div>
      <table className="admin-table">
        <thead><tr><th>SKU</th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.sku}</td>
              <td>{r.name}</td>
              <td>{r.category}</td>
              <td>${Number(r.price).toFixed(2)}</td>
              <td>{r.active ? 'Active' : 'Hidden'}</td>
              <td className="row-actions">
                <button className="link-btn" onClick={() => openEdit(r)}>Edit</button>
                <button className="link-btn danger" onClick={() => remove(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="6" className="empty">No products yet.</td></tr>}
        </tbody>
      </table>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editing === 'new' ? 'Add product' : 'Edit product'}</h3>
            <label>SKU<input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required /></label>
            <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Price<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label>
            <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
            <label>Image path<input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/products/example.jpg" /></label>
            <label className="checkbox-label"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active in catalog</label>
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
