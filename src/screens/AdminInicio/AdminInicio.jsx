import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TeamOutlined,
  FileTextOutlined,
  TagsOutlined,
  FolderOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  UsergroupAddOutlined,
  FilePdfOutlined,
  ArrowLeftOutlined,
  LockOutlined
} from '@ant-design/icons';
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
import { colaboradoresMock } from '../../data/colaboradores';
import { getAllDocuments } from '../../db/documentosDb';
import { getAcoes } from '../../db/acoesDb';
import RelatorioModal from '../../components/RelatorioModal/RelatorioModal';
import RelatorioView from '../../components/RelatorioView/RelatorioView';
import HistoricoAcoes from '../../components/HistoricoAcoes/HistoricoAcoes';
import HistoricoAcoesFull from '../../screens/HistoricoAcoesFull/HistoricoAcoesFull';
import '../AdminDashboard/AdminDashboard.css';

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

function idsEmAlgumGrupo(grupos) {
  const ids = new Set();
  (grupos || []).forEach((g) => (g.membros || []).forEach((id) => ids.add(id)));
  return ids;
}

function AdminInicio() {
  const { user } = useOutletContext();
  const [timeFilter, setTimeFilter] = useState('semana');
  const [isRelatorioModalOpen, setIsRelatorioModalOpen] = useState(false);
  const [relatorioOpcoes, setRelatorioOpcoes] = useState(null);
  const [relatorioData, setRelatorioData] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [mostrarHistoricoFull, setMostrarHistoricoFull] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    let cancelled = false;
    getAllDocuments().then((list) => { if (!cancelled) setDocumentos(list); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentData = accessData[timeFilter];

  const buildRelatorioData = async (opcoes) => {
    const periodoAcessos = opcoes.find((o) => o.id === 'acessos')?.periodo || 'semana';
    const acessosData = accessData[periodoAcessos] || accessData.semana;

    const idsColab = idsEmAlgumGrupo(gruposMock);
    const colaboradoresAtivos = colaboradoresMock.filter((c) => idsColab.has(c.id));

    const docsPorTipo = {};
    const docsPorCategoria = {};
    const docsPorAssunto = {};
    let totalSigilosos = 0;
    documentos.forEach((doc) => {
      const tipo = doc.tipo || doc.categories?.[0] || 'Sem tipo';
      docsPorTipo[tipo] = (docsPorTipo[tipo] || 0) + 1;
      if (doc.categoria) {
        docsPorCategoria[doc.categoria] = (docsPorCategoria[doc.categoria] || 0) + 1;
      }
      if (doc.assunto) {
        docsPorAssunto[doc.assunto] = (docsPorAssunto[doc.assunto] || 0) + 1;
      }
      if ((doc.classificacaoSigilo || 'interno') !== 'interno') totalSigilosos += 1;
    });

    let historicoAcoes = [];
    if (opcoes.find((o) => o.id === 'historicoAcoes')) {
      historicoAcoes = await getAcoes(100);
    }

    return {
      acessosData: {
        labels: acessosData.map((d) => d.date),
        values: acessosData.map((d) => d.acessos)
      },
      totalColaboradores: colaboradoresAtivos.length,
      colaboradores: colaboradoresAtivos,
      categorias: categoriasMock,
      assuntos: tagsMock,
      grupos: gruposMock,
      totalDocumentos: documentos.length,
      totalSigilosos,
      documentosPorTipo: docsPorTipo,
      documentosPorCategoria: docsPorCategoria,
      documentosPorAssunto: docsPorAssunto,
      historicoAcoes
    };
  };

  const handleGerarRelatorio = async (opcoes) => {
    setRelatorioOpcoes(opcoes);
    const data = await buildRelatorioData(opcoes);
    setRelatorioData(data);
  };

  const handleFecharRelatorio = () => {
    setRelatorioOpcoes(null);
    setRelatorioData(null);
  };

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
        tension: 0.4,
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
    layout: {
      padding: {
        left: isMobile ? 5 : 0,
        right: isMobile ? 5 : 0,
        top: 0,
        bottom: 0
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: isMobile ? 8 : 12,
        titleFont: { size: isMobile ? 12 : 14, weight: 'bold' },
        bodyFont: { size: isMobile ? 11 : 13 },
        displayColors: false,
        callbacks: {
          label: (context) => `Acessos: ${context.parsed.y.toLocaleString('pt-BR')}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
        ticks: {
          color: '#666',
          font: { 
            size: isMobile ? 10 : 12 
          },
          callback: (value) => value.toLocaleString('pt-BR')
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          color: '#666', 
          font: { 
            size: isMobile ? 10 : 12 
          },
          maxRotation: isMobile ? 45 : 0,
          minRotation: isMobile ? 45 : 0
        }
      }
    },
    elements: { 
      point: { 
        hoverRadius: 8,
        radius: isMobile ? 3 : 5
      } 
    }
  };

  if (mostrarHistoricoFull) {
    return (
      <div className="admin-dashboard-container">
        <main className="admin-main">
          <HistoricoAcoesFull onVoltar={() => setMostrarHistoricoFull(false)} />
        </main>
      </div>
    );
  }

  if (relatorioOpcoes && relatorioData) {
    return (
      <div className="admin-dashboard-container">
        <main className="admin-main">
          <div className="admin-content">
            <div className="admin-page-header admin-page-header-with-action">
              <button
                type="button"
                className="admin-btn-voltar-relatorio"
                onClick={handleFecharRelatorio}
              >
                <ArrowLeftOutlined /> Voltar ao Dashboard
              </button>
            </div>
            <RelatorioView opcoes={relatorioOpcoes} data={relatorioData} user={user} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <RelatorioModal
        isOpen={isRelatorioModalOpen}
        onClose={() => setIsRelatorioModalOpen(false)}
        onGerar={handleGerarRelatorio}
      />
      <main className="admin-main">
        <div className="admin-content">
          <div className="admin-page-header admin-page-header-with-action">
            <div>
              <h1 className="admin-page-title">Relatório</h1>
              <p className="admin-page-subtitle">Visão geral do Portal Jurídico</p>
            </div>
            <button
              type="button"
              className="admin-btn-gerar-relatorio"
              onClick={() => setIsRelatorioModalOpen(true)}
            >
              <FilePdfOutlined /> Gerar Relatório
            </button>
          </div>

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
                <h3 className="stat-value">
                  {documentos.filter((d) => (d.classificacaoSigilo || 'interno') !== 'interno').length}
                </h3>
                <div className="stat-trend neutral">
                  <span>documentos no sistema</span>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-section-with-historic">
            <div className="chart-section chart-section-main">
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
            <div className="historico-acoes-wrapper">
              <HistoricoAcoes onVerTelaCheia={() => setMostrarHistoricoFull(true)} />
            </div>
          </div>

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
              <h3 className="info-card-title">Assuntos</h3>
              <div className="tags-list">
                {tagsMock.map((tag, index) => (
                  <span key={index} className="tag-item">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminInicio;
