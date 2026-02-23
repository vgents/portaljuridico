import { useState, useMemo, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './PdfFullView.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const DEFAULT_ZOOM = 1.3;
const MOBILE_BREAKPOINT = 768;

function PdfFullView({ file, className = '', isRevogado = false }) {
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT);
  const containerRef = useRef(null);

  const fileSource = useMemo(() => {
    if (!file) return null;
    return typeof file === 'string' ? { url: file } : file;
  }, [file]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const updateWidth = () => setContainerWidth(el.clientWidth);
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, [numPages]);

  const onLoadSuccess = ({ numPages: total }) => setNumPages(total);
  const onLoadError = (err) => setError(err?.message || 'Erro ao carregar PDF');

  const pageWidth = isMobile
    ? (containerWidth && containerWidth > 0 ? containerWidth : typeof window !== 'undefined' ? Math.min(window.innerWidth, 420) : 360)
    : null;
  const pageScale = !isMobile ? DEFAULT_ZOOM : undefined;

  if (!fileSource) return null;
  if (error) {
    return (
      <div className={`pdf-full-view pdf-full-view-error ${className}`.trim()}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`pdf-full-view ${className}`.trim()}>
      <Document
        file={fileSource}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={
          <div className="pdf-full-view-loading">
            <span>Carregando documento…</span>
          </div>
        }
      >
        {numPages &&
          Array.from({ length: numPages }, (_, i) => (
            <div key={i} className={`pdf-full-view-page-wrapper ${isRevogado ? 'has-watermark' : ''}`}>
              <Page
                pageNumber={i + 1}
                width={pageWidth}
                scale={pageScale}
                className="pdf-full-view-page"
                renderTextLayer
                renderAnnotationLayer
              />
            </div>
          ))}
      </Document>
    </div>
  );
}

export default PdfFullView;
