import pb from '../../pb';

export default function Settings() {
  const env = import.meta.env;
  return (
    <div className="admin-page">
      <h3>Platform settings</h3>

      <section className="admin-card">
        <h4>Connections</h4>
        <ul className="settings-list">
          <li><span>PocketBase URL</span><code>{env.VITE_PB_URL || 'http://127.0.0.1:8090'}</code></li>
          <li><span>Store API base</span><code>{env.VITE_API_URL || '(relative /api)'}</code></li>
          <li><span>Auth</span><code>PocketBase auth store</code></li>
        </ul>
      </section>

      <section className="admin-card">
        <h4>Support AI bot</h4>
        <p>
          The bot runs on a built-in mock responder by default. To use a real LLM, set{' '}
          <code>OPENAI_API_KEY</code> (and optionally <code>OPENAI_MODEL</code>) in the Express service environment.
          The TikTok/Instagram/Facebook integrations are stubs ready for their respective APIs.
        </p>
      </section>

      <section className="admin-card">
        <h4>Schema</h4>
        <p>
          Collections (customers, deals, tickets, messages, inventory, shipments, campaigns) are created by{' '}
          <code>scripts/setup-pb.mjs</code> once PocketBase is running. Run it with admin credentials to seed the platform.
        </p>
        <p className="admin-hint">
          Current PocketBase client status: <code>{pb.authStore.isValid ? 'authenticated' : 'anonymous'}</code>
        </p>
      </section>
    </div>
  );
}
