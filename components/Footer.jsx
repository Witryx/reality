import React from 'react';
import { Home, Mail, Phone } from 'lucide-react';

const Footer = ({ t, onNavigate }) => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div className="brand-mark" style={{ boxShadow: 'none' }}>
              <Home size={20} color="#0b182f" />
            </div>
            <div>
              <div className="brand-name" style={{ color: '#eaf0f6' }}>Egypt Real Estate</div>
              <div style={{ fontSize: 13, color: '#cdd9e8' }}>Red Sea · Premium Realty</div>
            </div>
          </div>
          <p style={{ color: '#eaf0f6', lineHeight: 1.7, maxWidth: 420 }}>{t.footer.tagline}</p>
        </div>

        <div>
          <h4 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, color: '#f7c288' }}>
            Menu
          </h4>
          <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
            {['properties', 'howItWorks', 'about', 'reviews', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => onNavigate(section)}
                className="nav-link"
                style={{ textAlign: 'left', width: 'fit-content', padding: 0, color: '#cdd9e8' }}
              >
                {t.nav[section]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, color: '#f7c288' }}>
            Contact
          </h4>
          <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#eaf0f6' }}>
              <Phone size={16} color="#c7a04f" />
              {t.contact.info.phone}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#eaf0f6' }}>
              <Mail size={16} color="#c7a04f" />
              {t.contact.info.email}
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 18, color: '#cdd9e8', fontSize: 13 }}>
        {t.footer.rights}
      </div>
    </div>
  </footer>
);

export default Footer;
