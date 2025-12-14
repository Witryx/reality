import React, { useEffect, useState } from "react";
import { ArrowRight, Bed, MapPin, Maximize } from "lucide-react";
import SectionHeader from "./SectionHeader";

const Properties = ({ t, language = "cz" }) => {
  const [selected, setSelected] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showSold, setShowSold] = useState(false);
  const [data, setData] = useState({ active: [], sold: [] });
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const toImages = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        // not JSON, fall through
      }
      return value ? [value] : [];
    }
    return [];
  };

  const splitProperties = (list) => {
    const active = [];
    const sold = [];
    list.forEach((item) => {
      if (item?.sold) sold.push(item);
      else active.push(item);
    });
    return { active, sold };
  };

  useEffect(() => {
    setData({ active: [], sold: [] });
    setLoadError("");
  }, [language, t]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selected]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/properties?lang=${language}`, { signal: controller.signal });
        const resData = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(resData?.error || "Nepodarilo se nacist nemovitosti.");
        const list = Array.isArray(resData.properties) ? resData.properties : [];
        setData(splitProperties(list));
      } catch (error) {
        if (error.name !== "AbortError") {
          setLoadError(error.message || "Nepodarilo se nacist nemovitosti.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => controller.abort();
  }, [language, t]);

  const listings = showSold ? data.sold : data.active;
  const selectedImages = selected
    ? (() => {
        const imgs = toImages(selected.images);
        if (imgs.length) return imgs;
        if (selected.image) return [selected.image];
        return [];
      })()
    : [];
  const currentImage = selectedImages[activeImageIndex] || selectedImages[0];

  return (
    <section
      id="properties"
      className="section"
      style={{
        background:
          "linear-gradient(180deg, rgba(247,236,220,0.95), rgba(239,214,176,0.9), rgba(246,236,220,0.96))",
        borderTop: "1px solid rgba(217,179,106,0.3)",
      }}
    >
      <div className="container">
        <SectionHeader
          eyebrow={t.nav.properties}
          title={t.properties.title}
          subtitle={t.properties.subtitle}
        />

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 26, flexWrap: "wrap" }}>
          <button
            className="btn-secondary"
            style={{
              background: showSold
                ? "linear-gradient(135deg, #fffaf1, #f4e6d0)"
                : "linear-gradient(135deg, #0b2338, #0f7082 60%, #1fbac6)",
              color: showSold ? "var(--navy)" : "#fff",
              borderColor: showSold ? "rgba(217,179,106,0.35)" : "rgba(217,179,106,0.6)",
              boxShadow: showSold ? "0 10px 24px rgba(7,23,40,0.08)" : "0 12px 28px rgba(7,23,40,0.24)",
            }}
            onClick={() => setShowSold(false)}
          >
            {t.properties.toggles.active}
          </button>
          <button
            className="btn-secondary"
            style={{
              background: showSold
                ? "linear-gradient(135deg, #0b2338, #0f7082 60%, #1fbac6)"
                : "linear-gradient(135deg, #fffaf1, #f4e6d0)",
              color: showSold ? "#fff" : "var(--navy)",
              borderColor: showSold ? "rgba(217,179,106,0.6)" : "rgba(217,179,106,0.35)",
              boxShadow: showSold ? "0 12px 28px rgba(7,23,40,0.24)" : "0 10px 24px rgba(7,23,40,0.08)",
            }}
            onClick={() => setShowSold(true)}
          >
            {t.properties.toggles.sold}
          </button>
        </div>

        {loading && <div style={{ textAlign: "center", color: "#6b7280", marginBottom: 12 }}>Načítám...</div>}
        {loadError && <div style={{ textAlign: "center", color: "#b42318", marginBottom: 12 }}>{loadError}</div>}

        {!listings.length && (
          <div style={{ textAlign: "center", color: "#6b7280", marginBottom: 12 }}>
            Žádné nemovitosti k zobrazení.
          </div>
        )}

        <div className="listing-grid">
          {listings.map((property) => (
            <article key={property.id || property.name} className="listing-card">
              <div className="listing-thumb">
                {(() => {
                  const imgs = toImages(property.images);
                  const cover = imgs[0] || property.image;
                  return (
                    <img
                      src={cover}
                      alt={property.name}
                      style={showSold ? { filter: "grayscale(1)" } : undefined}
                    />
                  );
                })()}
                {(() => {
                  const tagLabel = property.sold
                    ? (language === "cz" ? "PROD\u00c1NO" : language === "de" ? "VERKAUFT" : "SOLD")
                    : property.tag;
                  return tagLabel ? <div className="tag-chip">{tagLabel}</div> : null;
                })()}
                <div className="price-tag">{property.price}</div>
              </div>
              <div className="listing-body">
                <h3 className="listing-title">{property.name}</h3>
                <div className="listing-meta">
                  <a
                    className="meta-chip"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <MapPin size={16} color="#d9b45a" />
                    {property.location}
                  </a>
                  <span className="meta-chip">
                    <Maximize size={16} color="#d9b45a" />
                    {property.sqm} {t.properties.sqm}
                  </span>
                  <span className="meta-chip">
                    <Bed size={16} color="#d9b45a" />
                    {property.rooms} {t.properties.rooms}
                  </span>
                </div>
                <button
                  className="btn-secondary"
                  style={{ width: "fit-content", marginTop: 6 }}
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
            <button className="close-btn" onClick={() => setSelected(null)}>x</button>
            <div className="detail-grid">
              <div className="detail-image">
                {currentImage ? (
                  <img src={currentImage} alt={selected.name} />
                ) : (
                  <div style={{ padding: 20, textAlign: "center", color: "#6b7280" }}>Žádný obrázek</div>
                )}
                {selectedImages.length > 1 && (
                  <div className="thumb-row">
                    {selectedImages.map((img, idx) => (
                      <button
                        key={img + idx}
                        className={`thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                        onClick={() => setActiveImageIndex(idx)}
                        type="button"
                        aria-label={`Obrázek ${idx + 1}`}
                      >
                        <img src={img} alt={`${selected.name} náhled ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="detail-info">
                <div className="eyebrow" style={{ color: "var(--gold)" }}>{selected.location}</div>
                <h3 className="title" style={{ fontSize: "28px", margin: "10px 0 8px" }}>{selected.name}</h3>
                <p style={{ color: "var(--gold)", fontWeight: 700, marginBottom: 10 }}>{selected.price}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                  <span className="meta-chip"><Maximize size={16} color="#d9b45a" />{selected.sqm} {t.properties.sqm}</span>
                  <span className="meta-chip"><Bed size={16} color="#d9b45a" />{selected.rooms} {t.properties.rooms}</span>
                  <a
                    className="meta-chip"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.location)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <MapPin size={16} color="#d9b45a" />
                    {selected.location}
                  </a>
                </div>
                <div style={{ color: "#1a2a38", lineHeight: 1.6, marginBottom: 12 }}>
                  {t.properties.subtitle}
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  <button className="btn-primary" style={{ justifyContent: "center" }}>
                    {t.hero.cta1}
                  </button>
                  <button className="btn-secondary" style={{ justifyContent: "center" }}>
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
