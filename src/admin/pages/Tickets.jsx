import { useEffect, useState } from 'react';
import pb from '../../pb';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [thread, setThread] = useState([]);
  const [reply, setReply] = useState('');
  const [drafting, setDrafting] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', customer: '', status: 'open', priority: 'normal', channel: 'web' });

  const load = async () => {
    const res = await pb.collection('tickets').getList(1, 50, { sort: '-created' });
    setTickets(res.items);
  };

  useEffect(() => { load(); }, []);

  const openTicket = async (t) => {
    setSelected(t);
    const res = await pb.collection('messages').getList(1, 100, { filter: `ticket = "${t.id}"`, sort: 'created' });
    setThread(res.items);
    setReply('');
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    await pb.collection('messages').create({ ticket: selected.id, author: 'agent', body: reply, isBot: false });
    await pb.collection('tickets').update(selected.id, { status: 'pending' });
    setReply('');
    openTicket(selected);
  };

  const draftWithAi = async () => {
    setDrafting(true);
    const lastCustomer = [...thread].reverse().find((m) => m.author !== 'agent' && !m.isBot);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: lastCustomer ? lastCustomer.body : selected.subject }),
      });
      const data = await res.json();
      setReply((prev) => (prev ? `${prev}\n\n${data.reply}` : data.reply));
    } finally {
      setDrafting(false);
    }
  };

  const createTicket = async (e) => {
    e.preventDefault();
    const created = await pb.collection('tickets').create(form);
    setNewOpen(false);
    setForm({ subject: '', customer: '', status: 'open', priority: 'normal', channel: 'web' });
    await load();
    openTicket(created);
  };

  return (
    <div className="admin-page tickets-layout">
      <div className="ticket-list">
        <div className="admin-toolbar">
          <h3>Tickets</h3>
          <button className="btn btn-primary" onClick={() => setNewOpen(true)}>+ New</button>
        </div>
        {tickets.map((t) => (
          <button key={t.id} className={`ticket-row ${selected?.id === t.id ? 'active' : ''}`} onClick={() => openTicket(t)}>
            <span className={`pill status-${t.status}`}>{t.status}</span>
            <span className="ticket-subject">{t.subject}</span>
          </button>
        ))}
      </div>

      <div className="ticket-thread">
        {!selected && <p className="empty">Select a ticket to view the conversation.</p>}
        {selected && (
          <>
            <div className="thread-head">
              <h3>{selected.subject}</h3>
              <span className="thread-meta">{selected.channel} · {selected.priority}</span>
            </div>
            <div className="messages">
              {thread.map((m) => (
                <div key={m.id} className={`message ${m.isBot ? 'bot' : m.author === 'agent' ? 'agent' : 'customer'}`}>
                  <small>{m.isBot ? 'AI raven' : m.author}</small>
                  <p dangerouslySetInnerHTML={{ __html: m.body }} />
                </div>
              ))}
            </div>
            <form className="reply-box" onSubmit={sendReply}>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" />
              <div className="reply-actions">
                <button type="button" className="btn btn-secondary" onClick={draftWithAi} disabled={drafting}>
                  {drafting ? 'Asking raven…' : '✨ Draft with AI'}
                </button>
                <button type="submit" className="btn btn-primary">Send reply</button>
              </div>
            </form>
          </>
        )}
      </div>

      {newOpen && (
        <div className="modal-backdrop" onClick={() => setNewOpen(false)}>
          <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={createTicket}>
            <h3>New ticket</h3>
            <label>Subject<input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></label>
            <label>Customer name<input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} /></label>
            <label>Channel
              <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
                <option value="web">web</option><option value="email">email</option>
                <option value="chat">chat</option><option value="social">social</option>
              </select>
            </label>
            <label>Priority
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">low</option><option value="normal">normal</option>
                <option value="high">high</option><option value="urgent">urgent</option>
              </select>
            </label>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setNewOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
