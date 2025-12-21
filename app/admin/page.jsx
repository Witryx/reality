'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  Loader2,
  LogOut,
  Pencil,
  RefreshCw,
  Shield,
  UploadCloud,
  X,
} from 'lucide-react';
import { translations } from '../../content/translations';

const ACCESS_KEY = (process.env.NEXT_PUBLIC_ADMIN_KEY || process.env.NEXT_PUBLIC_ADMIN_TOKEN || '').trim();
const languages = ['cz', 'en', 'de'];
const blankProperty = { name: '', location: '', price: '', sqm: '', rooms: '', tag: '', description: '' };

const splitProperties = (list = []) => {
  const active = [];
  const sold = [];
  list.forEach((item) => {
    if (item?.sold) sold.push(item);
    else active.push(item);
  });
  return { active, sold };
};

const toImages = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      /* ignore */
    }
    return value ? [value] : [];
  }
  return [];
};

const toNumberOrNull = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const readJsonSafe = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const AdminPage = () => {
  const [authed, setAuthed] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [remember, setRemember] = useState(false);
  const [lang, setLang] = useState('cz');
  const [properties, setProperties] = useState(splitProperties());
  const [newProperty, setNewProperty] = useState(blankProperty);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editFiles, setEditFiles] = useState([]);
  const [editPreviews, setEditPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingNew, setSavingNew] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const fallback = useMemo(() => translations[lang]?.properties || {}, [lang]);
  const fallbackSplit = useMemo(
    () => splitProperties([...(fallback.items || []), ...(fallback.soldItems || [])]),
    [fallback]
  );

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('adminAccessKey') : '';
    if (stored && ACCESS_KEY && stored === ACCESS_KEY) {
      setAuthed(true);
      loadProperties(lang);
    }
  }, []);

  useEffect(() => {
    const urls = newFiles.map((file) => URL.createObjectURL(file));
    setNewPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [newFiles]);

  useEffect(() => {
    const urls = editFiles.map((file) => URL.createObjectURL(file));
    setEditPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [editFiles]);

  useEffect(() => {
    setProperties(fallbackSplit);
    setStatus('');
    setError('');
    if (authed) {
      loadProperties(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, authed, fallbackSplit]);
  const uploadFiles = async (files) => {
    if (!files?.length) return [];
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || 'Upload selhal.');
    return Array.isArray(data.urls) ? data.urls : [];
  };

  const loadProperties = async (currentLang) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/properties?lang=${currentLang}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Nepodarilo se nacist data.');
      const list = Array.isArray(data.properties) ? data.properties : [];
      setProperties(list.length ? splitProperties(list) : fallbackSplit);
    } catch (err) {
      setError(err.message || 'Nepodarilo se nacist data.');
      setProperties(fallbackSplit);
    } finally {
      setLoading(false);
    }
  };

  const createFromFallback = async (prop, sold = false) => {
    const payload = {
      ...prop,
      language: lang,
      sqm: toNumberOrNull(prop.sqm),
      rooms: toNumberOrNull(prop.rooms),
      tag: prop.tag || 'Nova',
      description: prop.description || '',
    };
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await readJsonSafe(res);
    if (!res.ok) throw new Error(data?.error || 'Ulozeni selhalo.');
    if (!data?.property) throw new Error('Neplatna odpoved serveru.');
    let created = data.property;
    if (sold) {
      const toggleRes = await fetch('/api/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: created.id, sold: true }),
      });
      const toggleData = await toggleRes.json().catch(() => ({}));
      if (!toggleRes.ok) throw new Error(toggleData?.error || 'Oznaceni prodano selhalo.');
      created = toggleData.property;
    }
    return created;
  };

  const ensurePersistedProperty = async (prop) => {
    if (prop?.id) return prop;
    return createFromFallback(prop, Boolean(prop?.sold));
  };

  const applyUpdate = (updated) => {
    if (!updated) return;
    setProperties((prev) => {
      const merged = [];
      const seen = new Set();
      const all = [updated, ...(prev.active || []), ...(prev.sold || [])];
      all.forEach((item) => {
        const key = item?.id ? `id-${item.id}` : `name-${item?.name}`;
        if (!seen.has(key)) {
          merged.push(item);
          seen.add(key);
        }
      });
      return splitProperties(merged);
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!ACCESS_KEY) {
      setError('Neni nastaven pristupovy klic (NEXT_PUBLIC_ADMIN_KEY).');
      return;
    }
    if (accessKey.trim() !== ACCESS_KEY) {
      setError('Nespravny pristupovy klic.');
      return;
    }
    setAuthed(true);
    if (remember && typeof window !== 'undefined') {
      sessionStorage.setItem('adminAccessKey', accessKey.trim());
    }
    loadProperties(lang);
  };

  const logout = () => {
    setAuthed(false);
    setAccessKey('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('adminAccessKey');
    }
  };

  const addProperty = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');

    if (!newProperty.name || !newProperty.location || !newProperty.price) {
      setError('Vyplnte nazev, lokaci a cenu.');
      return;
    }
    if (!newFiles.length) {
      setError('Pripojte alespon jeden obrazek.');
      return;
    }

    setSavingNew(true);
    try {
      const uploaded = await uploadFiles(newFiles);
      const payload = {
        ...newProperty,
        language: lang,
        sqm: toNumberOrNull(newProperty.sqm),
        rooms: toNumberOrNull(newProperty.rooms),
        tag: newProperty.tag || 'Nova',
        description: newProperty.description || '',
        images: uploaded,
        image: uploaded[0],
      };
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error(data?.error || 'Ulozeni selhalo.');
      if (!data?.property) throw new Error('Neplatna odpoved serveru.');

      applyUpdate(data.property);
      setNewProperty(blankProperty);
      setNewFiles([]);
      setStatus('Nemovitost ulozena.');
    } catch (err) {
      setError(err.message || 'Ulozeni selhalo.');
    } finally {
      setSavingNew(false);
    }
  };

  const toggleSold = async (prop, soldState) => {
    setStatus('');
    setError('');
    setTogglingId(prop.id || prop.name);
    try {
      const ensured = await ensurePersistedProperty(prop);
      const res = await fetch('/api/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ensured.id, sold: soldState }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Aktualizace selhala.');
      applyUpdate(data.property);
      setStatus(soldState ? 'Oznaceno jako prodano.' : 'Vraceno mezi aktivni.');
    } catch (err) {
      setError(err.message || 'Aktualizace selhala.');
    } finally {
      setTogglingId(null);
    }
  };

  const removeProperty = async (prop) => {
    setStatus('');
    setError('');
    setDeletingId(prop.id || prop.name);
    try {
      const ensured = await ensurePersistedProperty(prop);
      const res = await fetch('/api/properties', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ensured.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Smazani selhalo.');
      setProperties((prev) => ({
        active: (prev.active || []).filter((item) => item.id !== ensured.id),
        sold: (prev.sold || []).filter((item) => item.id !== ensured.id),
      }));
      setStatus('Nemovitost odstranena.');
    } catch (err) {
      setError(err.message || 'Smazani selhalo.');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = async (prop) => {
    setStatus('');
    setError('');
    try {
      const ensured = await ensurePersistedProperty(prop);
      const images = toImages(ensured.images);
      const cover = images.length ? images : ensured.image ? [ensured.image] : [];
      setEditing({
        ...ensured,
        images: cover,
        description: ensured.description || '',
      });
      setEditFiles([]);
    } catch (err) {
      setError(err.message || 'Nelze nacist detail.');
    }
  };

  const removeExistingImage = (target) => {
    setEditing((prev) => {
      if (!prev) return prev;
      return { ...prev, images: (prev.images || []).filter((img, idx) => idx !== target) };
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editing?.id) return;
    setStatus('');
    setError('');
    setSavingEdit(true);

    try {
      const uploaded = await uploadFiles(editFiles);
      const baseImages = Array.isArray(editing.images) ? editing.images.filter(Boolean) : [];
      const mergedImages = uploaded.length ? [...baseImages, ...uploaded] : baseImages;

      const payload = {
        ...editing,
        id: editing.id,
        language: lang,
        description: editing.description || '',
        images: mergedImages,
        image: mergedImages.length ? mergedImages[0] : null,
      };

      const res = await fetch('/api/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Ulozeni selhalo.');

      applyUpdate(data.property);
      setEditing(null);
      setEditFiles([]);
      setStatus('Zmeny ulozeny.');
    } catch (err) {
      setError(err.message || 'Ulozeni selhalo.');
    } finally {
      setSavingEdit(false);
    }
  };

  const activeCount = properties.active?.length || 0;
  const soldCount = properties.sold?.length || 0;
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(110% 80% at 10% 20%, rgba(31,186,198,0.08), transparent 40%), radial-gradient(110% 80% at 80% 0%, rgba(217,179,106,0.08), transparent 48%), linear-gradient(180deg, #f5f7fb 0%, #e7ecf7 40%, #dfe7f5 100%)',
        padding: '32px 18px 48px',
        color: '#0f1c2d',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <header
          style={{
            background: 'linear-gradient(135deg, #0f2c4d, #133a67 60%, #1fbac6)',
            color: '#fff',
            padding: '18px 20px',
            borderRadius: 18,
            boxShadow: '0 18px 40px rgba(10,30,60,0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 14,
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} />
              <p style={{ margin: 0, letterSpacing: 1, textTransform: 'uppercase', fontSize: 12 }}>Admin panel</p>
            </div>
            <h1 style={{ margin: '4px 0 2px', fontSize: 26 }}>Sprava nemovitosti</h1>
            <p style={{ margin: 0, opacity: 0.85 }}>
              Nahrajte fotky, upravujte texty a prepinajte inzeraty mezi aktivni a prodane.
            </p>
          </div>
          {authed && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={() => loadProperties(lang)} style={{ ...chipBtn, background: '#102a42', color: '#fff' }}>
                <RefreshCw size={16} />
                Obnovit
              </button>
              <button onClick={logout} style={{ ...chipBtn, background: '#fef2f2', color: '#b42318', borderColor: '#fbc7c7' }}>
                <LogOut size={16} />
                Odhlasit
              </button>
            </div>
          )}
        </header>

        {!authed ? (
          <div style={{ ...card, maxWidth: 520, marginTop: 16 }}>
            <h3 style={{ marginTop: 0, marginBottom: 10 }}>Pristup do administrace</h3>
            <p style={{ marginTop: 0, color: '#5b6b7a', marginBottom: 12 }}>
              Prihlaseni je chraneno pristupovym klicem. Nastavte promenou <code>NEXT_PUBLIC_ADMIN_KEY</code> ve svem prostredi a pouzijte ji zde.
            </p>
            <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12 }}>
              <input
                placeholder="Pristupovy klic"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                style={{ ...inputStyle, letterSpacing: 0.8 }}
                type="password"
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5b6b7a' }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                Zapamatovat pro toto sezeni
              </label>
              <button type="submit" style={{ ...primaryBtn, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={18} />
                Vstoupit do administrace
              </button>
              {error && <div style={{ color: '#b42318', fontSize: 13 }}>{error}</div>}
              {!ACCESS_KEY && (
                <div style={{ color: '#9a6b0c', fontSize: 13, background: '#fff7e6', padding: 10, borderRadius: 10 }}>
                  Tip: nastavte <strong>NEXT_PUBLIC_ADMIN_KEY</strong> (24+ znaku) v .env.local a aplikaci znovu spustte.
                </div>
              )}
            </form>
          </div>
        ) : (
          <>
            <div style={{ ...card, marginTop: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {languages.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      style={{
                        ...pillBtn,
                        background: lang === l ? '#0f2c4d' : '#eef2fa',
                        color: lang === l ? '#fff' : '#0f2c4d',
                        borderColor: lang === l ? '#0f2c4d' : '#d7deed',
                      }}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <div style={statChip}>
                    <CheckCircle2 size={16} color="#20a36b" />
                    Aktivni: {activeCount}
                  </div>
                  <div style={statChip}>
                    <ArrowLeftRight size={16} color="#d28b37" />
                    Prodane: {soldCount}
                  </div>
                </div>
              </div>
              {loading && <div style={{ color: '#6b7280', fontSize: 13, marginTop: 8 }}>Nacitam data...</div>}
              {status && <div style={{ color: '#1b7a2f', fontSize: 13, marginTop: 8 }}>{status}</div>}
              {error && <div style={{ color: '#b42318', fontSize: 13, marginTop: 8 }}>{error}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, alignItems: 'start' }}>
              <section style={{ ...card, minWidth: 320 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <UploadCloud size={20} color="#0f2c4d" />
                  <h3 style={{ margin: 0 }}>Nova nemovitost</h3>
                </div>
                <form onSubmit={addProperty} style={{ display: 'grid', gap: 10, maxWidth: 540 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input
                      style={inputStyle}
                      placeholder="Nazev"
                      value={newProperty.name}
                      onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                    />
                    <input
                      style={inputStyle}
                      placeholder="Lokace"
                      value={newProperty.location}
                      onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <input
                      style={inputStyle}
                      placeholder="Cena"
                      value={newProperty.price}
                      onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                    />
                    <input
                      style={inputStyle}
                      placeholder="m2"
                      value={newProperty.sqm}
                      onChange={(e) => setNewProperty({ ...newProperty, sqm: e.target.value })}
                    />
                    <input
                      style={inputStyle}
                      placeholder="Pokoje"
                      value={newProperty.rooms}
                      onChange={(e) => setNewProperty({ ...newProperty, rooms: e.target.value })}
                    />
                  </div>
                  <input
                    style={inputStyle}
                    placeholder="Stitek (napr. Nova, Top)"
                    value={newProperty.tag}
                    onChange={(e) => setNewProperty({ ...newProperty, tag: e.target.value })}
                  />
                  <textarea
                    style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                    placeholder="Popis / detail nemovitosti"
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                  />
                  <label style={uploadBox}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f2c4d' }}>Nahrajte fotky</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>Vyberte alespon jeden obrazek, slouzi i jako titulka.</div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        setNewFiles(Array.from(e.target.files || []));
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {!!newPreviews.length && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                      {newPreviews.map((src, idx) => (
                        <div key={src} style={thumb}>
                          <img
                            src={src}
                            alt={`Nahrany obrazek ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <button type="submit" disabled={savingNew} style={{ ...primaryBtn, opacity: savingNew ? 0.8 : 1 }}>
                    {savingNew ? <Loader2 size={18} /> : <CheckCircle2 size={18} />}
                    {savingNew ? 'Ukladam...' : 'Ulozit nemovitost'}
                  </button>
                </form>
              </section>

              <section style={{ ...card }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Pencil size={20} color="#0f2c4d" />
                  <h3 style={{ margin: 0 }}>Prehled inzeratu</h3>
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div>
                    <div style={listHeader}>
                      <strong>Aktivni</strong>
                      <span style={{ color: '#6b7280', fontSize: 13 }}>{activeCount} polozek</span>
                    </div>
                    <div style={{ display: 'grid', gap: 10 }}>
                      {(properties.active || []).map((prop) => {
                        const imgs = toImages(prop.images);
                        const cover = imgs[0] || prop.image;
                        const pid = prop.id || prop.name;
                        return (
                          <div key={pid} style={propertyRow}>
                            <div style={rowLeft}>
                              {cover ? (
                                <img src={cover} alt={prop.name} style={rowThumb} />
                              ) : (
                                <div style={rowPlaceholder}>Bez fotky</div>
                              )}
                              <div>
                                <div style={{ fontWeight: 700 }}>{prop.name}</div>
                                <div style={{ color: '#6b7280', fontSize: 13 }}>{prop.location}</div>
                                <div style={{ color: '#0f2c4d', fontWeight: 700 }}>{prop.price}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <button style={ghostBtn} onClick={() => startEdit(prop)}>
                                <Pencil size={16} />
                                Upravit
                              </button>
                              <button style={dangerBtn} onClick={() => removeProperty(prop)} disabled={deletingId === pid}>
                                {deletingId === pid ? <Loader2 size={16} /> : <X size={16} />}
                                Smazat
                              </button>
                              <button
                                style={{ ...pillBtn, background: '#102a42', color: '#fff' }}
                                onClick={() => toggleSold(prop, true)}
                                disabled={togglingId === pid}
                              >
                                {togglingId === pid ? <Loader2 size={16} /> : <ArrowLeftRight size={16} />}
                                Prodano
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {!properties.active?.length && <div style={{ color: '#6b7280', fontSize: 13 }}>Zatim zadne aktivni inzeraty.</div>}
                    </div>
                  </div>

                  <div style={{ height: 1, background: '#e5e7eb', margin: '4px 0' }} />

                  <div>
                    <div style={listHeader}>
                      <strong>Prodane</strong>
                      <span style={{ color: '#6b7280', fontSize: 13 }}>{soldCount} polozek</span>
                    </div>
                    <div style={{ display: 'grid', gap: 10 }}>
                      {(properties.sold || []).map((prop) => {
                        const imgs = toImages(prop.images);
                        const cover = imgs[0] || prop.image;
                        const pid = prop.id || prop.name;
                        return (
                          <div key={pid} style={{ ...propertyRow, background: '#f5f7fb' }}>
                            <div style={rowLeft}>
                              {cover ? (
                                <img src={cover} alt={prop.name} style={rowThumb} />
                              ) : (
                                <div style={rowPlaceholder}>Bez fotky</div>
                              )}
                              <div>
                                <div style={{ fontWeight: 700 }}>{prop.name}</div>
                                <div style={{ color: '#6b7280', fontSize: 13 }}>{prop.location}</div>
                                <div style={{ color: '#d28b37', fontWeight: 700 }}>PRODANO</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <button style={ghostBtn} onClick={() => startEdit(prop)}>
                                <Pencil size={16} />
                                Upravit
                              </button>
                              <button style={dangerBtn} onClick={() => removeProperty(prop)} disabled={deletingId === pid}>
                                {deletingId === pid ? <Loader2 size={16} /> : <X size={16} />}
                                Smazat
                              </button>
                              <button
                                style={{ ...pillBtn, background: '#fff', color: '#0f2c4d', borderColor: '#d28b37' }}
                                onClick={() => toggleSold(prop, false)}
                                disabled={togglingId === pid}
                              >
                                {togglingId === pid ? <Loader2 size={16} /> : <ArrowLeftRight size={16} />}
                                Zpet do aktivnich
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {!properties.sold?.length && <div style={{ color: '#6b7280', fontSize: 13 }}>Zatim nic prodaneho.</div>}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {editing && (
              <div style={drawerOverlay} onClick={() => !savingEdit && setEditing(null)}>
                <div style={drawer} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <p style={{ margin: 0, color: '#5b6b7a', fontSize: 13 }}>Upravit nemovitost</p>
                      <h3 style={{ margin: '4px 0 0' }}>{editing.name}</h3>
                    </div>
                    <button style={pillBtn} onClick={() => !savingEdit && setEditing(null)}>
                      Zavrit
                    </button>
                  </div>

                  <form onSubmit={saveEdit} style={{ display: 'grid', gap: 10 }}>
                    <input
                      style={inputStyle}
                      placeholder="Nazev"
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    />
                    <input
                      style={inputStyle}
                      placeholder="Lokace"
                      value={editing.location}
                      onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      <input
                        style={inputStyle}
                        placeholder="Cena"
                        value={editing.price}
                        onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                      />
                      <input
                        style={inputStyle}
                        placeholder="m2"
                        value={editing.sqm}
                        onChange={(e) => setEditing({ ...editing, sqm: e.target.value })}
                      />
                      <input
                        style={inputStyle}
                        placeholder="Pokoje"
                        value={editing.rooms}
                        onChange={(e) => setEditing({ ...editing, rooms: e.target.value })}
                      />
                    </div>
                    <input
                      style={inputStyle}
                      placeholder="Stitek"
                      value={editing.tag || ''}
                      onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                    />
                    <textarea
                      style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                      placeholder="Popis / detail nemovitosti"
                      value={editing.description || ''}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    />

                    <div style={{ display: 'grid', gap: 6 }}>
                      <div style={{ fontWeight: 700 }}>Aktualni fotky</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                        {(editing.images || []).map((src, idx) => (
                          <div key={src + idx} style={{ position: 'relative' }}>
                            <img
                              src={src}
                              alt={`Foto ${idx + 1}`}
                              style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid #e5e7eb' }}
                            />
                            <button type="button" onClick={() => removeExistingImage(idx)} style={removeBtn}>
                              x
                            </button>
                          </div>
                        ))}
                        {!(editing.images || []).length && <div style={{ color: '#6b7280', fontSize: 13 }}>Zatim zadne ulozene fotky.</div>}
                      </div>
                    </div>

                    <label style={uploadBox}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f2c4d' }}>Pridat dalsi fotky</div>
                        <div style={{ color: '#6b7280', fontSize: 13 }}>Nove fotky se prida ke stavajicim.</div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          setEditFiles(Array.from(e.target.files || []));
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {!!editPreviews.length && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                        {editPreviews.map((src, idx) => (
                          <div key={src} style={thumb}>
                            <img
                              src={src}
                              alt={`Nova fotka ${idx + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <button type="submit" disabled={savingEdit} style={{ ...primaryBtn, flex: 1, opacity: savingEdit ? 0.8 : 1 }}>
                        {savingEdit ? <Loader2 size={18} /> : <CheckCircle2 size={18} />}
                        {savingEdit ? 'Ukladam...' : 'Ulozit zmeny'}
                      </button>
                      <button type="button" style={ghostBtn} onClick={() => setEditing(null)} disabled={savingEdit}>
                        Zavrit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const card = {
  background: '#fff',
  borderRadius: 16,
  border: '1px solid #e3e7ef',
  boxShadow: '0 10px 24px rgba(15, 28, 45, 0.08)',
  padding: 18,
};

const inputStyle = {
  padding: '12px 14px',
  borderRadius: 8,
  border: '1px solid #d7dce5',
  fontSize: 14,
  width: '100%',
  background: '#fff',
};

const primaryBtn = {
  padding: '12px 14px',
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

const chipBtn = {
  padding: '9px 12px',
  borderRadius: 12,
  border: '1px solid #0f2c4d',
  background: '#fff',
  color: '#0f2c4d',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

const uploadBox = {
  border: '1px dashed #b6c2d7',
  borderRadius: 12,
  padding: '14px 14px',
  background: '#f8fbff',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const thumb = {
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
  height: 90,
};

const statChip = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 10px',
  borderRadius: 10,
  background: '#f4f6fb',
  color: '#0f2c4d',
  border: '1px solid #e3e7ef',
  fontWeight: 700,
  fontSize: 13,
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

const listHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
};

const propertyRow = {
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
};

const rowLeft = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minWidth: 0,
};

const rowThumb = {
  width: 72,
  height: 72,
  objectFit: 'cover',
  borderRadius: 10,
  border: '1px solid #e5e7eb',
};

const rowPlaceholder = {
  ...rowThumb,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f5f6f9',
  color: '#6b7280',
  fontSize: 12,
};

const drawerOverlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15,28,45,0.45)',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: 16,
};

const drawer = {
  width: 420,
  maxWidth: '90vw',
  background: '#fff',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 25px 50px rgba(0,0,0,0.18)',
  overflowY: 'auto',
  maxHeight: '100%',
};

const removeBtn = {
  position: 'absolute',
  top: 6,
  right: 6,
  border: 'none',
  background: 'rgba(15,28,45,0.75)',
  color: '#fff',
  borderRadius: 20,
  width: 22,
  height: 22,
  cursor: 'pointer',
};

export default AdminPage;
