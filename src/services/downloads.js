import { supabase } from './supabaseClient.js';

const counts = new Map();
const pending = new Map();
const listeners = new Set();
export function downloadKey(url) {
  const parsed = new URL(url, window.location.origin);
  return parsed.origin === window.location.origin ? parsed.pathname : `${parsed.origin}${parsed.pathname}`;
}
export function subscribeDownloads(listener) { listeners.add(listener); return () => listeners.delete(listener); }
export function cachedDownloadCount(key) { return counts.get(key) ?? null; }
function publish(key, count) { counts.set(key, count); listeners.forEach(fn => fn()); }
export async function loadDownloadCount(key) {
  if (!supabase) return;
  if (pending.has(key)) return pending.get(key);
  const request = (async () => {
    try {
      const { data, error } = await supabase.from('download_counts').select('count').eq('file_key', key).maybeSingle();
      publish(key, !error && data ? Number(data.count) : null);
    } catch { publish(key, null); }
    finally { pending.delete(key); }
  })();
  pending.set(key, request);
  return request;
}
export async function recordDownload(key, eventId) {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.rpc('record_download', { p_file_key: key, p_event_id: eventId });
    if (error) { publish(key, null); return; }
    publish(key, Math.max(counts.get(key) || 0, Number(data)));
  } catch { publish(key, null); }
}
