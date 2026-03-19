import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Bed, ChevronDown, ChevronLeft, ChevronRight, Mail, MapPin, Maximize, Maximize2, Phone, X } from "lucide-react";
import SectionHeader from "./SectionHeader";

const LISTINGS_PER_PAGE = 6;
const PRICE_FILTERS = {
  cz: [
    { id: "all", label: "Vsechny ceny", min: null, max: null, currency: "CZK" },
    { id: "0-500k", label: "Do 500 000 Kc", min: 0, max: 500000, currency: "CZK" },
    { id: "500k-1m", label: "500 000 - 1 000 000 Kc", min: 500000, max: 1000000, currency: "CZK" },
    { id: "1m-1.5m", label: "1 000 000 - 1 500 000 Kc", min: 1000000, max: 1500000, currency: "CZK" },
    { id: "1.5m-2m", label: "1 500 000 - 2 000 000 Kc", min: 1500000, max: 2000000, currency: "CZK" },
    { id: "2m-2.5m", label: "2 000 000 - 2 500 000 Kc", min: 2000000, max: 2500000, currency: "CZK" },
    { id: "2.5m-3m", label: "2 500 000 - 3 000 000 Kc", min: 2500000, max: 3000000, currency: "CZK" },
    { id: "3m-5m", label: "3 000 000 - 5 000 000 Kc", min: 3000000, max: 5000000, currency: "CZK" },
    { id: "5m-plus", label: "Vice nez 5 000 000 Kc", min: 5000000, max: null, currency: "CZK" },
  ],
  en: [
    { id: "all", label: "Any price", min: null, max: null, currency: "EUR" },
    { id: "0-20k", label: "Up to 20 000 EUR", min: 0, max: 20000, currency: "EUR" },
    { id: "20k-40k", label: "20 000 - 40 000 EUR", min: 20000, max: 40000, currency: "EUR" },
    { id: "40k-60k", label: "40 000 - 60 000 EUR", min: 40000, max: 60000, currency: "EUR" },
    { id: "60k-80k", label: "60 000 - 80 000 EUR", min: 60000, max: 80000, currency: "EUR" },
    { id: "80k-100k", label: "80 000 - 100 000 EUR", min: 80000, max: 100000, currency: "EUR" },
    { id: "100k-120k", label: "100 000 - 120 000 EUR", min: 100000, max: 120000, currency: "EUR" },
    { id: "120k-200k", label: "120 000 - 200 000 EUR", min: 120000, max: 200000, currency: "EUR" },
    { id: "200k-plus", label: "Above 200 000 EUR", min: 200000, max: null, currency: "EUR" },
  ],
  de: [
    { id: "all", label: "Alle Preise", min: null, max: null, currency: "EUR" },
    { id: "0-20k", label: "Bis 20 000 EUR", min: 0, max: 20000, currency: "EUR" },
    { id: "20k-40k", label: "20 000 - 40 000 EUR", min: 20000, max: 40000, currency: "EUR" },
    { id: "40k-60k", label: "40 000 - 60 000 EUR", min: 40000, max: 60000, currency: "EUR" },
    { id: "60k-80k", label: "60 000 - 80 000 EUR", min: 60000, max: 80000, currency: "EUR" },
    { id: "80k-100k", label: "80 000 - 100 000 EUR", min: 80000, max: 100000, currency: "EUR" },
    { id: "100k-120k", label: "100 000 - 120 000 EUR", min: 100000, max: 120000, currency: "EUR" },
    { id: "120k-200k", label: "120 000 - 200 000 EUR", min: 120000, max: 200000, currency: "EUR" },
    { id: "200k-plus", label: "Ueber 200 000 EUR", min: 200000, max: null, currency: "EUR" },
  ],
};

const priceFilterCopy = {
  cz: {
    label: "Cena",
    count: "nabidek",
    empty: "V tomhle cenovem rozmezi ted nic neni.",
  },
  en: {
    label: "Price",
    count: "listings",
    empty: "No listings in this price range right now.",
  },
  de: {
    label: "Preis",
    count: "Angebote",
    empty: "In diesem Preisbereich gibt es aktuell keine Angebote.",
  },
};

