import { Link } from 'react-router-dom';
import { LeftOutlined, TagsOutlined } from '@ant-design/icons';
import '../GestaoGrupos/GestaoGrupos.css';

function GestaoAssuntos() {
  return (
    <div className="gestao-page-container">
      <header className="gestao-page-header">
        <div className="gestao-page-header-content">
          <Link to="/admin" className="back-button">
            <LeftOutlined />
          </Link>
          <div className="gestao-page-title-wrapper">
            <TagsOutlined className="gestao-page-title-icon" />
            <div>
              <h1 className="gestao-page-title">Gestão de Assuntos</h1>
              <p className="gestao-page-subtitle">Gerencie assuntos e tags</p>
            </div>
          </div>
        </div>
      </header>
      <main className="gestao-page-main">
        <div className="gestao-page-content">
          <p className="gestao-page-placeholder">Conteúdo em construção.</p>
        </div>
      </main>
    </div>
  );
}

export default GestaoAssuntos;
