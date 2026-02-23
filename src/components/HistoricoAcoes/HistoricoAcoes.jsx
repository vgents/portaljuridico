import { useState, useEffect } from 'react';
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
  PlusOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { getAcoes } from '../../db/acoesDb';
import './HistoricoAcoes.css';

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

function HistoricoAcoes({ onVerTelaCheia }) {
  const [acoes, setAcoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarAcoes();
  }, []);

  const carregarAcoes = async () => {
    try {
      setCarregando(true);
      const lista = await getAcoes(10);
      setAcoes(lista);
    } catch (err) {
      console.error('Erro ao carregar ações:', err);
    } finally {
      setCarregando(false);
    }
  };

  const formatarHora = (timestamp) => {
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
    if (diffDia < 7) return `${diffDia}d atrás`;
    
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const formatarHoraCompleta = (timestamp) => {
    const data = new Date(timestamp);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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
    <div className="historico-acoes">
      <div className="historico-acoes-header">
        <div className="historico-acoes-header-top">
          <div className="historico-acoes-titulo-wrapper">
            <HistoryOutlined className="historico-acoes-icon" />
            <h2 className="historico-acoes-titulo">Histórico de Ações</h2>
          </div>
        </div>
        {onVerTelaCheia && (
          <button
            type="button"
            className="historico-acoes-btn-ver-tudo"
            onClick={onVerTelaCheia}
          >
            Ver tudo <ArrowRightOutlined />
          </button>
        )}
      </div>

      <div className="historico-acoes-lista">
        {carregando ? (
          <div className="historico-acoes-loading">Carregando...</div>
        ) : acoes.length === 0 ? (
          <div className="historico-acoes-vazio">
            <p>Nenhuma ação registrada ainda.</p>
          </div>
        ) : (
          acoes.map((acao) => {
            const cor = CORES_POR_TIPO[acao.tipo] || '#666';
            const icone = ICONES_POR_TIPO[acao.tipo] || <FileTextOutlined />;
            
            return (
              <div key={acao.id} className="historico-acoes-item">
                <div className="historico-acoes-item-avatar" style={{ backgroundColor: `${cor}20`, color: cor }}>
                  {getIniciais(acao.nomeUsuario)}
                </div>
                <div className="historico-acoes-item-conteudo">
                  <div className="historico-acoes-item-topo">
                    <span className="historico-acoes-item-usuario">{acao.nomeUsuario}</span>
                    <span className="historico-acoes-item-hora">{formatarHoraCompleta(acao.timestamp)}</span>
                  </div>
                  <div className="historico-acoes-item-descricao">
                    <span className="historico-acoes-item-icone" style={{ color: cor }}>
                      {icone}
                    </span>
                    <span>{acao.descricao}</span>
                  </div>
                  {acao.recursoNome && (
                    <div className="historico-acoes-item-recurso">
                      {acao.recursoNome}
                    </div>
                  )}
                  <div className="historico-acoes-item-tempo">
                    {formatarHora(acao.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default HistoricoAcoes;
