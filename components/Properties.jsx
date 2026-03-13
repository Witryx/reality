import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, Bed, ChevronLeft, ChevronRight, Mail, MapPin, Maximize, Maximize2, Phone, X } from "lucide-react";
import SectionHeader from "./SectionHeader";

const loadingCopy = {
  cz: "Nacitam nabidku...",
  en: "Loading listings...",
  de: "Angebote werden geladen...",
};

const errorCopy = {
  cz: "Nepodarilo se nacist nabidku.",
  en: "Failed to load listings.",
  de: "Angebote konnten nicht geladen werden.",
};

const emptyCopy = {
  cz: "Momentalne nic k zobrazeni.",
  en: "No listings to show right now.",
  de: "Keine Angebote verfuegbar.",
};

const moreCopy = {
  cz: "vice",
  en: "more",
  de: "mehr",
};

const noImageCopy = {
  cz: "Zadny obrazek",
  en: "No image",
  de: "Kein Bild",
};

const Properties = ({ t, language = "cz" }) => {
  const [selected, setSelected] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [data, setData] = useState({ active: [], sold: [] });
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const phoneNote = {
    cz: "CZ/EN · nejrychlejší spojení",
    en: "CZ/EN · fastest response",
    de: "CZ/EN · schnellste Verbindung",
  };
  const renderDescription = (raw = "") => {
    const normalized = String(raw).replace(/\\n/g, "\n");
    const paragraphs = normalized
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean);

    return paragraphs.map((para, idx) => {
      const lines = para.split(/\n+/).map((ln) => ln.trim()).filter(Boolean);
      return (
        <p key={idx} style={{ margin: 0, lineHeight: 1.6, color: "#1a2a38" }}>
          {lines.map((ln, i) => (
            <React.Fragment key={i}>
              {ln}
              {i < lines.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  const toImages = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        // ignore parse errors
      }
      return value ? [value] : [];
    }
    return [];
  };
  const withCoverFirst = (images = [], coverImage = null) => {
    const cleaned = images.filter(Boolean);
    if (!coverImage) return cleaned;
    return [coverImage, ...cleaned.filter((src) => src !== coverImage)];
  };
  const toVideos = (value) => {
    const isVideoUrl = (src = "") => /\.(mp4|webm|ogg|mov)$/i.test(src);
    if (Array.isArray(value)) return value.filter((v) => v && isVideoUrl(String(v)));
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter((v) => v && isVideoUrl(String(v)));
      } catch {
        // ignore
      }
      return isVideoUrl(value) ? [value] : [];
    }
    return [];
  };
  const toMediaItems = (item) => {
    if (!item) return [];
    const imageList = (() => {
      const imgs = withCoverFirst(toImages(item.images), item.image);
      if (imgs.length) return imgs;
      if (item.image) return [item.image];
      return [];
    })();
    const videoList = (() => {
      if (item.media && Array.isArray(item.media)) {
        return item.media
          .filter((m) => m && m.type === "video" && m.src)
          .map((m) => m.src);
      }
      const vids = toVideos(item.videos || item.video);
      return vids;
    })();
    const media = [
      ...imageList.map((src) => ({ type: "image", src })),
      ...videoList.map((src) => ({ type: "video", src })),
    ];
    return media;
  };

  const splitProperties = (list = []) => {
    const active = [];
    const sold = [];
    list.forEach((item) => {
      if (item?.sold) sold.push(item);
      else active.push(item);
    });
    return { active, sold };
  };

  useEffect(() => {
    setActiveImageIndex(0);
    setDescriptionExpanded(false);
    setIsLightboxOpen(false);
    if (selected) {
      document.body.classList.add("detail-open");
    } else {
      document.body.classList.remove("detail-open");
    }

    return () => document.body.classList.remove("detail-open");
  }, [selected]);

  useEffect(() => {
    const controller = new AbortController();

    const readList = (resData) => {
      if (Array.isArray(resData)) return resData;
      if (Array.isArray(resData?.properties)) return resData.properties;
      return [];
    };

    const filterByLanguage = (list = []) =>
      list.filter((item) => !item?.language || item.language === language);

    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const apiRes = await fetch(`/api/properties?lang=${language}`, { signal: controller.signal });
        if (!apiRes.ok) throw new Error("api_load_failed");
        const apiData = await apiRes.json().catch(() => ({}));
        const apiList = filterByLanguage(readList(apiData));

        const staticRes = await fetch(`/data/properties.json`, { signal: controller.signal });
        if (!staticRes.ok && !apiList.length) throw new Error("load_failed");
        const staticData = staticRes.ok ? await staticRes.json().catch(() => ({})) : {};
        const staticList = filterByLanguage(readList(staticData));
        const fallback = Array.isArray(t?.properties?.items) ? t.properties.items : [];

        const unique = new Map();
        [...apiList, ...staticList, ...fallback].forEach((item) => {
          if (!item) return;
          const key = `${String(item.name || "").trim()}|${String(item.location || "").trim()}`;
          if (!unique.has(key)) unique.set(key, item);
        });
        const combined = Array.from(unique.values());
        setData(splitProperties(combined));
      } catch (error) {
        if (error.name === "AbortError") return;
        const fallback = Array.isArray(t?.properties?.items) ? t.properties.items : [];
        setData(splitProperties(fallback));
        setLoadError(errorCopy[language] || errorCopy.en);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => controller.abort();
  }, [language, t]);

  const listings = data.active;
  const selectedMedia = selected ? toMediaItems(selected) : [];
  const totalMedia = selectedMedia.length;
  const hasGallery = totalMedia > 1;
  const currentMedia = selectedMedia[activeImageIndex] || selectedMedia[0];
  const currentIsImage = currentMedia?.type !== "video";
  const currentSrc = currentMedia?.src;
  const goNextImage = useCallback(() => {
    if (!totalMedia) return;
    setActiveImageIndex((idx) => (idx + 1) % totalMedia);
  }, [totalMedia]);
  const goPrevImage = useCallback(() => {
    if (!totalMedia) return;
    setActiveImageIndex((idx) => (idx - 1 + totalMedia) % totalMedia);
  }, [totalMedia]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowRight") goNextImage();
      if (event.key === "ArrowLeft") goPrevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNextImage, goPrevImage, isLightboxOpen]);

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

        {loading && (
          <div style={{ textAlign: "center", color: "#6b7280", marginBottom: 12 }}>
            {loadingCopy[language] || loadingCopy.en}
          </div>
        )}
        {loadError && <div style={{ textAlign: "center", color: "#b42318", marginBottom: 12 }}>{loadError}</div>}

        {!listings.length && (
          <div style={{ textAlign: "center", color: "#6b7280", marginBottom: 12 }}>
            {emptyCopy[language] || emptyCopy.en}
          </div>
        )}

        <div className="listing-grid">
          {listings.map((property) => (
            <article key={property.id || property.name} className="listing-card">
              <div className="listing-thumb">
                {(() => {
                  const imgs = toImages(property.images);
                  const cover = property.image || imgs[0];
                  return (
                    <img
                      src={cover}
                      alt={property.name}
                    />
                  );
                })()}
                {(() => {
                  const tagLabel = property.tag;
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
                  <div className="detail-image-main">
                    {hasGallery && (
                      <button
                        className="image-nav left"
                        onClick={goPrevImage}
                      type="button"
                      aria-label={language === "cz" ? "Predchozi fotka" : language === "de" ? "Vorheriges Foto" : "Previous photo"}
                    >
                      <ChevronLeft size={18} />
                    </button>
                  )}
                  {currentSrc ? (
                    currentMedia.type === "video" ? (
                      <div className="detail-video-frame">
                        <video
                          className="detail-video"
                          src={currentSrc}
                          controls
                          playsInline
                          preload="metadata"
                        />
                        <span className="media-badge">Video</span>
                      </div>
                    ) : (
                      <button
                        className="image-frame"
                        onClick={() => currentSrc && setIsLightboxOpen(true)}
                        type="button"
                        aria-label={language === "cz" ? "Zvetsit fotografii" : language === "de" ? "Foto vergroessern" : "Expand photo"}
                      >
                        <img src={currentSrc} alt={selected.name} />
                        <span className="image-zoom-hint">
                          <Maximize2 size={16} />
                          {language === "cz" ? "Zvetsit" : language === "de" ? "Vergroessern" : "Expand"}
                        </span>
                      </button>
                    )
                  ) : (
                    <div style={{ padding: 20, textAlign: "center", color: "#6b7280" }}>{noImageCopy[language] || noImageCopy.en}</div>
                  )}
                  {hasGallery && (
                    <button
                      className="image-nav right"
                      onClick={goNextImage}
                      type="button"
                      aria-label={language === "cz" ? "Dalsi fotka" : language === "de" ? "Naechstes Foto" : "Next photo"}
                    >
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
                {hasGallery && (
                  <div className="thumb-row">
                    {selectedMedia.map((media, idx) => (
                      <button
                        key={media.src + idx}
                        className={`thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                        onClick={() => setActiveImageIndex(idx)}
                        type="button"
                        aria-label={`Obrazek ${idx + 1}`}
                      >
                        {media.type === "video" ? (
                          <div className="thumb-video">
                            <video src={media.src} muted playsInline preload="metadata" />
                            <span className="thumb-badge">Video</span>
                          </div>
                        ) : (
                          <img src={media.src} alt={`${selected.name} nahled ${idx + 1}`} />
                        )}
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
                <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                  {(() => {
                    const text = selected.longDescription || selected.description || t.properties.subtitle;
                    if (!text) return null;
                    return renderDescription(text);
                  })()}
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  <a
                    className="btn-primary"
                    href="https://wa.me/420723063837"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      justifyContent: "center",
                      textDecoration: "none",
                      width: "100%",
                      background: "linear-gradient(135deg, #25d366, #1ebe57 60%, #0f9f3d)",
                      color: "#0b2338",
                      borderColor: "rgba(12,140,65,0.6)",
                      boxShadow: "0 14px 32px rgba(10, 157, 74, 0.3)",
                    }}
                  >
                    {language === "cz" ? "Kontaktovat přes WhatsApp" : language === "de" ? "Über WhatsApp kontaktieren" : "Contact via WhatsApp"}
                  </a>
                  <div className="detail-contact-card">
                    <div className="detail-contact-icon">
                      <Mail size={18} />
                    </div>
                    <div className="detail-contact-copy">
                      <div className="detail-contact-label">
                        {language === "cz" ? "E-mail" : language === "de" ? "E-Mail" : "Email"}
                      </div>
                      <div className="detail-contact-title">{t?.contact?.info?.email || "Info@egyptskoceskareality.cz"}</div>
                      <div className="detail-contact-note">
                        {language === "cz"
                          ? "Pokud nejste na WhatsAppu, napiste sem."
                          : language === "de"
                            ? "Falls Sie kein WhatsApp nutzen, schreiben Sie hier."
                            : "Not on WhatsApp? Email us here."}
                      </div>
                    </div>
                  </div>
                  <div className="detail-contact-card">
                    <div className="detail-contact-icon">
                      <Phone size={18} />
                    </div>
                    <div className="detail-contact-copy">
                      <div className="detail-contact-label">
                        {language === "cz" ? "Telefonní číslo" : language === "de" ? "Telefonnummer" : "Phone number"}
                      </div>
                      <div className="detail-contact-title">{t?.contact?.info?.phone || "+420 723 063 837"}</div>
                      <div className="detail-contact-note">{phoneNote[language] || phoneNote.en}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLightboxOpen && currentIsImage && currentSrc && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-body" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
              type="button"
              aria-label={language === "cz" ? "Zavrit nahled" : language === "de" ? "Vorschau schliessen" : "Close preview"}
            >
              <X size={18} />
            </button>
            {hasGallery && (
              <button
                className="lightbox-nav left"
                onClick={goPrevImage}
                type="button"
                aria-label={language === "cz" ? "Predchozi fotka" : language === "de" ? "Vorheriges Foto" : "Previous photo"}
              >
                <ChevronLeft size={22} />
              </button>
            )}
            <img className="lightbox-image" src={currentSrc} alt={`${selected.name} nahled`} />
            {hasGallery && (
              <button
                className="lightbox-nav right"
                onClick={goNextImage}
                type="button"
                aria-label={language === "cz" ? "Dalsi fotka" : language === "de" ? "Naechstes Foto" : "Next photo"}
              >
                <ChevronRight size={22} />
              </button>
            )}
            {hasGallery && (
              <div className="lightbox-counter">
                {activeImageIndex + 1} / {totalMedia}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Properties;


