import { useState, useEffect, useMemo } from 'react';
import {
  SearchOutlined,
  UserOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  YoutubeOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  StarOutlined,
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  TagOutlined,
  FolderOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { showingDocuments } from '../../data';
import { getAllDocuments } from '../../db/documentosDb';
import { filtrarDocumentosPorSigilo } from '../../utils/documentoSigilo';
import { gruposMock } from '../../data/grupos';
import DocumentView from '../DocumentView/DocumentView';
import AdvancedSearchModal from '../../components/AdvancedSearchModal/AdvancedSearchModal';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [documentos, setDocumentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Geral');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      getAllDocuments().then((list) => {
        if (!cancelled) {
          // Garantir que todos os documentos tenham classificacaoSigilo definida (padrão: 'interno')
          const documentosComSigilo = list.map((doc) => ({
            ...doc,
            classificacaoSigilo: doc.classificacaoSigilo || 'interno'
          }));
          setDocumentos(documentosComSigilo);
        }
      });
    };
    load();
    
    const onVisibilityChange = () => {
      if (window.document.visibilityState === 'visible') {
        load();
      }
    };
    
    const onFocus = () => {
      load();
    };
    
    // Listener para eventos customizados de atualização de documentos
    const onDocumentUpdate = () => {
      load();
    };
    
    window.document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onDocumentUpdate);
    // Evento customizado para quando documentos são criados/editados
    window.addEventListener('documentos-updated', onDocumentUpdate);
    
    return () => {
      cancelled = true;
      window.document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onDocumentUpdate);
      window.removeEventListener('documentos-updated', onDocumentUpdate);
    };
  }, []);

  // Filtros baseados nas categorias dos documentos
  const filters = ['Geral', 'Minuta', 'Informativo Jurídico', 'Decisão', 'Contratos', 'Licitações'];

  // Documentos que o usuário pode visualizar (classificação de sigilo)
  // Normalização já é feita dentro de filtrarDocumentosPorSigilo, então não precisa duplicar
  const isAdmin = user?.profile === 'Administrador';
  const documentosPorSigilo = filtrarDocumentosPorSigilo(documentos, user, gruposMock);

  // Função para converter data DD-MM-YYYY para timestamp
  const parseDate = (dateStr) => {
    if (!dateStr) return 0;
    // Formato pode ser DD-MM-YYYY ou YYYY-MM-DD (ISO)
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      // Se o primeiro elemento tem 4 dígitos, é YYYY-MM-DD
      if (parts[0].length === 4) {
        return new Date(dateStr).getTime();
      }
      // Caso contrário, é DD-MM-YYYY
      const [day, month, year] = parts;
      return new Date(`${year}-${month}-${day}`).getTime();
    }
    return 0;
  };

  // Ordenar TODOS os documentos visíveis primeiro (incluindo revogados para manter ordem consistente)
  const documentosOrdenados = useMemo(() => {
    return [...documentosPorSigilo].sort((a, b) => {
      // Priorizar timestamp de criação se existir (mais preciso)
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (a.createdAt && !b.createdAt) return -1; // a é mais recente
      if (!a.createdAt && b.createdAt) return 1; // b é mais recente
      
      // Se não houver createdAt, usar a data de publicação
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      
      // Se as datas forem iguais, ordenar por ID (mais recente primeiro)
      if (dateB === dateA) {
        return (b.id || '').localeCompare(a.id || '');
      }
      
      // Se uma data for inválida (0), colocar no final
      if (dateA === 0 && dateB === 0) {
        return (b.id || '').localeCompare(a.id || '');
      }
      if (dateA === 0) return 1; // a sem data vai para o final
      if (dateB === 0) return -1; // b sem data vai para o final
      
      return dateB - dateA; // Mais recente primeiro
    });
  }, [documentosPorSigilo]);

  // Agora filtrar documentos revogados apenas para não-administradores
  // Isso garante que a ordem seja a mesma para todos, exceto que não-admins não veem revogados
  const documentosVisiveis = documentosOrdenados.filter(
    (doc) => isAdmin || (!doc.revogado && doc.status !== 'Revogado')
  );

  // Filtrar por tipo/categoria (Geral = todos)
  const porCategoria = activeFilter === 'Geral'
    ? documentosVisiveis
    : documentosVisiveis.filter((doc) => {
        const filtro = activeFilter.toLowerCase();
        if (doc.tipo?.toLowerCase().includes(filtro)) return true;
        if (doc.categoria?.toLowerCase().includes(filtro)) return true;
        return doc.categories?.some((c) => c?.toLowerCase().includes(filtro));
      });

  // Filtrar por termo de busca automaticamente a partir de 4 caracteres
  const termo = searchTerm.trim().toLowerCase();
  const porBusca = termo.length >= 4
    ? porCategoria.filter((doc) => {
        const titulo = (doc.title || '').toLowerCase();
        const id = (doc.id || '').toLowerCase();
        const resumo = (doc.summary || '').toLowerCase();
        const resumoSimples = (doc.summarySimplified || '').toLowerCase();
        const tipo = (doc.tipo || '').toLowerCase();
        const categoria = (doc.categoria || '').toLowerCase();
        const assunto = (doc.assunto || '').toLowerCase();
        return titulo.includes(termo) || id.includes(termo) || resumo.includes(termo) || resumoSimples.includes(termo) || tipo.includes(termo) || categoria.includes(termo) || assunto.includes(termo);
      })
    : porCategoria;

  // Aplicar filtros avançados se existirem
  const filteredDocuments = useMemo(() => {
    if (!advancedFilters) return porBusca;

    let result = [...porBusca];

    // Filtro por tipo
    if (advancedFilters.tipo && advancedFilters.tipo !== 'Todos os tipos') {
      result = result.filter((doc) => {
        const docTipo = doc.tipo || doc.categories?.[0] || '';
        return docTipo.toLowerCase().includes(advancedFilters.tipo.toLowerCase());
      });
    }

    // Filtro por categoria
    if (advancedFilters.categoria && advancedFilters.categoria !== 'Todas as categorias') {
      result = result.filter((doc) => {
        const docCategoria = doc.categoria || '';
        const docCategories = doc.categories || [];
        return docCategoria.toLowerCase().includes(advancedFilters.categoria.toLowerCase()) ||
               docCategories.some((c) => c?.toLowerCase().includes(advancedFilters.categoria.toLowerCase()));
      });
    }

    // Filtro por número do documento
    if (advancedFilters.numeroDocumento && advancedFilters.numeroDocumento.trim()) {
      const numero = advancedFilters.numeroDocumento.trim().toLowerCase();
      result = result.filter((doc) => {
        const docId = (doc.id || '').toLowerCase();
        return docId.includes(numero);
      });
    }

    // Filtro por status
    if (advancedFilters.status) {
      result = result.filter((doc) => {
        const docStatus = doc.status || (doc.revogado ? 'Revogado' : 'Vigente');
        return docStatus === advancedFilters.status;
      });
    }

    // Filtro por período de publicação
    if (advancedFilters.dataInicio || advancedFilters.dataFim) {
      result = result.filter((doc) => {
        if (!doc.date) return false;
        
        const docDate = parseDate(doc.date);
        if (docDate === 0) return false;

        let inicio = 0;
        let fim = Date.now();

        if (advancedFilters.dataInicio) {
          inicio = new Date(advancedFilters.dataInicio).getTime();
        }
        if (advancedFilters.dataFim) {
          const fimDate = new Date(advancedFilters.dataFim);
          fimDate.setHours(23, 59, 59, 999);
          fim = fimDate.getTime();
        }

        return docDate >= inicio && docDate <= fim;
      });
    }

    return result;
  }, [porBusca, advancedFilters]);

  // Os documentos já estão ordenados, então sortedDocuments é apenas uma referência
  const sortedDocuments = filteredDocuments;

  // Ajustar página atual quando o filtro ou a busca mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm, advancedFilters]);

  useEffect(() => {
    const maxPage = Math.ceil(filteredDocuments.length / showingDocuments);
    setCurrentPage((p) => {
      if (p > maxPage && maxPage > 0) return maxPage;
      if (maxPage === 0 && p > 1) return 1;
      return p;
    });
  }, [activeFilter, searchTerm, filteredDocuments.length]);
  
  // Calcular paginação com documentos filtrados e ordenados
  const totalPages = Math.ceil(sortedDocuments.length / showingDocuments);
  const startIndex = (currentPage - 1) * showingDocuments;
  const endIndex = startIndex + showingDocuments;
  const displayedDocuments = sortedDocuments.slice(startIndex, endIndex);
  const startDocument = sortedDocuments.length > 0 ? startIndex + 1 : 0;
  const endDocument = Math.min(endIndex, sortedDocuments.length);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Resetar para primeira página ao mudar filtro
  };

  const handleAdvancedSearchApply = (filters) => {
    setIsAdvancedSearchOpen(false);
    setIsLoading(true);
    
    // Simular loading de 2 segundos
    setTimeout(() => {
      setAdvancedFilters(filters);
      setCurrentPage(1);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const handleAdvancedSearchOpen = (e) => {
    e.preventDefault();
    setIsAdvancedSearchOpen(true);
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedDocument(null);
  };

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
    const maxVisible = 5; // Máximo de números de página visíveis
    
    if (totalPages <= maxVisible) {
      // Mostrar todas as páginas se houver poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas com ellipsis
      if (currentPage <= 3) {
        // Mostrar primeiras páginas
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Mostrar últimas páginas
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Mostrar páginas do meio
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

  // Componente de paginação reutilizável
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="pagination">
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
    );
  };

  // Se um documento foi selecionado, mostrar a tela de visualização
  if (selectedDocument) {
    return (
      <DocumentView
        document={selectedDocument}
        user={user}
        grupos={gruposMock}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="dashboard-container">
      {/* Search Section */}
      <section className="search-section">
        <div className="search-background"></div>
        <div className="search-overlay"></div>
        <div className="search-content">
          <h1 className="search-title">Pesquisar documentos</h1>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-form-inner">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar documento"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="search-button">
                Buscar
              </button>
            </div>
          </form>
          <div className="advanced-search-wrapper">
            <StarOutlined className="advanced-search-icon" />
            <a href="#" className="advanced-search-link" onClick={handleAdvancedSearchOpen}>Busca avançada:</a>
          </div>
          <div className="filter-tags">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`filter-tag ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="documents-section">
        <div className="documents-header">
          <h2 className="documents-title">Documentos</h2>
          
        </div>

        <div className="documents-list">
          {isLoading ? (
            <div className="documents-loading">
              <LoadingOutlined className="documents-loading-icon" />
              <p className="documents-loading-text">Carregando resultados...</p>
            </div>
          ) : displayedDocuments.length > 0 ? (
            displayedDocuments.map((doc, index) => {
              // Garantir valores padrão para todos os campos necessários
              const docTitle = doc.title || 'Sem título';
              // Priorizar summary sobre summarySimplified para manter consistência
              const docSummary = doc.summary || doc.summarySimplified || doc.title || 'Sem resumo disponível';
              // Garantir que categories seja sempre um array
              const docCategories = Array.isArray(doc.categories) ? doc.categories : 
                                   (doc.tipo || doc.categoria || doc.assunto ? 
                                    [doc.tipo, doc.categoria, doc.assunto].filter(Boolean) : []);
              const docHighlightText = doc.highlightText || doc.title || '';
              const docStatus = doc.status || (doc.revogado ? 'Revogado' : 'Vigente');
              
              // Renderizar título com ou sem highlight
              const renderTitle = () => {
                if (docHighlightText && docTitle.includes(docHighlightText)) {
                  return docTitle.split(docHighlightText).map((part, i) => (
                    <span key={i}>
                      {part}
                      {i < docTitle.split(docHighlightText).length - 1 && (
                        <span className="highlight">{docHighlightText}</span>
                      )}
                    </span>
                  ));
                }
                return docTitle;
              };
              
              return (
                <div key={doc.id || index} className="document-card">
                  <div className="document-meta">
                    <span className="document-id">{doc.id || 'Sem ID'}</span>
                    <span className="document-date">
                      <CalendarOutlined className="date-icon" />
                      {doc.date || 'Data não informada'}
                    </span>
                  </div>
                  <h3 className="document-title">
                    {renderTitle()}
                  </h3>
                  <p className="document-summary">{docSummary}</p>
                  <div className="document-footer">
                    <div className="document-categories">
                      <span className={`status-badge status-${docStatus.toLowerCase()}`}>
                        {docStatus}
                      </span>
                      {docCategories.length > 0 && (
                        <>
                          <span className="category-item">
                            <TagOutlined className="marker-icon" />
                            <span className="category-label">{docCategories[0]}</span>
                          </span>
                          {docCategories.length > 1 && docCategories.slice(1).map((category, catIndex) => (
                            <span key={catIndex} className="category-item">
                              <FolderOutlined className="category-icon" />
                              <span className="category-label">{category}</span>
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                    <button
                      className="view-document-link"
                      onClick={() => handleViewDocument(doc)}
                    >
                      Visualizar documento
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <p>Nenhum documento encontrado para o filtro selecionado.</p>
            </div>
          )}
        </div>
        
        {/* Paginação inferior */}
        {!isLoading && displayedDocuments.length > 0 && (
          <div className="pagination-bottom">
            {renderPagination()}
          </div>
        )}
      </section>

      {/* Modal de Busca Avançada */}
      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onApply={handleAdvancedSearchApply}
        initialFilters={advancedFilters}
        isAdmin={user?.profile === 'Administrador'}
      />

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-logo-column">
            <div className="footer-logo">
              <h3>Sesc</h3>
              <p>Fecomércio Senac</p>
            </div>
            <div className="social-icons">
              <a href="#" aria-label="YouTube" className="social-icon">
                <YoutubeOutlined />
              </a>
              <a href="#" aria-label="Facebook" className="social-icon">
                <FacebookOutlined />
              </a>
              <a href="#" aria-label="Instagram" className="social-icon">
                <InstagramOutlined />
              </a>
              <a href="#" aria-label="Email" className="social-icon">
                <MailOutlined />
              </a>
              <a href="#" aria-label="LinkedIn" className="social-icon">
                <LinkedinOutlined />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Sobre o SESC</h4>
              <ul>
                <li><a href="#">Transparência</a></li>
                <li><a href="#">Notícias</a></li>
                <li><a href="#">Credencial</a></li>
                <li><a href="#">Trabalhe conosco</a></li>
                <li><a href="#">Portal de compras</a></li>
                <li><a href="#">Podcast</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>SAC</h4>
              <p className="footer-info">
                <EnvironmentOutlined className="footer-icon" />
                Serviço Social do Comércio
              </p>
              <p className="footer-info">
                <MailOutlined className="footer-icon" />
                <a href="mailto:sac@sescdf.com.br">sac@sescdf.com.br</a>
              </p>
              <p className="footer-info">
                <PhoneOutlined className="footer-icon" />
                <a href="tel:08000617617">0800 0617 617</a>
              </p>
            </div>

            <div className="footer-column">
              <h4>Ouvidoria</h4>
              <p className="footer-info">
                <MailOutlined className="footer-icon" />
                <a href="mailto:ouvidoria@sescdf.com.br">ouvidoria@sescdf.com.br</a>
              </p>
              <p className="footer-info">
                <WhatsAppOutlined className="footer-icon" />
                <a href="#">WhatsApp</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
