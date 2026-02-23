import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  YoutubeOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined
} from '@ant-design/icons';
import './AppFooter.css';

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer-content">
        <div className="app-footer-logo-column">
          <div className="app-footer-logo">
            <h3>Sesc</h3>
            <p>Fecomércio Senac</p>
          </div>
          <div className="app-footer-social">
            <a href="#" aria-label="YouTube" className="app-footer-social-icon">
              <YoutubeOutlined />
            </a>
            <a href="#" aria-label="Facebook" className="app-footer-social-icon">
              <FacebookOutlined />
            </a>
            <a href="#" aria-label="Instagram" className="app-footer-social-icon">
              <InstagramOutlined />
            </a>
            <a href="#" aria-label="Email" className="app-footer-social-icon">
              <MailOutlined />
            </a>
            <a href="#" aria-label="LinkedIn" className="app-footer-social-icon">
              <LinkedinOutlined />
            </a>
          </div>
        </div>

        <div className="app-footer-links">
          <div className="app-footer-column">
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

          <div className="app-footer-column">
            <h4>SAC</h4>
            <p className="app-footer-info">
              <EnvironmentOutlined className="app-footer-icon" />
              Serviço Social do Comércio
            </p>
            <p className="app-footer-info">
              <MailOutlined className="app-footer-icon" />
              <a href="mailto:sac@sescdf.com.br">sac@sescdf.com.br</a>
            </p>
            <p className="app-footer-info">
              <PhoneOutlined className="app-footer-icon" />
              <a href="tel:08000617617">0800 0617 617</a>
            </p>
          </div>

          <div className="app-footer-column">
            <h4>Ouvidoria</h4>
            <p className="app-footer-info">
              <MailOutlined className="app-footer-icon" />
              <a href="mailto:ouvidoria@sescdf.com.br">ouvidoria@sescdf.com.br</a>
            </p>
            <p className="app-footer-info">
              <WhatsAppOutlined className="app-footer-icon" />
              <a href="#">WhatsApp</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
