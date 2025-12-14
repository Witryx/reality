import React from 'react';

const SectionHeader = ({ eyebrow, title, subtitle, align = 'center', tone = 'default' }) => {
  const isLight = tone === 'light';
  return (
    <div className="section-header" style={{ textAlign: align }}>
      {eyebrow && (
        <div className="eyebrow" style={isLight ? { color: '#d9b45a' } : undefined}>
          {eyebrow}
        </div>
      )}
      <h2 className="title" style={isLight ? { color: '#fff' } : undefined}>
        {title}
      </h2>
      {subtitle && (
        <p className="subtitle" style={isLight ? { color: 'rgba(255,255,255,0.8)' } : undefined}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
