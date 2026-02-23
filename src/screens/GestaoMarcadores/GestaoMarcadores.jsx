import { useState, useEffect, useCallback } from 'react';
import {
  SearchOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
  TagsOutlined,
  FolderOutlined,
  PlusOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { tagsMock, categoriasMock } from '../../data/adminStats';
import './GestaoMarcadores.css';

function GestaoMarcadores() {
  const [activeTab, setActiveTab] = useState('assuntos');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [assuntosData, setAssuntosData] = useState(
    () => tagsMock.map((nome, idx) => ({ id: idx + 1, nome }))
  );
  const [categoriasData, setCategoriasData] = useState(
    () => categoriasMock.map((nome, idx) => ({ id: idx + 1, nome }))
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [feedback, setFeedback] = useState(null);
  const itemsPerPage = 10;

  const dataSource = activeTab === 'assuntos' ? assuntosData : categoriasData;

  const filteredData = dataSource.filter((item) =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const showFeedback = useCallback((type, message) => {
    setFeedback({ type, message });
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  }, [feedback]);

  const handleOpenCreateModal = () => {
    setNewNome('');
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewNome('');
  };

  const handleCreate = (e) => {
    e?.preventDefault?.();
    const nome = newNome.trim();
    const tipo = activeTab === 'assuntos' ? 'assunto' : 'categoria';
    const list = activeTab === 'assuntos' ? assuntosData : categoriasData;

    if (!nome) {
      showFeedback('error', 'Informe o nome para criar o marcador.');
      return;
    }
    const duplicado = list.some(
      (item) => item.nome.toLowerCase() === nome.toLowerCase()
    );
    if (duplicado) {
      showFeedback(
        'error',
        `Já existe um ${tipo} com o nome "${nome}".`
      );
      return;
    }

    const nextId = Math.max(0, ...list.map((i) => i.id)) + 1;
    const novo = { id: nextId, nome };

    if (activeTab === 'assuntos') {
      setAssuntosData((prev) => [...prev, novo]);
      showFeedback('success', `Novo assunto "${nome}" criado com sucesso.`);
    } else {
      setCategoriasData((prev) => [...prev, novo]);
      showFeedback('success', `Nova categoria "${nome}" criada com sucesso.`);
    }
    handleCloseCreateModal();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  const labelCount = activeTab === 'assuntos'
    ? `${filteredData.length} assunto${filteredData.length !== 1 ? 's' : ''} encontrado${filteredData.length !== 1 ? 's' : ''}`
    : `${filteredData.length} categoria${filteredData.length !== 1 ? 's' : ''} encontrada${filteredData.length !== 1 ? 's' : ''}`;

  return (
    <div className="gestao-marcadores-container">
      {feedback && (
        <div
          className={`gestao-marcadores-feedback gestao-marcadores-feedback-${feedback.type}`}
          role="alert"
        >
          {feedback.type === 'success' ? (
            <CheckCircleOutlined className="gestao-marcadores-feedback-icon" />
          ) : (
            <ExclamationCircleOutlined className="gestao-marcadores-feedback-icon" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <main className="gestao-marcadores-main">
        <div className="gestao-marcadores-content">
          {/* Page Title */}
          <div className="gestao-marcadores-page-header">
            <h1 className="gestao-marcadores-page-title">Marcadores</h1>
            <p className="gestao-marcadores-page-subtitle">Gerencie assuntos e categorias</p>
          </div>

          {/* Search and Pagination */}
          <div className="gestao-marcadores-search-section">
            <div className="gestao-marcadores-search-bar">
              <div className="gestao-marcadores-tabs">
                <button
                  type="button"
                  className={`gestao-marcadores-tab ${activeTab === 'assuntos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('assuntos')}
                >
                  <TagsOutlined className="gestao-marcadores-tab-icon" />
                  Assuntos
                </button>
                <button
                  type="button"
                  className={`gestao-marcadores-tab ${activeTab === 'categorias' ? 'active' : ''}`}
                  onClick={() => setActiveTab('categorias')}
                >
                  <FolderOutlined className="gestao-marcadores-tab-icon" />
                  Categorias
                </button>
              </div>
              <div className="gestao-marcadores-search">
                <div className="gestao-marcadores-search-wrapper">
                  <SearchOutlined className="gestao-marcadores-search-icon" />
                  <input
                    type="text"
                    className="gestao-marcadores-search-input"
                    placeholder={
                      activeTab === 'assuntos'
                        ? 'Buscar assunto...'
                        : 'Buscar categoria...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                className="gestao-marcadores-btn-create"
                onClick={handleOpenCreateModal}
              >
                <PlusOutlined />
                {activeTab === 'assuntos' ? 'Novo Assunto' : 'Nova Categoria'}
              </button>
            </div>
            <div className="gestao-marcadores-results-pagination-row">
              <span className="gestao-marcadores-results-count">{labelCount}</span>
              {totalPages > 1 && (
                <div className="gestao-marcadores-pagination">
                <button
                  type="button"
                  className="pagination-button"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  <LeftOutlined />
                </button>
                <div className="pagination-numbers">
                  {getPageNumbers().map((page, idx) =>
                    page === 'ellipsis' ? (
                      <span key={`e-${idx}`} className="pagination-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Página ${page}`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  className="pagination-button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Próxima página"
                >
                  <RightOutlined />
                </button>
                </div>
              )}
            </div>
          </div>
          <div className="gestao-marcadores-table-wrapper">
            <table className="gestao-marcadores-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{activeTab === 'assuntos' ? 'Nome do assunto' : 'Nome da categoria'}</th>
                  <th className="actions-column">Ações</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.length > 0 ? (
                  displayedData.map((item) => (
                    <tr key={`${activeTab}-${item.id}`}>
                      <td className="gestao-marcadores-id-cell">{item.id}</td>
                      <td className="gestao-marcadores-nome-cell">{item.nome}</td>
                      <td className="actions-cell">
                        <button
                          type="button"
                          className="edit-button"
                          title={activeTab === 'assuntos' ? 'Editar assunto' : 'Editar categoria'}
                        >
                          <EditOutlined />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="no-results">
                      {activeTab === 'assuntos'
                        ? 'Nenhum assunto encontrado'
                        : 'Nenhuma categoria encontrada'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="gestao-marcadores-pagination">
              <button
                type="button"
                className="pagination-button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                <LeftOutlined />
              </button>
              <div className="pagination-numbers">
                {getPageNumbers().map((page, idx) =>
                  page === 'ellipsis' ? (
                    <span key={`e2-${idx}`} className="pagination-ellipsis">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Página ${page}`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                type="button"
                className="pagination-button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
              >
                <RightOutlined />
              </button>
            </div>
          )}
        </div>
      </main>

      {isCreateModalOpen && (
        <div
          className="gestao-marcadores-overlay"
          onClick={handleCloseCreateModal}
        >
          <div
            className="gestao-marcadores-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gestao-marcadores-modal-header">
              <h2 className="gestao-marcadores-modal-title">
                {activeTab === 'assuntos' ? 'Novo Assunto' : 'Nova Categoria'}
              </h2>
              <button
                type="button"
                className="gestao-marcadores-modal-close"
                onClick={handleCloseCreateModal}
                aria-label="Fechar"
              >
                <CloseOutlined />
              </button>
            </div>
            <form
              className="gestao-marcadores-modal-body"
              onSubmit={handleCreate}
            >
              <label className="gestao-marcadores-label">
                {activeTab === 'assuntos' ? 'Nome do assunto' : 'Nome da categoria'}
                <input
                  type="text"
                  className="gestao-marcadores-input"
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  placeholder={
                    activeTab === 'assuntos'
                      ? 'Ex.: LGPD, Contratos, Licitações...'
                      : 'Ex.: Informativo Jurídico, Minuta...'
                  }
                  autoFocus
                />
              </label>
              <div className="gestao-marcadores-modal-actions">
                <button
                  type="button"
                  className="gestao-marcadores-btn-secondary"
                  onClick={handleCloseCreateModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="gestao-marcadores-btn-primary"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoMarcadores;
