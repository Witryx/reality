import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bed, MapPin, Maximize } from "lucide-react";
import SectionHeader from "./SectionHeader";

const Properties = ({ t, language = "cz" }) => {
  const [selected, setSelected] = useState(null);
  const [showSold, setShowSold] = useState(false);
  const fallbackActive = useMemo(() => t.properties.items || [], [t]);
  const fallbackSold = useMemo(() => t.properties.soldItems || [], [t]);
  const [data, setData] = useState({ active: fallbackActive, sold: fallbackSold });
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

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
    setData({ active: fallbackActive, sold: fallbackSold });
    setLoadError("");
  }, [fallbackActive, fallbackSold, t]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/properties?lang=${language}`, { signal: controller.signal });
        const resData = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(resData?.error || "load_failed");
        const list = Array.isArray(resData.properties) ? resData.properties : [];
        if (list.length) {
          setData(splitProperties(list));
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setLoadError(error.message || "Nepodařilo se načíst nemovitosti.");
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

  return (
    <section
      id="properties"
      className="section"
      style={{ background: "#eef6f1", borderTop: "1px solid rgba(15,44,77,0.06)" }}
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
              background: showSold ? "#fff" : "#0f2c4d",
              color: showSold ? "var(--navy)" : "#fff",
              borderColor: showSold ? "rgba(15,44,77,0.14)" : "transparent",
              boxShadow: showSold ? "none" : "0 10px 24px rgba(15,44,77,0.22)",
            }}
            onClick={() => setShowSold(false)}
          >
            {t.properties.toggles.active}
          </button>
          <button
            className="btn-secondary"
            style={{
              background: showSold ? "#0f2c4d" : "#fff",
              color: showSold ? "#fff" : "var(--navy)",
              borderColor: showSold ? "transparent" : "rgba(15,44,77,0.14)",
              boxShadow: showSold ? "0 10px 24px rgba(15,44,77,0.22)" : "none",
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
                <img
                  src={property.image}
                  alt={property.name}
                  style={showSold ? { filter: "grayscale(1)" } : undefined}
                />
                {property.tag && <div className="tag-chip">{property.tag}</div>}
                <div className="price-tag">{property.price}
                </div>
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
                    <MapPin size={16} color="#c7a04f" />
                    {property.location}
                  </a>
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
                <img src={selected.image} alt={selected.name} />
              </div>
              <div className="detail-info">
                <div className="eyebrow" style={{ color: "#0f2c4d" }}>{selected.location}</div>
                <h3 className="title" style={{ fontSize: "28px", margin: "10px 0 8px" }}>{selected.name}</h3>
                <p style={{ color: "#0f2c4d", fontWeight: 700, marginBottom: 10 }}>{selected.price}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                  <span className="meta-chip"><Maximize size={16} color="#c7a04f" />{selected.sqm} {t.properties.sqm}</span>
                  <span className="meta-chip"><Bed size={16} color="#c7a04f" />{selected.rooms} {t.properties.rooms}</span>
                  <a
                    className="meta-chip"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.location)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <MapPin size={16} color="#c7a04f" />
                    {selected.location}
                  </a>
                </div>
                <div style={{ color: "#333", lineHeight: 1.6, marginBottom: 12 }}>
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
