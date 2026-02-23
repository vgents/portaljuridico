import { Outlet } from 'react-router-dom';
import AppFooter from '../../components/AppFooter/AppFooter';
import './AdminLayout.css';

function AdminLayout({ user, onLogout }) {
  return (
    <div className="admin-layout">
      <main className="admin-layout-main">
        <Outlet context={{ user, onLogout }} />
      </main>
      <AppFooter />
    </div>
  );
}

export default AdminLayout;
