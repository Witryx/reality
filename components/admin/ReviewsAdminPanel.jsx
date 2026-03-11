'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, MessageSquare, Pencil, RefreshCw, Star, Trash2, X } from 'lucide-react';

const blankReview = { name: '', location: '', rating: 5, text: '' };

const clampRating = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 5;
  return Math.min(5, Math.max(1, Math.round(num)));
};

const ReviewsAdminPanel = ({ lang = 'cz' }) => {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(blankReview);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState(blankReview);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const stats = useMemo(
    () => ({ count: Number(total || 0), avg: Number(average || 0) }),
    [average, total]
  );

  const loadReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reviews?lang=all&page=1&pageSize=100');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Nepodarilo se nacist recenze.');
      const apiList = Array.isArray(data?.reviews) ? data.reviews : [];
      const staticRes = await fetch('/data/reviews.json');
      const staticData = staticRes.ok ? await staticRes.json().catch(() => ({})) : {};
      const staticList = Array.isArray(staticData)
        ? staticData
        : Array.isArray(staticData?.reviews)
          ? staticData.reviews
          : [];

      const unique = new Map();
      [...apiList, ...staticList].forEach((item) => {
        if (!item) return;
        const key = `${String(item.name || '').trim()}|${String(item.text || '').trim()}`;
        if (!unique.has(key)) unique.set(key, item);
      });
      const list = Array.from(unique.values());

      setReviews(list);
      setTotal(Number(data?.total || list.length || 0));
      const calcAvg = list.length
        ? list.reduce((sum, item) => sum + Number(item?.rating || 0), 0) / list.length
        : 0;
      setAverage(Number(data?.average || calcAvg || 0));
    } catch (err) {
      setError(err.message || 'Nepodarilo se nacist recenze.');
      setReviews([]);
      setTotal(0);
      setAverage(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStatus('');
    setError('');
    setEditingId(null);
    setForm(blankReview);
    setEditing(blankReview);
    loadReviews();
  }, [lang]);

  const addReview = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');

    const payload = {
      name: form.name?.trim(),
      location: form.location?.trim(),
      rating: clampRating(form.rating),
      text: form.text?.trim(),
      language: 'all',
    };

    if (!payload.name || !payload.text) {
      setError('Vyplnte jmeno a text recenze.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Ulozeni recenze selhalo.');

      const created = data?.review;
      if (created) {
        setReviews((prev) => [created, ...prev]);
      }
      setForm(blankReview);
      setStatus('Recenze ulozena.');
      await loadReviews();
    } catch (err) {
      setError(err.message || 'Ulozeni recenze selhalo.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (review) => {
    setStatus('');
    setError('');
    setEditingId(review.id);
    setEditing({
      name: review.name || '',
      location: review.location || '',
      rating: clampRating(review.rating),
      text: review.text || '',
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    const payload = {
      id: editingId,
      name: editing.name?.trim(),
      location: editing.location?.trim(),
      rating: clampRating(editing.rating),
      text: editing.text?.trim(),
      language: 'all',
    };

    if (!payload.name || !payload.text) {
      setError('Vyplnte jmeno a text recenze.');
      return;
    }

    setSavingEdit(true);
    setStatus('');
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Ulozeni zmen selhalo.');

      const updated = data?.review;
      if (updated) {
        setReviews((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      }
      setEditingId(null);
      setEditing(blankReview);
      setStatus('Recenze upravena.');
      await loadReviews();
    } catch (err) {
      setError(err.message || 'Ulozeni zmen selhalo.');
    } finally {
      setSavingEdit(false);
    }
  };

  const removeReview = async (review) => {
    setDeletingId(review.id);
    setStatus('');
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: review.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Smazani recenze selhalo.');

      setReviews((prev) => prev.filter((item) => item.id !== review.id));
      setStatus('Recenze smazana.');
      await loadReviews();
    } catch (err) {
      setError(err.message || 'Smazani recenze selhalo.');
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (value) => {
    const safe = clampRating(value);
    return (
      <div style={{ display: 'inline-flex', gap: 2 }}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            size={14}
            color="#d9b45a"
            fill={idx + 1 <= safe ? '#d9b45a' : 'transparent'}
          />
        ))}
      </div>
    );
  };

  return (
    <section style={card}>
      <div style={headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MessageSquare size={20} color="#0f2c4d" />
          <h3 style={{ margin: 0 }}>Sprava recenzi</h3>
        </div>
        <button
          onClick={loadReviews}
          style={{ ...pillBtn, background: '#0f2c4d', color: '#fff', borderColor: '#0f2c4d' }}
          disabled={loading}
        >
          {loading ? <Loader2 size={14} /> : <RefreshCw size={14} />}
          Obnovit
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={statChip}>Pocet recenzi: {stats.count}</div>
        <div style={statChip}>Prumer: {(stats.avg || 0).toFixed(1)} / 5</div>
      </div>

      {status && <div style={{ color: '#1b7a2f', fontSize: 13, marginBottom: 8 }}>{status}</div>}
      {error && <div style={{ color: '#b42318', fontSize: 13, marginBottom: 8 }}>{error}</div>}

      <div style={{ display: 'grid', gap: 14 }}>
        <form onSubmit={addReview} style={formWrap}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Nova recenze</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px', gap: 8 }}>
            <input
              style={inputStyle}
              placeholder="Jmeno"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              style={inputStyle}
              placeholder="Mesto/Zeme"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            />
            <select
              style={inputStyle}
              value={form.rating}
              onChange={(e) => setForm((prev) => ({ ...prev, rating: clampRating(e.target.value) }))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}/5
                </option>
              ))}
            </select>
          </div>
          <textarea
            style={{ ...inputStyle, minHeight: 78, resize: 'vertical', marginTop: 8 }}
            placeholder="Text recenze"
            value={form.text}
            onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
          />
          <button type="submit" disabled={submitting} style={{ ...primaryBtn, marginTop: 8 }}>
            {submitting ? <Loader2 size={16} /> : <CheckCircle2 size={16} />}
            {submitting ? 'Ukladam...' : 'Ulozit recenzi'}
          </button>
        </form>

        <div style={{ display: 'grid', gap: 10 }}>
          {reviews.map((review) => {
            const isEditing = editingId === review.id;
            if (isEditing) {
              return (
                <form key={review.id} onSubmit={saveEdit} style={{ ...reviewRow, background: '#f8fafc' }}>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px', gap: 8 }}>
                      <input
                        style={inputStyle}
                        value={editing.name}
                        onChange={(e) => setEditing((prev) => ({ ...prev, name: e.target.value }))}
                      />
                      <input
                        style={inputStyle}
                        value={editing.location}
                        onChange={(e) => setEditing((prev) => ({ ...prev, location: e.target.value }))}
                      />
                      <select
                        style={inputStyle}
                        value={editing.rating}
                        onChange={(e) => setEditing((prev) => ({ ...prev, rating: clampRating(e.target.value) }))}
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r}/5
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      style={{ ...inputStyle, minHeight: 76, resize: 'vertical' }}
                      value={editing.text}
                      onChange={(e) => setEditing((prev) => ({ ...prev, text: e.target.value }))}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button type="submit" style={primaryBtn} disabled={savingEdit}>
                      {savingEdit ? <Loader2 size={16} /> : <CheckCircle2 size={16} />} Ulozit
                    </button>
                    <button
                      type="button"
                      style={ghostBtn}
                      onClick={() => {
                        setEditingId(null);
                        setEditing(blankReview);
                      }}
                      disabled={savingEdit}
                    >
                      <X size={16} /> Zrusit
                    </button>
                  </div>
                </form>
              );
            }

            return (
              <article key={review.id} style={reviewRow}>
                <div style={{ display: 'grid', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <strong>{review.name}</strong>
                    {review.location ? <span style={mutedChip}>{review.location}</span> : null}
                    <span style={mutedChip}>{renderStars(review.rating)}</span>
                  </div>
                  <div style={{ color: '#334155', lineHeight: 1.5 }}>{review.text}</div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>
                    ID: {review.id} | Jazyk: {(review.language || 'all').toUpperCase()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button type="button" style={ghostBtn} onClick={() => startEdit(review)}>
                    <Pencil size={15} /> Upravit
                  </button>
                  <button
                    type="button"
                    style={dangerBtn}
                    onClick={() => removeReview(review)}
                    disabled={deletingId === review.id}
                  >
                    {deletingId === review.id ? <Loader2 size={15} /> : <Trash2 size={15} />} Smazat
                  </button>
                </div>
              </article>
            );
          })}

          {!loading && !reviews.length && (
            <div style={{ color: '#6b7280', fontSize: 13 }}>Pro zvoleny jazyk zatim nejsou zadne recenze.</div>
          )}
        </div>
      </div>
    </section>
  );
};

const card = {
  background: '#fff',
  borderRadius: 16,
  border: '1px solid #e3e7ef',
  boxShadow: '0 10px 24px rgba(15, 28, 45, 0.08)',
  padding: 18,
};

const headerRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 10,
  marginBottom: 12,
};

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #d7dce5',
  fontSize: 14,
  width: '100%',
  background: '#fff',
};

const formWrap = {
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 12,
  background: '#f9fbff',
};

const reviewRow = {
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 12,
  display: 'grid',
  gap: 10,
};

const mutedChip = {
  padding: '4px 8px',
  borderRadius: 999,
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  color: '#334155',
  fontSize: 12,
  display: 'inline-flex',
  alignItems: 'center',
};

const statChip = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '7px 10px',
  borderRadius: 10,
  background: '#f4f6fb',
  color: '#0f2c4d',
  border: '1px solid #e3e7ef',
  fontWeight: 700,
  fontSize: 13,
};

const primaryBtn = {
  padding: '10px 12px',
  borderRadius: 10,
  border: 'none',
  background: '#0f2c4d',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  justifyContent: 'center',
};

const pillBtn = {
  padding: '9px 12px',
  borderRadius: 999,
  border: '1px solid #d7dce5',
  background: '#f8fafc',
  color: '#0f2c4d',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

const ghostBtn = {
  ...pillBtn,
  background: '#fff',
  color: '#0f2c4d',
  borderColor: '#d7dce5',
};

const dangerBtn = {
  ...pillBtn,
  background: '#fef2f2',
  color: '#b91c1c',
  borderColor: '#fecdd3',
};

export default ReviewsAdminPanel;
