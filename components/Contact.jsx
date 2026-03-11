import React from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import SectionHeader from './SectionHeader';

const microCopy = {
  cz: 'Jsme často přímo v Egyptě, proto doporučujeme WhatsApp pro hovory i zprávy. Pokud by hlavní makléř nebyl dostupný, zavolejte prosím na české číslo níže.',
  en: 'We are often on the ground in Egypt, so WhatsApp is best for calls or messages. If the lead agent is unavailable, please call the Czech number below.',
  de: 'Wir sind häufig direkt in Ägypten, daher am besten per WhatsApp anrufen oder schreiben. Wenn der Hauptmakler nicht erreichbar ist, rufen Sie bitte die tschechische Nummer unten an.',
};

const phoneNote = {
  cz: 'CZ/EN · nejrychlejší spojení',
  en: 'CZ/EN · fastest response',
  de: 'CZ/EN · schnellste Verbindung',
};

const Contact = ({ t, language }) => {
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
              padding: '22px 22px 18px',
            }}
          >
            <div className="contact-actions" style={{ justifyContent: 'center' }}>
              <a
                className="btn-primary"
                href="https://wa.me/420723063837"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #25d366, #1ebe57 60%, #0f9f3d)',
                  color: '#0b2338',
                  boxShadow: '0 14px 32px rgba(10, 157, 74, 0.3)',
                  textDecoration: 'none',
                  border: '1px solid rgba(12,140,65,0.4)',
                  minWidth: 220,
                  justifyContent: 'center',
                }}
              >
                <MessageCircle size={16} />
                {language === 'cz' ? 'Napište na WhatsApp' : language === 'de' ? 'WhatsApp schreiben' : 'Message on WhatsApp'}
              </a>
            </div>

            <div className="email-spotlight">
              <div className="email-icon">
                <Mail size={20} />
              </div>
              <div>
                <div className="eyebrow" style={{ color: '#fbe7c3', letterSpacing: 1.5, marginBottom: 6 }}>
                  {language === 'cz' ? 'E-mail' : language === 'de' ? 'E-Mail' : 'Email'}
                </div>
                <div className="email-address">{t.contact.info.email}</div>
                <div className="email-note">
                  {language === 'cz'
                    ? 'Pokud nejste na WhatsAppu, napište sem.'
                    : language === 'de'
                    ? 'Falls Sie kein WhatsApp nutzen, schreiben Sie hier.'
                    : 'Not on WhatsApp? Email us here.'}
                </div>
              </div>
            </div>

            <div className="phone-spotlight">
              <div className="phone-icon">
                <Phone size={20} />
              </div>
              <div style={{ display: 'grid', gap: 4 }}>
                <div className="eyebrow" style={{ color: '#fbe7c3', letterSpacing: 1.5 }}>
                  {language === 'cz' ? 'Telefonní číslo' : language === 'de' ? 'Telefonnummer' : 'Phone number'}
                </div>
                <a className="phone-number" href={`tel:${t.contact.info.phone.replace(/\s+/g, '')}`}>
                  {t.contact.info.phone}
                </a>
                <div className="phone-note">{phoneNote[language]}</div>
              </div>
            </div>

            <div className="contact-note">
              {microCopy[language] || microCopy.en}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
