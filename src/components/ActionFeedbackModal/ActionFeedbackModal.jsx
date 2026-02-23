import { useEffect } from 'react';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './ActionFeedbackModal.css';

/**
 * Componente genérico para feedback de ações assíncronas.
 * Exibe: loading (ação em processamento) -> sucesso ou erro (mensagem final).
 * Uso: criar documento, editar, revogar, etc.
 *
 * @param {boolean} isOpen - Se o modal está visível
 * @param {() => void} onClose - Callback ao fechar
 * @param {'loading' | 'success' | 'error'} status - Estado atual
 * @param {string} action - Texto exibido durante loading (ex: "Processando sua solicitação")
 * @param {string} message - Mensagem final em sucesso ou erro (ex: "Documento revogado")
 */
function ActionFeedbackModal({ isOpen, onClose, status = 'loading', action = 'Processando sua solicitação', message = '' }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <>
          <div className="action-feedback-spinner">
            <LoadingOutlined spin />
          </div>
          <p className="action-feedback-action">{action}</p>
        </>
      );
    }
    if (status === 'success') {
      return (
        <>
          <CheckCircleOutlined className="action-feedback-icon action-feedback-icon-success" />
          <p className="action-feedback-message">{message}</p>
        </>
      );
    }
    if (status === 'error') {
      return (
        <>
          <CloseCircleOutlined className="action-feedback-icon action-feedback-icon-error" />
          <p className="action-feedback-message">{message}</p>
        </>
      );
    }
    return null;
  };

  const canClose = status !== 'loading';

  return (
    <div className="action-feedback-overlay" onClick={canClose ? onClose : undefined}>
      <div className="action-feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="action-feedback-content">
          {renderContent()}
        </div>
        {canClose && (
          <div className="action-feedback-actions">
            <button type="button" className="action-feedback-btn-close" onClick={onClose}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActionFeedbackModal;
