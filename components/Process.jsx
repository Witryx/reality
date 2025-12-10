import React from 'react';
import SectionHeader from './SectionHeader';

const Process = ({ t }) => (
  <section
    id="howItWorks"
    className="section"
    style={{
      background: '#eef6f1',
      borderTop: '1px solid rgba(15,44,77,0.06)',
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
        background: 'radial-gradient(circle, rgba(47,111,163,0.08) 0%, transparent 60%)',
        filter: 'blur(6px)',
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
                  border: '1px solid rgba(15,44,77,0.08)',
                  background: '#f7fbf8',
                  boxShadow: '0 18px 30px rgba(15,44,77,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div className="step-number" style={{ background: '#0f2c4d', boxShadow: '0 6px 14px rgba(15,44,77,0.2)' }}>
                    {number}
                  </div>
                  <div
                    style={{
                      height: 2,
                      flex: 1,
                      background: 'linear-gradient(90deg, rgba(242,156,75,0.8), transparent)',
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
