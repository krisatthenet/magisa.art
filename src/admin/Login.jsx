import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(identity, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      const isAuthFailure = err?.status === 400 || err?.status === 401;
      setError(
        isAuthFailure
          ? 'Invalid credentials. Use the PocketBase admin or a platform user account.'
          : `Could not reach PocketBase (${err?.message || 'network error'}). Check the API connection.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <p className="eyebrow">Magisa Art Console</p>
        <h2>Sign in to the forge</h2>
        <label>
          Email / username
          <input value={identity} onChange={(e) => setIdentity(e.target.value)} required autoFocus />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="status-message">{error}</p>}
        <button type="submit" className="btn btn-primary full" disabled={loading}>
          {loading ? 'Entering...' : 'Enter'}
        </button>
        <p className="admin-hint">
          Accounts live in PocketBase. Create users in the PocketBase admin UI at <code>/_/</code>.
        </p>
      </form>
    </div>
  );
}
