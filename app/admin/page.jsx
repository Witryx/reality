'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { ArrowLeftRight, CheckCircle2, Loader2, LogOut, Pencil, RefreshCw, UploadCloud } from 'lucide-react';

const ADMIN_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADMIN === '1';
const languages = ['cz', 'en', 'de'];
const blankProperty = { name: '', location: '', price: '', sqm: '', rooms: '', tag: '', description: '' };
const DIRECT_UPLOAD_THRESHOLD = 4 * 1024 * 1024; // Vercel request payload limit is lower than typical video sizes.
const MULTIPART_UPLOAD_THRESHOLD = 100 * 1024 * 1024;

const sanitizeFileName = (name = 'upload') =>
  String(name)
    .replace(/[^a-zA-Z0-9_.-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);

const shouldUseDirectUpload = (file) => {
  if (typeof window === 'undefined') return false;
  const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (isLocalHost) return false;
  return file?.type?.startsWith('video/') || file?.size > DIRECT_UPLOAD_THRESHOLD;
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

const toVideos = (value) => {
  const isVideoUrl = (src = '') => /\.(mp4|webm|ogg|mov)$/i.test(String(src));
  if (Array.isArray(value)) return value.filter((video) => video && isVideoUrl(video));
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter((video) => video && isVideoUrl(video));
    } catch {
      /* ignore */
    }
    return isVideoUrl(value) ? [value] : [];
  }
  return [];
};

