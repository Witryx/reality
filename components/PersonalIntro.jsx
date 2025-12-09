import React from 'react';

const PersonalIntro = ({ t, onConsult }) => (
  <section className="section personal-section">
    <div className="container personal-grid">
      <div className="personal-image-wrap">
        <div className="personal-image-bg" />
        <div className="personal-image">
          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&auto=format&fit=crop"
            alt="Váš osobní makléř"
          />
        </div>
      </div>
      <div>
        <div className="eyebrow" style={{ color: '#0f2c4d' }}>
          Martin Novák
        </div>
        <h3 style={{ fontSize: 'clamp(30px, 4vw, 44px)', margin: '12px 0 10px', color: '#0f2c4d' }}>
          {t.personal.title}
        </h3>
        <p style={{ color: '#111', lineHeight: 1.7, marginBottom: 16 }}>{t.personal.subtitle}</p>
        <div className="personal-bullets">
          {t.personal.bullets.map((item) => (
            <div className="personal-bullet" key={item}>
              <div className="personal-dot" />
              <span style={{ color: '#0f2c4d', fontWeight: 600 }}>{item}</span>
            </div>
          ))}
        </div>
        <button
          className="btn-primary"
          onClick={onConsult}
          style={{ background: '#0f2c4d', boxShadow: '0 14px 30px rgba(15,44,77,0.25)' }}
        >
          {t.personal.cta}
        </button>
      </div>
    </div>
  </section>
);

export default PersonalIntro;
