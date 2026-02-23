import { useState } from 'react';
import {
  MailOutlined,
  LockOutlined,
  GlobalOutlined,
  DownOutlined,
  FileTextOutlined,
  DollarOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { colaboradoresMock } from '../../data/colaboradores';
import logoImage from '../../assets/Logo_topbar.png';
import './Login.css';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro ao digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validação básica
    if (!credentials.username || !credentials.password) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      // Simulação de autenticação LDAP
      // Em produção, isso seria uma chamada à API de autenticação institucional
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulação: aceita qualquer credencial para demonstração
      // Em produção, validar com LDAP do SESC
      if (onLogin) {
        const adminEmails = ['admin@sescdf.com.br', 'administrador@sescdf.com.br'];
        const isAdmin = adminEmails.includes(credentials.username.toLowerCase());
        const colaborador = colaboradoresMock.find(
          (c) => c.email.toLowerCase() === credentials.username.toLowerCase()
        );
        const userId = colaborador ? colaborador.id : (isAdmin ? 1 : 3);

        onLogin({
          id: userId,
          username: colaborador ? colaborador.nome : credentials.username,
          email: credentials.username,
          profile: isAdmin ? 'Administrador' : (credentials.username.includes('gejur') ? 'GEJUR' : 'UsuarioInterno')
        });
      }
    } catch (err) {
      setError('Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Painel Esquerdo - Informativo */}
        <div className="login-info-panel">
          <div className="info-content">
            <div className="login-logo-container-into">
            <img src={logoImage} alt="Sesc Fecomércio Senac - Portal Jurídico" className="login-logo" />
          </div>
            <p className="info-description">
              O Portal Jurídico do SESC oferece acesso centralizado aos Informativos Jurídicos, 
              promovendo uniformização de entendimentos e segurança jurídica para todas as áreas 
              técnicas e administrativas da instituição.
            </p>
          </div>
          
          <div className="info-footer">
            <div className="language-selector">
              <GlobalOutlined className="language-icon" />
              <span>Português</span>
              <DownOutlined className="dropdown-icon" />
            </div>
            <div className="info-links">
              <a href="#">
                <FileTextOutlined /> Termos
              </a>
              <a href="#">
                <DollarOutlined /> Planos
              </a>
              <a href="#">
                <CustomerServiceOutlined /> Contato
              </a>
            </div>
          </div>
        </div>

        {/* Painel Direito - Formulário */}
        <div className="login-form-panel">
          <form className="login-form" onSubmit={handleSubmit}>
          
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                E-MAIL INSTITUCIONAL
              </label>
              <div className="form-input-wrapper">
                <MailOutlined className="input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  placeholder="exemplo@sesc.com.br"
                  value={credentials.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                SENHA
              </label>
              <div className="form-input-wrapper">
                <LockOutlined className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-checkbox"
                />
                <span>Lembrar acesso</span>
              </label>
              <a href="#" className="forgot-password">Esqueceu a senha?</a>
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Autenticando...' : 'Entrar no Portal'}
            </button>

            <p className="restricted-access">ACESSO RESTRITO A COLABORADORES</p>
          </form>

          <div className="form-footer">
            <p className="support-link">
              Dúvidas? Entre em contato com o <a href="#" className="support-ti">Suporte TI</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
