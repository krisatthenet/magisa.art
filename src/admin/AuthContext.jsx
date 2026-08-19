import { createContext, useContext, useEffect, useState } from 'react';
import pb from '../pb';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    return pb.authStore.onChange((_token, model) => setUser(model));
  }, []);

  const login = async (identity, password) => {
    try {
      const auth = await pb.collection('users').authWithPassword(identity, password);
      return auth.record;
    } catch (userError) {
      if (![400, 401].includes(userError?.status)) throw userError;

      const adminAuth = await pb.send('/api/admins/auth-with-password', {
        method: 'POST',
        body: { identity, password },
      });
      pb.authStore.save(adminAuth.token, adminAuth.admin);
      return adminAuth.admin;
    }
  };

  const logout = () => pb.authStore.clear();

  const isAuthed = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, isAuthed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
