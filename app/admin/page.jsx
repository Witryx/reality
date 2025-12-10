'use client';

import React, { useMemo, useState } from 'react';
import { translations } from '../../content/translations';

const cloneData = () => JSON.parse(JSON.stringify(translations));

const AdminPage = () => {
  const [authed, setAuthed] = useState(false);
  const [formAuth, setFormAuth] = useState({ user: '', pass: '' });
  const [lang, setLang] = useState('cz');
  const [data, setData] = useState(cloneData());
  const [newProperty, setNewProperty] = useState({
    name: '',
    location: '',
    price: '',
    sqm: '',
    rooms: '',
    image: '',
  });

  const t = useMemo(() => data[lang], [data, lang]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (formAuth.user === 'admin' && formAuth.pass === '1234') {
      setAuthed(true);
    } else {
      alert('Nesprávné údaje');
    }
  };

  const markSold = (prop) => {
    setData((prev) => {
      const next = cloneData();
      Object.assign(next, prev);
      next[lang] = { ...prev[lang] };
      next[lang].properties = { ...prev[lang].properties };
      next[lang].properties.items = prev[lang].properties.items.filter((p) => p.name !== prop.name);
      next[lang].properties.soldItems = [
        ...(prev[lang].properties.soldItems || []),
        { ...prop, tag: prev[lang].properties.toggles.sold },
      ];
      return next;
    });
  };

  const addProperty = (e) => {
    e.preventDefault();
    if (!newProperty.name || !newProperty.location || !newProperty.price) {
      alert('Vyplňte alespoň název, lokaci a cenu');
      return;
    }
    setData((prev) => {
      const next = cloneData();
      Object.assign(next, prev);
      next[lang] = { ...prev[lang] };
      next[lang].properties = { ...prev[lang].properties };
      next[lang].properties.items = [
        { ...newProperty, sqm: newProperty.sqm || '0', rooms: newProperty.rooms || '0', tag: 'Nové' },
        ...prev[lang].properties.items,
      ];
      return next;
    });
    setNewProperty({ name: '', location: '', price: '', sqm: '', rooms: '', image: '' });
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
          </form>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              {['cz', 'en', 'de'].map((l) => (
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
                <button type="submit" style={primaryBtn}>Uložit</button>
              </form>
            </section>

            <section>
              <h2 style={{ margin: '8px 0 12px' }}>{t.properties.title}</h2>
              <div style={{ display: 'grid', gap: 10 }}>
                {(t.properties.items || []).map((prop) => (
                  <div key={prop.name} style={{ border: '1px solid #e5e8f0', borderRadius: 12, padding: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }}>
                    <div>
                      <strong>{prop.name}</strong>
                      <div style={{ color: '#6b7280', fontSize: 14 }}>{prop.location}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={secondaryBtn} onClick={() => setSelected(prop)}>Detail</button>
                      <button style={primaryBtn} onClick={() => markSold(prop)}>Označit prodáno</button>
                    </div>
                  </div>
                ))}
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
