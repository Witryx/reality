import React, { useEffect, useState } from 'react';
import { Send, Star, X } from 'lucide-react';
import SectionHeader from './SectionHeader';

const ratingScale = [1, 2, 3, 4, 5];
const initialFormState = { name: '', location: '', rating: 5, text: '' };
const loadingMessages = {
  cz: 'Na\u010d\u00edt\u00e1m recenze...',
  en: 'Loading reviews...',
  de: 'Bewertungen werden geladen...',
};

const avgLabel = {
  cz: 'Pr\u016fm\u011brn\u00e9 hodnocen\u00ed',
  en: 'Average rating',
  de: 'Durchschnittsbewertung',
};

const countLabel = {
  cz: 'recenz\u00ed',
  en: 'reviews',
  de: 'Bewertungen',
};

const MAX_SHOWN = 4;
const TRUNCATE_AT = 220;

const Reviews = ({ t, language }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState(initialFormState);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setReviews([]);
    setForm({ ...initialFormState });
    setFormError('');
    setFormSuccess('');
    setLoadError('');
    setTotal(0);
    setAverage(0);
  }, [language]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reviews?lang=all&page=1&pageSize=${MAX_SHOWN}`, {
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'load_failed');
        const incoming = Array.isArray(data.reviews) ? data.reviews : [];

        setReviews(incoming.slice(0, MAX_SHOWN));
        setTotal(Number(data.total || incoming.length || 0));
        setAverage(Number(data.average || 0));
      } catch (error) {
        if (error.name !== 'AbortError') {
          const fallbackMessage = t.reviews.form?.error || 'Nepodarilo se nacist recenze.';
          const message = error.message && error.message !== 'load_failed' ? error.message : fallbackMessage;
          setLoadError(message);
          setReviews([]);
          setTotal(0);
          setAverage(0);
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

  const onChange = (field) => (e) => {
    const value = field === 'rating' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: Number(form.rating), language }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Request failed');
      }

      setFormSuccess(t.reviews.form?.success || 'Review saved.');
      const ratingValue = Number(form.rating);
      const newReview = data?.review || { ...form, rating: ratingValue };
      setReviews((prev) => [newReview, ...prev].slice(0, MAX_SHOWN));
      setTotal((prev) => prev + 1);
      setAverage((prevAvg) => {
        const prevTotal = total || 0;
        return Math.round((((prevAvg || 0) * prevTotal + ratingValue) / (prevTotal + 1)) * 10) / 10;
      });
      setForm({ ...initialFormState });
    } catch (error) {
      setFormError(error.message || t.reviews.form?.error);
    } finally {
      setSubmitting(false);
    }
  };

  const truncate = (text) => {
    if (!text) return '';
    return text.length > TRUNCATE_AT ? `${text.slice(0, TRUNCATE_AT).trimEnd()}...` : text;
  };

  const renderStars = (value) => (
    <div style={{ display: 'flex', gap: 4 }}>
      {ratingScale.map((n) => (
        <Star key={n} size={18} color="#d9b45a" fill={n <= value ? '#d9b45a' : 'transparent'} />
      ))}
    </div>
  );

  return (
    <section
      id="reviews"
      className="section"
      style={{ background: "linear-gradient(180deg, rgba(247,236,220,0.95), rgba(239,214,176,0.9), rgba(246,236,220,0.96))" }}
    >
      <div className="container">
        <SectionHeader
          eyebrow={t.nav.reviews}
          title={t.reviews.title}
          subtitle={t.reviews.subtitle}
        />

        <div className="reviews-layout">
          <form className="review-form-card" onSubmit={onSubmit}>
            <h4 style={{ margin: '0 0 10px' }}>{t.reviews.form.title}</h4>
            <div className="form-field">
              <label style={{ color: 'var(--muted)', fontSize: 13 }}>{t.reviews.form.name}</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange('name')}
                required
                placeholder={t.reviews.form.name}
              />
            </div>

            <div className="form-field">
              <label style={{ color: 'var(--muted)', fontSize: 13 }}>
                {t.reviews.form.location}
              </label>
              <input
                name="location"
                value={form.location}
                onChange={onChange('location')}
                placeholder={t.reviews.form.location}
              />
            </div>

            <div className="form-field">
              <label style={{ color: 'var(--muted)', fontSize: 13 }}>
                {t.reviews.form.rating}
              </label>
              <div className="review-rating">
                {ratingScale.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="star-button"
                    onClick={() => setForm((prev) => ({ ...prev, rating: value }))}
                    aria-label={`${value} ${t.reviews.form.rating}`}
                  >
                    <Star
                      size={18}
                      color="#d9b45a"
                      fill={value <= form.rating ? '#d9b45a' : 'transparent'}
                    />
                  </button>
                ))}
                <span className="rating-value">{form.rating}/5</span>
              </div>
            </div>

            <div className="form-field">
              <label style={{ color: 'var(--muted)', fontSize: 13 }}>{t.reviews.form.text}</label>
              <textarea
                name="text"
                value={form.text}
                onChange={onChange('text')}
                required
                placeholder={t.reviews.form.text}
                rows={4}
              />
            </div>

            <div className="review-status helper">{t.reviews.form.helper}</div>
            {formError && <div className="review-status error">{formError}</div>}
            {formSuccess && <div className="review-status success">{formSuccess}</div>}

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {submitting ? `${t.reviews.form.submit}...` : t.reviews.form.submit}
              <Send size={16} />
            </button>
          </form>

          <div className="review-list">
            <div className="review-summary">
              <div>
                <div className="avg-label">{avgLabel[language] || avgLabel.en}</div>
                <div className="avg-score">
                  {average?.toFixed ? average.toFixed(1) : Number(average || 0).toFixed(1)}
                  <span className="avg-total">/5</span>
                </div>
                <div className="avg-count">
                  {total || 0} {countLabel[language] || countLabel.en}
                </div>
              </div>
              <div className="avg-stars">
                {renderStars(Math.round(average || 0))}
              </div>
            </div>

            {loading && (
              <div className="review-status helper">
                {loadingMessages[language] || loadingMessages.en}
              </div>
            )}

            {!loading && reviews.length === 0 && (
              <div className="review-empty">{t.reviews.empty}</div>
            )}

            <div className="review-grid">
              {reviews.map((review) => (
                <article
                  key={`${review.name}-${review.text}-${review.id || ''}`}
                  className="review-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(review)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: 16 }}>{review.name}</strong>
                      {review.location ? <div className="review-meta">{review.location}</div> : null}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {Array.from({ length: Math.min(5, Math.max(0, Math.round(Number(review.rating) || 0))) }).map((_, i) => (
                        <Star key={i} size={16} color="#d9b45a" fill="#d9b45a" />
                      ))}
                    </div>
                  </div>
                  <p style={{ marginTop: 12, color: '#111', lineHeight: 1.65 }}>
                    {truncate(review.text)}
                  </p>
                  {review.text && review.text.length > TRUNCATE_AT && (
                    <span style={{ color: '#0b2338', fontWeight: 700, fontSize: 13 }}>
                      {language === 'cz' ? 'V\u00edce' : language === 'de' ? 'Mehr' : 'More'}
                    </span>
                  )}
                </article>
              ))}
            </div>

            {loadError && <div className="review-status error">{loadError}</div>}
          </div>
        </div>
      </div>

      {selected && (
        <div className="detail-overlay" onClick={() => setSelected(null)}>
          <div className="detail-modal review-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelected(null)} aria-label="Zav\u0159\u00edt detail">
              <X size={18} />
            </button>
            <div className="detail-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="review-detail">
                <div className="review-detail-meta">
                  {selected.location ? <span className="review-chip">{selected.location}</span> : null}
                  <span className="review-chip rating-chip">
                    {Number(selected.rating || 0).toFixed(1).replace(/\\.0$/, '')}/5
                  </span>
                </div>

                <div className="review-detail-header">
                  <h3 className="review-name">{selected.name}</h3>
                  <div className="review-detail-stars">
                    {renderStars(selected.rating || 0)}
                    <span className="rating-value" style={{ color: '#6b7280' }}>
                      {selected.rating}/5
                    </span>
                  </div>
                </div>

                <div className="review-detail-text">
                  {selected.text}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
