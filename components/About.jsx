import React from "react";
import { ShieldCheck, Users, Clock, Sparkles, HeartHandshake } from "lucide-react";
import SectionHeader from "./SectionHeader";

const trustItems = (language) => [
  {
    icon: <ShieldCheck size={18} color="#0b2338" />,
    title: language === 'cz' ? 'Transparentnost' : language === 'de' ? 'Transparenz' : 'Transparency',
    desc: language === 'cz' ? 'Jasný proces a smlouvy' : language === 'de' ? 'Klarer Prozess und Verträge' : 'Clear process and contracts',
  },
  {
    icon: <Users size={18} color="#0b2338" />,
    title: language === 'cz' ? 'Osobní přístup' : language === 'de' ? 'Individuell' : 'Personal approach',
    desc: language === 'cz' ? 'Každý klient je jedinečný' : language === 'de' ? 'Jeder Kunde ist einzigartig' : 'Every client is unique',
  },
  {
    icon: <HeartHandshake size={18} color="#0b2338" />,
    title: language === 'cz' ? 'Důvěra' : language === 'de' ? 'Vertrauen' : 'Trust',
    desc: language === 'cz' ? 'Prověření partneři a právníci' : language === 'de' ? 'Geprüfte Partner & Anwälte' : 'Vetted partners & lawyers',
  },
  {
    icon: <Clock size={18} color="#0b2338" />,
    title: language === 'cz' ? 'Podpora 24/7' : language === 'de' ? 'Support 24/7' : 'Support 24/7',
    desc: language === 'cz' ? 'Jsme tu, kdykoli potřebujete' : language === 'de' ? 'Immer erreichbar' : 'We are here anytime',
  },
  {
    icon: <Sparkles size={18} color="#0b2338" />,
    title: language === 'cz' ? 'Kvalita' : language === 'de' ? 'Qualität' : 'Quality',
    desc: language === 'cz' ? 'Pouze ověřené projekty' : language === 'de' ? 'Nur geprüfte Projekte' : 'Only verified projects',
  },
];

const About = ({ t, language }) => {
  const bullets = t.personal?.bullets || [];

  return (
    <section
      id="about"
      className="section"
      style={{
        background: 'linear-gradient(180deg, rgba(247,236,220,0.95), rgba(239,214,176,0.9), rgba(246,236,220,0.96))',
        borderTop: '1px solid rgba(217,179,106,0.3)',
      }}
    >
      <div className="container">
        <SectionHeader
          eyebrow={t.nav.about}
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255,252,245,0.95), rgba(242,224,194,0.94))',
            border: '1px solid rgba(217,179,106,0.35)',
            borderRadius: 24,
            padding: '34px',
            boxShadow: '0 28px 54px rgba(7,23,40,0.18)',
            display: 'grid',
            gap: 22,
          }}
        >
          <div>
            <p style={{ color: '#0c1b27', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>
              {t.about.story}
            </p>
          </div>

          {bullets.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {bullets.map((item, idx) => (
                <div
                  key={`${item}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(255,252,245,0.94), rgba(244,228,205,0.94))',
                    border: '1px solid rgba(217,179,106,0.32)',
                    boxShadow: '0 14px 28px rgba(7,23,40,0.12)',
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1fbac6, #0b2338)',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: 'var(--navy)' }}>{item}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {trustItems(language).map((item) => (
              <div
                className="trust-card"
                key={item.title}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, rgba(255,252,245,0.96), rgba(242,224,194,0.92))',
                  border: '1px solid rgba(217,179,106,0.3)',
                  borderRadius: 16,
                  padding: '12px 14px',
                  boxShadow: '0 16px 30px rgba(7,23,40,0.14)',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, rgba(255,252,245,0.96), rgba(244,228,205,0.92))',
                    border: '1px solid rgba(217,179,106,0.3)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
