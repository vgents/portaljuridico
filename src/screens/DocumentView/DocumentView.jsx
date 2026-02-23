import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  LockOutlined,
  StopOutlined
} from '@ant-design/icons';
import { podeVisualizarDocumento } from '../../utils/documentoSigilo';
import PdfFullView from '../../components/PdfFullView/PdfFullView';
import AppFooter from '../../components/AppFooter/AppFooter';
import './DocumentView.css';

function DocumentView({ document, user, grupos = [], onBack, skipAccessCheck = false }) {
  const [pdfSource, setPdfSource] = useState(null);
  const [showProtectionFeedback, setShowProtectionFeedback] = useState(false);
  const containerRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);
  
  const isRevogado = document?.status === 'Revogado' || document?.revogado;

  useEffect(() => {
    if (document?.pdfBlob) {
      const url = URL.createObjectURL(document.pdfBlob);
      setPdfSource(url);
      return () => URL.revokeObjectURL(url);
    } else if (document?.pdfUrl) {
      setPdfSource(document.pdfUrl);
    } else {
      setPdfSource(null);
    }
  }, [document?.pdfBlob, document?.pdfUrl]);

  const mostrarFeedback = () => {
    setShowProtectionFeedback(true);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setShowProtectionFeedback(false);
    }, 3000);
  };

  useEffect(() => {
    if (!isRevogado) return;

    const handleCopy = (e) => {
      e.preventDefault();
      mostrarFeedback();
      return false;
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      mostrarFeedback();
      return false;
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    const handleDragStart = (e) => {
      e.preventDefault();
      mostrarFeedback();
      return false;
    };

    const handleKeyDown = (e) => {
      // Bloquear Ctrl+C, Ctrl+A, Ctrl+V, Ctrl+X, Ctrl+S, Ctrl+P (Print)
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 'c' || e.key === 'C' || e.key === 'v' || e.key === 'V' || 
         e.key === 'a' || e.key === 'A' || e.key === 'x' || e.key === 'X' ||
         e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P')
      ) {
        e.preventDefault();
        e.stopPropagation();
        mostrarFeedback();
        return false;
      }
      // Bloquear Print Screen (PrintScreen key)
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        mostrarFeedback();
        return false;
      }
    };

    const container = containerRef.current;
    if (!container) return;

    // Event listeners no container
    container.addEventListener('copy', handleCopy, true);
    container.addEventListener('contextmenu', handleContextMenu, true);
    container.addEventListener('selectstart', handleSelectStart, true);
    container.addEventListener('dragstart', handleDragStart, true);
    container.addEventListener('keydown', handleKeyDown, true);

    // Bloquear atalhos globais também quando o container está focado
    const handleGlobalKeyDown = (e) => {
      if (container.contains(window.document.activeElement) || window.document.activeElement === window.document.body) {
        handleKeyDown(e);
      }
    };
    window.document.addEventListener('keydown', handleGlobalKeyDown, true);

    return () => {
      container.removeEventListener('copy', handleCopy, true);
      container.removeEventListener('contextmenu', handleContextMenu, true);
      container.removeEventListener('selectstart', handleSelectStart, true);
      container.removeEventListener('dragstart', handleDragStart, true);
      container.removeEventListener('keydown', handleKeyDown, true);
      window.document.removeEventListener('keydown', handleGlobalKeyDown, true);
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [isRevogado]);

  if (!document) {
    return null;
  }

  const podeVisualizar = skipAccessCheck || (user && podeVisualizarDocumento(document, user, grupos));
  if (!podeVisualizar) {
    return (
      <div className="document-view-container">
        <main className="document-view-main">
          <div className="document-view-content document-view-acesso-negado">
            <button type="button" className="document-view-back-inline" onClick={onBack}>
              <ArrowLeftOutlined /> Voltar
            </button>
            <LockOutlined className="document-view-acesso-negado-icon" />
            <h2>Acesso não autorizado</h2>
            <p>Você não tem permissão para visualizar este documento.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`document-view-container ${isRevogado ? 'document-revogado-protected' : ''}`}
    >
      {showProtectionFeedback && (
        <div className="document-protection-feedback">
          <StopOutlined className="protection-feedback-icon" />
          <span className="protection-feedback-text">
            Esta ação não está disponível para documentos revogados
          </span>
        </div>
      )}
      <main className="document-view-main">
        <div className="document-view-content">
          <button type="button" className="document-view-back-inline" onClick={onBack}>
            <ArrowLeftOutlined /> Voltar
          </button>
          {/* Cabeçalho do Documento */}
          <div className="document-view-header-section">
            <div className="document-icon-wrapper">
              <FileTextOutlined className="document-icon" />
            </div>
            <div className="document-header-info">
              <h1 className="document-view-title">{document.title}</h1>
              <div className="document-meta-info">
                {(document.tipo || document.categoria || document.assunto) && (
                  <div className="meta-item meta-item-marcadores">
                    {document.tipo && <span className="meta-badge">Tipo: {document.tipo}</span>}
                    {document.categoria && <span className="meta-badge">Categoria: {document.categoria}</span>}
                    {document.assunto && <span className="meta-badge">Assunto: {document.assunto}</span>}
                  </div>
                )}
                <div className="meta-item">
                  <CalendarOutlined className="meta-icon" />
                  <span className="meta-label">Data de Publicação:</span>
                  <span className="meta-value">{document.date}</span>
                </div>
                <div className="meta-item">
                  <CheckCircleOutlined className="meta-icon" />
                  <span className="meta-label">Vigência:</span>
                  <span className="meta-value">{document.vigencia}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Número:</span>
                  <span className="meta-value">{document.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo principal: PDF quando existir (pdfUrl ou pdfBlob), senão texto */}
          {pdfSource ? (
            <>
              <div className="document-pdf-section document-pdf-main">
                <div className="document-pdf-wrapper document-pdf-full">
                  <PdfFullView 
                    file={pdfSource} 
                    isRevogado={document.status === 'Revogado' || document.revogado}
                  />
                </div>
              </div>
              {document.summarySimplified && (
                <div className="document-summary-section">
                  <h2 className="section-title">Resumo</h2>
                  <p className="summary-text">{document.summarySimplified}</p>
                </div>
              )}
            </>
          ) : (
            <>
              {document.summarySimplified && (
                <div className="document-summary-section">
                  <h2 className="section-title">Resumo</h2>
                  <p className="summary-text">{document.summarySimplified}</p>
                </div>
              )}
              {document.categories && document.categories.length > 0 && (
                <div className="document-categories-section">
                  <h3 className="categories-title">Categorias:</h3>
                  <div className="categories-list">
                    {document.categories.map((category, index) => (
                      <span key={index} className="category-badge">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="document-content-section">
                <h2 className="section-title">Documento Completo</h2>
                <div className="document-content">
                  <pre className="document-text">{document.content}</pre>
                </div>
              </div>
            </>
          )}

          {/* Botão de Voltar */}
          <div className="document-view-actions">
            <button className="back-to-list-button" onClick={onBack}>
              <ArrowLeftOutlined /> Voltar para Lista
            </button>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

export default DocumentView;
