import { useState, useEffect, useMemo } from 'react';
import {
  SearchOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
  CloseOutlined,
  TeamOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  UserOutlined,
  StopOutlined
} from '@ant-design/icons';
import { getAllDocuments, addDocument, updateDocument } from '../../db/documentosDb';
import { gruposMock } from '../../data/grupos';
import { colaboradoresMock } from '../../data/colaboradores';
import { categoriasMock, tagsMock } from '../../data/adminStats';
import DocumentView from '../DocumentView/DocumentView';
import ActionFeedbackModal from '../../components/ActionFeedbackModal/ActionFeedbackModal';
import PasswordConfirmModal from '../../components/PasswordConfirmModal/PasswordConfirmModal';
import './GestaoDocumentos.css';

const CREATE_STEPS = [
  { key: 0, title: 'Nome do documento' },
  { key: 1, title: 'Resumo em linguagem simplificada' },
  { key: 2, title: 'Assunto, categoria e tipo' },
  { key: 3, title: 'Arquivo PDF' },
  { key: 4, title: 'Classificação de sigilo' },
  { key: 5, title: 'Grupo ou pessoas autorizadas' }
];

const TIPOS_DOCUMENTO = [
  'Minuta',
  'Informativo Jurídico',
  'Decisão',
  'Contratos',
  'Licitações',
  'Parcerias'
];

function idsEmAlgumGrupo(grupos) {
  const ids = new Set();
  (grupos || []).forEach((g) => (g.membros || []).forEach((id) => ids.add(id)));
  return ids;
}

const LABEL_SIGILO = {
  interno: 'Sem sigilo',
  grupo: 'Restrito',
  pessoal: 'Sigiloso'
};

const CLASSIFICACAO_OPCOES = [
  { value: 'interno', label: 'Sem sigilo – qualquer pessoa logada pode visualizar' },
  { value: 'grupo', label: 'Restrito – apenas o grupo associado pode visualizar' },
  { value: 'pessoal', label: 'Sigiloso – apenas pessoas específicas podem visualizar' }
];

