import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
  FileTextOutlined,
  TagsOutlined,
  BulbOutlined,
  BulbFilled,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import logoImage from '../../assets/Logo_topbar.png';
import './AppHeader.css';

function AppHeader({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef(null);
  const {
    darkMode,
    toggleDarkMode,
    readingFontSizeDelta,
    increaseReadingFontSize,
    decreaseReadingFontSize,
    canIncreaseFontSize,
    canDecreaseFontSize
  } = useAccessibility();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = String(name).split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return String(name)[0]?.toUpperCase() || 'A';
  };

  const isGestor = user?.profile === 'Administrador';

  const navItems = [
    { to: '/documentos', end: true, label: 'Pesquisar', icon: SearchOutlined },
    { to: '/admin', end: true, label: 'Relatório', icon: BarChartOutlined },
    { to: '/admin/colaboradores', label: 'Colaboradores', icon: UsergroupAddOutlined },
    { to: '/admin/grupos', label: 'Grupos', icon: TeamOutlined },
    { to: '/admin/documentos', label: 'Documentos', icon: FileTextOutlined },
    { to: '/admin/marcadores', label: 'Marcadores', icon: TagsOutlined }
  ];

  return (
    <header className="app-header">
      <div className="app-header-content">
        <div className="app-header-brand">
          <img src={logoImage} alt="Sesc Fecomércio Senac - Portal Jurídico" className="app-header-logo-img" />
        </div>

        {isGestor && (
          <nav className="app-header-nav">
            {navItems.map(({ to, end, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `app-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="app-nav-icon" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        )}

        <div className="app-header-user" ref={menuRef}>
          <div className="app-header-avatar">
            {getInitials(user?.username || 'Usuário')}
          </div>
          <button
            type="button"
            className="app-header-menu-btn"
            onClick={() => {
              if (isMobile) {
                setDrawerOpen(true);
              } else {
                setMenuOpen(!menuOpen);
              }
            }}
            aria-label="Menu"
            aria-expanded={menuOpen || drawerOpen}
          >
            <MenuOutlined />
          </button>
          {!isMobile && menuOpen && (
            <div className="app-header-dropdown" role="menu" aria-label="Menu do usuário">
              {isGestor && (
                <>
                  <div className="app-header-dropdown-nav">
                    {navItems.map(({ to, end, label, icon: Icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                          `app-header-dropdown-item app-header-dropdown-nav-link ${isActive ? 'active' : ''}`
                        }
                        onClick={() => setMenuOpen(false)}
                        role="menuitem"
                      >
                        <Icon className="app-nav-icon" />
                        {label}
                      </NavLink>
                    ))}
                  </div>
                  <div className="app-header-dropdown-divider" />
                </>
              )}
              <div className="app-header-dropdown-section">
                <span className="app-header-dropdown-label">Acessibilidade</span>
                <button
                  type="button"
                  className="app-header-dropdown-item"
                  onClick={() => toggleDarkMode()}
                  role="menuitem"
                  aria-label={darkMode ? 'Desativar modo escuro' : 'Ativar modo escuro'}
                >
                  {darkMode ? <BulbFilled /> : <BulbOutlined />}
                  Modo escuro {darkMode ? 'on' : 'off'}
                </button>
                <div className="app-header-font-control" role="group" aria-label="Tamanho do texto de leitura">
                  <span className="app-header-dropdown-label">Tamanho do texto de leitura</span>
                  <div className="app-header-font-buttons">
                    <button
                      type="button"
                      className="app-header-font-btn"
                      onClick={() => decreaseReadingFontSize()}
                      disabled={!canDecreaseFontSize}
                      aria-label="Diminuir tamanho do texto em 2 pixels"
                    >
                      <MinusOutlined />
                    </button>
                    <span className="app-header-font-value">{readingFontSizeDelta >= 0 ? '+' : ''}{readingFontSizeDelta}px</span>
                    <button
                      type="button"
                      className="app-header-font-btn"
                      onClick={() => increaseReadingFontSize()}
                      disabled={!canIncreaseFontSize}
                      aria-label="Aumentar tamanho do texto em 2 pixels"
                    >
                      <PlusOutlined />
                    </button>
                  </div>
                </div>
              </div>
              <div className="app-header-dropdown-divider" />
              <button
                type="button"
                className="app-header-dropdown-item"
                onClick={() => {
                  onLogout();
                  setMenuOpen(false);
                }}
                role="menuitem"
              >
                <LogoutOutlined /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
      {isMobile && (
        <MobileDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          user={user}
          onLogout={onLogout}
        />
      )}
    </header>
  );
}

export default AppHeader;
