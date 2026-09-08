import { useEffect, useState } from 'react';
import mammoth from 'mammoth/mammoth.browser';
import DOMPurify from 'dompurify';
import { useI18n } from '../../hooks/useI18n.js';

export default function WordPreview({ url }) {
  const { locale } = useI18n();
  const [html, setHtml] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setHtml(null); setError(false);
    (async () => {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error('Document unavailable');
      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength > 20 * 1024 * 1024) throw new Error('Document too large');
      const result = await mammoth.convertToHtml({ arrayBuffer }, { externalFileAccess: false });
      const clean = DOMPurify.sanitize(result.value, { USE_PROFILES: { html: true }, FORBID_TAGS: ['style', 'form', 'input', 'iframe', 'video', 'audio'], FORBID_ATTR: ['style', 'srcset'] });
      if (active) setHtml(clean);
    })().catch(e => { if (active && e.name !== 'AbortError') setError(true); });
    return () => { active = false; controller.abort(); };
  }, [url]);
  if (error) return <p role="alert" className="p-6 text-sm text-slate-500">{locale === 'zh' ? '文档无法解析，可能已加密或损坏。请下载原文件查看。' : 'Cannot parse this document. It may be encrypted or damaged. Please download the original.'}</p>;
  if (html === null) return <p role="status" className="p-6">{locale === 'zh' ? '正在解析 Word 文档…' : 'Reading Word document…'}</p>;
  return <div><p className="mb-3 text-xs text-slate-500">{locale === 'zh' ? '内容预览 · 原始分页和复杂排版以下载文件为准' : 'Content preview · Download for original pagination and complex layouts'}</p><div className="word-preview max-h-[700px] overflow-auto rounded-xl bg-white p-6 text-slate-800 md:p-10" dangerouslySetInnerHTML={{ __html: html }} /></div>;
}