const parsePriceValue = (value, defaultCurrency = null) => {
  const raw = String(value || "").trim();
  if (!raw) return { amount: null, currency: defaultCurrency };

  const normalized = raw.toLowerCase();
  const currency = /(czk|kc)/i.test(normalized)
    ? "CZK"
    : /eur|\u20ac/i.test(normalized)
      ? "EUR"
      : defaultCurrency;

  const millionMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:m|mil\.?|mega|million)/i);
  if (millionMatch) {
    const amount = Number(millionMatch[1].replace(",", "."));
    return { amount: Number.isNaN(amount) ? null : Math.round(amount * 1000000), currency };
  }

  const digitOnly = normalized.replace(/[^\d]/g, "");
  if (!digitOnly) return { amount: null, currency };

  const amount = Number(digitOnly);
  return { amount: Number.isNaN(amount) ? null : amount, currency };
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

const getUniquePropertyMergeKey = (item = {}) =>
  item?.id ? `id:${item.id}` : `${String(item?.name || "").trim()}|${String(item?.location || "").trim()}|${String(item?.language || "cz").trim()}`;

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

const paginationCopy = {
  cz: {
    prev: "Predchozi strana",
    next: "Dalsi strana",
    page: "Strana",
    of: "z",
    showing: "Zobrazeno",
    from: "z",
  },
  en: {
    prev: "Previous page",
    next: "Next page",
    page: "Page",
    of: "of",
    showing: "Showing",
    from: "of",
  },
  de: {
    prev: "Vorherige Seite",
    next: "Naechste Seite",
    page: "Seite",
    of: "von",
    showing: "Angezeigt",
    from: "von",
  },
};