function GestaoDocumentos({ user }) {
  const [documentos, setDocumentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    summary: '',
    assunto: '',
    categoria: '',
    tipo: '',
    status: 'Vigente',
    pdfFile: null,
    classificacaoSigilo: 'interno',
    gruposAutorizados: [],
    usuariosAutorizados: []
  });
  const [createStep, setCreateStep] = useState(0);
  const [sigiloSearchTerm, setSigiloSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [docAssociarGrupo, setDocAssociarGrupo] = useState(null);
  const [associateGrupos, setAssociateGrupos] = useState([]);
  const [docForEdit, setDocForEdit] = useState(null);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, status: 'loading', action: '', message: '' });
  const itemsPerPage = 10;

  const isEditMode = !!docForEdit;

  const filteredDocumentos = documentos.filter((doc) => {
    const termo = searchTerm.toLowerCase();
    return (
      (doc.id && doc.id.toLowerCase().includes(termo)) ||
      (doc.title && doc.title.toLowerCase().includes(termo)) ||
      (doc.summary && doc.summary.toLowerCase().includes(termo)) ||
      (doc.tipo && doc.tipo.toLowerCase().includes(termo)) ||
      (doc.categoria && doc.categoria.toLowerCase().includes(termo)) ||
      (doc.assunto && doc.assunto.toLowerCase().includes(termo))
    );
  });

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

  // Ordenar documentos do mais novo para o mais antigo
  const sortedDocumentos = useMemo(() => {
    return [...filteredDocumentos].sort((a, b) => {
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
  }, [filteredDocumentos]);

  const totalPages = Math.max(1, Math.ceil(sortedDocumentos.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedDocumentos = sortedDocumentos.slice(startIndex, startIndex + itemsPerPage);

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
    
    const onDocumentUpdate = () => {
      load();
    };
    
    window.addEventListener('documentos-updated', onDocumentUpdate);
    window.addEventListener('focus', load);
    
    return () => {
      cancelled = true;
      window.removeEventListener('documentos-updated', onDocumentUpdate);
      window.removeEventListener('focus', load);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const getSigiloLabel = (doc) => LABEL_SIGILO[doc.classificacaoSigilo] || 'Sem sigilo';

  const getGruposNames = (doc) => {
    const ids = doc.gruposAutorizados || [];
    return ids
      .map((id) => gruposMock.find((g) => g.id === id)?.nome)
      .filter(Boolean)
      .join(', ') || '—';
  };

  const openCreate = () => {
    setDocForEdit(null);
    setShowRevokeConfirm(false);
    setForm({
      title: '',
      date: new Date().toISOString().slice(0, 10),
      summary: '',
      assunto: '',
      categoria: '',
      tipo: '',
      status: 'Vigente',
      pdfFile: null,
      classificacaoSigilo: 'interno',
      gruposAutorizados: [],
      usuariosAutorizados: []
    });
    setCreateStep(0);
    setSigiloSearchTerm('');
    setIsCreateOpen(true);
  };

  const openEdit = (doc) => {
    setDocForEdit(doc);
    setShowRevokeConfirm(false);
    const [d, m, y] = (doc.date || '').split('-');
    const dateInput = y && m && d ? `${y}-${m}-${d}` : new Date().toISOString().slice(0, 10);
    setForm({
      title: doc.title || '',
      date: dateInput,
      summary: doc.summarySimplified || doc.summary || '',
      assunto: doc.assunto || '',
      categoria: doc.categoria || '',
      tipo: doc.tipo || doc.categories?.[0] || '',
      status: doc.status || (doc.revogado ? 'Revogado' : 'Vigente'),
      pdfFile: doc.pdfBlob ? { file: doc.pdfBlob, name: 'documento.pdf' } : null,
      classificacaoSigilo: doc.classificacaoSigilo || 'interno',
      gruposAutorizados: doc.gruposAutorizados || [],
      usuariosAutorizados: doc.usuariosAutorizados || []
    });
    setCreateStep(0);
    setSigiloSearchTerm('');
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    if (form.pdfFile?.previewUrl) URL.revokeObjectURL(form.pdfFile.previewUrl);
    setDocForEdit(null);
    setShowRevokeConfirm(false);
    setIsCreateOpen(false);
    setCreateStep(0);
  };

  const handleRevokeClick = () => {
    if (!docForEdit || !showRevokeConfirm) {
      setShowRevokeConfirm(true);
      return;
    }
    setShowPasswordModal(true);
  };

  const verifyPassword = async (password) => {
    await new Promise((r) => setTimeout(r, 300));
    return password && password.trim().length >= 4;
  };

  const handlePasswordConfirm = async (password) => {
    const valid = await verifyPassword(password);
    if (!valid) return false;
    setShowPasswordModal(false);
    setFeedback({ isOpen: true, status: 'loading', action: 'Processando sua solicitação', message: '' });
    try {
      await updateDocument(docForEdit.id, { revogado: true, status: 'Revogado' });
      setDocumentos((prev) =>
        prev.map((d) => (d.id === docForEdit.id ? { ...d, revogado: true, status: 'Revogado' } : d))
      );
      window.dispatchEvent(new CustomEvent('documentos-updated'));
      setFeedback({ isOpen: true, status: 'success', action: '', message: 'Documento revogado.' });
    } catch (err) {
      console.error('Erro ao revogar documento:', err);
      setFeedback({ isOpen: true, status: 'error', action: '', message: 'Erro ao revogar documento. Tente novamente.' });
    }
    return true;
  };

  const handleFeedbackClose = () => {
    setFeedback((prev) => ({ ...prev, isOpen: false }));
    closeCreate();
  };

  const runWithFeedback = async (actionFn, actionText, successMessage, errorMessage = 'Ocorreu um erro. Tente novamente.') => {
    setFeedback({ isOpen: true, status: 'loading', action: actionText, message: '' });
    try {
      await actionFn();
      setFeedback({ isOpen: true, status: 'success', action: '', message: successMessage });
    } catch (err) {
      console.error(err);
      setFeedback({ isOpen: true, status: 'error', action: '', message: errorMessage });
    }
  };

  const handleSave = async () => {
    if (!docForEdit) return;
    const categoriesFromForm = [form.tipo, form.categoria, form.assunto].filter(Boolean);
    const updates = {
      summary: form.summary.trim() || docForEdit.title,
      summarySimplified: form.summary.trim() || docForEdit.title,
      content: form.summary.trim() || docForEdit.title,
      assunto: form.assunto || null,
      categoria: form.categoria || null,
      tipo: form.tipo || null,
      status: form.status || 'Vigente',
      revogado: form.status === 'Revogado',
      categories: categoriesFromForm
    };
    // Se não havia PDF original e foi inserido um novo PDF na edição, adiciona ao update
    if (!docForEdit.pdfBlob && !docForEdit.pdfUrl && form.pdfFile?.file) {
      updates.pdfBlob = form.pdfFile.file;
    }
    await runWithFeedback(
      async () => {
        await updateDocument(docForEdit.id, updates);
        setDocumentos((prev) =>
          prev.map((d) => (d.id === docForEdit.id ? { ...d, ...updates } : d))
        );
        window.dispatchEvent(new CustomEvent('documentos-updated'));
      },
      'Salvando alterações...',
      'Alterações salvas com sucesso.',
      'Erro ao salvar. Tente novamente.'
    );
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    const year = new Date().getFullYear();
    const nextNum = documentos.length + 1;
    const id = `DOC-${String(nextNum).padStart(3, '0')}-${year}`;
    const [y, m, d] = form.date.split('-');
    const dateStr = `${d}-${m}-${y}`;
    const categoriesFromForm = [form.tipo, form.categoria, form.assunto].filter(Boolean);
    const now = new Date().toISOString(); // Timestamp de criação para ordenação precisa
    const newDoc = {
      id,
      title: form.title.trim(),
      date: dateStr,
      vigencia: dateStr,
      createdAt: now, // Timestamp de criação para ordenação
      summary: form.summary.trim() || form.title.trim(),
      summarySimplified: form.summary.trim() || form.title.trim(),
      content: form.summary.trim() || form.title.trim(),
      assunto: form.assunto || null,
      categoria: form.categoria || null,
      status: form.status || 'Vigente',
      revogado: form.status === 'Revogado',
      tipo: form.tipo || null,
      categories: categoriesFromForm,
      highlightText: form.title.trim(),
      classificacaoSigilo: form.classificacaoSigilo || 'interno', // Garantir valor padrão
      ...(form.pdfFile?.file && { pdfBlob: form.pdfFile.file }),
      ...(form.classificacaoSigilo === 'grupo' && { gruposAutorizados: [...form.gruposAutorizados] }),
      ...(form.classificacaoSigilo === 'pessoal' && { usuariosAutorizados: [...form.usuariosAutorizados] })
    };
    await runWithFeedback(
      async () => {
        await addDocument(newDoc);
        setDocumentos((prev) => [...prev, newDoc]);
        // Disparar evento customizado para notificar outras telas
        window.dispatchEvent(new CustomEvent('documentos-updated'));
      },
      'Criando documento...',
      'Documento criado com sucesso.',
      'Erro ao criar documento. Tente novamente.'
    );
  };

  const canGoNext = () => {
    if (isEditMode && createStep === 0) return true;
    if (createStep === 0) return form.title.trim().length > 0;
    if (createStep === 1) return true;
    if (createStep === 2) return !!form.tipo;
    // No modo de edição, permite avançar mesmo sem PDF (se não existir) ou se já existir PDF
    if (createStep === 3) {
      if (isEditMode) {
        // Se já existe PDF no documento original, permite avançar
        // Se não existe PDF, permite avançar apenas se foi inserido um novo
        const tinhaPdfOriginal = docForEdit?.pdfBlob || docForEdit?.pdfUrl;
        return tinhaPdfOriginal || !!form.pdfFile;
      }
      return !!form.pdfFile;
    }
    if (createStep === 4) return true;
    if (createStep === 5) {
      if (form.classificacaoSigilo === 'grupo') return form.gruposAutorizados.length > 0;
      if (form.classificacaoSigilo === 'pessoal') return form.usuariosAutorizados.length > 0;
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (isEditMode && createStep === 0) {
      setCreateStep(1);
      return;
    }
    if (createStep < CREATE_STEPS.length - 1) setCreateStep((s) => s + 1);
    else if (isEditMode) handleSave();
    else handleCreate();
  };

  const prevStep = () => {
    if (createStep > 0) setCreateStep((s) => s - 1);
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;
    if (form.pdfFile?.previewUrl) URL.revokeObjectURL(form.pdfFile.previewUrl);
    setForm((p) => ({
      ...p,
      pdfFile: { file, name: file.name, previewUrl: URL.createObjectURL(file) }
    }));
  };

  const pessoasEncontradasSigilo = () => {
    if (sigiloSearchTerm.trim().length < 4) return [];
    const termo = sigiloSearchTerm.trim().toLowerCase();
    return colaboradoresDoSite.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        (c.email && c.email.toLowerCase().includes(termo))
    );
  };

  const toggleGrupo = (grupoId) => {
    setForm((prev) => ({
      ...prev,
      gruposAutorizados: prev.gruposAutorizados.includes(grupoId)
        ? prev.gruposAutorizados.filter((id) => id !== grupoId)
        : [...prev.gruposAutorizados, grupoId]
    }));
  };

  const toggleUsuario = (userId) => {
    setForm((prev) => ({
      ...prev,
      usuariosAutorizados: prev.usuariosAutorizados.includes(userId)
        ? prev.usuariosAutorizados.filter((id) => id !== userId)
        : [...prev.usuariosAutorizados, userId]
    }));
  };

  const openAssociarGrupo = (doc) => {
    setDocAssociarGrupo(doc);
    setAssociateGrupos(doc.gruposAutorizados ? [...doc.gruposAutorizados] : []);
  };

  const closeAssociarGrupo = () => {
    setDocAssociarGrupo(null);
    setAssociateGrupos([]);
  };

  const toggleAssociateGrupo = (grupoId) => {
    setAssociateGrupos((prev) =>
      prev.includes(grupoId) ? prev.filter((id) => id !== grupoId) : [...prev, grupoId]
    );
  };

  const saveAssociarGrupo = async () => {
    if (!docAssociarGrupo) return;
    const updates = { classificacaoSigilo: 'grupo', gruposAutorizados: [...associateGrupos] };
    try {
      await updateDocument(docAssociarGrupo.id, updates);
      setDocumentos((prev) =>
        prev.map((d) =>
          d.id === docAssociarGrupo.id ? { ...d, ...updates } : d
        )
      );
      window.dispatchEvent(new CustomEvent('documentos-updated'));
      closeAssociarGrupo();
    } catch (err) {
      console.error('Erro ao salvar associação no banco local:', err);
    }
  };

  const idsNoSite = idsEmAlgumGrupo(gruposMock);
  const colaboradoresDoSite = colaboradoresMock.filter((c) => idsNoSite.has(c.id));

  const handleViewDocument = (doc, e) => {
    if (e?.target?.closest('.gestao-documentos-card-actions')) return;
    setSelectedDocument(doc);
  };

  const handleBackFromView = () => setSelectedDocument(null);

  if (selectedDocument) {
    return (
      <DocumentView
        document={selectedDocument}
        onBack={handleBackFromView}
        skipAccessCheck
      />
    );
  }

  return (
    <div className="gestao-documentos-container">
      <main className="gestao-documentos-main">
        <div className="gestao-documentos-content">
          {/* Page Title */}
          <div className="gestao-documentos-page-header">
            <h1 className="gestao-documentos-page-title">Documentos</h1>
            <p className="gestao-documentos-page-subtitle">Gerencie documentos do portal jurídico</p>
          </div>

          {/* Search and Pagination */}
          <div className="gestao-documentos-search-section">
            <div className="gestao-documentos-search-bar">
              <div className="gestao-documentos-search">
                <div className="gestao-documentos-search-wrapper">
                  <SearchOutlined className="gestao-documentos-search-icon" />
                  <input
                    type="text"
                    className="gestao-documentos-search-input"
                    placeholder="Buscar por código, título ou resumo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button type="button" className="gestao-documentos-btn-create" onClick={openCreate}>
                <PlusOutlined /> Novo documento
              </button>
            </div>
            <div className="gestao-documentos-results-pagination-row">
              <span className="gestao-documentos-results-count">
                {sortedDocumentos.length} documento{sortedDocumentos.length !== 1 ? 's' : ''} encontrado{sortedDocumentos.length !== 1 ? 's' : ''}
              </span>
              {totalPages > 1 && (
                <div className="gestao-documentos-pagination">
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
                      <span key={`e-${idx}`} className="pagination-ellipsis">...</span>
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
          {/* Desktop: tabela (igual Colaboradores) */}
          <div className="gestao-documentos-table-wrapper gestao-desktop-view">
            <table className="gestao-documentos-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Assunto</th>
                  <th>Data</th>
                  <th>Sigilo</th>
                  <th>Status</th>
                  <th className="gestao-documentos-actions-column">Ações</th>
                </tr>
              </thead>
              <tbody>
                {displayedDocumentos.length > 0 ? (
                  displayedDocumentos.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={(e) => handleViewDocument(doc, e)}
                      className="gestao-documentos-table-row-clickable"
                    >
                      <td className="codigo-cell">{doc.id}</td>
                      <td className="titulo-cell">{doc.title}</td>
                      <td>{doc.tipo || doc.categories?.[0] || '—'}</td>
                      <td>{doc.assunto || '—'}</td>
                      <td>{doc.date || '—'}</td>
                      <td>
                        <span className={`sigilo-badge sigilo-${doc.classificacaoSigilo || 'interno'}`}>
                          {getSigiloLabel(doc)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${(doc.status || (doc.revogado ? 'Revogado' : 'Vigente')).toLowerCase()}`}>
                          {doc.status || (doc.revogado ? 'Revogado' : 'Vigente')}
                        </span>
                      </td>
                      <td className="gestao-documentos-actions-cell" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="gestao-documentos-table-btn"
                          onClick={() => openAssociarGrupo(doc)}
                          title="Associar documento a grupo(s)"
                        >
                          <TeamOutlined />
                        </button>
                        <button
                          type="button"
                          className="gestao-documentos-table-btn"
                          onClick={() => openEdit(doc)}
                          title="Editar documento"
                        >
                          <EditOutlined />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="gestao-documentos-no-results">
                      Nenhum documento encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="gestao-documentos-cards-wrapper gestao-mobile-view">
            {displayedDocumentos.length > 0 ? (
              <div className="gestao-documentos-cards">
                {displayedDocumentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="gestao-documentos-card"
                    onClick={(e) => handleViewDocument(doc, e)}
                  >
                    <div className="gestao-documentos-card-header">
                      <FileTextOutlined className="gestao-documentos-card-icon" />
                      <div className="gestao-documentos-card-header-right">
                        <span className={`status-badge status-${(doc.status || (doc.revogado ? 'Revogado' : 'Vigente')).toLowerCase()}`}>
                          {doc.status || (doc.revogado ? 'Revogado' : 'Vigente')}
                        </span>
                        <span className={`sigilo-badge sigilo-${doc.classificacaoSigilo || 'interno'}`}>
                          {getSigiloLabel(doc)}
                        </span>
                      </div>
                    </div>
                    <div className="gestao-documentos-card-body">
                      <h3 className="gestao-documentos-card-title">{doc.title}</h3>
                      <p className="gestao-documentos-card-codigo">
                        <strong>Código:</strong> {doc.id}
                      </p>
                      <div className="gestao-documentos-card-info">
                        <div className="gestao-documentos-card-info-row">
                          <span className="gestao-documentos-card-label">Tipo:</span>
                          <span className="gestao-documentos-card-value">{doc.tipo || doc.categories?.[0] || '—'}</span>
                        </div>
                        {doc.assunto && (
                          <div className="gestao-documentos-card-info-row">
                            <span className="gestao-documentos-card-label">Assunto:</span>
                            <span className="gestao-documentos-card-value">{doc.assunto}</span>
                          </div>
                        )}
                        <div className="gestao-documentos-card-info-row">
                          <span className="gestao-documentos-card-label">Data:</span>
                          <span className="gestao-documentos-card-value">{doc.date}</span>
                        </div>
                        {doc.classificacaoSigilo === 'grupo' && getGruposNames(doc) !== '—' && (
                          <div className="gestao-documentos-card-info-row">
                            <span className="gestao-documentos-card-label">Grupos:</span>
                            <span className="gestao-documentos-card-value">{getGruposNames(doc)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="gestao-documentos-card-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="gestao-documentos-card-action-btn gestao-documentos-btn-associar"
                        onClick={() => openAssociarGrupo(doc)}
                        title="Associar documento a grupo(s)"
                      >
                        <TeamOutlined />
                      </button>
                      <button
                        type="button"
                        className="gestao-documentos-card-action-btn"
                        title="Editar documento"
                        onClick={() => openEdit(doc)}
                      >
                        <EditOutlined />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="gestao-documentos-no-results-card">
                Nenhum documento encontrado
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="gestao-documentos-pagination">
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
                    <span key={`e2-${idx}`} className="pagination-ellipsis">...</span>
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

      {docAssociarGrupo && (
        <div className="gestao-documentos-overlay" onClick={closeAssociarGrupo}>
          <div className="gestao-documentos-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gestao-documentos-modal-header">
              <h2>Associar documento a grupo(s)</h2>
              <button type="button" className="gestao-documentos-modal-close" onClick={closeAssociarGrupo} aria-label="Fechar">
                <CloseOutlined />
              </button>
            </div>
            <div className="gestao-documentos-modal-body">
              <p className="gestao-documentos-doc-ref">
                <strong>{docAssociarGrupo.id}</strong> – {docAssociarGrupo.title}
              </p>
              <p className="gestao-documentos-hint">
                Selecione o(s) grupo(s) de trabalho que poderão visualizar este documento. O documento passará a ser classificado como restrito.
              </p>
              <div className="gestao-documentos-check-list">
                {gruposMock.map((g) => (
                  <label key={g.id} className="gestao-documentos-check-item">
                    <input
                      type="checkbox"
                      checked={associateGrupos.includes(g.id)}
                      onChange={() => toggleAssociateGrupo(g.id)}
                    />
                    <span>{g.nome}</span>
                  </label>
                ))}
              </div>
              <div className="gestao-documentos-modal-actions">
                <button type="button" className="gestao-documentos-btn-secondary" onClick={closeAssociarGrupo}>
                  Cancelar
                </button>
                <button type="button" className="gestao-documentos-btn-primary" onClick={saveAssociarGrupo}>
                  Salvar associação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="gestao-documentos-overlay" onClick={closeCreate}>
          <div className="gestao-documentos-modal gestao-documentos-modal-wizard" onClick={(e) => e.stopPropagation()}>
            <div className="gestao-documentos-modal-header">
              <h2>{isEditMode ? 'Editar documento' : 'Criar novo documento'}</h2>
              <button type="button" className="gestao-documentos-modal-close" onClick={closeCreate} aria-label="Fechar">
                <CloseOutlined />
              </button>
            </div>
            <div className={`gestao-documentos-steps-bar ${isMobile ? 'gestao-documentos-steps-mobile' : ''}`}>
              {isMobile ? (
                // Mobile: mostrar apenas o step atual
                <div className="gestao-documentos-step-current-mobile">
                  <div className="gestao-documentos-step-item active">
                    <span className="gestao-documentos-step-num">{createStep + 1}</span>
                    <span className="gestao-documentos-step-title">
                      {isEditMode && CREATE_STEPS[createStep].key === 0 ? 'Início' : CREATE_STEPS[createStep].title}
                    </span>
                  </div>
                  <div className="gestao-documentos-step-progress-mobile">
                    <span className="gestao-documentos-step-progress-text">
                      Etapa {createStep + 1} de {CREATE_STEPS.length}
                    </span>
                    <div className="gestao-documentos-step-progress-bar">
                      <div 
                        className="gestao-documentos-step-progress-fill"
                        style={{ width: `${((createStep + 1) / CREATE_STEPS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Desktop: mostrar todos os steps
                CREATE_STEPS.map((s, index) => {
                  const stepTitle = isEditMode && s.key === 0 ? 'Início' : s.title;
                  return (
                    <div key={s.key} className="gestao-documentos-step-wrapper">
                      <div
                        className={`gestao-documentos-step-item ${createStep === s.key ? 'active' : ''} ${createStep > s.key ? 'done' : ''}`}
                      >
                        <span className="gestao-documentos-step-num">{s.key + 1}</span>
                        <span className="gestao-documentos-step-title">{stepTitle}</span>
                      </div>
                      {index < CREATE_STEPS.length - 1 && (
                        <div
                          className={`gestao-documentos-step-line ${createStep > s.key ? 'done' : ''}`}
                          aria-hidden
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <div className="gestao-documentos-modal-body">
              {createStep === 0 && isEditMode && (
                <div className="gestao-documentos-fieldset">
                  <span className="gestao-documentos-fieldset-title">Documento selecionado para edição</span>
                  <p className="gestao-documentos-doc-ref">
                    <strong>{docForEdit?.id}</strong> – {docForEdit?.title}
                  </p>
                  <p className="gestao-documentos-hint">
                    Código e título não podem ser alterados. O sigilo e grupos de acesso também permanecem inalterados.
                    Você poderá editar: resumo simplificado, assunto, categoria, tipo e status.
                  </p>
                  {showRevokeConfirm ? (
                    <div className="gestao-documentos-revoke-confirm">
                      <p className="gestao-documentos-hint" style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)' }}>
                        Tem certeza que deseja revogar este documento? Esta ação não pode ser desfeita.
                      </p>
                      <div className="gestao-documentos-modal-actions">
                        <button
                          type="button"
                          className="gestao-documentos-btn-secondary"
                          onClick={() => setShowRevokeConfirm(false)}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="gestao-documentos-btn-revoke"
                          onClick={handleRevokeClick}
                        >
                          <StopOutlined /> Confirmar revogação
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="gestao-documentos-edit-intro-actions">
                      <button
                        type="button"
                        className="gestao-documentos-btn-primary"
                        onClick={() => setCreateStep(1)}
                      >
                        Seguir para edição
                      </button>
                      <button
                        type="button"
                        className="gestao-documentos-btn-revoke"
                        onClick={() => setShowRevokeConfirm(true)}
                      >
                        <StopOutlined /> Revogar este documento
                      </button>
                    </div>
                  )}
                </div>
              )}
              {createStep === 0 && !isEditMode && (
                <>
                  <label className="gestao-documentos-label">
                    Nome do documento
                    <input
                      type="text"
                      className="gestao-documentos-input"
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Ex.: Minuta - Reunião de Diretoria"
                    />
                  </label>
                  <label className="gestao-documentos-label">
                    Data
                    <input
                      type="date"
                      className="gestao-documentos-input"
                      value={form.date}
                      onChange={(e) => setForm((p) => ({ ...p, date: e.target.value || p.date }))}
                    />
                  </label>
                </>
              )}
              {createStep === 1 && (
                <label className="gestao-documentos-label">
                  Resumo técnico em linguagem simplificada
                  <p className="gestao-documentos-hint">
                    Escreva um resumo para entendimento de pessoas fora do meio jurídico.
                  </p>
                  <textarea
                    className="gestao-documentos-textarea"
                    value={form.summary}
                    onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                    placeholder="Descreva o conteúdo do documento em linguagem acessível..."
                    rows={5}
                  />
                </label>
              )}
              {createStep === 2 && (
                <div className="gestao-documentos-fieldset">
                  <span className="gestao-documentos-fieldset-title">Classificação do documento</span>
                  <p className="gestao-documentos-hint">
                    Informe assunto, categoria e tipo para facilitar a identificação e o relatório do documento.
                  </p>
                  <label className="gestao-documentos-label">
                    Tipo do documento
                    <select
                      className="gestao-documentos-input"
                      value={form.tipo}
                      onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      {TIPOS_DOCUMENTO.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="gestao-documentos-label">
                    Categoria
                    <select
                      className="gestao-documentos-input"
                      value={form.categoria}
                      onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value }))}
                    >
                      <option value="">Selecione a categoria</option>
                      {categoriasMock.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label className="gestao-documentos-label">
                    Assunto
                    <select
                      className="gestao-documentos-input"
                      value={form.assunto}
                      onChange={(e) => setForm((p) => ({ ...p, assunto: e.target.value }))}
                    >
                      <option value="">Selecione o assunto</option>
                      {tagsMock.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </label>
                  {isEditMode && (
                    <label className="gestao-documentos-label">
                      Status
                      <select
                        className="gestao-documentos-input"
                        value={form.status}
                        onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                      >
                        <option value="Vigente">Vigente</option>
                        <option value="Revogado">Revogado</option>
                      </select>
                    </label>
                  )}
                </div>
              )}
              {createStep === 3 && (
                <div className="gestao-documentos-fieldset">
                  <span className="gestao-documentos-fieldset-title">Documento PDF</span>
                  <p className="gestao-documentos-hint">
                    {isEditMode
                      ? (docForEdit?.pdfBlob || docForEdit?.pdfUrl
                          ? 'O arquivo PDF não pode ser alterado na edição. Você pode avançar para salvar as alterações.'
                          : 'Este documento não possui PDF. Você pode inserir um PDF agora ou avançar para salvar as alterações.')
                      : 'O PDF é o arquivo central do documento. Ele será exibido para leitura na tela de visualização.'}
                  </p>
                  {isEditMode ? (
                    (docForEdit?.pdfBlob || docForEdit?.pdfUrl) ? (
                      <p className="gestao-documentos-doc-ref">
                        <FilePdfOutlined /> Documento possui PDF anexado
                      </p>
                    ) : (
                      <label className="gestao-documentos-file-label">
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handlePdfChange}
                          className="gestao-documentos-file-input"
                        />
                        <span className="gestao-documentos-file-btn">
                          <FilePdfOutlined /> {form.pdfFile ? form.pdfFile.name : 'Escolher arquivo PDF (opcional)'}
                        </span>
                      </label>
                    )
                  ) : (
                    <label className="gestao-documentos-file-label">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfChange}
                        className="gestao-documentos-file-input"
                      />
                      <span className="gestao-documentos-file-btn">
                        <FilePdfOutlined /> {form.pdfFile ? form.pdfFile.name : 'Escolher arquivo PDF'}
                      </span>
                    </label>
                  )}
                </div>
              )}
              {createStep === 4 && (
                <div className="gestao-documentos-fieldset">
                  <span className="gestao-documentos-fieldset-title">Classificação de sigilo</span>
                  <p className="gestao-documentos-hint">
                    {isEditMode
                      ? 'A classificação de sigilo não pode ser alterada na edição.'
                      : 'Sem sigilo: qualquer pessoa logada pode ver. Restrito: apenas o grupo associado. Sigiloso: apenas pessoas específicas.'}
                  </p>
                  <div className={`gestao-documentos-radio-group ${isEditMode ? 'gestao-documentos-readonly' : ''}`}>
                    {CLASSIFICACAO_OPCOES.map((opt) => (
                      <label key={opt.value} className="gestao-documentos-radio">
                        <input
                          type="radio"
                          name="sigilo"
                          checked={form.classificacaoSigilo === opt.value}
                          onChange={() => !isEditMode && setForm((p) => ({ ...p, classificacaoSigilo: opt.value }))}
                          disabled={isEditMode}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {createStep === 5 && (
                <div className="gestao-documentos-fieldset">
                  {form.classificacaoSigilo === 'grupo' && (
                    <>
                      <span className="gestao-documentos-fieldset-title">Grupo de trabalho associado</span>
                      <p className="gestao-documentos-hint">
                        {isEditMode
                          ? 'Os grupos associados não podem ser alterados na edição.'
                          : 'Selecione o(s) grupo(s) que poderão visualizar este documento na pesquisa.'}
                      </p>
                      <div className={`gestao-documentos-check-list ${isEditMode ? 'gestao-documentos-readonly' : ''}`}>
                        {gruposMock.map((g) => (
                          <label key={g.id} className="gestao-documentos-check-item">
                            <input
                              type="checkbox"
                              checked={form.gruposAutorizados.includes(g.id)}
                              onChange={() => !isEditMode && toggleGrupo(g.id)}
                              disabled={isEditMode}
                            />
                            <span>{g.nome}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                  {form.classificacaoSigilo === 'pessoal' && (
                    <>
                      <span className="gestao-documentos-fieldset-title">Pessoas autorizadas</span>
                      <p className="gestao-documentos-hint">
                        {isEditMode
                          ? 'As pessoas autorizadas não podem ser alteradas na edição.'
                          : 'Pesquise por nome ou e-mail (mín. 4 caracteres) e adicione quem terá acesso ao documento.'}
                      </p>
                      {!isEditMode && (
                        <>
                          <div className="gestao-documentos-member-search-wrapper">
                            <SearchOutlined className="gestao-documentos-member-search-icon" />
                            <input
                              type="text"
                              className="gestao-documentos-input"
                              placeholder="Buscar por nome ou e-mail (mín. 4 caracteres)"
                              value={sigiloSearchTerm}
                              onChange={(e) => setSigiloSearchTerm(e.target.value)}
                            />
                          </div>
                          {sigiloSearchTerm.trim().length >= 4 && (
                            <div className="gestao-documentos-add-list">
                              {pessoasEncontradasSigilo().length === 0 ? (
                                <p className="gestao-documentos-search-empty">Nenhum usuário encontrado.</p>
                              ) : (
                                pessoasEncontradasSigilo().map((c) => (
                                  <div key={c.id} className="gestao-documentos-add-row">
                                    <span>{c.nome}</span>
                                    <span className="gestao-documentos-add-email">{c.email}</span>
                                    <button
                                      type="button"
                                      className="gestao-documentos-btn-add-one"
                                      onClick={() => toggleUsuario(c.id)}
                                    >
                                      <UserOutlined /> {form.usuariosAutorizados.includes(c.id) ? 'Remover' : 'Adicionar'}
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </>
                      )}
                      {form.usuariosAutorizados.length > 0 && (
                        <p className="gestao-documentos-hint" style={{ marginTop: 'var(--spacing-md)' }}>
                          Autorizados: {form.usuariosAutorizados.length} pessoa(s) –{' '}
                          {form.usuariosAutorizados
                            .map((id) => colaboradoresDoSite.find((c) => c.id === id)?.nome)
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </>
                  )}
                  {form.classificacaoSigilo === 'interno' && (
                    <p className="gestao-documentos-hint">Documento sem sigilo: qualquer pessoa logada poderá visualizar. Nenhuma configuração adicional.</p>
                  )}
                </div>
              )}
              {!(isEditMode && createStep === 0) && (
                <div className="gestao-documentos-modal-actions">
                  <button type="button" className="gestao-documentos-btn-secondary" onClick={createStep === 0 ? closeCreate : prevStep}>
                    {createStep === 0 ? 'Cancelar' : 'Voltar'}
                  </button>
                  <button
                    type="button"
                    className="gestao-documentos-btn-primary"
                    onClick={nextStep}
                    disabled={!canGoNext()}
                  >
                    {createStep === CREATE_STEPS.length - 1
                      ? (isEditMode ? 'Salvar alterações' : 'Criar documento')
                      : 'Próximo'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <PasswordConfirmModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Confirmar revogação"
        hint="Informe sua senha de acesso para revogar este documento."
        onConfirm={handlePasswordConfirm}
      />

      <ActionFeedbackModal
        isOpen={feedback.isOpen}
        onClose={handleFeedbackClose}
        status={feedback.status}
        action={feedback.action}
        message={feedback.message}
      />
    </div>
  );
}

export default GestaoDocumentos;
