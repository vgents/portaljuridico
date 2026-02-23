import { useState, useEffect } from 'react';
import {
  SearchOutlined,
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
  CloseOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  LockOutlined
} from '@ant-design/icons';
import { gruposMock } from '../../data/grupos';
import { colaboradoresMock } from '../../data/colaboradores';
import './GestaoGrupos.css';

function formatarData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

const PERMISSOES_OPCOES = [
  { id: 'criarGrupo', label: 'Criar grupo' },
  { id: 'editarGrupo', label: 'Editar grupo' },
  { id: 'excluirGrupo', label: 'Excluir grupo' },
  { id: 'criarDocumento', label: 'Criar documento' },
  { id: 'criarAssunto', label: 'Criar assunto' },
  { id: 'criarCategoria', label: 'Criar categoria' },
  { id: 'removerPessoasGrupo', label: 'Remover pessoas de grupo' }
];

function GestaoGrupos() {
  const [grupos, setGrupos] = useState([...gruposMock]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordAction, setPasswordAction] = useState(null);
  const [memberToAdd, setMemberToAdd] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [newGroupPermissoes, setNewGroupPermissoes] = useState([]);
  const itemsPerPage = 5;

  const filteredGrupos = grupos.filter((g) =>
    g.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredGrupos.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedGrupos = filteredGrupos.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const openGroupDetail = (grupo) => {
    setSelectedGroup({ ...grupo });
    setIsDetailOpen(true);
  };

  const closeGroupDetail = () => {
    setSelectedGroup(null);
    setIsDetailOpen(false);
    setMemberSearchTerm('');
  };

  const getMembrosDoGrupo = () => {
    if (!selectedGroup) return [];
    return (selectedGroup.membros || [])
      .map((id) => colaboradoresMock.find((c) => c.id === id))
      .filter(Boolean);
  };

  const colaboradoresForaDoGrupo = () => {
    const idsNoGrupo = new Set(selectedGroup?.membros || []);
    return colaboradoresMock.filter((c) => !idsNoGrupo.has(c.id));
  };

  const colaboradoresEncontrados = () => {
    if (!selectedGroup || memberSearchTerm.trim().length < 4) return [];
    const idsNoGrupo = new Set(selectedGroup.membros || []);
    const termo = memberSearchTerm.trim().toLowerCase();
    return colaboradoresMock.filter(
      (c) =>
        !idsNoGrupo.has(c.id) &&
        (c.nome.toLowerCase().includes(termo) || (c.email && c.email.toLowerCase().includes(termo)))
    );
  };

  const requestPassword = (action, extra = null) => {
    setPasswordAction(action);
    setPasswordValue('');
    if (action === 'add') setMemberToAdd(extra);
    if (action === 'remove') setMemberToRemove(extra);
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordValue('');
    setPasswordAction(null);
    setMemberToAdd(null);
    setMemberToRemove(null);
  };

  const confirmWithPassword = () => {
    if (!passwordValue.trim()) return;
    if (passwordAction === 'create') {
      const novo = {
        id: Math.max(...grupos.map((g) => g.id), 0) + 1,
        nome: newGroupName.trim(),
        dataCriacao: new Date().toISOString().slice(0, 10),
        membros: [],
        permissoes: [...newGroupPermissoes]
      };
      setGrupos((prev) => [...prev, novo]);
      setNewGroupName('');
      setNewGroupPermissoes([]);
      setIsCreateModalOpen(false);
    }
    if (passwordAction === 'add' && selectedGroup && memberToAdd != null) {
      setGrupos((prev) =>
        prev.map((g) =>
          g.id === selectedGroup.id
            ? { ...g, membros: [...(g.membros || []), memberToAdd] }
            : g
        )
      );
      setSelectedGroup((g) =>
        g ? { ...g, membros: [...(g.membros || []), memberToAdd] } : g
      );
      setMemberToAdd(null);
    }
    if (passwordAction === 'remove' && selectedGroup && memberToRemove != null) {
      setGrupos((prev) =>
        prev.map((g) =>
          g.id === selectedGroup.id
            ? { ...g, membros: (g.membros || []).filter((id) => id !== memberToRemove) }
            : g
        )
      );
      setSelectedGroup((g) =>
        g ? { ...g, membros: (g.membros || []).filter((id) => id !== memberToRemove) } : g
      );
      setMemberToRemove(null);
    }
    closePasswordModal();
  };

  const handleCreateGroup = () => {
    setNewGroupName('');
    setNewGroupPermissoes([]);
    setIsCreateModalOpen(true);
  };

  const togglePermissao = (id) => {
    setNewGroupPermissoes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const submitCreateGroup = () => {
    if (!newGroupName.trim()) return;
    requestPassword('create');
  };

  const handleAddMember = (colaboradorId) => {
    setMemberToAdd(colaboradorId);
    requestPassword('add', colaboradorId);
  };

  const handleRemoveMember = (colaboradorId) => {
    requestPassword('remove', colaboradorId);
  };

  const membros = getMembrosDoGrupo();
  const encontrados = colaboradoresEncontrados();

  return (
    <div className="gestao-grupos-container">
      <main className="gestao-grupos-main">
        <div className="gestao-grupos-content">
          {/* Page Title */}
          <div className="gestao-grupos-page-header">
            <h1 className="gestao-grupos-page-title">Grupos</h1>
            <p className="gestao-grupos-page-subtitle">Gerencie grupos de trabalho e permissões</p>
          </div>

          {/* Search and Pagination */}
          <div className="gestao-grupos-search-section">
            <div className="gestao-grupos-search-bar">
              <div className="gestao-grupos-search">
                <div className="gestao-grupos-search-wrapper">
                  <SearchOutlined className="gestao-grupos-search-icon" />
                  <input
                    type="text"
                    className="gestao-grupos-search-input"
                    placeholder="Buscar por nome do grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button type="button" className="gestao-grupos-btn-create" onClick={handleCreateGroup}>
                <PlusOutlined /> Criar novo grupo
              </button>
            </div>
            <div className="gestao-grupos-results-pagination-row">
              <span className="gestao-grupos-results-count">
                {filteredGrupos.length} grupo{filteredGrupos.length !== 1 ? 's' : ''} encontrado{filteredGrupos.length !== 1 ? 's' : ''}
              </span>
              {totalPages > 1 && (
                <div className="gestao-grupos-pagination">
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
          <div className="gestao-grupos-cards">
            {displayedGrupos.map((grupo) => (
              <button
                type="button"
                key={grupo.id}
                className="gestao-grupos-card"
                onClick={() => openGroupDetail(grupo)}
              >
                <TeamOutlined className="gestao-grupos-card-icon" />
                <h3 className="gestao-grupos-card-title">{grupo.nome}</h3>
                <p className="gestao-grupos-card-date">
                  Criado em {formatarData(grupo.dataCriacao)}
                </p>
                <span className="gestao-grupos-card-meta">
                  {(grupo.membros || []).length} membro{(grupo.membros || []).length !== 1 ? 's' : ''}
                </span>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="gestao-grupos-pagination">
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

      {/* Modal: Detalhe do grupo (membros, adicionar, remover) */}
      {isDetailOpen && selectedGroup && (
        <div className="gestao-grupos-overlay" onClick={closeGroupDetail}>
          <div
            className="gestao-grupos-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gestao-grupos-detail-header">
              <h2 className="gestao-grupos-detail-title">{selectedGroup.nome}</h2>
              <button
                type="button"
                className="gestao-grupos-detail-close"
                onClick={closeGroupDetail}
                aria-label="Fechar"
              >
                <CloseOutlined />
              </button>
            </div>
            <div className="gestao-grupos-detail-body">
              <div className="gestao-grupos-detail-section">
                <h3 className="gestao-grupos-detail-section-title">Membros do grupo</h3>
                <div className="gestao-grupos-member-search-wrapper">
                  <SearchOutlined className="gestao-grupos-member-search-icon" />
                  <input
                    type="text"
                    className="gestao-grupos-member-search-input"
                    placeholder="Buscar por nome ou e-mail (mín. 4 caracteres)"
                    value={memberSearchTerm}
                    onChange={(e) => setMemberSearchTerm(e.target.value)}
                  />
                </div>
                {memberSearchTerm.trim().length >= 4 && (
                  <div className="gestao-grupos-add-list">
                    {encontrados.length === 0 ? (
                      <p className="gestao-grupos-search-empty">
                        Nenhum usuário encontrado com &quot;{memberSearchTerm.trim()}&quot;
                      </p>
                    ) : (
                      <>
                        <p className="gestao-grupos-add-list-label">
                          {encontrados.length} usuário{encontrados.length !== 1 ? 's' : ''} encontrado
                          {encontrados.length !== 1 ? 's' : ''}
                        </p>
                        {encontrados.map((c) => (
                          <div key={c.id} className="gestao-grupos-add-row">
                            <span>{c.nome}</span>
                            <span className="gestao-grupos-add-email">{c.email}</span>
                            <button
                              type="button"
                              className="gestao-grupos-btn-add-one"
                              onClick={() => handleAddMember(c.id)}
                            >
                              <UserAddOutlined /> Adicionar
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
                <ul className="gestao-grupos-members-list">
                  {membros.length === 0 ? (
                    <li className="gestao-grupos-members-empty">
                      Nenhum membro no grupo. Use a busca acima para adicionar colaboradores.
                    </li>
                  ) : (
                    membros.map((m) => (
                      <li key={m.id} className="gestao-grupos-member-item">
                        <div>
                          <span className="gestao-grupos-member-nome">{m.nome}</span>
                          <span className="gestao-grupos-member-email">{m.email}</span>
                        </div>
                        <button
                          type="button"
                          className="gestao-grupos-btn-remove"
                          onClick={() => handleRemoveMember(m.id)}
                          title="Remover do grupo"
                        >
                          <UserDeleteOutlined /> Remover
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Criar novo grupo */}
      {isCreateModalOpen && (
        <div className="gestao-grupos-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className="gestao-grupos-create-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gestao-grupos-detail-header">
              <h2 className="gestao-grupos-detail-title">Criar novo grupo</h2>
              <button
                type="button"
                className="gestao-grupos-detail-close"
                onClick={() => setIsCreateModalOpen(false)}
                aria-label="Fechar"
              >
                <CloseOutlined />
              </button>
            </div>
            <div className="gestao-grupos-detail-body">
              <label className="gestao-grupos-label">
                Nome do grupo
                <input
                  type="text"
                  className="gestao-grupos-input"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ex.: Área Contratos, Comissão Jurídica..."
                />
              </label>
              <div className="gestao-grupos-permissoes-section">
                <span className="gestao-grupos-permissoes-title">Níveis de permissão do grupo</span>
                <p className="gestao-grupos-permissoes-hint">
                  Selecione as permissões que este grupo terá no sistema.
                </p>
                <div className="gestao-grupos-permissoes-grid">
                  {PERMISSOES_OPCOES.map((perm) => (
                    <label key={perm.id} className="gestao-grupos-permissao-check">
                      <input
                        type="checkbox"
                        checked={newGroupPermissoes.includes(perm.id)}
                        onChange={() => togglePermissao(perm.id)}
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="gestao-grupos-create-hint">
                Ao confirmar, será solicitada sua senha para autorizar a criação do grupo.
              </p>
              <div className="gestao-grupos-modal-actions">
                <button
                  type="button"
                  className="gestao-grupos-btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="gestao-grupos-btn-primary"
                  onClick={submitCreateGroup}
                  disabled={!newGroupName.trim()}
                >
                  Criar grupo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmação por senha */}
      {isPasswordModalOpen && (
        <div className="gestao-grupos-overlay gestao-grupos-overlay-password" onClick={closePasswordModal}>
          <div
            className="gestao-grupos-password-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gestao-grupos-password-header">
              <LockOutlined className="gestao-grupos-password-icon" />
              <h3>Confirmação de segurança</h3>
              <p>
                {passwordAction === 'create' &&
                  'Digite sua senha para confirmar a criação do grupo.'}
                {passwordAction === 'add' && 'Digite sua senha para confirmar a adição do membro.'}
                {passwordAction === 'remove' &&
                  'Digite sua senha para confirmar a remoção do membro.'}
              </p>
            </div>
            <label className="gestao-grupos-label">
              Senha
              <input
                type="password"
                className="gestao-grupos-input"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="Sua senha"
                autoFocus
              />
            </label>
            <div className="gestao-grupos-modal-actions">
              <button
                type="button"
                className="gestao-grupos-btn-secondary"
                onClick={closePasswordModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="gestao-grupos-btn-primary"
                onClick={confirmWithPassword}
                disabled={!passwordValue.trim()}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoGrupos;
