import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchOutlined,
  ArrowLeftOutlined,
  PlayCircleFilled,
  CloseOutlined,
  TagOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import AppFooter from '../../components/AppFooter/AppFooter';
import './Treinamentos.css';

function Treinamentos() {
  const navigate = useNavigate();
  const [treinamentos, setTreinamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    fetch('/treinamentos.json')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar treinamentos');
        return res.json();
      })
      .then((data) => {
        setTreinamentos(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar treinamentos:', err);
        setLoadError('Não foi possível carregar os treinamentos.');
        setIsLoading(false);
      });
  }, []);

  const parseTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
    return String(tags)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const filteredTreinamentos = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();
    if (!termo) return treinamentos;
    return treinamentos.filter((item) => {
      const titulo = (item.titulo || '').toLowerCase();
      const tags = parseTags(item.tags).join(' ').toLowerCase();
      return titulo.includes(termo) || tags.includes(termo);
    });
  }, [treinamentos, searchTerm]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenVideo = (item) => {
    setSelectedVideo(item);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    if (!selectedVideo) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedVideo]);

  return (
    <div className="treinamentos-container">
      <section className="treinamentos-hero">
        <div className="treinamentos-hero-content">
          <button
            type="button"
            className="treinamentos-back-button"
            onClick={handleBack}
            aria-label="Voltar"
          >
            <ArrowLeftOutlined /> Voltar
          </button>

          <div className="treinamentos-header-text">
            <h1 className="treinamentos-title">Central de Treinamentos</h1>
            <p className="treinamentos-subtitle">
              Assista aos nossos vídeos e aprenda a tirar o máximo proveito do Portal Jurídico.
            </p>
          </div>

          <form
            className="treinamentos-search-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="treinamentos-search-pill">
              <SearchOutlined className="treinamentos-search-icon" />
              <input
                type="text"
                className="treinamentos-search-input"
                placeholder="Buscar por título ou tag"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar treinamentos"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="treinamentos-search-clear"
                  onClick={() => setSearchTerm('')}
                  aria-label="Limpar busca"
                >
                  <CloseOutlined />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="treinamentos-section">
        <div className="treinamentos-section-header">
          <h2 className="treinamentos-section-title">
            Treinamentos em destaque
          </h2>
          {!isLoading && !loadError && (
            <span className="treinamentos-count">
              {filteredTreinamentos.length}{' '}
              {filteredTreinamentos.length === 1 ? 'vídeo' : 'vídeos'}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="treinamentos-loading">
            <LoadingOutlined className="treinamentos-loading-icon" />
            <p>Carregando treinamentos...</p>
          </div>
        ) : loadError ? (
          <div className="treinamentos-empty">
            <p>{loadError}</p>
          </div>
        ) : filteredTreinamentos.length === 0 ? (
          <div className="treinamentos-empty">
            <p>Nenhum treinamento encontrado para a sua busca.</p>
          </div>
        ) : (
          <div className="treinamentos-grid">
            {filteredTreinamentos.map((item) => {
              const tags = parseTags(item.tags);
              return (
                <article key={item.id || item.titulo} className="treinamento-card">
                  <button
                    type="button"
                    className="treinamento-card-media"
                    onClick={() => handleOpenVideo(item)}
                    aria-label={`Assistir: ${item.titulo}`}
                    style={{
                      backgroundImage: item.imagemUrl
                        ? `url(${item.imagemUrl})`
                        : undefined
                    }}
                  >
                    <span className="treinamento-card-overlay" aria-hidden="true" />
                    <PlayCircleFilled className="treinamento-card-play" aria-hidden="true" />
                  </button>
                  <div className="treinamento-card-body">
                    <h3 className="treinamento-card-title">{item.titulo}</h3>
                    <p className="treinamento-card-description">{item.descricao}</p>
                    {tags.length > 0 && (
                      <div className="treinamento-card-tags">
                        {tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="treinamento-card-tag">
                            <TagOutlined /> {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      className="treinamento-card-button"
                      onClick={() => handleOpenVideo(item)}
                    >
                      <PlayCircleFilled /> Assistir
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selectedVideo && (
        <div
          className="treinamento-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Reprodução: ${selectedVideo.titulo}`}
          onClick={handleCloseVideo}
        >
          <div
            className="treinamento-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="treinamento-modal-header">
              <h3>{selectedVideo.titulo}</h3>
              <button
                type="button"
                className="treinamento-modal-close"
                onClick={handleCloseVideo}
                aria-label="Fechar"
              >
                <CloseOutlined />
              </button>
            </div>
            <div className="treinamento-modal-player">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {selectedVideo.descricao && (
              <p className="treinamento-modal-description">{selectedVideo.descricao}</p>
            )}
          </div>
        </div>
      )}

      <AppFooter />
    </div>
  );
}

export default Treinamentos;
