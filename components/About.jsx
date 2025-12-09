import React from "react";
import { ShieldCheck, Users, Clock, Sparkles } from "lucide-react";

const trustItems = (language) => [
  {
    icon: <ShieldCheck size={18} color="#0f2c4d" />,
    title: language === 'cz' ? 'Transparentnost' : language === 'de' ? 'Transparenz' : 'Transparency',
    desc: language === 'cz' ? 'Jasny proces a smlouvy' : language === 'de' ? 'Klarer Prozess und Vertraege' : 'Clear process and contracts',
  },
  {
    icon: <Users size={18} color="#0f2c4d" />,
    title: language === 'cz' ? 'Osobni pristup' : language === 'de' ? 'Individuell' : 'Personal approach',
    desc: language === 'cz' ? 'Kazdy klient je jedinecny' : language === 'de' ? 'Jeder Kunde ist einzigartig' : 'Every client is unique',
  },
  {
    icon: <Sparkles size={18} color="#0f2c4d" />,
    title: language === 'cz' ? 'Kvalita' : language === 'de' ? 'Qualitat' : 'Quality',
    desc: language === 'cz' ? 'Pouze overene projekty' : language === 'de' ? 'Nur geprufte Projekte' : 'Only verified projects',
  },
  {
    icon: <Clock size={18} color="#0f2c4d" />,
    title: language === 'cz' ? 'Podpora 24/7' : language === 'de' ? 'Support 24/7' : 'Support 24/7',
    desc: language === 'cz' ? 'Jsme tu, kdykoli potrebujete' : language === 'de' ? 'Immer erreichbar' : 'We are here anytime',
  },
];

const About = ({ t, language }) => (
  <section
    id="about"
    className="section"
    style={{ background: '#eef6f1', borderTop: '1px solid rgba(15,44,77,0.06)' }}
  >
    <div className="container">
      <div className="about-grid">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=1200&auto=format&fit=crop"
            alt="Real estate advisor in Egypt"
          />
        </div>
        <div>
          <div className="eyebrow">{t.nav.about}</div>
          <h3 className="title" style={{ marginTop: 10 }}>
            {t.about.title}
          </h3>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16, whiteSpace: 'pre-line' }}>
            {t.about.subtitle}
          </p>
          <p style={{ color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {t.about.story}
          </p>
          <div className="trust-grid">
            {trustItems(language).map((item) => (
              <div className="trust-card" key={item.title}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: '#eef3f9',
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
    </div>
  </section>
);

export default About;
