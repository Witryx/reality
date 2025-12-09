import React, { useState } from 'react';
import { ArrowRight, Bed, MapPin, Maximize } from 'lucide-react';
import SectionHeader from './SectionHeader';

const Properties = ({ t }) => {
  const [selected, setSelected] = useState(null);

  return (
    <section
      id="properties"
      className="section"
      style={{ background: '#eef6f1', borderTop: '1px solid rgba(15,44,77,0.06)' }}
    >
      <div className="container">
        <SectionHeader
          eyebrow={t.nav.properties}
          title={t.properties.title}
          subtitle={t.properties.subtitle}
        />

        <div className="listing-grid">
          {t.properties.items.map((property) => (
            <article key={property.name} className="listing-card">
              <div className="listing-thumb">
                <img src={property.image} alt={property.name} />
                {property.tag && <div className="tag-chip">{property.tag}</div>}
                <div className="price-tag">{property.price}</div>
              </div>
              <div className="listing-body">
                <h3 className="listing-title">{property.name}</h3>
                <div className="listing-meta">
                  <span className="meta-chip">
                    <MapPin size={16} color="#c7a04f" />
                    {property.location}
                  </span>
                  <span className="meta-chip">
                    <Maximize size={16} color="#c7a04f" />
                    {property.sqm} {t.properties.sqm}
                  </span>
                  <span className="meta-chip">
                    <Bed size={16} color="#c7a04f" />
                    {property.rooms} {t.properties.rooms}
                  </span>
                </div>
                <button
                  className="btn-secondary"
                  style={{ width: 'fit-content', marginTop: 6 }}
                  onClick={() => setSelected(property)}
                >
                  {t.properties.detail}
                  <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && (
        <div className="detail-overlay" onClick={() => setSelected(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            <div className="detail-grid">
              <div className="detail-image">
                <img src={selected.image} alt={selected.name} />
              </div>
              <div className="detail-info">
                <div className="eyebrow" style={{ color: '#0f2c4d' }}>{selected.location}</div>
                <h3 className="title" style={{ fontSize: '28px', margin: '10px 0 8px' }}>{selected.name}</h3>
                <p style={{ color: '#0f2c4d', fontWeight: 700, marginBottom: 10 }}>{selected.price}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                  <span className="meta-chip"><Maximize size={16} color="#c7a04f" />{selected.sqm} {t.properties.sqm}</span>
                  <span className="meta-chip"><Bed size={16} color="#c7a04f" />{selected.rooms} {t.properties.rooms}</span>
                  <a
                    className="meta-chip"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.location)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <MapPin size={16} color="#c7a04f" />
                    {selected.location}
                  </a>
                </div>
                <div style={{ color: '#333', lineHeight: 1.6, marginBottom: 12 }}>
                  {t.properties.subtitle}
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <button className="btn-primary" style={{ justifyContent: 'center' }}>
                    {t.hero.cta1}
                  </button>
                  <button className="btn-secondary" style={{ justifyContent: 'center' }}>
                    {t.hero.cta2}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Properties;
