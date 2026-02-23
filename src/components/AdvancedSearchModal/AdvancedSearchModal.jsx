import { useState, useEffect } from 'react';
import { CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import './AdvancedSearchModal.css';

const TIPOS_DOCUMENTO = [
  'Todos os tipos',
  'Minuta',
  'Informativo Jurídico',
  'Decisão',
  'Contratos',
  'Licitações',
  'Parcerias'
];

const CATEGORIAS = [
  'Todas as categorias',
  'Minuta',
  'Informativo Jurídico',
  'Decisão',
  'Diretoria',
  'Trabalhista',
  'Contratos',
  'Compras',
  'LGPD',
  'Imóveis',
  'Recursos Humanos',
  'Licitações',
  'Parcerias'
];

function AdvancedSearchModal({ isOpen, onClose, onApply, initialFilters = null, isAdmin = false }) {
  const [filters, setFilters] = useState({
    tipo: (initialFilters && initialFilters.tipo) || 'Todos os tipos',
    categoria: (initialFilters && initialFilters.categoria) || 'Todas as categorias',
    numeroDocumento: (initialFilters && initialFilters.numeroDocumento) || '',
    status: (initialFilters && initialFilters.status) || null, // null, 'Vigente', 'Revogado'
    dataInicio: (initialFilters && initialFilters.dataInicio) || '',
    dataFim: (initialFilters && initialFilters.dataFim) || ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialFilters && typeof initialFilters === 'object') {
        setFilters({
          tipo: initialFilters.tipo || 'Todos os tipos',
          categoria: initialFilters.categoria || 'Todas as categorias',
          numeroDocumento: initialFilters.numeroDocumento || '',
          status: isAdmin ? (initialFilters.status || null) : null, // Só permite status se for admin
          dataInicio: initialFilters.dataInicio || '',
          dataFim: initialFilters.dataFim || ''
        });
      } else {
        // Resetar para valores padrão se initialFilters não existir ou for inválido
        setFilters({
          tipo: 'Todos os tipos',
          categoria: 'Todas as categorias',
          numeroDocumento: '',
          status: null,
          dataInicio: '',
          dataFim: ''
        });
      }
    }
  }, [isOpen, initialFilters, isAdmin]);

  const handleTipoChange = (e) => {
    setFilters({ ...filters, tipo: e.target.value });
  };

  const handleCategoriaChange = (e) => {
    setFilters({ ...filters, categoria: e.target.value });
  };

  const handleNumeroChange = (e) => {
    setFilters({ ...filters, numeroDocumento: e.target.value });
  };

  const handleStatusChange = (status) => {
    setFilters({ ...filters, status: filters.status === status ? null : status });
  };

  const handleDataInicioChange = (e) => {
    setFilters({ ...filters, dataInicio: e.target.value });
  };

  const handleDataFimChange = (e) => {
    setFilters({ ...filters, dataFim: e.target.value });
  };

  const handleQuickDateRange = (range) => {
    const hoje = new Date();
    let inicio, fim;
    
    if (range === '30dias') {
      inicio = new Date(hoje);
      inicio.setDate(inicio.getDate() - 30);
      fim = hoje;
    } else if (range === 'esteAno') {
      inicio = new Date(hoje.getFullYear(), 0, 1);
      fim = hoje;
    }
    
    setFilters({
      ...filters,
      dataInicio: inicio ? inicio.toISOString().slice(0, 10) : '',
      dataFim: fim ? fim.toISOString().slice(0, 10) : ''
    });
  };

  const handleClear = () => {
    setFilters({
      tipo: 'Todos os tipos',
      categoria: 'Todas as categorias',
      numeroDocumento: '',
      status: null,
      dataInicio: '',
      dataFim: ''
    });
  };

  const handleApply = () => {
    onApply(filters);
  };

  const countActiveFilters = () => {
    let count = 0;
    if (filters.tipo && filters.tipo !== 'Todos os tipos') count++;
    if (filters.categoria && filters.categoria !== 'Todas as categorias') count++;
    if (filters.numeroDocumento.trim()) count++;
    if (filters.status) count++;
    if (filters.dataInicio || filters.dataFim) count++;
    return count;
  };

  const activeFiltersCount = countActiveFilters();

  if (!isOpen) return null;

  return (
    <div className="advanced-search-overlay" onClick={onClose}>
      <div className="advanced-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="advanced-search-header">
          <div className="advanced-search-header-left">
            <h2 className="advanced-search-title">Busca Avançada</h2>
            {activeFiltersCount > 0 && (
              <span className="advanced-search-badge">{activeFiltersCount} ativo{activeFiltersCount !== 1 ? 's' : ''}</span>
            )}
          </div>
          <button type="button" className="advanced-search-close" onClick={onClose} aria-label="Fechar">
            <CloseOutlined />
          </button>
        </div>

        <div className="advanced-search-body">
          <div className="advanced-search-field">
            <label className="advanced-search-label">TIPO DE DOCUMENTO</label>
            <div className="advanced-search-select-wrapper">
              <select
                className="advanced-search-select"
                value={filters.tipo}
                onChange={handleTipoChange}
              >
                {TIPOS_DOCUMENTO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="advanced-search-field">
            <label className="advanced-search-label">CATEGORIA / TEMA</label>
            <div className="advanced-search-select-wrapper">
              <select
                className="advanced-search-select"
                value={filters.categoria}
                onChange={handleCategoriaChange}
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="advanced-search-field">
            <label className="advanced-search-label">NÚMERO DO DOCUMENTO</label>
            <input
              type="text"
              className="advanced-search-input"
              placeholder="Ex: IJ-018/2026"
              value={filters.numeroDocumento}
              onChange={handleNumeroChange}
            />
          </div>

          {isAdmin && (
            <div className="advanced-search-field">
              <label className="advanced-search-label">STATUS</label>
              <div className="advanced-search-status-buttons">
                <button
                  type="button"
                  className={`advanced-search-status-btn ${filters.status === 'Vigente' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('Vigente')}
                >
                  Vigente
                </button>
                <button
                  type="button"
                  className={`advanced-search-status-btn ${filters.status === 'Revogado' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('Revogado')}
                >
                  Revogado
                </button>
              </div>
            </div>
          )}

          <div className="advanced-search-field">
            <label className="advanced-search-label">PERÍODO DE PUBLICAÇÃO</label>
            <div className="advanced-search-date-range">
              <div className="advanced-search-date-input-wrapper">
                <input
                  type="date"
                  className="advanced-search-date-input"
                  value={filters.dataInicio}
                  onChange={handleDataInicioChange}
                  placeholder="dd/mm/aaaa"
                />
                <CalendarOutlined className="advanced-search-date-icon" />
              </div>
              <span className="advanced-search-date-separator">até</span>
              <div className="advanced-search-date-input-wrapper">
                <input
                  type="date"
                  className="advanced-search-date-input"
                  value={filters.dataFim}
                  onChange={handleDataFimChange}
                  placeholder="dd/mm/aaaa"
                />
                <CalendarOutlined className="advanced-search-date-icon" />
              </div>
            </div>
            <div className="advanced-search-quick-dates">
              <button
                type="button"
                className="advanced-search-quick-date-btn"
                onClick={() => handleQuickDateRange('30dias')}
              >
                ÚLTIMOS 30 DIAS
              </button>
              <button
                type="button"
                className="advanced-search-quick-date-btn"
                onClick={() => handleQuickDateRange('esteAno')}
              >
                ESTE ANO
              </button>
            </div>
          </div>
        </div>

        <div className="advanced-search-footer">
          <button type="button" className="advanced-search-clear" onClick={handleClear}>
            Limpar filtros
          </button>
          <button type="button" className="advanced-search-apply" onClick={handleApply}>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdvancedSearchModal;
