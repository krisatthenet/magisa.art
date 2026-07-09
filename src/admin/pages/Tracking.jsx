import { useEffect, useState } from 'react';
import pb from '../../pb';

const empty = { orderRef: '', customerName: '', address: '', carrier: 'Lithuania Post', trackingNumber: '', status: 'created' };

export default function Tracking() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const res = await pb.collection('shipments').getList(1, 50, { sort: '-created' });
    setRows(res.items);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing('new'); setForm(empty); };
  const openEdit = (r) => { setEditing(r.id); setForm({ ...empty, ...r }); };
  const save = async (e) => {
    e.preventDefault();
    if (editing === 'new') await pb.collection('shipments').create(form);
    else await pb.collection('shipments').update(editing, form);
    setEditing(null);
    load();
  };
  const remove = async (id) => { if (confirm('Delete shipment?')) { await pb.collection('shipments').delete(id); load(); } };

  const generateLabel = async (r) => {
    const res = await fetch('/api/labels/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderRef: r.orderRef, customerName: r.customerName, address: r.address, carrier: r.carrier, trackingNumber: r.trackingNumber }),
    });
    if (!res.ok) { alert('Label generation failed'); return; }
    if (r.status !== 'label_generated') await pb.collection('shipments').update(r.id, { status: 'label_generated' }).catch(() => {});
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `label-${r.orderRef}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-toolbar">
        <h3>Shipments &amp; tracking</h3>
        <button className="btn btn-primary" onClick={openNew}>+ New shipment</button>
      </div>
      <table className="admin-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Carrier</th><th>Tracking</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.orderRef}</td>
              <td>{r.customerName}</td>
              <td>{r.carrier}</td>
              <td>{r.trackingNumber || '—'}</td>
              <td><span className={`pill status-${r.status}`}>{r.status}</span></td>
              <td className="row-actions">
                <button className="link-btn" onClick={() => generateLabel(r)}>Label</button>
                <button className="link-btn" onClick={() => openEdit(r)}>Edit</button>
                <button className="link-btn danger" onClick={() => remove(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="6" className="empty">No shipments yet.</td></tr>}
        </tbody>
      </table>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editing === 'new' ? 'New shipment' : 'Edit shipment'}</h3>
            <label>Order ref<input value={form.orderRef} onChange={(e) => setForm({ ...form, orderRef: e.target.value })} required /></label>
            <label>Customer name<input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></label>
            <label>Address<textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
            <label>Carrier
              <select value={form.carrier} onChange={(e) => setForm({ ...form, carrier: e.target.value })}>
                <option>DHL</option><option>UPS</option><option>FedEx</option>
                <option>Lithuania Post</option><option>Omniva</option>
              </select>
            </label>
            <label>Tracking number<input value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} /></label>
            <label>Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="created">created</option>
                <option value="label_generated">label_generated</option>
                <option value="in_transit">in_transit</option>
                <option value="delivered">delivered</option>
              </select>
            </label>
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
