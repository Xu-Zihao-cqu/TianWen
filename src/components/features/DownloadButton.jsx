import { useEffect, useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import { fetchDownload, MissingDownloadError, saveDownload } from '../../utils/download.js';

import { downloadKey, subscribeDownloads, cachedDownloadCount, loadDownloadCount, recordDownload } from '../../services/downloads.js';

export default function DownloadButton({ file, className = '', children }) {
  const { locale } = useI18n();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const zh = locale === 'zh';
  const key = downloadKey(file.url);
  const [count, setCount] = useState(() => cachedDownloadCount(key));
  useEffect(() => {
    setCount(cachedDownloadCount(key));
    const unsubscribe = subscribeDownloads(() => setCount(cachedDownloadCount(key)));
    loadDownloadCount(key);
    const refresh = () => loadDownloadCount(key);
    window.addEventListener('focus', refresh);
    return () => { unsubscribe(); window.removeEventListener('focus', refresh); };
  }, [key]);
  async function download() {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError('');
    try {
      const blob = await fetchDownload(file.url);
      // Preserve the actual extension even when a display name has none.
      const actualName = decodeURIComponent(new URL(file.url, window.location.origin).pathname.split('/').pop());
      saveDownload(blob, /\.[a-z0-9]{1,8}$/i.test(file.name) ? file.name : actualName);
      await recordDownload(key, crypto.randomUUID());
    } catch (e) {
      if (e instanceof MissingDownloadError) window.location.assign('/download-missing.html');
      else setError(zh ? '下载失败，请重试。' : 'Download failed. Please retry.');
    } finally { inFlight.current = false; setBusy(false); }
  }
  return <span className="inline-flex flex-col items-start gap-1"><button type="button" disabled={busy} onClick={download} className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${className}`} aria-label={`${zh ? '下载' : 'Download'} ${file.name}`}>
    {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}{busy ? (zh ? '下载中…' : 'Downloading…') : children || (zh ? '下载' : 'Download')}
  </button><span className="px-1 text-[10px] text-slate-500" aria-live="polite">{count === null ? (zh ? '统计暂不可用' : 'Count unavailable') : `${count.toLocaleString(locale)} ${zh ? '次下载' : 'downloads'}`}</span>{error && <span role="alert" className="max-w-40 text-xs text-red-500">{error}</span>}</span>;
}
