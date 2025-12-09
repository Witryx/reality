import React from 'react';
import { Mail, MessageCircle, Phone, Send } from 'lucide-react';
import SectionHeader from './SectionHeader';

const microCopy = {
  cz: 'Ozveme se do 24 hodin a připravíme vám konkrétní scénáře nákupu nebo prodeje.',
  en: 'We reply within one business day with tailored options for your goals.',
  de: 'Wir melden uns innerhalb von 24 Stunden mit passenden Vorschlägen.',
};

const Contact = ({ t, formData, onChange, onSubmit, language }) => (
  <section
    id="contact"
    className="section"
    style={{ background: 'linear-gradient(135deg, #0f2c4d 0%, #2f6fa3 100%)', color: '#fff' }}
  >
    <div className="container">
      <SectionHeader
        eyebrow={t.nav.contact}
        title={t.contact.title}
        subtitle={t.contact.subtitle}
        tone="light"
      />

      <div className="contact-grid">
        <div className="contact-card" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
          <div className="contact-actions">
            <button className="btn-secondary" style={{ background: '#fff', color: 'var(--navy)' }}>
              <Mail size={16} />
              {language === 'cz' ? 'Napište nám email' : language === 'de' ? 'Schreiben Sie uns' : 'Email us'}
            </button>
            <button className="btn-primary" style={{ background: '#25d366', color: '#0f2c4d', boxShadow: '0 12px 26px rgba(37,211,102,0.35)' }}>
              <MessageCircle size={16} />
              WhatsApp
            </button>
          </div>
          <div className="contact-info" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Phone size={18} color="#f7c288" />
              <strong>{t.contact.info.phone}</strong>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Mail size={18} color="#f7c288" />
              <span>{t.contact.info.email}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <MessageCircle size={18} color="#f7c288" />
              <span>{t.contact.info.whatsapp}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="badge">HQ</div>
              <span>{t.contact.info.address}</span>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#dfe8f5', marginTop: 10 }}>{microCopy[language]}</div>
        </div>

        <form className="contact-card" onSubmit={onSubmit}>
          <div className="form-field">
            <label style={{ color: 'var(--muted)', fontSize: 13 }}>{t.contact.form.name}</label>
            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              placeholder={t.contact.form.name}
            />
          </div>
          <div className="form-field">
            <label style={{ color: 'var(--muted)', fontSize: 13 }}>{t.contact.form.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
              placeholder={t.contact.form.email}
            />
          </div>
          <div className="form-field">
            <label style={{ color: 'var(--muted)', fontSize: 13 }}>{t.contact.form.phone}</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={onChange}
              required
              placeholder={t.contact.form.phone}
            />
          </div>
          <div className="form-field">
            <label style={{ color: 'var(--muted)', fontSize: 13 }}>{t.contact.form.message}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={onChange}
              required
              placeholder={t.contact.form.message}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {t.contact.form.send}
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  </section>
);

export default Contact;
