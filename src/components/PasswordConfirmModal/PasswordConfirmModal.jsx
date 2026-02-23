import { useState } from 'react';
import { LockOutlined } from '@ant-design/icons';
import './PasswordConfirmModal.css';

/**
 * Modal para confirmação de ações sensíveis que exigem senha.
 * Ex: revogar documento.
 */
function PasswordConfirmModal({ isOpen, onClose, title = 'Confirmar ação', hint = 'Informe sua senha de acesso para continuar.', onConfirm }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError('');
    if (!password.trim()) {
      setError('Informe sua senha.');
      return;
    }
    try {
      const valid = await onConfirm?.(password);
      if (valid) {
        setPassword('');
        onClose?.();
      } else {
        setError('Senha incorreta. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao verificar senha. Tente novamente.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="password-confirm-overlay" onClick={handleClose}>
      <div className="password-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="password-confirm-header">
          <LockOutlined className="password-confirm-icon" />
          <h2 className="password-confirm-title">{title}</h2>
        </div>
        <form className="password-confirm-body" onSubmit={handleSubmit}>
          <p className="password-confirm-hint">{hint}</p>
          <label className="password-confirm-label">
            Senha
            <input
              type="password"
              className="password-confirm-input"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className="password-confirm-error" role="alert">{error}</p>
          )}
          <div className="password-confirm-actions">
            <button type="button" className="password-confirm-btn-cancel" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="password-confirm-btn-submit">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordConfirmModal;
