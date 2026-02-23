import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screens/Login/Login';
import Dashboard from './screens/Dashboard/Dashboard';
import AdminLayout from './screens/AdminLayout/AdminLayout';
import AdminInicio from './screens/AdminInicio/AdminInicio';
import GestaoColaboradores from './screens/GestaoColaboradores/GestaoColaboradores';
import GestaoGrupos from './screens/GestaoGrupos/GestaoGrupos';
import GestaoDocumentos from './screens/GestaoDocumentos/GestaoDocumentos';
import GestaoMarcadores from './screens/GestaoMarcadores/GestaoMarcadores';
import { initDb } from './db/documentosDb';
import { initAcoesDb } from './db/acoesDb';
import AppHeader from './components/AppHeader/AppHeader';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    Promise.all([initDb(), initAcoesDb()])
      .then(() => setDbReady(true))
      .catch((err) => {
        console.error('Erro ao inicializar bancos de dados:', err);
        setDbReady(true);
      });
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('portal_juridico_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
        localStorage.removeItem('portal_juridico_user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('portal_juridico_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('portal_juridico_user');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (!dbReady) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary, #f5f5f5)',
        fontFamily: 'var(--font-family-primary, sans-serif)'
      }}>
        <p style={{ color: 'var(--text-secondary, #666)', fontSize: '1rem' }}>Carregando documentos...</p>
      </div>
    );
  }

  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <>
          <AppHeader user={user} onLogout={handleLogout} />
        <Routes>
        <Route path="/" element={<Navigate to="/documentos" replace />} />
        <Route path="/documentos" element={<Dashboard user={user} onLogout={handleLogout} />} />
        {user?.profile === 'Administrador' && (
          <Route path="/admin" element={<AdminLayout user={user} onLogout={handleLogout} />}>
            <Route index element={<AdminInicio />} />
            <Route path="colaboradores" element={<GestaoColaboradores />} />
            <Route path="grupos" element={<GestaoGrupos />} />
            <Route path="documentos" element={<GestaoDocumentos user={user} />} />
            <Route path="marcadores" element={<GestaoMarcadores />} />
            <Route path="assuntos" element={<Navigate to="/admin/marcadores" replace />} />
            <Route path="categorias" element={<Navigate to="/admin/marcadores" replace />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to="/documentos" replace />} />
        </Routes>
        </>
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;
