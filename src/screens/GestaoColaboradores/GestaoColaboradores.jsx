import { useState, useEffect } from 'react';
import {
  SearchOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  SaveOutlined,
  FileTextOutlined,
  CameraOutlined
} from '@ant-design/icons';
import { colaboradoresMock } from '../../data/colaboradores';
import { gruposMock } from '../../data/grupos';
import './GestaoColaboradores.css';

// IDs de pessoas que pertencem a pelo menos um grupo (colaboradores do site)
function idsEmAlgumGrupo(grupos) {
  const ids = new Set();
  (grupos || []).forEach((g) => (g.membros || []).forEach((id) => ids.add(id)));
  return ids;
}

function GestaoColaboradores() {
  const [colaboradores, setColaboradores] = useState([...colaboradoresMock]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    setor: '',
    funcao: '',
    papel: '',
    email: '',
    foto: null
  });
  const [activeTab, setActiveTab] = useState('dados');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const itemsPerPage = 10;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Só exibir colaboradores do site: pessoas que estão em pelo menos um grupo
  const idsColaboradoresSite = idsEmAlgumGrupo(gruposMock);
  const colaboradoresDoSite = colaboradores.filter((c) => idsColaboradoresSite.has(c.id));

  // Filtrar colaboradores baseado na pesquisa (sobre a lista já restrita a quem está em algum grupo)
  const filteredColaboradores = colaboradoresDoSite.filter(colaborador =>
    colaborador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colaborador.setor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colaborador.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colaborador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colaborador.papel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular paginação
  const totalPages = Math.ceil(filteredColaboradores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedColaboradores = filteredColaboradores.slice(startIndex, endIndex);

  // Resetar página quando a pesquisa mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Detectar mudanças no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevenir scroll do body quando modal mobile está aberto
  useEffect(() => {
    if (isModalOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen, isMobile]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Gerar array de números de página para exibir
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleEdit = (colaborador) => {
    setEditingColaborador(colaborador);
    setFormData({
      nome: colaborador.nome,
      setor: colaborador.setor,
      funcao: colaborador.funcao,
      papel: colaborador.papel,
      email: colaborador.email,
      foto: colaborador.foto ?? null
    });
    setActiveTab('dados');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingColaborador(null);
    setFormData({
      nome: '',
      setor: '',
      funcao: '',
      papel: '',
      email: '',
      foto: null
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!editingColaborador) return;

    // Atualizar o colaborador no array
    const updatedColaboradores = colaboradores.map(colab =>
      colab.id === editingColaborador.id
        ? {
            ...colab,
            nome: formData.nome,
            setor: formData.setor,
            funcao: formData.funcao,
            papel: formData.papel,
            email: formData.email,
            foto: formData.foto
          }
        : colab
    );

    setColaboradores(updatedColaboradores);
    handleCloseModal();
  };

  return (
    <div className="gestao-colaboradores-container">
      {/* Main Content */}
      <main className="gestao-main">
        <div className="gestao-content">
          {/* Page Title */}
          <div className="gestao-page-header">
            <h1 className="gestao-page-title">Colaboradores</h1>
            <p className="gestao-page-subtitle">Gerencie colaboradores e suas permissões</p>
          </div>

          {/* Search and Pagination */}
          <div className="gestao-search-section">
            <div className="gestao-search-bar">
              <div className="gestao-search">
                <div className="gestao-search-wrapper">
                  <SearchOutlined className="gestao-search-icon" />
                  <input
                    type="text"
                    className="gestao-search-input"
                    placeholder="Buscar por nome, setor, função, email ou papel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="gestao-results-pagination-row">
              <span className="gestao-results-count">
                {filteredColaboradores.length} encontrado{filteredColaboradores.length !== 1 ? 's' : ''}
              </span>
              {totalPages > 1 && (
                <div className="gestao-pagination">
                <button
                  className="pagination-button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  <LeftOutlined />
                </button>
                <div className="pagination-numbers">
                  {getPageNumbers().map((page, index) => {
                    if (page === 'ellipsis') {
                      return (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Ir para página ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
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
          {/* Desktop Table */}
          <div className="gestao-table-wrapper gestao-desktop-view">
            <table className="gestao-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Setor</th>
                  <th>Função</th>
                  <th>Papel no Site</th>
                  <th>Email</th>
                  <th className="actions-column">Ações</th>
                </tr>
              </thead>
              <tbody>
                {displayedColaboradores.length > 0 ? (
                  displayedColaboradores.map((colaborador) => (
                    <tr key={colaborador.id}>
                      <td className="nome-cell">{colaborador.nome}</td>
                      <td>{colaborador.setor}</td>
                      <td>{colaborador.funcao}</td>
                      <td>
                        <span className={`papel-badge papel-${colaborador.papel.toLowerCase().replace(/\s+/g, '-').replace(/á/g, 'a').replace(/ã/g, 'a')}`}>
                          {colaborador.papel}
                        </span>
                      </td>
                      <td>{colaborador.email}</td>
                      <td className="actions-cell">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(colaborador)}
                          title="Editar colaborador"
                        >
                          <EditOutlined />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">
                      Nenhum colaborador encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="gestao-cards-wrapper gestao-mobile-view">
            {displayedColaboradores.length > 0 ? (
              <div className="gestao-cards-list">
                {displayedColaboradores.map((colaborador) => (
                  <div key={colaborador.id} className="gestao-colaborador-card">
                    <div className="gestao-card-header">
                      <div className="gestao-card-avatar">
                        {(colaborador.foto || colaborador.imagem) ? (
                          <img 
                            src={colaborador.foto || colaborador.imagem} 
                            alt={colaborador.nome} 
                            className="gestao-card-avatar-img"
                          />
                        ) : (
                          <div className="gestao-card-avatar-placeholder">
                            {getInitials(colaborador.nome)}
                          </div>
                        )}
                      </div>
                      <div className="gestao-card-header-info">
                        <h3 className="gestao-card-name">{colaborador.nome}</h3>
                        <span className={`gestao-card-papel papel-${colaborador.papel.toLowerCase().replace(/\s+/g, '-').replace(/á/g, 'a').replace(/ã/g, 'a')}`}>
                          {colaborador.papel}
                        </span>
                      </div>
                      <button
                        className="gestao-card-edit-button"
                        onClick={() => handleEdit(colaborador)}
                        title="Editar colaborador"
                        aria-label="Editar colaborador"
                      >
                        <EditOutlined />
                      </button>
                    </div>
                    <div className="gestao-card-body">
                      <div className="gestao-card-info-row">
                        <span className="gestao-card-label">Setor</span>
                        <span className="gestao-card-value">{colaborador.setor}</span>
                      </div>
                      <div className="gestao-card-info-row">
                        <span className="gestao-card-label">Função</span>
                        <span className="gestao-card-value">{colaborador.funcao}</span>
                      </div>
                      <div className="gestao-card-info-row">
                        <span className="gestao-card-label">Email</span>
                        <span className="gestao-card-value gestao-card-email">{colaborador.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="gestao-no-results-card">
                <p>Nenhum colaborador encontrado</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="gestao-pagination">
              <button
                className="pagination-button"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                <LeftOutlined />
              </button>
              
              <div className="pagination-numbers">
                {getPageNumbers().map((page, index) => {
                  if (page === 'ellipsis') {
                    return (
                      <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Ir para página ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
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

      {/* Modal para Desktop */}
      {isModalOpen && !isMobile && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Cabeçalho do modal */}
            <div className="modal-dialog-header">
              <h2 className="modal-dialog-title">Detalhes da Conta</h2>
              <button className="modal-close-button" onClick={handleCloseModal} aria-label="Fechar">
                <CloseOutlined />
              </button>
            </div>

            <div className="modal-dialog-body">
              {/* Painel esquerdo - Foto e navegação */}
              <div className="modal-left-panel">
                {/* Área da foto */}
                <div className="modal-photo-container">
                  <label className="modal-photo-label" htmlFor="colaborador-foto">
                    {formData.foto ? (
                      <div className="modal-photo-wrapper">
                        <img src={formData.foto} alt={formData.nome} className="modal-photo-image" />
                        <div className="modal-photo-overlay">
                          <CameraOutlined className="modal-photo-icon" />
                          <span className="modal-photo-text">Clique para alterar foto</span>
                        </div>
                      </div>
                    ) : (
                      <div className="modal-photo-wrapper">
                        <div className="modal-photo-placeholder">
                          {getInitials(formData.nome)}
                        </div>
                        <div className="modal-photo-overlay">
                          <CameraOutlined className="modal-photo-icon" />
                          <span className="modal-photo-text">Clique para alterar foto</span>
                        </div>
                      </div>
                    )}
                  </label>
                  <input
                    id="colaborador-foto"
                    type="file"
                    accept="image/*"
                    className="modal-photo-input"
                    onChange={handleImageChange}
                  />
                </div>

                {/* Navegação vertical */}
                <nav className="modal-vertical-nav">
                  <button
                    type="button"
                    className={`modal-nav-item ${activeTab === 'dados' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dados')}
                  >
                    <FileTextOutlined className="modal-nav-icon" />
                    <span>Dados da Conta</span>
                  </button>
                </nav>
              </div>

              {/* Painel direito - Formulário */}
              <div className="modal-right-panel">
                <div className="modal-form-content">
                  <div className="form-group">
                    <label htmlFor="nome">Nome *</label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="setor">Setor *</label>
                    <input
                      type="text"
                      id="setor"
                      name="setor"
                      value={formData.setor}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="funcao">Função *</label>
                    <input
                      type="text"
                      id="funcao"
                      name="funcao"
                      value={formData.funcao}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="papel">Papel no Site *</label>
                    <select
                      id="papel"
                      name="papel"
                      value={formData.papel}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="Gerente da Área">Gerente da Área</option>
                      <option value="Gerente Adjunto">Gerente Adjunto</option>
                      <option value="Usuário Padrão">Usuário Padrão</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">E-Mail *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="modal-form-footer">
                    <button className="modal-button save-button" onClick={handleSave}>
                      <SaveOutlined /> Atualizar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tela Fullscreen para Mobile */}
      {isModalOpen && isMobile && (
        <div className="gestao-mobile-edit-screen">
          <div className="gestao-mobile-edit-header">
            <button 
              className="gestao-mobile-back-button" 
              onClick={handleCloseModal}
              aria-label="Voltar"
            >
              <LeftOutlined />
            </button>
            <h2 className="gestao-mobile-edit-title">Editar Colaborador</h2>
            <div style={{ width: '40px' }}></div>
          </div>

          <div className="gestao-mobile-edit-content">
            {/* Foto do colaborador */}
            <div className="gestao-mobile-photo-section">
              <label className="gestao-mobile-photo-label" htmlFor="colaborador-foto-mobile">
                {formData.foto ? (
                  <div className="gestao-mobile-photo-wrapper">
                    <img src={formData.foto} alt={formData.nome} className="gestao-mobile-photo-image" />
                    <div className="gestao-mobile-photo-overlay">
                      <CameraOutlined className="gestao-mobile-photo-icon" />
                      <span className="gestao-mobile-photo-text">Alterar foto</span>
                    </div>
                  </div>
                ) : (
                  <div className="gestao-mobile-photo-wrapper">
                    <div className="gestao-mobile-photo-placeholder">
                      {getInitials(formData.nome)}
                    </div>
                    <div className="gestao-mobile-photo-overlay">
                      <CameraOutlined className="gestao-mobile-photo-icon" />
                      <span className="gestao-mobile-photo-text">Adicionar foto</span>
                    </div>
                  </div>
                )}
              </label>
              <input
                id="colaborador-foto-mobile"
                type="file"
                accept="image/*"
                className="gestao-mobile-photo-input"
                onChange={handleImageChange}
              />
            </div>

            {/* Formulário */}
            <div className="gestao-mobile-form">
              <div className="gestao-mobile-form-group">
                <label htmlFor="nome-mobile">Nome *</label>
                <input
                  type="text"
                  id="nome-mobile"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="gestao-mobile-form-input"
                  required
                />
              </div>

              <div className="gestao-mobile-form-group">
                <label htmlFor="setor-mobile">Setor *</label>
                <input
                  type="text"
                  id="setor-mobile"
                  name="setor"
                  value={formData.setor}
                  onChange={handleInputChange}
                  className="gestao-mobile-form-input"
                  required
                />
              </div>

              <div className="gestao-mobile-form-group">
                <label htmlFor="funcao-mobile">Função *</label>
                <input
                  type="text"
                  id="funcao-mobile"
                  name="funcao"
                  value={formData.funcao}
                  onChange={handleInputChange}
                  className="gestao-mobile-form-input"
                  required
                />
              </div>

              <div className="gestao-mobile-form-group">
                <label htmlFor="papel-mobile">Papel no Site *</label>
                <select
                  id="papel-mobile"
                  name="papel"
                  value={formData.papel}
                  onChange={handleInputChange}
                  className="gestao-mobile-form-select"
                  required
                >
                  <option value="Gerente da Área">Gerente da Área</option>
                  <option value="Gerente Adjunto">Gerente Adjunto</option>
                  <option value="Usuário Padrão">Usuário Padrão</option>
                </select>
              </div>

              <div className="gestao-mobile-form-group">
                <label htmlFor="email-mobile">E-Mail *</label>
                <input
                  type="email"
                  id="email-mobile"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="gestao-mobile-form-input"
                  required
                />
              </div>

              {/* Botão no final do conteúdo */}
              <div className="gestao-mobile-form-footer">
                <button 
                  className="gestao-mobile-save-button" 
                  onClick={handleSave}
                >
                  <SaveOutlined /> Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoColaboradores;
