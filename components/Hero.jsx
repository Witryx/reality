import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

const Hero = ({ t, language, onPrimaryCta, onSecondaryCta }) => (
  <section id="top" className="hero">
    <div className="container hero-grid single">
      <div className="hero-copy" style={{ textAlign: 'center', margin: '0 auto' }}>
        <h1 className="display">{t.hero.title}</h1>
        <p className="subtitle" style={{ textAlign: 'center' }}>
          {t.hero.subtitle}
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <button className="btn-primary" onClick={onPrimaryCta}>
            {t.hero.cta1}
            <ArrowRight size={16} />
          </button>
          <button className="btn-secondary" onClick={onSecondaryCta}>
            {t.hero.cta2}
          </button>
        </div>
        <div className="hero-highlights" style={{ justifyContent: 'center' }}>
          {t.hero.highlights.map((item) => (
            <div key={item} className="pill" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
              <ShieldCheck size={16} color="#d9b45a" />
              {item}
            </div>
          ))}
        </div>
        <div className="hero-support" style={{ justifyContent: 'center' }}>
          {[
            language === 'cz' ? 'Ověřené projekty' : language === 'de' ? 'Geprüfte Projekte' : 'Verified projects',
            language === 'cz' ? '24/7 podpora' : language === 'de' ? '24/7 Support' : '24/7 support',
          ].map((text) => (
            <div className="support-item" key={text}>
              <CheckCircle size={16} color="#d9b45a" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
