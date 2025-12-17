import React from 'react';
import { Home, Mail, Phone } from 'lucide-react';

const Footer = ({ t, onNavigate }) => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div className="brand-mark" style={{ boxShadow: 'none' }}>
              <Home size={20} color="#d9b45a" />
            </div>
            <div>
              <div className="brand-name" style={{ color: '#f6efdd' }}>Egyptsko Česká Reality</div>
              <div style={{ fontSize: 13, color: '#d8e4f2' }}>Hurghada · Nemovitosti</div>
            </div>
          </div>
          <p style={{ color: '#f6efdd', lineHeight: 1.7, maxWidth: 420 }}>{t.footer.tagline}</p>
        </div>

        <div>
          <h4 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, color: '#d9b45a' }}>
            Menu
          </h4>
          <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
            {['properties', 'howItWorks', 'about', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => onNavigate(section)}
                className="nav-link"
                style={{ textAlign: 'left', width: 'fit-content', padding: 0, color: '#d8e4f2' }}
              >
                {t.nav[section]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, color: '#d9b45a' }}>
            Contact
          </h4>
          <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f6efdd' }}>
              <Phone size={16} color="#d9b45a" />
              {t.contact.info.phone}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f6efdd' }}>
              <Mail size={16} color="#d9b45a" />
              {t.contact.info.email}
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.16)', paddingTop: 18, color: '#d8e4f2', fontSize: 13 }}>
        {t.footer.rights}
      </div>
    </div>
  </footer>
);

export default Footer;
