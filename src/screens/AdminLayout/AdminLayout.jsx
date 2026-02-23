import { Outlet } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout({ user, onLogout }) {
  return (
    <div className="admin-layout">
      <main className="admin-layout-main">
        <Outlet context={{ user, onLogout }} />
      </main>

      <footer className="admin-layout-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Sesc</h3>
            <p>Fecomércio Senac</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminLayout;
