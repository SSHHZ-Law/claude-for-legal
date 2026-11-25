// THE ONE DATA MODULE.
// Every read and write in the app goes through the `data` object below. Nothing else
// touches localStorage or IndexedDB (the only exception is one line in index.html that
// reads the saved theme before first paint).
//
// Today: entries and verdicts live in localStorage, uploaded photos in IndexedDB.
// Later: swap the bodies of these functions for fetch() calls to a Google Apps Script
// web endpoint backed by a Sheet. Every function is already async and returns plain
// JSON-shaped objects, so the screens will not need to change. `me` and `theme` are
// device settings and should stay local even then.
//
// Shapes
//   person  { id, name, color, about }
//   entry   { id, kind: recipe|sauce|method|find|place, title, by, at, note, photos: [{ src, by, credit }],
//             ...fields for its kind, trashedAt, trashedBy }
//   verdict { id, entryId, by, rating: 1-5, note, at }   one per person per entry

import { seed } from './seed.js';

const KEY = 'tsr.data.v1', ME = 'tsr.me', THEME = 'tsr.theme';
let db = null;
const urls = new Map();            // 'local:<id>' -> object URL for an uploaded photo
const copy = x => JSON.parse(JSON.stringify(x));
const uid = p => p + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const nowIso = () => new Date().toISOString();
const newest = (a, b) => (a.at < b.at ? 1 : -1);

function read() {
  if (db) return db;
  try { db = JSON.parse(localStorage.getItem(KEY)); } catch { db = null; }
  if (!db || !db.entries) { db = seed(Date.now()); write(); }
  return db;
}
function write() { localStorage.setItem(KEY, JSON.stringify(db)); }

// ---- uploaded photos (IndexedDB) ----
const req = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
function photoStore(mode) {
  return new Promise((res, rej) => {
    const open = indexedDB.open('tsr-photos', 1);
    open.onupgradeneeded = () => open.result.createObjectStore('photos');
    open.onsuccess = () => res(open.result.transaction('photos', mode).objectStore('photos'));
    open.onerror = () => rej(open.error);
  });
}
async function loadPhotos() {
  const s = await photoStore('readonly');
  const [keys, blobs] = await Promise.all([req(s.getAllKeys()), req(s.getAll())]);
  keys.forEach((k, i) => urls.set('local:' + k, URL.createObjectURL(blobs[i])));
}
// Phone photos are huge. Scale to 1400px on the long side and re-encode as JPEG.
async function shrink(file, max = 1400) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise(res => c.toBlob(res, 'image/jpeg', 0.82));
}

export const data = {
  async init() { read(); try { await loadPhotos(); } catch { /* photos unavailable; entries still work */ } },

  // ---- this device ----
  async me() { const id = localStorage.getItem(ME); return read().people.find(p => p.id === id) || null; },
  async setMe(id) { localStorage.setItem(ME, id); },
  async theme() { return localStorage.getItem(THEME) || 'auto'; },
  async setTheme(t) { t === 'auto' ? localStorage.removeItem(THEME) : localStorage.setItem(THEME, t); },

  // ---- people ----
  async people() { return copy(read().people); },

  // ---- entries ----
  async entries({ kind, by } = {}) {
    return copy(read().entries.filter(e => !e.trashedAt && (!kind || e.kind === kind) && (!by || e.by === by)).sort(newest));
  },
  async entry(id) { const e = read().entries.find(e => e.id === id); return e ? copy(e) : null; },
  async saveEntry(entry) {
    const d = read();
    const i = d.entries.findIndex(e => e.id === entry.id);
    if (i >= 0) d.entries[i] = { ...d.entries[i], ...entry };
    else d.entries.push(entry = { photos: [], ...entry, id: uid(entry.kind[0]), at: nowIso() });
    write();
    return copy(i >= 0 ? d.entries[i] : entry);
  },
  async trashEntry(id, byId) {
    const e = read().entries.find(e => e.id === id);
    if (!e || e.by !== byId) return false;          // only the person who added it can trash it
    e.trashedAt = nowIso(); e.trashedBy = byId; write(); return true;
  },
  async restoreEntry(id) {                           // anyone can restore
    const e = read().entries.find(e => e.id === id);
    if (!e) return false;
    delete e.trashedAt; delete e.trashedBy; write(); return true;
  },
  async trashed() {
    return copy(read().entries.filter(e => e.trashedAt).sort((a, b) => (a.trashedAt < b.trashedAt ? 1 : -1)));
  },
  async search(q) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const names = Object.fromEntries(read().people.map(p => [p.id, p.name]));
    return copy(read().entries.filter(e => {
      if (e.trashedAt) return false;
      const hay = [e.title, e.aka, e.note, e.city, e.area, e.order, e.maker, e.goodOn, e.cut, e.wood, e.type, names[e.by], ...(e.ingredients || [])].join(' ').toLowerCase();
      return words.every(w => hay.includes(w));
    }).sort(newest));
  },

  // ---- verdicts ("I made this / tried this / went here") ----
  async verdicts({ entryId, by, limit } = {}) {
    const d = read();
    const live = new Set(d.entries.filter(e => !e.trashedAt).map(e => e.id));
    let list = d.marks.filter(m => (!entryId || m.entryId === entryId) && (!by || m.by === by) && (entryId || live.has(m.entryId))).sort(newest);
    if (limit) list = list.slice(0, limit);
    return copy(list);
  },
  async saveVerdict({ entryId, by, rating, note }) {
    const d = read();
    let m = d.marks.find(m => m.entryId === entryId && m.by === by);
    if (m) Object.assign(m, { rating, note, at: nowIso() });
    else d.marks.push(m = { id: uid('k'), entryId, by, rating, note, at: nowIso() });
    write();
    return copy(m);
  },

  // ---- photos ----
  // Store an uploaded image and return a photo record for an entry's `photos` list.
  async addPhoto(file, byId) {
    const blob = await shrink(file);
    const id = uid('ph');
    const s = await photoStore('readwrite');
    await req(s.put(blob, id));
    urls.set('local:' + id, URL.createObjectURL(blob));
    return { src: 'local:' + id, by: byId };
  },
  async addPhotoToEntry(entryId, photo) {
    const e = read().entries.find(e => e.id === entryId);
    if (!e) return null;
    (e.photos ||= []).push(photo); write(); return copy(e);
  },
  // Sync on purpose: turns a stored `src` into something an <img> can load.
  photoUrl(src) { return src.startsWith('local:') ? (urls.get(src) || '') : src; },

  // ---- housekeeping ----
  async resetSample() { db = seed(Date.now()); write(); },
};
