import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogoutOutlined,
  CloseOutlined,
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
import { colaboradoresMock } from '../../data/colaboradores';
import './MobileDrawer.css';

function MobileDrawer({ isOpen, onClose, user, onLogout }) {
  const navigate = useNavigate();
  const {
    darkMode,
    toggleDarkMode,
    readingFontSizeDelta,
    increaseReadingFontSize,
    decreaseReadingFontSize,
    canIncreaseFontSize,
    canDecreaseFontSize
  } = useAccessibility();

  // Fechar drawer ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll do body quando drawer está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isAdmin = user?.profile === 'Administrador';
  const colaborador = colaboradoresMock.find(
    (c) => c.email.toLowerCase() === user?.email?.toLowerCase()
  );

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = String(name).split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return String(name)[0]?.toUpperCase() || 'U';
  };

  // Opções de navegação básicas para todos os usuários
  const basicNavItems = [
    { to: '/documentos', end: true, label: 'Pesquisar', icon: SearchOutlined }
  ];

  // Opções de navegação administrativas
  const adminNavItems = [
    { to: '/admin', end: true, label: 'Relatório', icon: BarChartOutlined },
    { to: '/admin/colaboradores', label: 'Colaboradores', icon: UsergroupAddOutlined },
    { to: '/admin/grupos', label: 'Grupos', icon: TeamOutlined },
    { to: '/admin/documentos', label: 'Documentos', icon: FileTextOutlined },
    { to: '/admin/marcadores', label: 'Marcadores', icon: TagsOutlined }
  ];

  // Combinar navegação básica com admin se necessário
  const navItems = isAdmin ? [...basicNavItems, ...adminNavItems] : basicNavItems;

  const handleNavClick = (to) => {
    navigate(to);
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none' }}>
      {/* Overlay com blur */}
      <div className="mobile-drawer-overlay" onClick={onClose} style={{ pointerEvents: 'auto' }} />
      
      {/* Drawer */}
      <div className="mobile-drawer" style={{ pointerEvents: 'auto' }}>
        {/* Header do Drawer */}
        <div className="mobile-drawer-header">
          <button
            type="button"
            className="mobile-drawer-close-btn"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Conteúdo do Drawer */}
        <div className="mobile-drawer-content">
          {/* Seção do Usuário */}
          <div className="mobile-drawer-user-section">
            <div className="mobile-drawer-avatar-container">
              {colaborador?.imagem ? (
                <img
                  src={colaborador.imagem}
                  alt={user?.username || 'Usuário'}
                  className="mobile-drawer-avatar-img"
                />
              ) : (
                <div className="mobile-drawer-avatar">
                  {getInitials(user?.username || 'Usuário')}
                </div>
              )}
            </div>
            <div className="mobile-drawer-user-info">
              <h2 className="mobile-drawer-user-name">{user?.username || 'Usuário'}</h2>
              {colaborador ? (
                <p className="mobile-drawer-user-role">{colaborador.papel || colaborador.funcao}</p>
              ) : (
                <p className="mobile-drawer-user-email">{user?.email}</p>
              )}
            </div>
          </div>

          {/* Seção de Navegação */}
          {navItems.length > 0 && (
            <div className="mobile-drawer-section">
              <h3 className="mobile-drawer-section-title">
                Menu: {navItems.length}
              </h3>
              <nav className="mobile-drawer-nav">
                {navItems.map(({ to, end, label, icon: Icon }) => (
                  <button
                    key={to}
                    type="button"
                    className="mobile-drawer-nav-item"
                    onClick={() => handleNavClick(to)}
                  >
                    <Icon className="mobile-drawer-nav-icon" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Seção de Acessibilidade */}
          <div className="mobile-drawer-section">
            <h3 className="mobile-drawer-section-title">Acessibilidade</h3>
            <div className="mobile-drawer-accessibility">
              <button
                type="button"
                className="mobile-drawer-accessibility-item"
                onClick={toggleDarkMode}
                aria-label={darkMode ? 'Desativar modo escuro' : 'Ativar modo escuro'}
              >
                {darkMode ? <BulbFilled /> : <BulbOutlined />}
                <span>Modo escuro {darkMode ? 'on' : 'off'}</span>
              </button>
              <div className="mobile-drawer-font-control">
                <span className="mobile-drawer-font-label">Tamanho do texto de leitura</span>
                <div className="mobile-drawer-font-buttons">
                  <button
                    type="button"
                    className="mobile-drawer-font-btn"
                    onClick={decreaseReadingFontSize}
                    disabled={!canDecreaseFontSize}
                    aria-label="Diminuir tamanho do texto em 2 pixels"
                  >
                    <MinusOutlined />
                  </button>
                  <span className="mobile-drawer-font-value">
                    {readingFontSizeDelta >= 0 ? '+' : ''}{readingFontSizeDelta}px
                  </span>
                  <button
                    type="button"
                    className="mobile-drawer-font-btn"
                    onClick={increaseReadingFontSize}
                    disabled={!canIncreaseFontSize}
                    aria-label="Aumentar tamanho do texto em 2 pixels"
                  >
                    <PlusOutlined />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Sair Fixo */}
        <div className="mobile-drawer-footer">
          <button
            type="button"
            className="mobile-drawer-logout-btn"
            onClick={handleLogout}
          >
            <LogoutOutlined />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileDrawer;
