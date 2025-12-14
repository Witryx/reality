import React from 'react';
import SectionHeader from './SectionHeader';

const Process = ({ t }) => (
  <section
    id="howItWorks"
    className="section"
    style={{
      background: 'linear-gradient(180deg, rgba(247,236,220,0.95), rgba(239,214,176,0.9), rgba(246,236,220,0.96))',
      borderTop: '1px solid rgba(217,179,106,0.3)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: '-10% -20% auto auto',
        width: '420px',
        height: '420px',
        background: 'radial-gradient(circle, rgba(31,186,198,0.12) 0%, transparent 60%), radial-gradient(circle at 40% 30%, rgba(217,179,106,0.14), transparent 70%)',
        filter: 'blur(8px)',
      }}
    />
    <div className="container">
      <SectionHeader
        eyebrow={t.nav.howItWorks}
        title={t.howItWorks.title}
        subtitle={t.howItWorks.subtitle}
      />

      {[t.howItWorks.steps.slice(0, 3), t.howItWorks.steps.slice(3)].map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="process-grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginBottom: rowIndex === 0 ? 16 : 0 }}
        >
          {row.map((step, index) => {
            const number = rowIndex * 3 + index + 1;
            return (
              <div
                key={step.title}
                className="step-card"
                style={{
                  border: '1px solid rgba(217,179,106,0.3)',
                  background: 'linear-gradient(145deg, rgba(255,252,245,0.94), rgba(244,228,205,0.92))',
                  boxShadow: '0 18px 32px rgba(7,23,40,0.14)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div className="step-number" style={{ background: 'linear-gradient(135deg, #0b2338, #0f7082 65%, #1fbac6)', boxShadow: '0 8px 18px rgba(7,23,40,0.22)' }}>
                    {number}
                  </div>
                  <div
                    style={{
                      height: 2,
                      flex: 1,
                      background: 'linear-gradient(90deg, rgba(217,179,106,0.8), transparent)',
                      borderRadius: 999,
                    }}
                  />
                </div>
                <h4 style={{ margin: '8px 0 6px', fontSize: 18, color: 'var(--navy)' }}>{step.title}</h4>
                <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      ))}

    </div>
  </section>
);

export default Process;
