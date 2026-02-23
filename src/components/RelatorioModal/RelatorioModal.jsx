import { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import './RelatorioModal.css';

const OPCOES_RELATORIO = [
  { id: 'acessos', label: 'Quantidade de acessos', precisaPeriodo: true },
  { id: 'colaboradoresQtd', label: 'Quantidade de colaboradores ativos' },
  { id: 'colaboradoresLista', label: 'Lista dos colaboradores' },
  { id: 'categorias', label: 'Categorias' },
  { id: 'assuntos', label: 'Assuntos' },
  { id: 'grupos', label: 'Grupos' },
  { id: 'documentosQtd', label: 'Quantidade de documentos' },
  { id: 'documentosPorTipo', label: 'Documentos por tipo' },
  { id: 'documentosPorCategoria', label: 'Documentos por categoria' },
  { id: 'documentosPorAssunto', label: 'Documentos por assunto' },
  { id: 'historicoAcoes', label: 'Histórico de ações' }
];

const PERIODOS = [
  { id: 'semana', label: 'Semana' },
  { id: 'mes', label: 'Mês' },
  { id: 'semestre', label: 'Semestre' },
  { id: 'ano', label: 'Ano' }
];

function RelatorioModal({ isOpen, onClose, onGerar }) {
  const [opcoes, setOpcoes] = useState({});
  const [periodoAcessos, setPeriodoAcessos] = useState('semana');

  const toggleOpcao = (id) => {
    setOpcoes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGerar = () => {
    const selecionadas = OPCOES_RELATORIO.filter((o) => opcoes[o.id]).map((o) => ({
      ...o,
      periodo: o.precisaPeriodo ? periodoAcessos : null
    }));
    onGerar(selecionadas);
    onClose();
    setOpcoes({});
  };

  const temSelecao = Object.values(opcoes).some(Boolean);

  if (!isOpen) return null;

  return (
    <div className="relatorio-modal-overlay" onClick={onClose}>
      <div className="relatorio-modal" onClick={(e) => e.stopPropagation()}>
        <div className="relatorio-modal-header">
          <h2 className="relatorio-modal-title">Gerar Relatório</h2>
          <button type="button" className="relatorio-modal-close" onClick={onClose} aria-label="Fechar">
            <CloseOutlined />
          </button>
        </div>
        <div className="relatorio-modal-body">
          <p className="relatorio-modal-desc">Selecione as informações que deseja incluir no relatório:</p>
          <div className="relatorio-opcoes-list">
            {OPCOES_RELATORIO.map((op) => (
              <div key={op.id} className="relatorio-opcao-row">
                <label className="relatorio-opcao-label">
                  <input
                    type="checkbox"
                    checked={!!opcoes[op.id]}
                    onChange={() => toggleOpcao(op.id)}
                  />
                  <span>{op.label}</span>
                </label>
                {op.precisaPeriodo && opcoes[op.id] && (
                  <div className="relatorio-periodo-select">
                    <label>Período:</label>
                    <select
                      value={periodoAcessos}
                      onChange={(e) => setPeriodoAcessos(e.target.value)}
                    >
                      {PERIODOS.map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="relatorio-modal-footer">
          <button type="button" className="relatorio-btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="relatorio-btn-gerar"
            onClick={handleGerar}
            disabled={!temSelecao}
          >
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}

export default RelatorioModal;
