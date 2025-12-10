import React from 'react';
import { ArrowRight, ShieldCheck, Star, CheckCircle } from 'lucide-react';

const agentTitles = {
  cz: 'Osobní makléř v Egyptě',
  en: 'Personal advisor in Egypt',
  de: 'Ihr Berater in Ägypten',
};

const Hero = ({ t, language, onPrimaryCta, onSecondaryCta }) => (
  <section id="top" className="hero">
    <div className="container hero-grid">
      <div className="hero-copy">
        <h1 className="display">{t.hero.title}</h1>
        <p className="subtitle" style={{ textAlign: 'left' }}>
          {t.hero.subtitle}
        </p>
        <div className="btn-row">
          <button className="btn-primary" onClick={onPrimaryCta}>
            {t.hero.cta1}
            <ArrowRight size={16} />
          </button>
          <button className="btn-secondary" onClick={onSecondaryCta}>
            {t.hero.cta2}
          </button>
        </div>
        <div className="hero-highlights">
          {t.hero.highlights.map((item) => (
            <div key={item} className="pill" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
              <ShieldCheck size={16} color="#f7c288" />
              {item}
            </div>
          ))}
        </div>
        <div className="hero-support">
          {[
            t.nav.about,
            language === 'cz' ? 'Ověřené projekty' : language === 'de' ? 'Geprüfte Projekte' : 'Verified projects',
            language === 'cz' ? '24/7 podpora v češtině' : language === 'de' ? '24/7 Support' : '24/7 local support',
          ].map((text) => (
            <div className="support-item" key={text}>
              <CheckCircle size={16} color="#f7c288" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-media">
        <img
          src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200&h=900&fit=crop"
          alt="Luxury property in Egypt"
        />
        <div className="media-overlay" />
        <div className="stat-card">
          <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--gold)' }}>8+</div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            {language === 'cz'
              ? 'let zkušeností'
              : language === 'de'
              ? 'Jahre Erfahrung'
              : 'years of expertise'}
          </div>
        </div>
        <div className="agent-card">
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: 'var(--gradient)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
              color: '#0b182f',
            }}
          >
            MN
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            <span className="badge">
              {language === 'cz'
                ? 'Osobní podpora'
                : language === 'de'
                ? 'Persönliche Betreuung'
                : 'Personal support'}
            </span>
            <strong style={{ fontSize: 16 }}>Martin Novák</strong>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>{agentTitles[language]}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
