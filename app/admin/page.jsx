'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { translations } from '../../content/translations';

const languages = ['cz', 'en', 'de'];
const initialProperty = { name: '', location: '', price: '', sqm: '', rooms: '', image: '', tag: '' };

const splitProperties = (list = []) => {
  const active = [];
  const sold = [];
  list.forEach((item) => {
    if (item?.sold) sold.push(item);
    else active.push(item);
  });
  return { active, sold };
};

const AdminPage = () => {
  const [authed, setAuthed] = useState(false);
  const [formAuth, setFormAuth] = useState({ user: '', pass: '' });
  const [lang, setLang] = useState('cz');
  const [properties, setProperties] = useState(splitProperties());
  const [newProperty, setNewProperty] = useState(initialProperty);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const t = useMemo(() => translations[lang], [lang]);
  const fallback = useMemo(() => translations[lang]?.properties || {}, [lang]);
  const fallbackSplit = useMemo(
    () => splitProperties([...(fallback.items || []), ...(fallback.soldItems || [])]),
    [fallback]
  );

  useEffect(() => {
    setProperties(fallbackSplit);
    setStatus('');
    setError('');
    if (authed) {
      loadProperties(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, authed, fallbackSplit]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (formAuth.user === 'admin' && formAuth.pass === '1234') {
      setAuthed(true);
      loadProperties(lang);
    } else {
      setError('Nesprávné údaje.');
    }
  };

  const loadProperties = async (currentLang) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/properties?lang=${currentLang}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Nepodařilo se načíst data.');
      const list = Array.isArray(data.properties) ? data.properties : [];
      setProperties(list.length ? splitProperties(list) : fallbackSplit);
    } catch (err) {
      setError(err.message || 'Nepodařilo se načíst data.');
      setProperties(fallbackSplit);
    } finally {
      setLoading(false);
    }
  };

  const createFromFallback = async (prop, sold = false) => {
    const payload = {
      ...prop,
      language: lang,
      sqm: prop.sqm || '0',
      rooms: prop.rooms || '0',
      tag: prop.tag || 'Nově',
    };
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || 'Uložení selhalo.');

    if (sold) {
      const markRes = await fetch('/api/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data.property.id, sold: true }),
      });
      const markData = await markRes.json().catch(() => ({}));
      if (!markRes.ok) throw new Error(markData?.error || 'Označení prodáno selhalo.');
      return markData.property;
    }

    return data.property;
  };

  const addProperty = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    if (!newProperty.name || !newProperty.location || !newProperty.price) {
      setError('Vyplňte alespoň název, lokaci a cenu.');
      return;
    }

    try {
      const payload = {
        ...newProperty,
        language: lang,
        sqm: newProperty.sqm || '0',
        rooms: newProperty.rooms || '0',
        tag: newProperty.tag || 'Nově',
      };
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Uložení selhalo.');

      setProperties((prev) => ({
        active: [data.property, ...(prev.active || [])],
        sold: prev.sold || [],
      }));
      setNewProperty(initialProperty);
      setStatus('Nemovitost uložena.');
    } catch (err) {
      setError(err.message || 'Uložení selhalo.');
    }
  };

  const markSold = async (prop) => {
    setStatus('');
    setError('');
    try {
      const ensure = prop.id ? prop : await createFromFallback(prop, false);
      const res = await fetch('/api/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ensure.id, sold: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Označení prodáno selhalo.');
      const updated = data.property || ensure;

      setProperties((prev) => ({
        active: (prev.active || []).filter((p) => (p.id ? p.id !== updated.id : p.name !== updated.name)),
        sold: [updated, ...(prev.sold || []).filter((p) => (p.id ? p.id !== updated.id : p.name !== updated.name))],
      }));
      setStatus('Označeno jako prodané.');
    } catch (err) {
      setError(err.message || 'Označení prodáno selhalo.');
    }
  };

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', minHeight: '100vh', background: '#f5f7fb', padding: '30px 20px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', background: '#fff', borderRadius: 14, boxShadow: '0 18px 30px rgba(0,0,0,0.08)', padding: 24 }}>
        <h1 style={{ marginTop: 0, marginBottom: 20 }}>Admin</h1>

        {!authed ? (
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
            <input
              placeholder="Uživatel"
              value={formAuth.user}
              onChange={(e) => setFormAuth({ ...formAuth, user: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Heslo"
              type="password"
              value={formAuth.pass}
              onChange={(e) => setFormAuth({ ...formAuth, pass: e.target.value })}
              style={inputStyle}
            />
            <button type="submit" style={primaryBtn}>Přihlásit</button>
            {error && <div style={{ color: '#b42318', fontSize: 13 }}>{error}</div>}
          </form>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    ...tabBtn,
                    background: lang === l ? '#0f2c4d' : '#eef3f9',
                    color: lang === l ? '#fff' : '#0f2c4d',
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {loading && <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 8 }}>Načítám data...</div>}
            {status && <div style={{ color: '#2b7a0b', fontSize: 13, marginBottom: 8 }}>{status}</div>}
            {error && <div style={{ color: '#b42318', fontSize: 13, marginBottom: 8 }}>{error}</div>}

            <section style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '8px 0 12px' }}>Přidat nemovitost</h2>
              <form onSubmit={addProperty} style={{ display: 'grid', gap: 10, maxWidth: 600 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input style={inputStyle} placeholder="Název" value={newProperty.name} onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })} />
                  <input style={inputStyle} placeholder="Lokace" value={newProperty.location} onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <input style={inputStyle} placeholder="Cena" value={newProperty.price} onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })} />
                  <input style={inputStyle} placeholder="m²" value={newProperty.sqm} onChange={(e) => setNewProperty({ ...newProperty, sqm: e.target.value })} />
                  <input style={inputStyle} placeholder="Pokoje" value={newProperty.rooms} onChange={(e) => setNewProperty({ ...newProperty, rooms: e.target.value })} />
                </div>
                <input style={inputStyle} placeholder="Obrázek URL" value={newProperty.image} onChange={(e) => setNewProperty({ ...newProperty, image: e.target.value })} />
                <input style={inputStyle} placeholder="Štítek (např. Nově, Top)" value={newProperty.tag} onChange={(e) => setNewProperty({ ...newProperty, tag: e.target.value })} />
                <button type="submit" style={primaryBtn}>Uložit</button>
              </form>
            </section>

            <section>
              <h2 style={{ margin: '8px 0 12px' }}>{t.properties.title}</h2>
              <div style={{ display: 'grid', gap: 10 }}>
                {(properties.active || []).map((prop) => (
                  <div key={prop.id || prop.name} style={{ border: '1px solid #e5e8f0', borderRadius: 12, padding: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }}>
                    <div>
                      <strong>{prop.name}</strong>
                      <div style={{ color: '#6b7280', fontSize: 14 }}>{prop.location}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={primaryBtn} onClick={() => markSold(prop)}>Označit prodáno</button>
                    </div>
                  </div>
                ))}
                {!properties.active?.length && <div style={{ color: '#6b7280', fontSize: 13 }}>Žádné aktivní nemovitosti.</div>}
              </div>
            </section>

            <section style={{ marginTop: 24 }}>
              <h3 style={{ margin: '12px 0' }}>Prodané</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {(properties.sold || []).map((prop) => (
                  <div key={prop.id || prop.name} style={{ border: '1px solid #e5e8f0', borderRadius: 12, padding: 12, background: '#f7f9fb' }}>
                    <strong>{prop.name}</strong>
                    <div style={{ color: '#6b7280', fontSize: 14 }}>{prop.location}</div>
                  </div>
                ))}
                {!properties.sold?.length && <div style={{ color: '#6b7280', fontSize: 13 }}>Žádné prodané záznamy.</div>}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #d7dce5',
  fontSize: 14,
};

const primaryBtn = {
  padding: '12px 14px',
  borderRadius: 10,
  border: 'none',
  background: '#0f2c4d',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
};

const secondaryBtn = {
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #d7dce5',
  background: '#fff',
  color: '#0f2c4d',
  cursor: 'pointer',
};

const tabBtn = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid rgba(15,44,77,0.14)',
  cursor: 'pointer',
  fontWeight: 700,
};

export default AdminPage;
