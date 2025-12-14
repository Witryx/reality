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
    style={{
      background:
        'radial-gradient(120% 120% at 12% 10%, rgba(217,179,106,0.22), transparent 55%), radial-gradient(120% 90% at 86% 8%, rgba(31,186,198,0.18), transparent 52%), linear-gradient(160deg, #041021 0%, #0b2338 50%, #0f7082 100%)',
      color: '#f4efe4',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div className="container">
      <SectionHeader
        eyebrow={t.nav.contact}
        title={t.contact.title}
        subtitle={t.contact.subtitle}
        tone="light"
      />

      <div className="contact-grid">
        <div
          className="contact-card"
          style={{
            background: 'linear-gradient(145deg, rgba(255,252,245,0.14), rgba(31,186,198,0.08))',
            color: '#f4efe4',
            borderColor: 'rgba(217,179,106,0.4)',
            boxShadow: '0 22px 48px rgba(0,0,0,0.28)',
          }}
        >
          <div className="contact-actions">
            <button
              className="btn-secondary"
              style={{
                background: 'linear-gradient(135deg, #fffaf1, #f4e6d0)',
                color: 'var(--navy)',
                borderColor: 'rgba(217,179,106,0.45)',
              }}
            >
              <Mail size={16} />
              {language === 'cz' ? 'Napište nám email' : language === 'de' ? 'Schreiben Sie uns' : 'Email us'}
            </button>
            <button
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #f0c77b, #1fbac6)',
                color: '#0b2338',
                boxShadow: '0 14px 32px rgba(7,23,40,0.3)',
              }}
            >
              <MessageCircle size={16} />
              WhatsApp
            </button>
          </div>
          <div
            className="contact-info"
            style={{
              background: 'linear-gradient(135deg, rgba(255,252,245,0.16), rgba(31,186,198,0.12))',
              borderColor: 'rgba(217,179,106,0.45)',
              color: '#f4efe4',
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Phone size={18} color="#d9b45a" />
              <strong>{t.contact.info.phone}</strong>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Mail size={18} color="#d9b45a" />
              <span>{t.contact.info.email}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <MessageCircle size={18} color="#d9b45a" />
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
