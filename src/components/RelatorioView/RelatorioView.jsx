import { useRef, useState } from 'react';
import {
  LineChartOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
  FolderOutlined,
  TagsOutlined,
  FileTextOutlined,
  BarChartOutlined,
  FilePdfOutlined,
  HistoryOutlined,
  EditOutlined,
  CheckCircleOutlined,
  StopOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import './RelatorioView.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* Paleta com cores bem distintas para cada tipo de documento */
const PALETA_CORES = [
  { fill: 'rgba(66, 133, 244, 0.85)', stroke: '#4285F4' },   /* azul */
  { fill: 'rgba(52, 168, 83, 0.85)', stroke: '#34A853' },   /* verde */
  { fill: 'rgba(251, 188, 4, 0.85)', stroke: '#FBBC04' },   /* amarelo */
  { fill: 'rgba(234, 67, 53, 0.85)', stroke: '#EA4335' },   /* vermelho */
  { fill: 'rgba(156, 39, 176, 0.85)', stroke: '#9C27B0' },  /* roxo */
  { fill: 'rgba(0, 172, 193, 0.85)', stroke: '#00ACC1' },   /* ciano */
  { fill: 'rgba(255, 152, 0, 0.85)', stroke: '#FF9800' },   /* laranja */
  { fill: 'rgba(121, 85, 72, 0.85)', stroke: '#795548' }    /* marrom */
];

function getCoresPorTipo(qtd) {
  return {
    fill: Array.from({ length: qtd }, (_, i) => PALETA_CORES[i % PALETA_CORES.length].fill),
    stroke: Array.from({ length: qtd }, (_, i) => PALETA_CORES[i % PALETA_CORES.length].stroke)
  };
}

function RelatorioView({ opcoes, data, user }) {
  const relatorioRef = useRef(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  if (!opcoes || opcoes.length === 0) return null;

  const handleGerarPdf = async () => {
    if (!relatorioRef.current) return;
    setGerandoPdf(true);
    try {
      const canvas = await html2canvas(relatorioRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const headerHeight = 28;
      const footerHeight = 18;
      const contentTop = margin + headerHeight;
      const contentBottom = pageHeight - margin - footerHeight;
      const contentHeight = contentBottom - contentTop;

      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const nomePortal = 'Portal Jurídico - GEJUR';
      const nomeUsuario = user?.username || 'Usuário';
      const emailUsuario = user?.email || '-';
      const agora = new Date();
      const dataStr = agora.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const horaStr = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const local = 'Brasília, DF';
      const rodape = 'Relatório do Portal Jurídico - GEJUR';

      while (heightLeft > 0) {
        if (position > 0) pdf.addPage();

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(nomePortal, margin, margin + 6);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.text(`Gerado por: ${nomeUsuario} (${emailUsuario})`, margin, margin + 12);
        pdf.text(`Data: ${dataStr} | Hora: ${horaStr} | Local: ${local}`, margin, margin + 18);
        pdf.setDrawColor(180, 180, 180);
        pdf.line(margin, margin + headerHeight - 2, pageWidth - margin, margin + headerHeight - 2);

        const sliceHeightMm = Math.min(contentHeight, heightLeft);
        const sourceY = (position / imgHeight) * canvas.height;
        const sliceHeightPx = (sliceHeightMm / imgHeight) * canvas.height;
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeightPx;
        const ctx = sliceCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);
        const sliceImg = sliceCanvas.toDataURL('image/jpeg', 0.95);
        const displayH = (sliceCanvas.height * imgWidth) / canvas.width;
        pdf.addImage(sliceImg, 'JPEG', margin, contentTop, imgWidth, Math.min(displayH, contentHeight));

        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, contentBottom, pageWidth - margin, contentBottom);
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(8);
        pdf.text('Documento gerado de forma segura. Uso restrito ao Portal Jurídico.', margin, contentBottom + 6);
        pdf.setFont('helvetica', 'normal');
        pdf.text(rodape, margin, contentBottom + 12);

        heightLeft -= contentHeight;
        position += contentHeight;
      }

      pdf.save(`Relatorio-Portal-Juridico-${agora.toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setGerandoPdf(false);
    }
  };

  const opcao = (id) => opcoes.find((o) => o.id === id);
  const tem = (id) => !!opcao(id);
  const chartOptionsLine = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: { label: (ctx) => `Acessos: ${ctx.parsed.y.toLocaleString('pt-BR')}` }
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#666' } },
      x: { grid: { display: false }, ticks: { color: '#666' } }
    }
  };

  const chartOptionsBar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed.y}` }
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#666' } },
      x: { grid: { display: false }, ticks: { color: '#666' } }
    }
  };

  const chartOptionsPie = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : 0;
            return `${ctx.label}: ${ctx.raw} (${pct}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="relatorio-view" ref={relatorioRef}>
      <div className="relatorio-view-header">
        <div className="relatorio-view-header-top">
          <div>
            <h1 className="relatorio-view-titulo">Relatório Portal Jurídico</h1>
            <p className="relatorio-view-data">
              Gerado em {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            type="button"
            className="relatorio-btn-gerar-pdf"
            onClick={handleGerarPdf}
            disabled={gerandoPdf}
          >
            <FilePdfOutlined /> {gerandoPdf ? 'Gerando PDF...' : 'Gerar PDF'}
          </button>
        </div>
      </div>

      <div className="relatorio-view-conteudo">
        {tem('acessos') && (
          <section className="relatorio-secao">
            <h2 className="relatorio-secao-titulo">
              <LineChartOutlined /> Quantidade de Acessos
              {opcao('acessos').periodo && (
                <span className="relatorio-secao-periodo">
                  ({opcao('acessos').periodo === 'semana' ? 'Semana' : opcao('acessos').periodo === 'mes' ? 'Mês' : opcao('acessos').periodo === 'semestre' ? 'Semestre' : 'Ano'})
                </span>
              )}
            </h2>
            <div className="relatorio-chart-container">
              <Line
                data={{
                  labels: data.acessosData.labels,
                  datasets: [{
                    label: 'Acessos',
                    data: data.acessosData.values,
                    borderColor: '#0A2346',
                    backgroundColor: 'rgba(10, 35, 70, 0.15)',
                    fill: true,
                    tension: 0.4
                  }]
                }}
                options={chartOptionsLine}
              />
            </div>
          </section>
        )}

        {tem('colaboradoresQtd') && (
          <section className="relatorio-secao relatorio-secao-numero">
            <h2 className="relatorio-secao-titulo">
              <UsergroupAddOutlined /> Colaboradores Ativos
            </h2>
            <div className="relatorio-numero-grande">{data.totalColaboradores}</div>
            <p className="relatorio-secao-desc">colaboradores ativos no projeto</p>
          </section>
        )}

        {tem('colaboradoresLista') && (
          <section className="relatorio-secao">
            <h2 className="relatorio-secao-titulo">
              <UsergroupAddOutlined /> Lista de Colaboradores
            </h2>
            <div className="relatorio-tabela-wrapper">
              <table className="relatorio-tabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Setor</th>
                    <th>Função</th>
                    <th>E-mail</th>
                  </tr>
                </thead>
                <tbody>
                  {data.colaboradores.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nome}</td>
                      <td>{c.setor}</td>
                      <td>{c.funcao}</td>
                      <td>{c.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tem('categorias') && (
          <section className="relatorio-secao">
            <h2 className="relatorio-secao-titulo">
              <FolderOutlined /> Categorias
            </h2>
            <p className="relatorio-secao-meta">{data.categorias.length} categorias cadastradas</p>
            <div className="relatorio-tags">
              {data.categorias.map((cat, i) => (
                <span key={i} className="relatorio-tag">{cat}</span>
              ))}
            </div>
          </section>
        )}

        {tem('assuntos') && (
          <section className="relatorio-secao">
            <h2 className="relatorio-secao-titulo">
              <TagsOutlined /> Assuntos
            </h2>
            <div className="relatorio-tags">
              {data.assuntos.map((a, i) => (
                <span key={i} className="relatorio-tag">{a}</span>
              ))}
            </div>
          </section>
        )}

        {tem('grupos') && (
          <section className="relatorio-secao">
            <h2 className="relatorio-secao-titulo">
              <TeamOutlined /> Grupos
            </h2>
            <div className="relatorio-tabela-wrapper">
              <table className="relatorio-tabela">
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Usuários</th>
                    <th>Documentos</th>
                  </tr>
                </thead>
                <tbody>
                  {data.grupos.map((g) => (
                    <tr key={g.id}>
                      <td>{g.nome}</td>
                      <td>{g.usuarios}</td>
                      <td>{g.documentos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tem('documentosQtd') && (
          <section className="relatorio-secao relatorio-secao-numero">
            <h2 className="relatorio-secao-titulo">
              <FileTextOutlined /> Quantidade de Documentos
            </h2>
            <div className="relatorio-numero-grande">{data.totalDocumentos}</div>
            <p className="relatorio-secao-desc">documentos cadastrados</p>
          </section>
        )}

        {tem('documentosPorTipo') && data.documentosPorTipo && Object.keys(data.documentosPorTipo).length > 0 && (() => {
          const labels = Object.keys(data.documentosPorTipo);
          const values = Object.values(data.documentosPorTipo);
          const { fill: coresFill, stroke: coresStroke } = getCoresPorTipo(labels.length);
          return (
            <section className="relatorio-secao relatorio-secao-docs-tipo">
              <h2 className="relatorio-secao-titulo">
                <BarChartOutlined /> Documentos por Tipo
              </h2>
              <div className="relatorio-charts-row">
                <div className="relatorio-chart-container relatorio-chart-pie">
                  <Pie
                    data={{
                      labels,
                      datasets: [{
                        data: values,
                        backgroundColor: coresFill,
                        borderColor: coresStroke,
                        borderWidth: 2
                      }]
                    }}
                    options={chartOptionsPie}
                  />
                </div>
                <div className="relatorio-chart-container relatorio-chart-bar">
                  <Bar
                    data={{
                      labels,
                      datasets: [{
                        label: 'Documentos',
                        data: values,
                        backgroundColor: coresFill,
                        borderColor: coresStroke,
                        borderWidth: 1
                      }]
                    }}
                    options={chartOptionsBar}
                  />
                </div>
              </div>
            <div className="relatorio-tabela-wrapper relatorio-tabela-compacta">
              <table className="relatorio-tabela">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((tipo) => (
                    <tr key={tipo}>
                      <td>{tipo}</td>
                      <td>{data.documentosPorTipo[tipo]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </section>
          );
        })()}

        {tem('documentosPorCategoria') && data.documentosPorCategoria && Object.keys(data.documentosPorCategoria).length > 0 && (() => {
          const labels = Object.keys(data.documentosPorCategoria);
          const values = Object.values(data.documentosPorCategoria);
          const { fill: coresFill, stroke: coresStroke } = getCoresPorTipo(labels.length);
          return (
            <section className="relatorio-secao relatorio-secao-docs-tipo">
              <h2 className="relatorio-secao-titulo">
                <FolderOutlined /> Documentos por Categoria
              </h2>
              <div className="relatorio-charts-row">
                <div className="relatorio-chart-container relatorio-chart-pie">
                  <Pie
                    data={{
                      labels,
                      datasets: [{
                        data: values,
                        backgroundColor: coresFill,
                        borderColor: coresStroke,
                        borderWidth: 2
                      }]
                    }}
                    options={chartOptionsPie}
                  />
                </div>
                <div className="relatorio-chart-container relatorio-chart-bar">
                  <Bar
                    data={{
                      labels,
                      datasets: [{
                        label: 'Documentos',
                        data: values,
                        backgroundColor: coresFill,
                        borderColor: coresStroke,
                        borderWidth: 1
                      }]
                    }}
                    options={chartOptionsBar}
                  />
                </div>
              </div>
              <div className="relatorio-tabela-wrapper relatorio-tabela-compacta">
                <table className="relatorio-tabela">
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labels.map((cat) => (
                      <tr key={cat}>
                        <td>{cat}</td>
                        <td>{data.documentosPorCategoria[cat]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })()}

        {tem('documentosPorAssunto') && data.documentosPorAssunto && Object.keys(data.documentosPorAssunto).length > 0 && (() => {
          const labels = Object.keys(data.documentosPorAssunto);
          const values = Object.values(data.documentosPorAssunto);
          const { fill: coresFill, stroke: coresStroke } = getCoresPorTipo(labels.length);
          return (
            <section className="relatorio-secao relatorio-secao-docs-tipo">
              <h2 className="relatorio-secao-titulo">
                <TagsOutlined /> Documentos por Assunto
              </h2>
              <div className="relatorio-charts-row">
                <div className="relatorio-chart-container relatorio-chart-pie">
                  <Pie
                    data={{
                      labels,
                      datasets: [{
                        data: values,
                        backgroundColor: coresFill,
                        borderColor: coresStroke,
                        borderWidth: 2
                      }]
                    }}
                    options={chartOptionsPie}
                  />
                </div>
                <div className="relatorio-chart-container relatorio-chart-bar">
                  <Bar
                    data={{
                      labels,
                      datasets: [{
                        label: 'Documentos',
                        data: values,
                        backgroundColor: coresFill,
                        borderColor: coresStroke,
                        borderWidth: 1
                      }]
                    }}
                    options={chartOptionsBar}
                  />
                </div>
              </div>
              <div className="relatorio-tabela-wrapper relatorio-tabela-compacta">
                <table className="relatorio-tabela">
                  <thead>
                    <tr>
                      <th>Assunto</th>
                      <th>Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labels.map((assunto) => (
                      <tr key={assunto}>
                        <td>{assunto}</td>
                        <td>{data.documentosPorAssunto[assunto]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })()}

        {tem('historicoAcoes') && data.historicoAcoes && data.historicoAcoes.length > 0 && (() => {
          const ICONES_POR_TIPO = {
            criar_documento: <FileTextOutlined />,
            editar_documento: <EditOutlined />,
            publicar_documento: <CheckCircleOutlined />,
            revogar_documento: <StopOutlined />,
            criar_grupo: <TeamOutlined />,
            editar_grupo: <EditOutlined />,
            criar_assunto: <TagsOutlined />,
            editar_assunto: <EditOutlined />,
            criar_categoria: <FolderOutlined />,
            editar_categoria: <EditOutlined />,
            adicionar_colaborador: <UserAddOutlined />,
            remover_colaborador: <UserDeleteOutlined />
          };

          const formatarDataHora = (timestamp) => {
            const data = new Date(timestamp);
            return {
              data: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
              hora: data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            };
          };

          const getIniciais = (nome) => {
            if (!nome) return '?';
            const partes = nome.split(' ');
            if (partes.length >= 2) {
              return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
            }
            return nome.substring(0, 2).toUpperCase();
          };

          return (
            <section className="relatorio-secao">
              <h2 className="relatorio-secao-titulo">
                <HistoryOutlined /> Histórico de Ações
              </h2>
              <p className="relatorio-secao-meta">{data.historicoAcoes.length} ações registradas</p>
              <div className="relatorio-tabela-wrapper">
                <table className="relatorio-tabela">
                  <thead>
                    <tr>
                      <th>Usuário</th>
                      <th>Ação</th>
                      <th>Recurso</th>
                      <th>Data</th>
                      <th>Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.historicoAcoes.map((acao) => {
                      const { data: dataFormatada, hora } = formatarDataHora(acao.timestamp);
                      const icone = ICONES_POR_TIPO[acao.tipo] || <FileTextOutlined />;
                      return (
                        <tr key={acao.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 'bold'
                              }}>
                                {getIniciais(acao.nomeUsuario)}
                              </span>
                              {acao.nomeUsuario}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {icone}
                              {acao.descricao}
                            </div>
                          </td>
                          <td>{acao.recursoNome || '-'}</td>
                          <td>{dataFormatada}</td>
                          <td>{hora}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })()}
      </div>
    </div>
  );
}

export default RelatorioView;
