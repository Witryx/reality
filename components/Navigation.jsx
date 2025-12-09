import React from 'react';
import { Home, Menu, Phone, X } from 'lucide-react';

const navOrder = ['properties', 'howItWorks', 'about', 'reviews', 'contact'];

const Navigation = ({
  t,
  language,
  onLanguageChange,
  onNavigate,
  mobileOpen,
  onToggleMobile,
}) => (
  <header className="nav-shell">
    <div className="nav">
      <div className="nav-left">
        <div className="brand-mark">
          <Home size={22} color="#0b182f" />
        </div>
        <div>
          <div className="brand-name">Egypt Real Estate</div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>Red Sea · CZ / EN / DE</div>
        </div>
      </div>

      <div className="nav-links">
        {navOrder.map((section) => (
          <button key={section} className="nav-link" onClick={() => onNavigate(section)}>
            {t.nav[section]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="lang-switch">
          {['cz', 'en', 'de'].map((lang) => (
            <button
              key={lang}
              className={`lang-btn ${language === lang ? 'active' : ''}`}
              onClick={() => onLanguageChange(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
        <button
          className="btn-primary"
          onClick={() => onNavigate('contact')}
          style={{ background: 'var(--navy)', boxShadow: '0 12px 28px rgba(15,44,77,0.25)' }}
        >
          <Phone size={16} />
          {t.hero.cta1}
        </button>
        <button className="menu-toggle" onClick={onToggleMobile} aria-label="Toggle menu">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </div>

    {mobileOpen && (
      <div className="nav-mobile">
        {navOrder.map((section) => (
          <button
            key={section}
            className="nav-link"
            style={{ textAlign: 'left', width: '100%' }}
            onClick={() => onNavigate(section)}
          >
            {t.nav[section]}
          </button>
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          {['cz', 'en', 'de'].map((lang) => (
            <button
              key={lang}
              className={`lang-btn ${language === lang ? 'active' : ''}`}
              onClick={() => onLanguageChange(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    )}
  </header>
);

export default Navigation;
