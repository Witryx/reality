'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { upload } from '@vercel/blob/client';
import {
  ArrowLeftRight,
  Building2,
  CheckCircle2,
  CircleAlert,
  Film,
  Globe2,
  Images,
  LayoutDashboard,
  Loader2,
  LogOut,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import styles from './admin.module.css';
import { globalStyles } from '../../styles/globalStyles';

const ADMIN_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADMIN === '1';
const languages = ['cz', 'en', 'de'];
const blankProperty = { name: '', location: '', price: '', sqm: '', rooms: '', tag: '', description: '' };
const DIRECT_UPLOAD_THRESHOLD = 4 * 1024 * 1024; // Vercel request payload limit is lower than typical video sizes.
const MULTIPART_UPLOAD_THRESHOLD = 100 * 1024 * 1024;
const PROPERTY_PAGE_SIZE = 6;

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

const withCoverFirst = (images = [], coverImage = null) => {
  const cleaned = images.filter(Boolean);
  if (!coverImage) return cleaned;
  return [coverImage, ...cleaned.filter((src) => src !== coverImage)];
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

const toInputValue = (value) => (value == null ? '' : String(value));

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

const cx = (...classes) => classes.filter(Boolean).join(' ');

const normalizeEditableProperty = (prop = {}) => {
  const images = withCoverFirst(toImages(prop.images), prop.image);
  const videos = toVideos(prop.videos);
  const coverImage = prop.image && images.includes(prop.image) ? prop.image : images[0] || null;

  return {
    ...prop,
    name: toInputValue(prop.name),
    location: toInputValue(prop.location),
    price: toInputValue(prop.price),
    sqm: toInputValue(prop.sqm),
    rooms: toInputValue(prop.rooms),
    tag: toInputValue(prop.tag),
    description: toInputValue(prop.description || prop.longDescription),
    images,
    videos,
    image: coverImage,
  };
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
  const [listingView, setListingView] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [listingView, lang]);

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

  const handleLogin = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      setAuthed(false);
      setError(err.message || 'Nespravne udaje.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    setAuthBusy(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } finally {
      setAuthed(false);
      setStatus('');
      setError('');
      setEditing(null);
      setEditFiles([]);
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
      setEditing(normalizeEditableProperty(ensured));
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
        sqm: toNumberOrNull(editing.sqm),
        rooms: toNumberOrNull(editing.rooms),
        tag: editing.tag || 'Nova',
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
  const totalCount = activeCount + soldCount;
  const isLoginScreen = ADMIN_ENABLED && !sessionLoading && !authed;
  const listingBuckets = useMemo(
    () => ({
      all: [...(properties.active || []), ...(properties.sold || [])],
      active: properties.active || [],
      sold: properties.sold || [],
    }),
    [properties]
  );
  const filteredProperties = listingBuckets[listingView] || [];
  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / PROPERTY_PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProperties = filteredProperties.slice(
    (safeCurrentPage - 1) * PROPERTY_PAGE_SIZE,
    safeCurrentPage * PROPERTY_PAGE_SIZE
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const feedbackTone = error ? 'error' : status ? 'success' : loading ? 'info' : null;
  const feedbackMessage = error || status || (loading ? 'Nacitam aktualni data...' : '');

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const renderFeedback = (message = feedbackMessage, tone = feedbackTone) => {
    if (!message || !tone) return null;

    const icon =
      tone === 'error' ? (
        <CircleAlert size={18} />
      ) : tone === 'info' ? (
        <RefreshCw size={18} className={styles.spin} />
      ) : (
        <CheckCircle2 size={18} />
      );

    return (
      <div
        className={cx(
          styles.statusBar,
          tone === 'success' && styles.statusSuccess,
          tone === 'error' && styles.statusError,
          tone === 'info' && styles.statusInfo
        )}
      >
        {icon}
        <span>{message}</span>
      </div>
    );
  };

  const renderPendingPreviewCard = ({ src, file, selected, onSelect, onRemove, alt }) => {
    const isVideo = file?.type?.startsWith('video/');

    return (
      <div key={`${src}-${alt}`} className={cx(styles.previewCard, selected && styles.previewSelected)}>
        {isVideo ? (
          <video src={src} className={styles.previewMedia} controls muted playsInline />
        ) : (
          <img src={src} alt={alt} className={styles.previewMedia} />
        )}
        <span className={styles.previewBadge}>{isVideo ? 'Video' : 'Foto'}</span>
        <button type="button" onClick={onRemove} className={styles.previewRemove}>
          <X size={14} />
        </button>
        {!isVideo ? (
          <button
            type="button"
            onClick={onSelect}
            className={cx(styles.coverButton, selected && styles.coverButtonActive)}
          >
            {selected ? 'Titulka' : 'Nastavit titulku'}
          </button>
        ) : null}
      </div>
    );
  };

  const renderPropertyCard = (prop, soldView = false) => {
    const itemKey = prop.id || prop.name;
    const images = toImages(prop.images);
    const videos = toVideos(prop.videos);
    const cover = prop.image || images[0];
    const mediaCount = images.length + videos.length;

    return (
      <article key={itemKey} className={cx(styles.propertyCard, soldView && styles.propertyCardSold)}>
        <div className={styles.propertyVisual}>
          {cover ? (
            <>
              <img src={cover} alt={prop.name} className={styles.propertyImage} />
              <div className={styles.propertyOverlay} />
            </>
          ) : (
            <div className={styles.propertyFallback}>
              <Sparkles size={22} />
              <span>Bez titulni fotky</span>
            </div>
          )}
          <span
            className={cx(
              styles.stateBadge,
              soldView ? styles.stateBadgeSold : styles.stateBadgeActive
            )}
          >
            {soldView ? 'Prodano' : 'Aktivni'}
          </span>
          {prop.tag ? <span className={styles.tagBadge}>{prop.tag}</span> : null}
          <span className={styles.mediaBadge}>
            <Images size={14} />
            {mediaCount} media
          </span>
        </div>

        <div className={styles.propertyBody}>
          <div className={styles.propertyHeader}>
            <div>
              <h3 className={styles.propertyTitle}>{prop.name}</h3>
              <p className={styles.propertyLocation}>{prop.location}</p>
            </div>
            <div className={styles.propertyPrice}>{prop.price}</div>
          </div>

          <div className={styles.propertyMeta}>
            {prop.sqm ? <span className={styles.metaChip}>{prop.sqm} m2</span> : null}
            {prop.rooms ? <span className={styles.metaChip}>{prop.rooms} pokoje</span> : null}
            {videos.length ? (
              <span className={styles.metaChip}>
                <Film size={14} />
                {videos.length} videa
              </span>
            ) : null}
            {!videos.length && images.length ? (
              <span className={styles.metaChip}>
                <Images size={14} />
                {images.length} fotek
              </span>
            ) : null}
          </div>

          <div className={styles.propertyActions}>
            <button
              type="button"
              className={cx(styles.button, styles.buttonGhost)}
              onClick={() => startEdit(prop)}
            >
              <Pencil size={16} />
              Upravit
            </button>

            <button
              type="button"
              className={cx(styles.button, styles.buttonDanger)}
              onClick={() => removeProperty(prop)}
              disabled={deletingId === itemKey}
            >
              {deletingId === itemKey ? <Loader2 size={16} className={styles.spin} /> : <Trash2 size={16} />}
              Smazat
            </button>

            <button
              type="button"
              className={cx(styles.button, soldView ? styles.buttonOutline : styles.buttonAccent)}
              onClick={() => toggleSold(prop, !soldView)}
              disabled={togglingId === itemKey}
            >
              {togglingId === itemKey ? (
                <Loader2 size={16} className={styles.spin} />
              ) : (
                <ArrowLeftRight size={16} />
              )}
              {soldView ? 'Zpet do aktivnich' : 'Prodano'}
            </button>
          </div>
        </div>
      </article>
    );
  };

  let pageContent = null;

  if (!ADMIN_ENABLED) {
    pageContent = (
      <div className={styles.stateScreen}>
        <section className={cx(styles.surface, styles.stateCard)}>
          <div className={styles.brandTop}>
            <span className={styles.eyebrow}>Admin panel</span>
            <span className={styles.securityBadge}>
              <CircleAlert size={14} />
              Vypnuto
            </span>
          </div>
          <h1 className={styles.stateTitle}>Admin rozhrani je v tomhle buildu vypnute</h1>
          <p className={styles.stateText}>
            Tady se ma zobrazit prihlaseni a sprava nabidek, ale aplikace nema povoleny admin mod.
          </p>
          <div className={styles.stateList}>
            <div className={styles.stateItem}>Nastav `NEXT_PUBLIC_ENABLE_ADMIN=1`.</div>
            <div className={styles.stateItem}>Zkontroluj serverove API a session cookie pro admin pristup.</div>
            <div className={styles.stateItem}>Po zmene aplikaci znovu nasad nebo restartuj lokalni server.</div>
          </div>
        </section>
      </div>
    );
  } else if (sessionLoading) {
    pageContent = (
      <div className={styles.stateScreen}>
        <section className={cx(styles.surface, styles.stateCard)}>
          <div className={styles.brandTop}>
            <span className={styles.eyebrow}>Admin panel</span>
            <span className={styles.securityBadge}>
              <ShieldCheck size={14} />
              Overeni relace
            </span>
          </div>
          <h1 className={styles.stateTitle}>Kontroluji prihlaseni</h1>
          <p className={styles.stateText}>Jakmile overime session, otevreme login nebo rovnou dashboard.</p>
          <div className={cx(styles.statusBar, styles.statusInfo)}>
            <Loader2 size={18} className={styles.spin} />
            <span>Pripravuji admin prostredi...</span>
          </div>
        </section>
      </div>
    );
  } else if (!authed) {
    pageContent = (
      <div className={styles.loginLayout}>
        <section className={cx(styles.surface, styles.brandPanel)}>
          <div className={styles.brandTop}>
            <span className={styles.eyebrow}>Admin entry</span>
            <span className={styles.securityBadge}>
              <ShieldCheck size={14} />
              Pouze interni pristup
            </span>
          </div>

          <div className={styles.loginIntro}>
            <div className={styles.loginLogoWrap}>
              <img src="/MAINLOGO.png" alt="Egyptsko Ceska Reality" className={styles.loginLogo} />
            </div>

            <div className={styles.loginCopy}>
              <h1 className={styles.loginTitle}>Sprava nemovitosti</h1>
              <p className={styles.loginText}>
                Prihlaseni do administrace pro pridani, upravu a mazani nabidek.
              </p>
            </div>
          </div>

          <div className={styles.loginInfoList}>
            <div className={styles.loginInfoItem}>Pridavani a uprava nabidek</div>
            <div className={styles.loginInfoItem}>Nahravani fotek a videi</div>
            <div className={styles.loginInfoItem}>Presun mezi aktivni a prodane</div>
            <div className={styles.loginInfoItem}>Sprava jazykovych mutaci CZ / EN / DE</div>
          </div>
        </section>

        <section className={cx(styles.surface, styles.loginCard)}>
          <div>
            <p className={styles.pretitle}>Prihlaseni</p>
            <h2 className={styles.cardTitle}>Admin</h2>
            <p className={styles.cardText}>
              Zadej uzivatelske jmeno a heslo.
            </p>
          </div>

          {error ? renderFeedback(error, 'error') : null}

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Uzivatel</span>
              <input
                className={styles.input}
                placeholder="admin"
                value={formAuth.user}
                onChange={(e) => setFormAuth({ ...formAuth, user: e.target.value })}
                disabled={authBusy}
                autoComplete="username"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Heslo</span>
              <input
                className={styles.input}
                placeholder="********"
                type="password"
                value={formAuth.pass}
                onChange={(e) => setFormAuth({ ...formAuth, pass: e.target.value })}
                disabled={authBusy}
                autoComplete="current-password"
              />
            </label>

            <button
              type="submit"
              className={cx(styles.button, styles.buttonPrimary, styles.buttonFull)}
              disabled={authBusy}
            >
              {authBusy ? <Loader2 size={18} className={styles.spin} /> : <ShieldCheck size={18} />}
              {authBusy ? 'Prihlasuji...' : 'Prihlasit se'}
            </button>
          </form>

          <div className={styles.loginFootnote}>
            Po vyprseni session te admin vrati zpet na login.
          </div>
        </section>
      </div>
    );
  } else {
    pageContent = (
      <div className={styles.dashboardStack}>
        <header className={cx(styles.surface, styles.heroCard)}>
          <div className={styles.heroMain}>
            <div className={styles.brandTop}>
              <span className={styles.eyebrow}>Admin cockpit</span>
              <span className={styles.securityBadge}>
                <ShieldCheck size={14} />
                Prihlaseno
              </span>
            </div>

            <h1 className={styles.heroTitle}>Sprava nemovitosti</h1>
            <p className={styles.heroDescription}>
              Nahraj fotky a videa, prepinej mezi jazyky a posouvej nabidky mezi aktivni a prodane z jednoho cisteho rozhrani.
            </p>

            <div className={styles.actionCluster}>
              <div className={styles.languageRow}>
                {languages.map((languageOption) => (
                  <button
                    key={languageOption}
                    type="button"
                    className={cx(
                      styles.languageTab,
                      lang === languageOption && styles.languageTabActive
                    )}
                    onClick={() => setLang(languageOption)}
                  >
                    {languageOption.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className={styles.heroActions}>
                <button
                  type="button"
                  className={cx(styles.button, styles.buttonGhost)}
                  onClick={() => loadProperties(lang)}
                  disabled={loading || authBusy}
                >
                  {loading ? <Loader2 size={16} className={styles.spin} /> : <RefreshCw size={16} />}
                  Obnovit
                </button>

                <button
                  type="button"
                  className={cx(styles.button, styles.buttonOutline)}
                  onClick={handleLogout}
                  disabled={authBusy}
                >
                  {authBusy ? <Loader2 size={16} className={styles.spin} /> : <LogOut size={16} />}
                  {authBusy ? 'Odhlasuji...' : 'Odhlasit'}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <LayoutDashboard size={18} />
              </div>
              <div className={styles.metricLabel}>Celkem nabidek</div>
              <div className={styles.metricValue}>{totalCount}</div>
              <div className={styles.metricHint}>Souhrn vsech zaznamu v aktualnim adminu.</div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <CheckCircle2 size={18} />
              </div>
              <div className={styles.metricLabel}>Aktivni</div>
              <div className={styles.metricValue}>{activeCount}</div>
              <div className={styles.metricHint}>Prave publikovane nebo pripravene na prodej.</div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <ArrowLeftRight size={18} />
              </div>
              <div className={styles.metricLabel}>Prodane</div>
              <div className={styles.metricValue}>{soldCount}</div>
              <div className={styles.metricHint}>Archivovane polozky, ktere zustavaji po ruce.</div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Globe2 size={18} />
              </div>
              <div className={styles.metricLabel}>Pracovni jazyk</div>
              <div className={styles.metricValue}>{lang.toUpperCase()}</div>
              <div className={styles.metricHint}>Vsechny nove i upravene zaznamy ted miri do teto mutace.</div>
            </div>
          </div>
        </header>

        {renderFeedback()}

        <div className={styles.dashboardGrid}>
          <section className={cx(styles.surface, styles.sectionCard, styles.editorCard)}>
            <div className={styles.sectionHeading}>
              <div className={styles.sectionTitleWrap}>
                <span className={styles.helperBadge}>Publikace</span>
                <h2 className={styles.sectionTitle}>
                  <Building2 size={20} />
                  Nova nemovitost
                </h2>
                <p className={styles.sectionDescription}>
                  Vypln zakladni data, pridej media a vyber titulni fotku pro listing.
                </p>
              </div>
              <span className={styles.helperBadge}>{lang.toUpperCase()}</span>
            </div>

            <form onSubmit={addProperty} className={styles.editorForm}>
              <div className={styles.fieldRowTwo}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Nazev</span>
                  <input
                    className={styles.input}
                    placeholder="Napriklad Byt s vyhledem na more"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Lokace</span>
                  <input
                    className={styles.input}
                    placeholder="Hurghada, Sahl Hasheesh..."
                    value={newProperty.location}
                    onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                  />
                </label>
              </div>

              <div className={styles.fieldRowThree}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Cena</span>
                  <input
                    className={styles.input}
                    placeholder="Napriklad 85 000 EUR"
                    value={newProperty.price}
                    onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>m2</span>
                  <input
                    className={styles.input}
                    placeholder="74"
                    value={newProperty.sqm}
                    onChange={(e) => setNewProperty({ ...newProperty, sqm: e.target.value })}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Pokoje</span>
                  <input
                    className={styles.input}
                    placeholder="3"
                    value={newProperty.rooms}
                    onChange={(e) => setNewProperty({ ...newProperty, rooms: e.target.value })}
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Stitek</span>
                <input
                  className={styles.input}
                  placeholder="Nova, Top, Investice..."
                  value={newProperty.tag}
                  onChange={(e) => setNewProperty({ ...newProperty, tag: e.target.value })}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Popis</span>
                <textarea
                  className={styles.textarea}
                  placeholder="Strucny i detailni popis nemovitosti"
                  value={newProperty.description}
                  onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                />
              </label>

              <label className={styles.uploadArea}>
                <div className={styles.uploadIcon}>
                  <UploadCloud size={20} />
                </div>
                <div>
                  <div className={styles.uploadTitle}>Nahraj fotky a videa</div>
                  <div className={styles.uploadText}>
                    Vyber aspon jedno medium. U vetsich souboru se admin sam prepne na primy upload do Blob uloziste.
                  </div>
                </div>
                <span className={styles.uploadCta}>Vybrat soubory</span>
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
                <div className={styles.previewSection}>
                  <div className={styles.sectionHeading}>
                    <div className={styles.sectionTitleWrap}>
                      <span className={styles.helperBadge}>Prehled nahravky</span>
                      <p className={styles.sectionDescription}>
                        U fotek muzes hned vybrat titulni snimek. Nepotrebne soubory klidne vyhod jeste pred ulozenim.
                      </p>
                    </div>
                    <span className={styles.helperBadge}>{newFiles.length} souboru</span>
                  </div>

                  <div className={styles.previewGrid}>
                    {newPreviews.map((src, idx) =>
                      renderPendingPreviewCard({
                        src,
                        file: newFiles[idx],
                        selected:
                          isImageFile(newFiles[idx]) &&
                          newCoverSelection === getPendingCoverValue(newFiles[idx]),
                        onSelect: () => setNewCoverSelection(getPendingCoverValue(newFiles[idx])),
                        onRemove: () => removePendingNewFile(idx),
                        alt: `Nahrane medium ${idx + 1}`,
                      })
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={cx(styles.button, styles.buttonPrimary, styles.buttonFull)}
                disabled={savingNew}
              >
                {savingNew ? <Loader2 size={18} className={styles.spin} /> : <CheckCircle2 size={18} />}
                {savingNew ? 'Ukladam...' : 'Ulozit nemovitost'}
              </button>
            </form>
          </section>

          <section className={cx(styles.surface, styles.sectionCard, styles.listingCard)}>
            <div className={cx(styles.sectionHeading, styles.listingHeader)}>
              <div className={styles.sectionTitleWrap}>
                <span className={styles.helperBadge}>Prehled</span>
                <h2 className={styles.sectionTitle}>
                  <LayoutDashboard size={20} />
                  Sprava nabidek
                </h2>
                <p className={styles.sectionDescription}>
                  Nabidky jsou pod formularem v samostatnem bloku. Prepines si stav a pri vetsim poctu listujes po strankach.
                </p>
              </div>
              <div className={styles.listingMeta}>
                <span className={styles.helperBadge}>{totalCount} celkem</span>
                <span className={styles.helperBadge}>Strana {safeCurrentPage} / {totalPages}</span>
              </div>
            </div>

            <div className={styles.listingToolbar}>
              <div className={styles.viewTabs}>
                <button
                  type="button"
                  className={cx(styles.viewTab, listingView === 'all' && styles.viewTabActive)}
                  onClick={() => setListingView('all')}
                >
                  Vse
                  <span className={styles.viewTabCount}>{totalCount}</span>
                </button>
                <button
                  type="button"
                  className={cx(styles.viewTab, listingView === 'active' && styles.viewTabActive)}
                  onClick={() => setListingView('active')}
                >
                  Aktivni
                  <span className={styles.viewTabCount}>{activeCount}</span>
                </button>
                <button
                  type="button"
                  className={cx(styles.viewTab, listingView === 'sold' && styles.viewTabActive)}
                  onClick={() => setListingView('sold')}
                >
                  Prodane
                  <span className={styles.viewTabCount}>{soldCount}</span>
                </button>
              </div>

              <div className={styles.listingSummary}>
                {filteredProperties.length ? (
                  <>
                    Zobrazeno {paginatedProperties.length} z {filteredProperties.length} polozek
                  </>
                ) : (
                  <>V tomhle filtru zatim nic neni</>
                )}
              </div>
            </div>

            {paginatedProperties.length ? (
              <div className={styles.propertyGrid}>
                {paginatedProperties.map((prop) => renderPropertyCard(prop, Boolean(prop.sold)))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                {listingView === 'sold' ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
                <div>
                  <div className={styles.emptyStateTitle}>
                    {listingView === 'sold'
                      ? 'Archiv je zatim prazdny'
                      : listingView === 'active'
                        ? 'Zatim zadne aktivni inzeraty'
                        : 'Zatim nejsou zadne nemovitosti'}
                  </div>
                  <div className={styles.emptyStateText}>
                    {listingView === 'sold'
                      ? 'Jakmile neco oznacis jako prodane, zustane to tady po ruce.'
                      : 'Nova nabidka se objevi hned po ulozeni formulare nahore.'}
                  </div>
                </div>
              </div>
            )}

            {totalPages > 1 ? (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={cx(styles.button, styles.buttonGhost, styles.paginationButton)}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safeCurrentPage === 1}
                >
                  Predchozi
                </button>

                <div className={styles.paginationPages}>
                  {pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={cx(
                        styles.paginationPage,
                        pageNumber === safeCurrentPage && styles.paginationPageActive
                      )}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className={cx(styles.button, styles.buttonGhost, styles.paginationButton)}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safeCurrentPage === totalPages}
                >
                  Dalsi
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={cx(styles.shell, isLoginScreen && styles.shellLogin)}>
      <style>{globalStyles}</style>
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />
      <div className={styles.orbThree} />

      <div className={cx(styles.frame, isLoginScreen && styles.frameLogin)}>{pageContent}</div>

      {editing && authed ? (
        <div className={styles.modalOverlay} onClick={() => !savingEdit && setEditing(null)}>
          <div className={cx(styles.surface, styles.modalCard)} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.brandTop}>
                  <span className={styles.eyebrow}>Editace nabidky</span>
                  <span className={styles.securityBadge}>
                    <Sparkles size={14} />
                    Live update
                  </span>
                </div>
                <h2 className={styles.modalTitle}>{editing.name}</h2>
                <div className={styles.modalMeta}>
                  {editing.location ? <span className={styles.helperBadge}>{editing.location}</span> : null}
                  <span className={styles.helperBadge}>
                    {(editing.images?.length || 0) + (editing.videos?.length || 0) + editFiles.length} media
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={cx(styles.button, styles.buttonGhost)}
                onClick={() => !savingEdit && setEditing(null)}
              >
                <X size={16} />
                Zavrit
              </button>
            </div>

            <form onSubmit={saveEdit}>
              <div className={styles.modalGrid}>
                <div className={styles.modalMain}>
                  <section className={styles.modalBlock}>
                    <div className={styles.modalBlockHeader}>
                      <div>
                        <h3 className={styles.modalBlockTitle}>Detaily nabidky</h3>
                        <p className={styles.modalBlockText}>Uprav text, cenu i tag. Zmeny se ulozi do aktualni jazykove mutace.</p>
                      </div>
                      <span className={styles.helperBadge}>{lang.toUpperCase()}</span>
                    </div>

                    <div className={styles.fieldRowTwo}>
                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Nazev</span>
                        <input
                          className={styles.input}
                          placeholder="Nazev"
                          value={editing.name ?? ''}
                          onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        />
                      </label>

                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Lokace</span>
                        <input
                          className={styles.input}
                          placeholder="Lokace"
                          value={editing.location ?? ''}
                          onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className={styles.fieldRowThree}>
                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Cena</span>
                        <input
                          className={styles.input}
                          placeholder="Cena"
                          value={editing.price ?? ''}
                          onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                        />
                      </label>

                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>m2</span>
                        <input
                          className={styles.input}
                          placeholder="m2"
                          value={editing.sqm ?? ''}
                          onChange={(e) => setEditing({ ...editing, sqm: e.target.value })}
                        />
                      </label>

                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Pokoje</span>
                        <input
                          className={styles.input}
                          placeholder="Pokoje"
                          value={editing.rooms ?? ''}
                          onChange={(e) => setEditing({ ...editing, rooms: e.target.value })}
                        />
                      </label>
                    </div>

                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Stitek</span>
                      <input
                        className={styles.input}
                        placeholder="Stitek"
                        value={editing.tag || ''}
                        onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                      />
                    </label>

                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Popis</span>
                      <textarea
                        className={styles.textarea}
                        placeholder="Popis / detail nemovitosti"
                        value={editing.description || ''}
                        onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      />
                    </label>

                    <label className={styles.uploadArea}>
                      <div className={styles.uploadIcon}>
                        <UploadCloud size={20} />
                      </div>
                      <div>
                        <div className={styles.uploadTitle}>Pridat dalsi media</div>
                        <div className={styles.uploadText}>
                          Nove obrazky i videa se ulozi ke stavajicim souborum. U fotek muzes rovnou zvolit novou titulku.
                        </div>
                      </div>
                      <span className={styles.uploadCta}>Pridat soubory</span>
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
                      <div className={styles.previewSection}>
                        <div className={styles.sectionHeading}>
                          <div className={styles.sectionTitleWrap}>
                            <span className={styles.helperBadge}>Nove soubory</span>
                            <p className={styles.sectionDescription}>
                              Vyber titulku jeste pred ulozenim. Pokud uz mas zvolenou stavajici fotku, muzes ji nahradit novou.
                            </p>
                          </div>
                          <span className={styles.helperBadge}>{editFiles.length} souboru</span>
                        </div>

                        <div className={styles.previewGrid}>
                          {editPreviews.map((src, idx) =>
                            renderPendingPreviewCard({
                              src,
                              file: editFiles[idx],
                              selected:
                                isImageFile(editFiles[idx]) &&
                                editing.image === getPendingCoverValue(editFiles[idx]),
                              onSelect: () =>
                                setEditing((prev) =>
                                  prev ? { ...prev, image: getPendingCoverValue(editFiles[idx]) } : prev
                                ),
                              onRemove: () => removePendingEditFile(idx),
                              alt: `Nove medium ${idx + 1}`,
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </section>
                </div>

                <div className={styles.modalSide}>
                  <section className={styles.modalBlock}>
                    <div className={styles.modalBlockHeader}>
                      <div>
                        <h3 className={styles.modalBlockTitle}>Aktualni fotky</h3>
                        <p className={styles.modalBlockText}>Kliknutim na tlacitko zvolis titulni obrazek. Krizek medium rovnou odstrani.</p>
                      </div>
                      <span className={styles.helperBadge}>{editing.images?.length || 0} fotek</span>
                    </div>

                    <div className={styles.savedMediaGrid}>
                      {(editing.images || []).map((src, idx) => (
                        <div
                          key={`${src}-${idx}`}
                          className={cx(
                            styles.savedMediaCard,
                            editing.image === src && styles.savedMediaSelected
                          )}
                        >
                          <img src={src} alt={`Foto ${idx + 1}`} className={styles.savedMediaImage} />
                          <button
                            type="button"
                            onClick={() => setEditing((prev) => (prev ? { ...prev, image: src } : prev))}
                            className={cx(
                              styles.coverButton,
                              editing.image === src && styles.coverButtonActive
                            )}
                          >
                            {editing.image === src ? 'Titulka' : 'Nastavit titulku'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(idx)}
                            className={styles.previewRemove}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}

                      {!(editing.images || []).length ? (
                        <div className={styles.emptyInset}>Zatim zadne ulozene fotky.</div>
                      ) : null}
                    </div>
                  </section>

                  <section className={styles.modalBlock}>
                    <div className={styles.modalBlockHeader}>
                      <div>
                        <h3 className={styles.modalBlockTitle}>Aktualni videa</h3>
                        <p className={styles.modalBlockText}>Videa zustanou v galerii. Muzes je kdykoliv smazat a nahrat znovu.</p>
                      </div>
                      <span className={styles.helperBadge}>{editing.videos?.length || 0} videi</span>
                    </div>

                    <div className={styles.savedMediaGrid}>
                      {(editing.videos || []).map((src, idx) => (
                        <div key={`${src}-${idx}`} className={styles.savedMediaCard}>
                          <video src={src} className={styles.savedMediaVideo} controls muted playsInline />
                          <span className={styles.previewBadge}>Video</span>
                          <button
                            type="button"
                            onClick={() => removeExistingVideo(idx)}
                            className={styles.previewRemove}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}

                      {!(editing.videos || []).length ? (
                        <div className={styles.emptyInset}>Zatim zadna ulozena videa.</div>
                      ) : null}
                    </div>
                  </section>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={cx(styles.button, styles.buttonGhost)}
                  onClick={() => setEditing(null)}
                  disabled={savingEdit}
                >
                  Zavrit bez ulozeni
                </button>
                <button
                  type="submit"
                  className={cx(styles.button, styles.buttonPrimary)}
                  disabled={savingEdit}
                >
                  {savingEdit ? <Loader2 size={18} className={styles.spin} /> : <CheckCircle2 size={18} />}
                  {savingEdit ? 'Ukladam...' : 'Ulozit zmeny'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminPage;