const splitUploadedMedia = (files = [], urls = []) => {
  const images = [];
  const videos = [];
  urls.forEach((url, idx) => {
    const file = files[idx];
    if (file?.type?.startsWith('video/')) videos.push(url);
    else images.push(url);
  });
  return { images, videos };
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

const getFileKey = (file) =>
  [file?.name || 'upload', file?.size || 0, file?.lastModified || 0, file?.type || 'file'].join(':');

const getPendingCoverValue = (file) => `pending:${getFileKey(file)}`;
const isPendingCoverValue = (value) => typeof value === 'string' && value.startsWith('pending:');
const isImageFile = (file) => Boolean(file?.type?.startsWith('image/'));

const pickFirstImageSelection = (files = []) => {
  const firstImage = files.find(isImageFile);
  return firstImage ? getPendingCoverValue(firstImage) : null;
};

const resolveCoverImage = ({ coverSelection, existingImages = [], pendingFiles = [], uploadedImages = [] }) => {
  if (coverSelection && !isPendingCoverValue(coverSelection) && existingImages.includes(coverSelection)) {
    return coverSelection;
  }

  if (isPendingCoverValue(coverSelection)) {
    const pendingImages = pendingFiles.filter(isImageFile);
    const pendingIndex = pendingImages.findIndex((file) => getPendingCoverValue(file) === coverSelection);
    if (pendingIndex >= 0 && uploadedImages[pendingIndex]) {
      return uploadedImages[pendingIndex];
    }
  }

  return existingImages[0] || uploadedImages[0] || null;
};

const AdminPage = () => {
  const [authed, setAuthed] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [formAuth, setFormAuth] = useState({ user: '', pass: '' });
  const [lang, setLang] = useState('cz');
  const [properties, setProperties] = useState(splitProperties());
  const [newProperty, setNewProperty] = useState(blankProperty);
  const [newFiles, setNewFiles] = useState([]);
  const [newCoverSelection, setNewCoverSelection] = useState(null);
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
  const fallbackSplit = useMemo(() => splitProperties(), []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/session', {
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await res.json().catch(() => ({}));
        setAuthed(Boolean(data?.authenticated));
      } catch {
        setAuthed(false);
      } finally {
        setSessionLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const urls = newFiles.map((file) => URL.createObjectURL(file));
    setNewPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [newFiles]);

  useEffect(() => {
    if (!newFiles.length) {
      setNewCoverSelection(null);
      return;
    }

    const availableSelections = newFiles.filter(isImageFile).map(getPendingCoverValue);
    if (!availableSelections.length) {
      setNewCoverSelection(null);
      return;
    }

    if (!newCoverSelection || !availableSelections.includes(newCoverSelection)) {
      setNewCoverSelection(availableSelections[0]);
    }
  }, [newFiles, newCoverSelection]);

  useEffect(() => {
    const urls = editFiles.map((file) => URL.createObjectURL(file));
    setEditPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [editFiles]);

  useEffect(() => {
    if (!editing) return;

    const availablePendingSelections = editFiles.filter(isImageFile).map(getPendingCoverValue);
    const hasExistingSelection =
      editing.image &&
      !isPendingCoverValue(editing.image) &&
      Array.isArray(editing.images) &&
      editing.images.includes(editing.image);
    const hasPendingSelection =
      isPendingCoverValue(editing.image) && availablePendingSelections.includes(editing.image);

    if (hasExistingSelection || hasPendingSelection) return;

    const fallbackSelection = editing.images?.[0] || availablePendingSelections[0] || null;
    if (fallbackSelection !== editing.image) {
      setEditing((prev) => (prev ? { ...prev, image: fallbackSelection } : prev));
    }
  }, [editFiles, editing]);

  useEffect(() => {
    setProperties(splitProperties());
    setStatus('');
    setError('');
    if (authed) {
      loadProperties(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, authed, fallbackSplit]);

  const uploadFiles = async (files) => {
    if (!files?.length) return [];
    const uploadThroughServer = async (batch) => {
      if (!batch.length) return [];

      const formData = new FormData();
      batch.forEach((file) => formData.append('files', file));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthed(false);
        throw new Error('Relace vyprsela. Prihlaste se znovu.');
      }
      if (res.status === 413) {
        throw new Error('Soubor je prilis velky pro server upload. Video se musi nahrat primo do Blob uloziste.');
      }
      if (!res.ok) throw new Error(data?.detail || data?.error || 'Upload selhal.');
      return Array.isArray(data.urls) ? data.urls : [];
    };

    const uploadDirectToBlob = async (file) => {
      try {
        const blob = await upload(`uploads/${Date.now()}-${sanitizeFileName(file.name || 'upload')}`, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          multipart: file.size > MULTIPART_UPLOAD_THRESHOLD,
        });
        return blob.url;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes('401') || message.toLowerCase().includes('unauthorized')) {
          setAuthed(false);
          throw new Error('Relace vyprsela. Prihlaste se znovu.');
        }
        throw new Error(message || 'Upload selhal.');
      }
    };

    const directEntries = [];
    const serverEntries = [];
    files.forEach((file, index) => {
      if (shouldUseDirectUpload(file)) directEntries.push({ file, index });
      else serverEntries.push({ file, index });
    });

    const urls = new Array(files.length);

    if (serverEntries.length) {
      const serverUrls = await uploadThroughServer(serverEntries.map((entry) => entry.file));
      serverUrls.forEach((url, index) => {
        urls[serverEntries[index].index] = url;
      });
    }

    if (directEntries.length) {
      const directUrls = await Promise.all(
        directEntries.map(async ({ file }) => uploadDirectToBlob(file))
      );
      directUrls.forEach((url, index) => {
        urls[directEntries[index].index] = url;
      });
    }

    return urls;
  };

  const loadStaticProperties = async (currentLang) => {
    try {
      const staticRes = await fetch('/data/properties.json');
      if (!staticRes.ok) return [];
      const staticData = await staticRes.json().catch(() => ({}));
      const staticList = Array.isArray(staticData)
        ? staticData
        : Array.isArray(staticData?.properties)
          ? staticData.properties
          : [];
      return staticList.filter((item) => !item?.language || item.language === currentLang);
    } catch {
      return [];
    }
  };

  const loadProperties = async (currentLang) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/properties?lang=${currentLang}`, {
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthed(false);
        throw new Error('Relace vyprsela. Prihlaste se znovu.');
      }
      if (!res.ok) throw new Error(data?.detail || data?.error || 'Nepodarilo se nacist data.');
      const apiList = Array.isArray(data.properties) ? data.properties : [];
      const staticList = await loadStaticProperties(currentLang);
      const unique = new Map();
      [...apiList, ...staticList].forEach((item) => {
        if (!item) return;
        const key = `${String(item.name || '').trim()}|${String(item.location || '').trim()}`;
        if (!unique.has(key)) unique.set(key, item);
      });
      const combined = Array.from(unique.values());
      setProperties(combined.length ? splitProperties(combined) : fallbackSplit);
    } catch (err) {
      const staticList = await loadStaticProperties(currentLang);
      if (staticList.length) {
        setProperties(splitProperties(staticList));
      } else {
        setProperties(fallbackSplit);
      }
      setError(err.message || 'Nepodarilo se nacist data.');
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
      description: prop.description || prop.longDescription || '',
      images: Array.isArray(prop.images) ? prop.images : toImages(prop.images),
      videos: Array.isArray(prop.videos) ? prop.videos : toVideos(prop.videos),
      image: prop.image || toImages(prop.images)[0] || null,
    };
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await readJsonSafe(res);
    if (res.status === 401) {
      setAuthed(false);
      throw new Error('Relace vyprsela. Prihlaste se znovu.');
    }
    if (!res.ok) throw new Error(data?.detail || data?.error || 'Ulozeni selhalo.');
    if (!data?.property) throw new Error('Neplatna odpoved serveru.');
    let created = data.property;
    if (sold) {
      const toggleRes = await fetch('/api/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: created.id, sold: true }),
      });
      const toggleData = await toggleRes.json().catch(() => ({}));
      if (toggleRes.status === 401) {
        setAuthed(false);
        throw new Error('Relace vyprsela. Prihlaste se znovu.');
      }
      if (!toggleRes.ok) throw new Error(toggleData?.detail || toggleData?.error || 'Oznaceni prodano selhalo.');
      created = toggleData.property;
    }
    return created;
  };

  const ensurePersistedProperty = async (prop) => {
    if (prop?.id && prop?.created_at) return prop;
    if (prop?.id && prop?.persisted) return prop;
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
    const login = async () => {
      setError('');
      setStatus('');
      setAuthBusy(true);
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ user: formAuth.user, pass: formAuth.pass }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Nespravne udaje.');
        setAuthed(true);
        setFormAuth({ user: '', pass: '' });
        await loadProperties(lang);
      } catch (err) {
        setAuthed(false);
        setError(err.message || 'Nespravne udaje.');
      } finally {
        setAuthBusy(false);
      }
    };

    login();
  };

  const handleLogout = async () => {
    setAuthBusy(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } finally {
      setAuthed(false);
      setStatus('');
      setError('');
      setProperties(splitProperties());
      setAuthBusy(false);
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
      setError('Pripojte aspon jedno medium (obrazek nebo video).');
      return;
    }

    setSavingNew(true);
    try {
      const uploaded = await uploadFiles(newFiles);
      const { images: uploadedImages, videos: uploadedVideos } = splitUploadedMedia(newFiles, uploaded);
      const coverImage = resolveCoverImage({
        coverSelection: newCoverSelection,
        pendingFiles: newFiles,
        uploadedImages,
      });
      const payload = {
        ...newProperty,
        language: lang,
        sqm: toNumberOrNull(newProperty.sqm),
        rooms: toNumberOrNull(newProperty.rooms),
        tag: newProperty.tag || 'Nova',
        description: newProperty.description || '',
        images: uploadedImages,
        videos: uploadedVideos,
        image: coverImage,
      };
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await readJsonSafe(res);
      if (res.status === 401) {
        setAuthed(false);
        throw new Error('Relace vyprsela. Prihlaste se znovu.');
      }
      if (!res.ok) throw new Error(data?.detail || data?.error || 'Ulozeni selhalo.');
      if (!data?.property) throw new Error('Neplatna odpoved serveru.');

      applyUpdate(data.property);
      setNewProperty(blankProperty);
      setNewFiles([]);
      setNewCoverSelection(null);
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
        credentials: 'include',
        body: JSON.stringify({ id: ensured.id, sold: soldState }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthed(false);
        throw new Error('Relace vyprsela. Prihlaste se znovu.');
      }
      if (!res.ok) throw new Error(data?.detail || data?.error || 'Aktualizace selhala.');
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
        credentials: 'include',
        body: JSON.stringify({ id: ensured.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthed(false);
        throw new Error('Relace vyprsela. Prihlaste se znovu.');
      }
      if (!res.ok) throw new Error(data?.detail || data?.error || 'Smazani selhalo.');
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
      const videos = toVideos(ensured.videos);
      const cover = images.length ? images : ensured.image ? [ensured.image] : [];
      setEditing({
        ...ensured,
        images: cover,
        videos,
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
      const nextImages = (prev.images || []).filter((img, idx) => idx !== target);
      const removedImage = prev.images?.[target];
      const fallbackPendingSelection = pickFirstImageSelection(editFiles);
      const nextImage = prev.image === removedImage ? nextImages[0] || fallbackPendingSelection || null : prev.image;
      return { ...prev, images: nextImages, image: nextImage };
    });
  };

  const removeExistingVideo = (target) => {
    setEditing((prev) => {
      if (!prev) return prev;
      return { ...prev, videos: (prev.videos || []).filter((vid, idx) => idx !== target) };
    });
  };

  const removePendingNewFile = (target) => {
    const remaining = newFiles.filter((_, idx) => idx !== target);
    setNewFiles(remaining);

    const availableSelections = remaining.filter(isImageFile).map(getPendingCoverValue);
    if (!availableSelections.length) {
      setNewCoverSelection(null);
      return;
    }

    if (!newCoverSelection || !availableSelections.includes(newCoverSelection)) {
      setNewCoverSelection(availableSelections[0]);
    }
  };

  const removePendingEditFile = (target) => {
    const remaining = editFiles.filter((_, idx) => idx !== target);
    setEditFiles(remaining);
    setEditing((prev) => {
      if (!prev) return prev;

      const availablePendingSelections = remaining.filter(isImageFile).map(getPendingCoverValue);
      const hasExistingSelection =
        prev.image &&
        !isPendingCoverValue(prev.image) &&
        Array.isArray(prev.images) &&
        prev.images.includes(prev.image);
      const hasPendingSelection =
        isPendingCoverValue(prev.image) && availablePendingSelections.includes(prev.image);

      if (hasExistingSelection || hasPendingSelection) return prev;

      return {
        ...prev,
        image: prev.images?.[0] || availablePendingSelections[0] || null,
      };
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
      const { images: uploadedImages, videos: uploadedVideos } = splitUploadedMedia(editFiles, uploaded);
      const baseImages = Array.isArray(editing.images) ? editing.images.filter(Boolean) : [];
      const baseVideos = Array.isArray(editing.videos) ? editing.videos.filter(Boolean) : [];
      const mergedImages = uploadedImages.length ? [...baseImages, ...uploadedImages] : baseImages;
      const mergedVideos = uploadedVideos.length ? [...baseVideos, ...uploadedVideos] : baseVideos;
      const coverImage = resolveCoverImage({
        coverSelection: editing.image,
        existingImages: baseImages,
        pendingFiles: editFiles,
        uploadedImages,
      });

      const payload = {
        ...editing,
        id: editing.id,
        language: lang,
        description: editing.description || '',
        images: mergedImages,
        videos: mergedVideos,
        image: coverImage,
      };

      const res = await fetch('/api/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthed(false);
        throw new Error('Relace vyprsela. Prihlaste se znovu.');
      }
      if (!res.ok) throw new Error(data?.detail || data?.error || 'Ulozeni selhalo.');

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

  if (!ADMIN_ENABLED) {
    return (
      <div style={{ padding: 40, maxWidth: 720, margin: '0 auto' }}>
        <h1>Admin je momentalne vypnuty</h1>
        <p>Tento build nema povolene admin rozhrani. Pro produkcni provoz na Vercel zapnete serverove API a databazi.</p>
        <p>Nastavte promennou NEXT_PUBLIC_ENABLE_ADMIN=1 a znovu nasadte aplikaci.</p>
      </div>
    );
  }

  if (sessionLoading) {
    return (
      <div style={{ padding: 40, maxWidth: 720, margin: '0 auto' }}>
        <h1>Admin panel</h1>
        <p>Overuji prihlaseni...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f5f8',
        padding: '28px 16px 36px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', color: '#0f1c2d' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p style={{ margin: 0, color: '#5b6b7a', letterSpacing: 0.3, fontSize: 13 }}>Admin panel</p>
            <h1 style={{ margin: '2px 0 6px', fontSize: 28, fontWeight: 800 }}>Sprava nemovitosti</h1>
            <p style={{ margin: 0, color: '#5b6b7a', maxWidth: 640, lineHeight: 1.45 }}>
              Nahrajte fotky, vyplnte zakladni informace a jednoduse prepnite nabidku mezi aktivni/prodano.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {authed && (
              <>
                <button onClick={() => loadProperties(lang)} style={{ ...chipBtn, background: '#0f2c4d', color: '#fff' }}>
                  <RefreshCw size={16} />
                  Obnovit
                </button>
                <button onClick={handleLogout} style={{ ...chipBtn, background: '#fff', color: '#0f2c4d' }} disabled={authBusy}>
                  <LogOut size={16} />
                  {authBusy ? 'Odhlasuji...' : 'Odhlasit'}
                </button>
              </>
            )}
          </div>
        </div>

        {!authed ? (
          <div style={{ ...card, maxWidth: 420 }}>
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Prihlaseni</h3>
            <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12 }}>
              <input
                placeholder="Uzivatel"
                value={formAuth.user}
                onChange={(e) => setFormAuth({ ...formAuth, user: e.target.value })}
                style={inputStyle}
                disabled={authBusy}
              />
              <input
                placeholder="Heslo"
                type="password"
                value={formAuth.pass}
                onChange={(e) => setFormAuth({ ...formAuth, pass: e.target.value })}
                style={inputStyle}
                disabled={authBusy}
              />
              <button type="submit" style={{ ...primaryBtn, display: 'inline-flex', alignItems: 'center', gap: 8 }} disabled={authBusy}>
                {authBusy ? <Loader2 size={18} /> : <CheckCircle2 size={18} />}
                {authBusy ? 'Prihlasuji...' : 'Prihlasit'}
              </button>
              {error && <div style={{ color: '#b42318', fontSize: 13 }}>{error}</div>}
            </form>
          </div>
        ) : (
          <>
            <div style={{ ...card, marginBottom: 16 }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, alignItems: 'start' }}>
              <section style={{ ...card, minWidth: 320 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <UploadCloud size={20} color="#0f2c4d" />
                  <h3 style={{ margin: 0 }}>Nova nemovitost</h3>
                </div>
                <form onSubmit={addProperty} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
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
                      <div style={{ fontWeight: 700, color: '#0f2c4d' }}>Nahrajte media</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>Vyberte obrazky nebo videa (minimalne jedno medium).</div>
                    </div>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        setNewFiles(Array.from(e.target.files || []));
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {!!newPreviews.length && (
                    <div style={{ display: 'grid', gap: 8 }}>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>U fotek muzes vybrat titulni obrazek a nepotrebne soubory odebrat.</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                      {newPreviews.map((src, idx) => (
                        <div
                          key={src}
                          style={{
                            ...thumb,
                            position: 'relative',
                            borderColor:
                              isImageFile(newFiles[idx]) && newCoverSelection === getPendingCoverValue(newFiles[idx])
                                ? '#0f2c4d'
                                : '#e5e7eb',
                            boxShadow:
                              isImageFile(newFiles[idx]) && newCoverSelection === getPendingCoverValue(newFiles[idx])
                                ? '0 0 0 2px rgba(15, 44, 77, 0.12)'
                                : 'none',
                          }}
                        >
                          {newFiles[idx]?.type?.startsWith('video/') ? (
                            <video
                              src={src}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                              controls
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={src}
                              alt={`Nahrany obrazek ${idx + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                            />
                          )}
                          <button type="button" onClick={() => removePendingNewFile(idx)} style={removeBtn}>
                            x
                          </button>
                          {isImageFile(newFiles[idx]) && (
                            <button
                              type="button"
                              onClick={() => setNewCoverSelection(getPendingCoverValue(newFiles[idx]))}
                              style={{
                                ...coverSelectBtn,
                                background:
                                  newCoverSelection === getPendingCoverValue(newFiles[idx]) ? '#0f2c4d' : 'rgba(255,255,255,0.92)',
                                color: newCoverSelection === getPendingCoverValue(newFiles[idx]) ? '#fff' : '#0f2c4d',
                              }}
                            >
                              {newCoverSelection === getPendingCoverValue(newFiles[idx]) ? 'Titulka' : 'Nastavit titulku'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
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
                        return (
                          <div key={prop.id || prop.name} style={propertyRow}>
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
                              <button
                                style={dangerBtn}
                                onClick={() => removeProperty(prop)}
                                disabled={deletingId === (prop.id || prop.name)}
                              >
                                {deletingId === (prop.id || prop.name) ? <Loader2 size={16} /> : '✕'}
                                Smazat
                              </button>
                              <button
                                style={{ ...pillBtn, background: '#102a42', color: '#fff' }}
                                onClick={() => toggleSold(prop, true)}
                                disabled={togglingId === (prop.id || prop.name)}
                              >
                                {togglingId === (prop.id || prop.name) ? <Loader2 size={16} /> : <ArrowLeftRight size={16} />}
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
                        return (
                          <div key={prop.id || prop.name} style={{ ...propertyRow, background: '#f5f7fb' }}>
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
                              <button
                                style={dangerBtn}
                                onClick={() => removeProperty(prop)}
                                disabled={deletingId === (prop.id || prop.name)}
                              >
                                {deletingId === (prop.id || prop.name) ? <Loader2 size={16} /> : '✕'}
                                Smazat
                              </button>
                              <button
                                style={{ ...pillBtn, background: '#fff', color: '#0f2c4d', borderColor: '#d28b37' }}
                                onClick={() => toggleSold(prop, false)}
                                disabled={togglingId === (prop.id || prop.name)}
                              >
                                {togglingId === (prop.id || prop.name) ? <Loader2 size={16} /> : <ArrowLeftRight size={16} />}
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
                      <div style={{ color: '#6b7280', fontSize: 13 }}>Kliknutim nastavis, ktera fotka bude titulni.</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                        {(editing.images || []).map((src, idx) => (
                          <div
                            key={src + idx}
                            style={{
                              position: 'relative',
                              borderRadius: 10,
                              boxShadow: editing.image === src ? '0 0 0 2px rgba(15, 44, 77, 0.12)' : 'none',
                            }}
                          >
                            <img
                              src={src}
                              alt={`Foto ${idx + 1}`}
                              style={{
                                width: '100%',
                                height: 90,
                                objectFit: 'cover',
                                borderRadius: 10,
                                border: editing.image === src ? '1px solid #0f2c4d' : '1px solid #e5e7eb',
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setEditing((prev) => (prev ? { ...prev, image: src } : prev))}
                              style={{
                                ...coverSelectBtn,
                                background: editing.image === src ? '#0f2c4d' : 'rgba(255,255,255,0.92)',
                                color: editing.image === src ? '#fff' : '#0f2c4d',
                              }}
                            >
                              {editing.image === src ? 'Titulka' : 'Nastavit titulku'}
                            </button>
                            <button type="button" onClick={() => removeExistingImage(idx)} style={removeBtn}>
                              x
                            </button>
                          </div>
                        ))}
                        {!(editing.images || []).length && <div style={{ color: '#6b7280', fontSize: 13 }}>Zatim zadne ulozene fotky.</div>}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: 6 }}>
                      <div style={{ fontWeight: 700 }}>Aktualni videa</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                        {(editing.videos || []).map((src, idx) => (
                          <div key={src + idx} style={{ position: 'relative' }}>
                            <video
                              src={src}
                              style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 10, border: '1px solid #e5e7eb' }}
                              controls
                              muted
                              playsInline
                            />
                            <button type="button" onClick={() => removeExistingVideo(idx)} style={removeBtn}>
                              x
                            </button>
                          </div>
                        ))}
                        {!(editing.videos || []).length && <div style={{ color: '#6b7280', fontSize: 13 }}>Zatim zadna ulozena videa.</div>}
                      </div>
                    </div>

                    <label style={uploadBox}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f2c4d' }}>Pridat dalsi media</div>
                        <div style={{ color: '#6b7280', fontSize: 13 }}>Nove obrazky i videa se pridaji ke stavajicim.</div>
                      </div>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          setEditFiles(Array.from(e.target.files || []));
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {!!editPreviews.length && (
                      <div style={{ display: 'grid', gap: 8 }}>
                        <div style={{ color: '#6b7280', fontSize: 13 }}>I u novych fotek muzes rovnou zvolit titulni obrazek nebo soubor odebrat.</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                        {editPreviews.map((src, idx) => (
                          <div
                            key={src}
                            style={{
                              ...thumb,
                              position: 'relative',
                              borderColor:
                                isImageFile(editFiles[idx]) && editing.image === getPendingCoverValue(editFiles[idx])
                                  ? '#0f2c4d'
                                  : '#e5e7eb',
                              boxShadow:
                                isImageFile(editFiles[idx]) && editing.image === getPendingCoverValue(editFiles[idx])
                                  ? '0 0 0 2px rgba(15, 44, 77, 0.12)'
                                  : 'none',
                            }}
                          >
                            {editFiles[idx]?.type?.startsWith('video/') ? (
                              <video
                                src={src}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                                controls
                                muted
                                playsInline
                              />
                            ) : (
                              <img
                                src={src}
                                alt={`Nova fotka ${idx + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                              />
                            )}
                            <button type="button" onClick={() => removePendingEditFile(idx)} style={removeBtn}>
                              x
                            </button>
                            {isImageFile(editFiles[idx]) && (
                              <button
                                type="button"
                                onClick={() => setEditing((prev) => (prev ? { ...prev, image: getPendingCoverValue(editFiles[idx]) } : prev))}
                                style={{
                                  ...coverSelectBtn,
                                  background: editing.image === getPendingCoverValue(editFiles[idx]) ? '#0f2c4d' : 'rgba(255,255,255,0.92)',
                                  color: editing.image === getPendingCoverValue(editFiles[idx]) ? '#fff' : '#0f2c4d',
                                }}
                              >
                                {editing.image === getPendingCoverValue(editFiles[idx]) ? 'Titulka' : 'Nastavit titulku'}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
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

const coverSelectBtn = {
  position: 'absolute',
  left: 6,
  bottom: 6,
  border: '1px solid rgba(15,28,45,0.15)',
  borderRadius: 999,
  padding: '4px 8px',
  fontSize: 11,
  fontWeight: 700,
  cursor: 'pointer',
};

export default AdminPage;
