import React from 'react';
import { Mail, MessageCircle, Phone, Send } from 'lucide-react';
import SectionHeader from './SectionHeader';

const microCopy = {
  cz: 'Jsme často přímo v Egyptě, proto doporučujeme WhatsApp pro hovory i zprávy. Pokud by hlavní makléř nebyl dostupný, zavolejte prosím na české číslo výše.',
  en: 'We are often on the ground in Egypt, so WhatsApp is best for calls or messages. If the lead agent is unavailable, please call the Czech number above.',
  de: 'Wir sind häufig direkt in Ägypten, daher empfehlen wir WhatsApp für Anrufe und Nachrichten. Wenn der Hauptmakler nicht erreichbar ist, rufen Sie bitte die tschechische Nummer oben an.',
};

const Contact = ({ t, formData, onChange, onSubmit, language, formStatus = {} }) => {
  const sending = Boolean(formStatus.sending);
  const error = formStatus.error;
  const success = formStatus.success;

  const whatsappLabel =
    language === 'cz'
      ? 'Napište na WhatsApp'
      : language === 'de'
      ? 'Schreiben Sie auf WhatsApp'
      : 'Message on WhatsApp';

  const directContactLabel =
    language === 'cz' ? 'Přímý kontakt' : language === 'de' ? 'Direkter Kontakt' : 'Direct contact';
  const channelBadge =
    language === 'cz' ? 'WhatsApp · Telefon' : language === 'de' ? 'WhatsApp · Telefon' : 'WhatsApp · Phone';
  const phoneSubtitle =
    language === 'cz'
      ? 'CZ/EN • nejrychlejší spojení'
      : language === 'de'
      ? 'CZ/EN • schnellste Verbindung'
      : 'CZ/EN • fastest response';

  return (
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
        <SectionHeader eyebrow={t.nav.contact} title={t.contact.title} subtitle={t.contact.subtitle} tone="light" />

        <div className="contact-grid">
          <div
            className="contact-card"
            style={{
              background: 'linear-gradient(140deg, rgba(255,252,245,0.14), rgba(31,186,198,0.08))',
              color: '#f4efe4',
              borderColor: 'rgba(217,179,106,0.4)',
              boxShadow: '0 22px 48px rgba(0,0,0,0.28)',
            }}
          >
            <div
              className="contact-actions"
              style={{
                alignItems: 'stretch',
                gap: 12,
                padding: '6px 6px 0',
                background: 'rgba(4,16,33,0.4)',
                borderRadius: 14,
              }}
            >
              <a
                className="btn-primary"
                href="https://wa.me/420722140302"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #25d366, #1ebe57 60%, #0f9f3d)',
                  color: '#0b2338',
                  boxShadow: '0 14px 32px rgba(10, 157, 74, 0.3)',
                  textDecoration: 'none',
                  width: '100%',
                  justifyContent: 'center',
                  gap: 8,
                  border: 'none',
                }}
              >
                <MessageCircle size={16} />
                {whatsappLabel}
              </a>
            </div>

            <div
              className="contact-info"
              style={{
                background:
                  'radial-gradient(120% 140% at 20% 10%, rgba(217,179,106,0.16), transparent 55%), linear-gradient(145deg, rgba(255,252,245,0.12), rgba(31,186,198,0.12))',
                borderColor: 'rgba(217,179,106,0.55)',
                color: '#f4efe4',
                boxShadow: '0 20px 42px rgba(0,0,0,0.26), inset 0 0 0 1px rgba(255,255,255,0.12)',
                borderRadius: 18,
                marginTop: 14,
                padding: '16px 16px 14px',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: '#f0dbaa' }}>
                  {directContactLabel}
                </span>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'rgba(15,142,158,0.16)',
                    border: '1px solid rgba(31,186,198,0.4)',
                    fontSize: 12,
                    color: '#d9f2ff',
                  }}
                >
                  {channelBadge}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: 'rgba(4,16,33,0.38)',
                  border: '1px solid rgba(217,179,106,0.45)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
                }}
              >
                <Phone size={18} color="#d9b45a" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <strong style={{ fontSize: 17 }}>{t.contact.info.phone}</strong>
                  <span style={{ fontSize: 12, color: '#dfe8f5' }}>{phoneSubtitle}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(217,179,106,0.28)',
                }}
              >
                <Mail size={18} color="#d9b45a" />
                <span>{t.contact.info.email}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(217,179,106,0.28)',
                }}
              >
                <MessageCircle size={18} color="#d9b45a" />
                <span>{t.contact.info.whatsapp}</span>
              </div>
            </div>

            <div style={{ fontSize: 13, color: '#dfe8f5', marginTop: 12, lineHeight: 1.6 }}>
              {microCopy[language]}
            </div>
          </div>

          <form className="contact-card" onSubmit={onSubmit}>
            <div className="form-field">
              <label style={{ color: 'var(--muted)', fontSize: 13 }}>{t.contact.form.name}</label>
              <input name="name" value={formData.name} onChange={onChange} required placeholder={t.contact.form.name} />
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
            <button
              type="submit"
              className="btn-primary"
              disabled={sending}
              style={{ width: '100%', justifyContent: 'center', opacity: sending ? 0.85 : 1 }}
            >
              {sending ? `${t.contact.form.send}...` : t.contact.form.send}
              <Send size={16} />
            </button>
            {error && (
              <div className="review-status error" style={{ marginTop: 8 }}>
                {error}
              </div>
            )}
            {success && (
              <div className="review-status success" style={{ marginTop: 8 }}>
                {success}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
