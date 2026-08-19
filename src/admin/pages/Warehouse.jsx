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
  const [imageFile, setImageFile] = useState(null);
  const [loadError, setLoadError] = useState('');

  const load = async () => {
    try {
      const res = await pb.collection('products').getList(1, 100, { sort: 'sku' });
      setRows(res.items);
      setLoadError('');
    } catch (error) {
      setLoadError(error?.message || 'Could not load products from PocketBase.');
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing('new'); setForm(empty); setImageFile(null); };
  const openEdit = (r) => { setEditing(r.id); setForm({ ...empty, ...r }); setImageFile(null); };
  const save = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('sku', form.sku);
    payload.append('name', form.name);
    payload.append('price', String(Number(form.price)));
    payload.append('description', form.description || '');
    payload.append('category', form.category || '');
    payload.append('active', String(Boolean(form.active)));
    if (imageFile) payload.append('image', imageFile);
    if (editing === 'new') await pb.collection('products').create(payload);
    else await pb.collection('products').update(editing, payload);
    setEditing(null);
    setImageFile(null);
    load();
  };
  const remove = async (id) => { if (confirm('Delete product?')) { await pb.collection('products').delete(id); load(); } };

  return (
    <div className="admin-page">
      <div className="admin-toolbar">
        <h3>Products</h3>
        <button className="btn btn-primary" onClick={openNew}>+ Add product</button>
      </div>
      {loadError && <p className="status-message">{loadError}</p>}
      <table className="admin-table">
        <thead><tr><th>SKU</th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.sku}</td>
              <td>
                {r.image && <img className="admin-product-thumb" src={pb.files.getUrl(r, r.image, { thumb: '80x80' })} alt="" />}
                {r.name}
              </td>
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
            <label>Product image<input key={editing} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setImageFile(e.target.files?.[0] || null)} /></label>
            {form.image && <p className="admin-hint">Current image: {form.image}</p>}
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
