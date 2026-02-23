import { useState, useEffect } from 'react';
import {
  LogoutOutlined,
  TeamOutlined,
  FileTextOutlined,
  FolderOutlined,
  TagsOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  UsergroupAddOutlined,
  LockOutlined
} from '@ant-design/icons';
import { getAllDocuments } from '../../db/documentosDb';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { adminStats, accessData, gruposMock, categoriasMock, tagsMock } from '../../data/adminStats';
import GestaoColaboradores from '../GestaoColaboradores/GestaoColaboradores';
import './AdminDashboard.css';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function AdminDashboard({ user, onLogout }) {
  const [timeFilter, setTimeFilter] = useState('semana');
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'colaboradores' | 'grupos' | 'documentos' | 'tags-categorias'
  const [totalSigilosos, setTotalSigilosos] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getAllDocuments().then((list) => {
      if (cancelled) return;
      const sigilosos = list.filter((doc) => (doc.classificacaoSigilo || 'interno') !== 'interno');
      setTotalSigilosos(sigilosos.length);
    });
    return () => { cancelled = true; };
  }, []);

  const currentData = accessData[timeFilter];
  
  // Preparar dados para o gráfico
  const chartData = {
    labels: currentData.map(item => item.date),
    datasets: [
      {
        label: 'Acessos da Plataforma',
        data: currentData.map(item => item.acessos),
        borderColor: '#BEA345',
        backgroundColor: 'rgba(190, 163, 69, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4, // Linha suave
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#BEA345',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#9A8537',
        pointHoverBorderColor: '#ffffff',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Acessos: ${context.parsed.y.toLocaleString('pt-BR')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          },
          callback: function(value) {
            return value.toLocaleString('pt-BR');
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const handleCardClick = (view) => {
    setCurrentView(view);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Se estiver em uma tela de gestão, renderizar ela
  if (currentView === 'colaboradores') {
    return <GestaoColaboradores />;
  }

  return (
    <div className="admin-dashboard-container">
     
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-logo">
            <div className="logo-container">
              <h2>Sesc</h2>
              <div className="logo-emblem"></div>
            </div>
            <p>Fecomércio Senac</p>
          </div>
          <div className="admin-header-user">
            <div className="user-avatar">
              {getInitials(user?.username || 'Admin')}
            </div>
            <span className="user-name">{user?.username || 'Administrador'}</span>
            <span className="user-badge">Admin</span>
            <button className="logout-button" onClick={onLogout}>
              <LogoutOutlined /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">
          {/* Page Title */}
          <div className="admin-page-header">
            <h1 className="admin-page-title">Dashboard Administrativo</h1>
            <p className="admin-page-subtitle">Visão geral do Portal Jurídico</p>
          </div>

          {/* Stats Cards - Ordem: Documentos, Grupos, Categorias, Assuntos, Colaboradores, Sigilosos */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper documents">
                <FileTextOutlined className="stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Documentos</p>
                <h3 className="stat-value">{adminStats.totalDocumentos}</h3>
                <div className="stat-trend positive">
                  <ArrowUpOutlined /> +3 este mês
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper groups">
                <TeamOutlined className="stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Grupos</p>
                <h3 className="stat-value">{adminStats.totalGrupos}</h3>
                <div className="stat-trend neutral">
                  <span>Sem alteração</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper categories">
                <FolderOutlined className="stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Categorias</p>
                <h3 className="stat-value">{adminStats.totalCategorias}</h3>
                <div className="stat-trend neutral">
                  <span>Configuradas</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper assuntos">
                <TagsOutlined className="stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Assuntos</p>
                <h3 className="stat-value">{adminStats.totalAssuntos}</h3>
                <div className="stat-trend neutral">
                  <span>Cadastrados</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper users">
                <UsergroupAddOutlined className="stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Colaboradores</p>
                <h3 className="stat-value">{adminStats.totalUsuarios}</h3>
                <div className="stat-trend positive">
                  <ArrowUpOutlined /> +5 este mês
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper sigilosos">
                <LockOutlined className="stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Sigilosos</p>
                <h3 className="stat-value">{totalSigilosos}</h3>
                <div className="stat-trend neutral">
                  <span>documentos no sistema</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-section">
            <div className="chart-header">
              <div className="chart-title-wrapper">
                <LineChartOutlined className="chart-title-icon" />
                <div>
                  <h2 className="chart-title">Acessos da Plataforma</h2>
                  <p className="chart-total">Total: {adminStats.totalAcessos.toLocaleString('pt-BR')} acessos</p>
                </div>
              </div>
              <div className="chart-filters">
                <button
                  className={`chart-filter ${timeFilter === 'semana' ? 'active' : ''}`}
                  onClick={() => setTimeFilter('semana')}
                >
                  Semana
                </button>
                <button
                  className={`chart-filter ${timeFilter === 'mes' ? 'active' : ''}`}
                  onClick={() => setTimeFilter('mes')}
                >
                  Mês
                </button>
                <button
                  className={`chart-filter ${timeFilter === 'semestre' ? 'active' : ''}`}
                  onClick={() => setTimeFilter('semestre')}
                >
                  Semestre
                </button>
              </div>
            </div>
            <div className="chart-container">
              <div className="chart-wrapper">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Additional Info Sections */}
          <div className="info-sections">
            <div className="info-card">
              <h3 className="info-card-title">Grupos Cadastrados</h3>
              <div className="info-list">
                {gruposMock.map((grupo) => (
                  <div key={grupo.id} className="info-item">
                    <span className="info-item-name">{grupo.nome}</span>
                    <div className="info-item-meta">
                      <span>{grupo.usuarios} usuários</span>
                      <span>{grupo.documentos} documentos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-card">
              <h3 className="info-card-title">Categorias</h3>
              <div className="tags-list">
                {categoriasMock.map((categoria, index) => (
                  <span key={index} className="tag-item">{categoria}</span>
                ))}
              </div>
            </div>

            <div className="info-card">
              <h3 className="info-card-title">Tags</h3>
              <div className="tags-list">
                {tagsMock.map((tag, index) => (
                  <span key={index} className="tag-item">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="admin-footer">
        <div className="footer-content">
          <div className="footer-logo-column">
            <div className="footer-logo">
              <h3>Sesc</h3>
              <p>Fecomércio Senac</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminDashboard;
