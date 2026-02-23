import { useState, useEffect, useMemo } from 'react';
import {
  HistoryOutlined,
  FileTextOutlined,
  TeamOutlined,
  TagsOutlined,
  FolderOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { getAcoes } from '../../db/acoesDb';
import { colaboradoresMock } from '../../data/colaboradores';
import { categoriasMock } from '../../data/adminStats';
import { tagsMock } from '../../data/adminStats';
import './HistoricoAcoesFull.css';

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

const CORES_POR_TIPO = {
  criar_documento: '#4caf50',
  editar_documento: '#2196f3',
  publicar_documento: '#4caf50',
  revogar_documento: '#f44336',
  criar_grupo: '#9c27b0',
  editar_grupo: '#2196f3',
  criar_assunto: '#ff9800',
  editar_assunto: '#2196f3',
  criar_categoria: '#00bcd4',
  editar_categoria: '#2196f3',
  adicionar_colaborador: '#4caf50',
  remover_colaborador: '#f44336'
};

const LABELS_TIPOS_ACAO = {
  criar_documento: 'Criar Documento',
  editar_documento: 'Editar Documento',
  publicar_documento: 'Publicar Documento',
  revogar_documento: 'Revogar Documento',
  criar_grupo: 'Criar Grupo',
  editar_grupo: 'Editar Grupo',
  criar_assunto: 'Criar Assunto',
  editar_assunto: 'Editar Assunto',
  criar_categoria: 'Criar Categoria',
  editar_categoria: 'Editar Categoria',
  adicionar_colaborador: 'Adicionar Colaborador',
  remover_colaborador: 'Remover Colaborador'
};

function HistoricoAcoesFull({ onVoltar }) {
  const [acoes, setAcoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState({
    nome: '',
    dataInicio: '',
    dataFim: '',
    tipoAcao: '',
    departamento: '',
    assunto: '',
    categoria: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    carregarAcoes();
  }, []);

  const carregarAcoes = async () => {
    try {
      setCarregando(true);
      const lista = await getAcoes(100);
      setAcoes(lista);
    } catch (err) {
      console.error('Erro ao carregar ações:', err);
    } finally {
      setCarregando(false);
    }
  };

  const formatarDataHora = (timestamp) => {
    const data = new Date(timestamp);
    return {
      data: data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      hora: data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const formatarHoraRelativa = (timestamp) => {
    const data = new Date(timestamp);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHora = Math.floor(diffMs / 3600000);
    const diffDia = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Agora';
    if (diffMin < 60) return `${diffMin}min atrás`;
    if (diffHora < 24) return `${diffHora}h atrás`;
    if (diffDia === 1) return 'Ontem';
    if (diffDia < 7) return `${diffDia} dias atrás`;
    
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getIniciais = (nome) => {
    if (!nome) return '?';
    const partes = nome.split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  const colaboradoresPorId = useMemo(() => {
    const mapa = {};
    colaboradoresMock.forEach((colab) => {
      mapa[colab.id] = colab;
    });
    return mapa;
  }, []);

  const departamentosUnicos = useMemo(() => {
    const depts = new Set();
    colaboradoresMock.forEach((colab) => depts.add(colab.setor));
    return Array.from(depts).sort();
  }, []);

  const acoesFiltradas = useMemo(() => {
    return acoes.filter((acao) => {
      const colaborador = colaboradoresPorId[acao.userId];
      
      // Filtro por nome
      if (filtros.nome && !acao.nomeUsuario.toLowerCase().includes(filtros.nome.toLowerCase())) {
        return false;
      }

      // Filtro por data
      if (filtros.dataInicio || filtros.dataFim) {
        const dataAcao = new Date(acao.timestamp);
        dataAcao.setHours(0, 0, 0, 0);
        
        if (filtros.dataInicio) {
          const dataInicio = new Date(filtros.dataInicio);
          dataInicio.setHours(0, 0, 0, 0);
          if (dataAcao < dataInicio) return false;
        }
        
        if (filtros.dataFim) {
          const dataFim = new Date(filtros.dataFim);
          dataFim.setHours(23, 59, 59, 999);
          if (dataAcao > dataFim) return false;
        }
      }

      // Filtro por tipo de ação
      if (filtros.tipoAcao && acao.tipo !== filtros.tipoAcao) {
        return false;
      }

      // Filtro por departamento
      if (filtros.departamento && (!colaborador || colaborador.setor !== filtros.departamento)) {
        return false;
      }

      // Filtro por assunto (verifica se o recursoNome contém o assunto)
      if (filtros.assunto && (!acao.recursoNome || !acao.recursoNome.toLowerCase().includes(filtros.assunto.toLowerCase()))) {
        return false;
      }

      // Filtro por categoria (verifica se o recursoNome contém a categoria)
      if (filtros.categoria && (!acao.recursoNome || !acao.recursoNome.toLowerCase().includes(filtros.categoria.toLowerCase()))) {
        return false;
      }

      return true;
    });
  }, [acoes, filtros, colaboradoresPorId]);

  const agruparPorData = (acoes) => {
    const grupos = {};
    acoes.forEach((acao) => {
      const data = new Date(acao.timestamp);
      const chave = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!grupos[chave]) {
        grupos[chave] = [];
      }
      grupos[chave].push(acao);
    });
    return grupos;
  };

  const grupos = agruparPorData(acoesFiltradas);
  const datasOrdenadas = Object.keys(grupos).sort((a, b) => {
    return new Date(b.split(' ').reverse().join('-')) - new Date(a.split(' ').reverse().join('-'));
  });

  const limparFiltros = () => {
    setFiltros({
      nome: '',
      dataInicio: '',
      dataFim: '',
      tipoAcao: '',
      departamento: '',
      assunto: '',
      categoria: ''
    });
  };

  const temFiltrosAtivos = Object.values(filtros).some((valor) => valor !== '');

  return (
    <div className="historico-acoes-full">
      <div className="historico-acoes-full-header">
        <button
          type="button"
          className="historico-acoes-full-btn-voltar"
          onClick={onVoltar}
        >
          <ArrowLeftOutlined /> Voltar
        </button>
        <div className="historico-acoes-full-titulo-wrapper">
          <HistoryOutlined className="historico-acoes-full-icon" />
          <div>
            <h1 className="historico-acoes-full-titulo">Histórico de Ações</h1>
            <p className="historico-acoes-full-subtitulo">Registro completo de todas as ações realizadas no sistema</p>
          </div>
        </div>
      </div>

      <div className="historico-acoes-full-filtros-section">
        <div className="historico-acoes-full-filtros-header">
          <button
            type="button"
            className={`historico-acoes-full-btn-filtros ${mostrarFiltros ? 'active' : ''}`}
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <FilterOutlined /> Filtros {temFiltrosAtivos && <span className="filtros-badge">{Object.values(filtros).filter(v => v !== '').length}</span>}
          </button>
          {temFiltrosAtivos && (
            <button
              type="button"
              className="historico-acoes-full-btn-limpar"
              onClick={limparFiltros}
            >
              <ClearOutlined /> Limpar Filtros
            </button>
          )}
        </div>

        {mostrarFiltros && (
          <div className="historico-acoes-full-filtros">
            <div className="historico-acoes-full-filtro-grupo">
              <label className="historico-acoes-full-filtro-label">
                <SearchOutlined /> Nome do Usuário
              </label>
              <input
                type="text"
                className="historico-acoes-full-filtro-input"
                placeholder="Buscar por nome..."
                value={filtros.nome}
                onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })}
              />
            </div>

            <div className="historico-acoes-full-filtro-grupo">
              <label className="historico-acoes-full-filtro-label">
                <CalendarOutlined /> Data Início
              </label>
              <input
                type="date"
                className="historico-acoes-full-filtro-input"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              />
            </div>

            <div className="historico-acoes-full-filtro-grupo">
              <label className="historico-acoes-full-filtro-label">
                <CalendarOutlined /> Data Fim
              </label>
              <input
                type="date"
                className="historico-acoes-full-filtro-input"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              />
            </div>

            <div className="historico-acoes-full-filtro-grupo">
              <label className="historico-acoes-full-filtro-label">
                <FileTextOutlined /> Tipo de Ação
              </label>
              <select
                className="historico-acoes-full-filtro-select"
                value={filtros.tipoAcao}
                onChange={(e) => setFiltros({ ...filtros, tipoAcao: e.target.value })}
              >
                <option value="">Todos os tipos</option>
                {Object.entries(LABELS_TIPOS_ACAO).map(([valor, label]) => (
                  <option key={valor} value={valor}>{label}</option>
                ))}
              </select>
            </div>

            <div className="historico-acoes-full-filtro-grupo">
              <label className="historico-acoes-full-filtro-label">
                <TeamOutlined /> Departamento
              </label>
              <select
                className="historico-acoes-full-filtro-select"
                value={filtros.departamento}
                onChange={(e) => setFiltros({ ...filtros, departamento: e.target.value })}
              >
                <option value="">Todos os departamentos</option>
                {departamentosUnicos.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="historico-acoes-full-filtro-grupo">
              <label className="historico-acoes-full-filtro-label">
                <TagsOutlined /> Assunto
              </label>
              <select
                className="historico-acoes-full-filtro-select"
                value={filtros.assunto}
                onChange={(e) => setFiltros({ ...filtros, assunto: e.target.value })}
              >
                <option value="">Todos os assuntos</option>
                {tagsMock.map((assunto) => (
                  <option key={assunto} value={assunto}>{assunto}</option>
                ))}
              </select>
            </div>

            <div className="historico-acoes-full-filtro-grupo">
              <label className="historico-acoes-full-filtro-label">
                <FolderOutlined /> Categoria
              </label>
              <select
                className="historico-acoes-full-filtro-select"
                value={filtros.categoria}
                onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
              >
                <option value="">Todas as categorias</option>
                {categoriasMock.map((categoria) => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="historico-acoes-full-conteudo">
        {carregando ? (
          <div className="historico-acoes-full-loading">Carregando histórico...</div>
        ) : acoesFiltradas.length === 0 ? (
          <div className="historico-acoes-full-vazio">
            <HistoryOutlined style={{ fontSize: '48px', color: 'var(--color-gray-medium)', marginBottom: 'var(--spacing-md)' }} />
            <p>{acoes.length === 0 ? 'Nenhuma ação registrada ainda.' : 'Nenhuma ação encontrada com os filtros aplicados.'}</p>
            {temFiltrosAtivos && (
              <button
                type="button"
                className="historico-acoes-full-btn-limpar-resultado"
                onClick={limparFiltros}
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          datasOrdenadas.map((data) => (
            <div key={data} className="historico-acoes-full-grupo">
              <h2 className="historico-acoes-full-data-titulo">{data}</h2>
              <div className="historico-acoes-full-lista">
                {grupos[data].map((acao) => {
                  const cor = CORES_POR_TIPO[acao.tipo] || '#666';
                  const icone = ICONES_POR_TIPO[acao.tipo] || <FileTextOutlined />;
                  const { data: dataFormatada, hora } = formatarDataHora(acao.timestamp);
                  
                  return (
                    <div key={acao.id} className="historico-acoes-full-item">
                      <div className="historico-acoes-full-item-avatar" style={{ backgroundColor: `${cor}20`, color: cor }}>
                        {getIniciais(acao.nomeUsuario)}
                      </div>
                      <div className="historico-acoes-full-item-conteudo">
                        <div className="historico-acoes-full-item-topo">
                          <span className="historico-acoes-full-item-usuario">{acao.nomeUsuario}</span>
                          <div className="historico-acoes-full-item-meta">
                            <span className="historico-acoes-full-item-hora">{hora}</span>
                            <span className="historico-acoes-full-item-tempo">{formatarHoraRelativa(acao.timestamp)}</span>
                          </div>
                        </div>
                        <div className="historico-acoes-full-item-descricao">
                          <span className="historico-acoes-full-item-icone" style={{ color: cor }}>
                            {icone}
                          </span>
                          <span>{acao.descricao}</span>
                        </div>
                        {acao.recursoNome && (
                          <div className="historico-acoes-full-item-recurso">
                            {acao.recursoNome}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistoricoAcoesFull;
