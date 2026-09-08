import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Eye, Send, UploadCloud, Code2, ImagePlus, X, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useI18n } from '../hooks/useI18n.js';
import { getPost, publishPost } from '../services/blog.js';
import { uploadBlogAsset } from '../services/blogStorage.js';
import { BLOG_ACCEPT, MAX_ATTACHMENTS, assetMarkdown, formatBytes, validateUpload, validateAssets } from '../utils/blogAssets.js';
import BlogBody from '../components/features/BlogBody.jsx';
import BlogAttachments from '../components/features/BlogAttachments.jsx';

const blank = () => ({ title: '', excerpt: '', content: '', cover_image: '', attachments: [] });
export default function BlogEditorPage() {
  const { user, role } = useAuth();
  const { postId } = useParams();
  const { locale } = useI18n();
  const zh = locale === 'zh';
  const navigate = useNavigate();
  const [post, setPost] = useState(blank);
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [editable, setEditable] = useState(!postId);
  const [draft, setDraft] = useState(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const input = useRef(null);
  const editor = useRef(null);
  const uploadLock = useRef(false);
  const key = `tianwen-blog-draft:${user?.id}:${postId || 'new'}`;
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem(key) || 'null'); setDraft(saved); } catch { setDraft(null); }
  }, [key]);
  useEffect(() => {
    if (!dirty || !editable || role !== 'Developer') return;
    try { localStorage.setItem(key, JSON.stringify(post)); setDraftSaved(true); } catch { setDraftSaved(false); }
  }, [post, dirty, key, editable, role]);
  useEffect(() => {
    if (!postId || role !== 'Developer') return;
    let active = true;
    setLoading(true); setEditable(false);
    getPost(postId).then(data => {
      if (!active) return;
      if (!data || data.author_id !== user?.id) throw new Error(zh ? '文章不存在或没有编辑权限。' : 'Post not found or access denied.');
      setPost({ ...blank(), ...data }); setEditable(true);
    }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [postId, role, user?.id]);
  useEffect(() => {
    if ((!dirty || draftSaved) && !uploading) return;
    const warn = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, draftSaved, uploading]);
  const update = patch => { setPost(p => ({ ...p, ...patch })); setDirty(true); setDraftSaved(false); };
  const insert = text => {
    const start = editor.current?.selectionStart ?? post.content.length;
    const end = editor.current?.selectionEnd ?? start;
    update({ content: post.content.slice(0, start) + '\n\n' + text + '\n\n' + post.content.slice(end) });
  };
  const upload = async files => {
    if (uploadLock.current || saving || !editable || role !== 'Developer') return;
    const selected = Array.from(files || []);
    if (!selected.length) return;
    if (post.attachments.length + selected.length > MAX_ATTACHMENTS) { setError(zh ? '每篇最多 20 个附件。' : 'Maximum 20 attachments per post.'); return; }
    uploadLock.current = true; setError('');
    const failures = [];
    for (const [index, file] of selected.entries()) {
      setUploading(`${index + 1}/${selected.length} · ${file.name}`);
      try {
        validateUpload(file);
        const asset = await uploadBlogAsset(file, user.id);
        setPost(p => ({ ...p, attachments: [...p.attachments, asset], content: asset.kind === 'image' ? p.content + '\n\n' + assetMarkdown(asset) + '\n' : p.content }));
        setDirty(true); setDraftSaved(false);
      } catch (e) { failures.push(`${file.name}: ${e.message}`); }
    }
    setError(failures.join('\n')); setUploading(''); uploadLock.current = false;
    if (input.current) input.current.value = '';
  };
  const restore = () => {
    try {
      if (!draft || typeof draft.title !== 'string' || typeof draft.content !== 'string') throw new Error('Invalid draft');
      update({ ...blank(), ...draft, attachments: validateAssets(draft.attachments) }); setDraft(null);
    } catch { setError(zh ? '草稿无法恢复。' : 'Unable to restore draft.'); }
  };
  const submit = async e => {
    e.preventDefault();
    if (saving || uploadLock.current || role !== 'Developer' || !editable) return;
    setSaving(true); setError('');
    try {
      const id = await publishPost(post, user.id, postId);
      setDirty(false);
      try { localStorage.removeItem(key); } catch { /* Publishing succeeded even when storage is unavailable. */ }
      navigate(`/works/blog/${id}`, { replace: true });
    } catch (err) { setError(`${zh ? '发布失败，内容已保留：' : 'Publish failed; content preserved: '}${err.message}`); }
    finally { setSaving(false); }
  };
  if (role !== 'Developer') return <div className="mx-auto max-w-3xl px-5 py-24"><h1 className="text-3xl font-bold">{zh ? '仅 Developer 可以发布文章' : 'Developer access required'}</h1><Link to="/works/blog" className="mt-6 inline-block underline">Blog</Link></div>;
  return <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
    <Helmet><title>{zh ? '创作工作室' : 'Writing studio'} | 天问 Blog</title></Helmet>
    <Link to="/works/blog" className="inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={16} />Journal</Link>
    <div className="my-10 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">THE WRITING STUDIO</p><h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{zh ? '让每一种表达，都有空间。' : 'Room for every idea.'}</h1><p className="mt-4 text-slate-500">{zh ? '文字、图像、代码与文档。在这里，汇成你的下一篇故事。' : 'Words, images, code and documents. Your next story starts here.'}</p></div><span role="status" className="rounded-full bg-teal-500/10 px-4 py-2 text-xs text-teal-700 dark:text-teal-300">{dirty ? (draftSaved ? (zh ? '草稿已保存到本机' : 'Draft saved locally') : (zh ? '草稿尚未保存' : 'Draft not yet saved')) : 'DEVELOPER'}</span></div>
    {draft && editable && <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-teal-500/30 bg-teal-500/5 p-4"><FileText size={18} /><span className="flex-1 text-sm">{zh ? '发现本机未发布的草稿。' : 'An unpublished local draft is available.'}</span><button onClick={restore} className="text-sm font-semibold text-teal-700 dark:text-teal-300">{zh ? '恢复草稿' : 'Restore draft'}</button><button onClick={() => setDraft(null)} aria-label="Dismiss draft notice"><X size={16} /></button></div>}
    {error && <p role="alert" className="mb-6 whitespace-pre-wrap break-words rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {loading ? <p role="status">Loading…</p> : <form onSubmit={submit}>
      <fieldset disabled={saving || !editable || Boolean(uploading)} className="min-w-0 space-y-6 disabled:opacity-70">
        <div className="studio-panel p-6 md:p-8"><label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">{zh ? '文章标题' : 'Title'}<input name="title" required maxLength={180} value={post.title} onChange={e => update({ title: e.target.value })} className="mt-4 w-full bg-transparent text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] outline-none md:text-4xl" placeholder={zh ? '从一个好问题开始…' : 'Start with a good question…'} /></label><label className="mt-7 block text-xs font-semibold text-slate-500">{zh ? '摘要' : 'Excerpt'}<textarea maxLength={500} rows={2} value={post.excerpt} onChange={e => update({ excerpt: e.target.value })} className="mt-2 w-full resize-y bg-transparent text-base font-normal leading-7 outline-none" placeholder={zh ? '用几句话，邀请读者进入你的世界。' : 'A short invitation into your world.'} /></label></div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="studio-panel min-w-0 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-white/10"><div className="flex gap-2"><button type="button" onClick={() => insert('## ' + (zh ? '新的章节' : 'New section'))} className="blog-tool">H2</button><button type="button" onClick={() => insert('```javascript\n// Your code here\n```')} className="blog-tool" aria-label="Insert code"><Code2 size={17} /></button><button type="button" onClick={() => input.current?.click()} className="blog-tool" aria-label="Upload files"><ImagePlus size={17} /></button></div><button type="button" aria-pressed={preview} onClick={() => setPreview(p => !p)} className="blog-tool"><Eye size={16} />{preview ? (zh ? '继续编辑' : 'Edit') : (zh ? '预览' : 'Preview')}</button></div>
            {preview ? <div className="min-h-[500px] p-6 md:p-8"><BlogBody content={post.content || (zh ? '还没有正文。' : 'No content yet.')} /><BlogAttachments files={post.attachments} /></div> : <textarea ref={editor} id="blog-content" aria-label={zh ? '正文 Markdown' : 'Markdown content'} required maxLength={100000} rows={22} value={post.content} onChange={e => update({ content: e.target.value })} onPaste={e => { const files = Array.from(e.clipboardData.files); if (files.length) { e.preventDefault(); upload(files); } }} className="block min-h-[500px] w-full resize-y bg-transparent p-6 font-mono text-sm leading-8 outline-none md:p-8" placeholder={zh ? '写下你的故事…\n\n支持 Markdown、粘贴图片和代码块。' : 'Write your story…\n\nMarkdown, pasted images and code blocks supported.'} />}
          </div>
          <aside className="space-y-5"><div className="studio-panel p-5"><p className="eyebrow mb-4">MEDIA LIBRARY</p><input ref={input} type="file" multiple accept={BLOG_ACCEPT} className="hidden" onChange={e => upload(e.target.files)} /><button type="button" onClick={() => input.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); upload(e.dataTransfer.files); }} className="flex w-full flex-col items-center rounded-2xl border border-dashed border-teal-500/40 bg-teal-500/5 px-3 py-7 transition hover:bg-teal-500/10"><UploadCloud size={27} className="mb-3 text-teal-600 dark:text-teal-300" /><span className="text-sm font-semibold">{zh ? '拖放或点击上传' : 'Drop files or browse'}</span><span className="mt-2 text-center text-xs leading-5 text-slate-500">{zh ? '图片 8 MB · 代码 1 MB\nPDF / DOC / DOCX 20 MB' : 'Images 8 MB · Code 1 MB\nPDF / DOC / DOCX 20 MB'}</span></button><p className="mt-3 text-xs leading-5 text-slate-500">{zh ? '附件上传后通过公开链接访问，请仅上传可公开的材料。图片自动插入正文。' : 'Uploaded files have public URLs. Upload only public materials. Images are inserted automatically.'}</p>
            <div className="mt-4 space-y-3">{post.attachments.map(file => <div key={file.path} className="rounded-xl border border-slate-200 p-3 dark:border-white/10"><div className="flex items-start justify-between gap-2"><span className="min-w-0 truncate text-xs font-semibold" title={file.name}>{file.name}</span><button type="button" aria-label={`${zh ? '移除' : 'Remove'} ${file.name}`} onClick={() => update({ attachments: post.attachments.filter(a => a.path !== file.path), cover_image: post.cover_image === file.url ? '' : post.cover_image, content: post.content.split(assetMarkdown(file)).join('') })}><X size={13} /></button></div><span className="text-[10px] text-slate-500">{formatBytes(file.size)}</span><div className="mt-2 flex flex-wrap gap-3 text-xs text-teal-700 dark:text-teal-300"><button type="button" onClick={() => insert(assetMarkdown(file))}>{zh ? '插入正文' : 'Insert link'}</button>{file.kind === 'image' && <button type="button" onClick={() => update({ cover_image: file.url })}>{zh ? '设为封面' : 'Set cover'}</button>}</div></div>)}</div></div>
            {post.cover_image && <div className="studio-panel overflow-hidden"><img src={post.cover_image} alt={zh ? '文章封面' : 'Post cover'} className="aspect-video w-full object-cover" /><button type="button" className="p-3 text-xs text-slate-500" onClick={() => update({ cover_image: '' })}>{zh ? '移除封面' : 'Remove cover'}</button></div>}
          </aside>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 backdrop-blur dark:border-white/10 dark:bg-slate-900/80"><span className="text-xs text-slate-500">{post.content.length.toLocaleString()} / 100,000 · {post.attachments.length} {zh ? '个附件' : 'attachments'}</span><button type="submit" className="studio-button" disabled={saving || !post.title.trim() || !post.content.trim()}><Send size={16} />{saving ? (zh ? '发布中…' : 'Publishing…') : (zh ? '发布文章' : 'Publish story')}</button></div>
      </fieldset>
      {uploading && <p role="status" className="mt-4 rounded-2xl bg-teal-500/10 p-4 text-sm text-teal-700 dark:text-teal-300">{zh ? '正在上传' : 'Uploading'} {uploading}</p>}
    </form>}
  </div>;
}
