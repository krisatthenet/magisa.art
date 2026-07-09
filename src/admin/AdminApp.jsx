import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AdminLayout from './AdminLayout';
import Login from './Login';
import Dashboard from './pages/Dashboard';
import Crm from './pages/Crm';
import Tickets from './pages/Tickets';
import Warehouse from './pages/Warehouse';
import Tracking from './pages/Tracking';
import Marketing from './pages/Marketing';
import Settings from './pages/Settings';

function RequireAuth({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/admin/login" replace />;
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="crm" element={<Crm />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="warehouse" element={<Warehouse />} />
        <Route path="tracking" element={<Tracking />} />
        <Route path="marketing" element={<Marketing />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