const Properties = ({ t, language = "cz" }) => {
  const [selected, setSelected] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [data, setData] = useState({ active: [], sold: [] });
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFilter, setPriceFilter] = useState("all");
  const [priceMenuOpen, setPriceMenuOpen] = useState(false);
  const filterBarRef = useRef(null);
  const priceMenuRef = useRef(null);
  const shouldScrollToFiltersRef = useRef(false);
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
      list.filter((item) => !item?.draft && (!item?.language || item.language === language));

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
          const key = getUniquePropertyMergeKey(item);
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

  useEffect(() => {
    setCurrentPage(1);
    setPriceFilter("all");
    setPriceMenuOpen(false);
  }, [language]);

  useEffect(() => {
    setCurrentPage(1);
  }, [priceFilter]);

  useEffect(() => {
    if (!priceMenuOpen) return;

    const handlePointerDown = (event) => {
      if (!priceMenuRef.current?.contains(event.target)) {
        setPriceMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setPriceMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [priceMenuOpen]);

  const listings = data.active;
  const priceText = priceFilterCopy[language] || priceFilterCopy.en;
  const activeFilters = PRICE_FILTERS[language] || PRICE_FILTERS.en;
  const activePriceFilter = priceFilter || "all";
  const selectedPriceRange = useMemo(
    () => activeFilters.find((item) => item.id === activePriceFilter) || activeFilters[0],
    [activeFilters, activePriceFilter]
  );
  const filteredListings = useMemo(() => {
    if (selectedPriceRange.id === "all") return listings;

    return listings.filter((property) => {
      const { amount, currency } = parsePriceValue(property?.price, selectedPriceRange.currency);

      if (amount === null) return false;
      if (selectedPriceRange.currency && currency && currency !== selectedPriceRange.currency) return false;
      if (selectedPriceRange.min !== null && amount < selectedPriceRange.min) return false;
      if (selectedPriceRange.max !== null && amount >= selectedPriceRange.max) return false;

      return true;
    });
  }, [listings, selectedPriceRange]);
  const totalPages = Math.max(1, Math.ceil(filteredListings.length / LISTINGS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedListings = useMemo(
    () =>
      filteredListings.slice(
        (safeCurrentPage - 1) * LISTINGS_PER_PAGE,
        safeCurrentPage * LISTINGS_PER_PAGE
      ),
    [filteredListings, safeCurrentPage]
  );
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);
  const startItem = filteredListings.length ? (safeCurrentPage - 1) * LISTINGS_PER_PAGE + 1 : 0;
  const endItem = filteredListings.length ? Math.min(safeCurrentPage * LISTINGS_PER_PAGE, filteredListings.length) : 0;
  const pageText = paginationCopy[language] || paginationCopy.en;
  const selectedMedia = useMemo(() => (selected ? toMediaItems(selected) : []), [selected]);
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

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  useEffect(() => {
    if (!shouldScrollToFiltersRef.current) return;

    shouldScrollToFiltersRef.current = false;

    const filterBar = filterBarRef.current;
    if (!filterBar) return;

    const top = filterBar.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({
      top: Math.max(top, 0),
      behavior: "smooth",
    });
  }, [safeCurrentPage]);

  const handlePriceFilterSelect = useCallback((filterId) => {
    setPriceMenuOpen(false);

    startTransition(() => {
      setPriceFilter(filterId);
    });
  }, []);

  const changePage = useCallback((nextPage) => {
    const boundedPage = Math.max(1, Math.min(totalPages, nextPage));
    if (boundedPage === safeCurrentPage) return;

    shouldScrollToFiltersRef.current = true;
    setPriceMenuOpen(false);
    startTransition(() => {
      setCurrentPage(boundedPage);
    });
  }, [safeCurrentPage, totalPages]);

  return (
    <section
      id="properties"
      className="section properties-section"
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

        {listings.length > 0 && (
          <div className="listing-filter-bar" ref={filterBarRef}>
            <div className="listing-filter-field">
              <div className="listing-filter-label">{priceText.label}</div>
              <div className="listing-filter-dropdown" ref={priceMenuRef}>
                <button
                  type="button"
                  className={`listing-filter-trigger ${priceMenuOpen ? "open" : ""}`}
                  onClick={() => setPriceMenuOpen((open) => !open)}
                  aria-haspopup="listbox"
                  aria-expanded={priceMenuOpen}
                >
                  <span className="listing-filter-trigger-text">{selectedPriceRange.label}</span>
                  <ChevronDown size={18} className={`listing-filter-trigger-icon ${priceMenuOpen ? "open" : ""}`} />
                </button>

                {priceMenuOpen && (
                  <div className="listing-filter-menu">
                    {activeFilters.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        className={`listing-filter-option ${selectedPriceRange.id === filter.id ? "active" : ""}`}
                        onClick={() => handlePriceFilterSelect(filter.id)}
                        aria-pressed={selectedPriceRange.id === filter.id}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="listing-filter-count">
              {filteredListings.length} / {listings.length} {priceText.count}
            </div>
          </div>
        )}

        {!filteredListings.length && (
          <div style={{ textAlign: "center", color: "#6b7280", marginBottom: 12 }}>
            {selectedPriceRange.id !== "all"
              ? priceText.empty
              : emptyCopy[language] || emptyCopy.en}
          </div>
        )}

        <div className="listing-grid">
          {paginatedListings.map((property) => (
            <article key={property.id || property.name} className="listing-card">
              <div className="listing-thumb">
                {(() => {
                  const imgs = toImages(property.images);
                  const cover = property.image || imgs[0];
                  return (
                    <img
                      src={cover}
                      alt={property.name}
                      loading="lazy"
                      decoding="async"
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
                  {property.sqm ? (
                    <span className="meta-chip">
                      <Maximize size={16} color="#d9b45a" />
                      {property.sqm} {t.properties.sqm}
                    </span>
                  ) : null}
                  {property.rooms ? (
                    <span className="meta-chip">
                      <Bed size={16} color="#d9b45a" />
                      {property.rooms} {t.properties.rooms}
                    </span>
                  ) : null}
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

        {filteredListings.length > LISTINGS_PER_PAGE && (
          <div className="listing-pagination-wrap">
            <div className="listing-pagination-summary">
              {pageText.showing} {startItem}-{endItem} {pageText.from} {filteredListings.length}
            </div>

            <div className="listing-pagination">
              <button
                type="button"
                className="page-btn"
                onClick={() => changePage(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                aria-label={pageText.prev}
              >
                <ChevronLeft size={16} />
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`page-btn ${pageNumber === safeCurrentPage ? "active" : ""}`}
                  onClick={() => changePage(pageNumber)}
                  aria-label={`${pageText.page} ${pageNumber}`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                className="page-btn"
                onClick={() => changePage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                aria-label={pageText.next}
              >
                <ChevronRight size={16} />
              </button>

              <span className="page-info">
                {pageText.page} {safeCurrentPage} {pageText.of} {totalPages}
              </span>
            </div>
          </div>
        )}
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
                        <img src={currentSrc} alt={selected.name} decoding="async" />
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
                          <img src={media.src} alt={`${selected.name} nahled ${idx + 1}`} loading="lazy" decoding="async" />
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
                  {selected.sqm ? (
                    <span className="meta-chip"><Maximize size={16} color="#d9b45a" />{selected.sqm} {t.properties.sqm}</span>
                  ) : null}
                  {selected.rooms ? (
                    <span className="meta-chip"><Bed size={16} color="#d9b45a" />{selected.rooms} {t.properties.rooms}</span>
                  ) : null}
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
            <img className="lightbox-image" src={currentSrc} alt={`${selected.name} nahled`} decoding="async" />
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


