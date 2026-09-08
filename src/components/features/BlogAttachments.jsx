import { lazy, Suspense, useEffect, useState } from 'react';
import { Download, FileCode2, FileText, Image, ChevronDown, ExternalLink } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import { codeLanguages, formatBytes, safeAssetUrl } from '../../utils/blogAssets.js';
import CodeBlock from './CodeBlock.jsx';

const PDFViewer = lazy(() => import('./PDFViewer.jsx'));
const WordPreview = lazy(() => import('./WordPreview.jsx'));

function SourcePreview({ file }) {
  const [code, setCode] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setCode(null); setError(false);
    fetch(file.url, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('File unavailable');
      const blob = await response.blob();
      if (blob.size > 1024 * 1024) throw new Error('File too large');
      return blob.text();
    }).then(setCode).catch(e => { if (e.name !== 'AbortError') setError(true); });
    return () => controller.abort();
  }, [file.url]);
  if (error) return <p role="alert" className="p-5">无法预览 / Preview unavailable</p>;
  if (code === null) return <p role="status" className="p-5">Loading…</p>;
  return <CodeBlock code={code} language={codeLanguages[file.name.split('.').pop().toLowerCase()] || 'text'} />;
}

function Attachment({ file }) {
  const [open, setOpen] = useState(false);
  const [office, setOffice] = useState(false);
  const { locale } = useI18n();
  const zh = locale === 'zh';
  const url = safeAssetUrl(file.url);
  if (!url) return null;
  const Icon = file.kind === 'image' ? Image : file.kind === 'code' ? FileCode2 : FileText;
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
    <div className="flex items-center gap-3 p-4"><span className="rounded-xl bg-teal-500/10 p-3 text-teal-600 dark:text-teal-300"><Icon size={20} /></span><button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-semibold">{file.name}</span><span className="mt-1 block text-xs text-slate-500">{file.kind.toUpperCase()} · {formatBytes(file.size)} · {zh ? '点击预览' : 'Preview'}</span></button><a href={url} download={file.name} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10" aria-label={`${zh ? '下载' : 'Download'} ${file.name}`}><Download size={18} /></a><button type="button" aria-label={zh ? '展开附件' : 'Toggle preview'} aria-expanded={open} onClick={() => setOpen(v => !v)}><ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} /></button></div>
    {open && <div className="border-t border-slate-200 p-3 dark:border-white/10"><Suspense fallback={<p role="status" className="p-6">Loading preview…</p>}>
      {file.kind === 'image' && <a href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt={file.name} className="mx-auto max-h-[650px] rounded-xl object-contain" loading="lazy" /></a>}
      {file.kind === 'pdf' && <PDFViewer key={url} url={url} />}
      {file.kind === 'docx' && <WordPreview url={url} />}
      {file.kind === 'code' && <SourcePreview file={{ ...file, url }} />}
      {file.kind === 'doc' && <div className="p-4"><p className="mb-4 text-sm leading-7 text-slate-500">{zh ? '旧版 DOC 使用 Microsoft 在线预览，点击后会将该公开附件地址交给 Microsoft；需要网络连接。也可下载原文件，或另存为 DOCX 后获得站内预览。' : 'Legacy DOC preview uses Microsoft. Opening it shares this public file URL with Microsoft and requires network access. You can also download the original, or upload DOCX for local preview.'}</p><button type="button" className="studio-button" onClick={() => setOffice(true)}><ExternalLink size={16} />{zh ? 'Microsoft 在线预览' : 'Preview with Microsoft'}</button>{office && <><iframe title={file.name} src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`} className="mt-5 h-[600px] w-full rounded-xl border-0" referrerPolicy="no-referrer" /><p className="mt-3 text-xs text-slate-500">{zh ? '若在线服务无法加载，请使用下载按钮。' : 'If the online service is unavailable, use Download.'}</p></>}</div>}
    </Suspense></div>}
  </div>;
}

export default function BlogAttachments({ files = [] }) {
  const { locale } = useI18n();
  if (!files.length) return null;
  return <section className="mt-14" aria-label={locale === 'zh' ? '文章附件' : 'Attachments'}><p className="eyebrow mb-5">ATTACHMENTS / {String(files.length).padStart(2, '0')}</p><div className="space-y-3">{files.map(file => <Attachment key={file.path || file.url} file={file} />)}</div></section>;
}
