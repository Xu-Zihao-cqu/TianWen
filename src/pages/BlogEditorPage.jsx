import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Eye, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useI18n } from '../hooks/useI18n.js';
import { getPost, publishPost } from '../services/blog.js';
import MarkdownRenderer from '../components/features/MarkdownRenderer.jsx';

export default function BlogEditorPage() {
  const { user, role } = useAuth();
  const { postId } = useParams();
  const { locale } = useI18n();
  const zh = locale === 'zh';
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: '', excerpt: '', content: '' });
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [editable, setEditable] = useState(!postId);
  useEffect(() => {
    if (!postId || role !== 'Developer') return;
    let active = true;
    setLoading(true); setEditable(false);
    getPost(postId).then(data => {
      if (!active) return;
      if (!data || data.author_id !== user?.id) throw new Error(zh ? '文章不存在或没有编辑权限。' : 'Post not found or access denied.');
      setPost({ title: data.title, excerpt: data.excerpt, content: data.content }); setEditable(true);
    }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [postId, role, user?.id, zh]);
  useEffect(() => {
    if (!dirty) return;
    const warn = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const change = e => { setPost(p => ({ ...p, [e.target.name]: e.target.value })); setDirty(true); };
  const submit = async e => {
    e.preventDefault();
    if (saving || role !== 'Developer' || !editable) return;
    setSaving(true); setError('');
    try { const id = await publishPost(post, user.id, postId); setDirty(false); navigate(`/works/blog/${id}`, { replace: true }); }
    catch (err) { setError(`${zh ? '发布失败，正文已保留：' : 'Publishing failed; your text is preserved: '}${err.message}`); }
    finally { setSaving(false); }
  };
  if (role !== 'Developer') return <div className="mx-auto max-w-3xl px-5 py-24"><h1 className="text-3xl font-bold">{zh ? '仅 Developer 可以发布文章' : 'Developer access required'}</h1><Link to="/works/blog" className="mt-6 inline-block underline">{zh ? '返回博客' : 'Back to Blog'}</Link></div>;
  return <div className="mx-auto max-w-5xl px-5 py-14">
    <Helmet><title>{zh ? '撰写文章' : 'Write a post'} | 天问 Blog</title></Helmet>
    <Link to="/works/blog" className="inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={16} />Blog</Link>
    <p className="eyebrow mt-10">DEVELOPER / EDITOR</p><h1 className="mt-4 text-4xl font-bold">{postId ? (zh ? '继续打磨你的想法。' : 'Refine your ideas.') : (zh ? '把想法，写下来。' : 'Give your ideas a voice.')}</h1>
    <p className="mt-4 text-slate-500">{zh ? '支持 Markdown。发布后，所有访客都可以阅读。' : 'Markdown supported. Published posts are visible to all visitors.'}</p>
    {error && <p role="alert" className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</p>}
    {loading ? <p role="status" className="mt-8">{zh ? '加载中…' : 'Loading…'}</p> : <form onSubmit={submit} className="mt-8 space-y-6">
      <fieldset disabled={saving || !editable} className="space-y-6 disabled:opacity-60">
        <label className="block text-sm font-medium">{zh ? '标题' : 'Title'}<input name="title" required maxLength={180} value={post.title} onChange={change} className="studio-input mt-2 text-xl" placeholder={zh ? '一个值得展开的想法' : 'An idea worth exploring'} /></label>
        <label className="block text-sm font-medium">{zh ? '摘要（可选）' : 'Excerpt (optional)'}<textarea name="excerpt" maxLength={500} rows={2} value={post.excerpt} onChange={change} className="studio-input mt-2" /></label>
        <div className="flex items-center justify-between"><label htmlFor="blog-content" className="text-sm font-medium">{zh ? '正文 · Markdown' : 'Content · Markdown'}</label><button type="button" aria-pressed={preview} onClick={() => setPreview(p => !p)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"><Eye size={16} />{preview ? (zh ? '继续编辑' : 'Edit') : (zh ? '预览排版' : 'Preview')}</button></div>
        {preview ? <div className="studio-panel min-h-80 break-words p-6"><MarkdownRenderer content={post.content || (zh ? '还没有正文。' : 'No content yet.')} /></div> : <textarea id="blog-content" name="content" required maxLength={100000} rows={18} value={post.content} onChange={change} className="studio-input font-mono leading-7" placeholder={'## ' + (zh ? '从这里开始' : 'Start here')} />}
        <div className="flex flex-wrap items-center justify-between gap-4"><span className="text-xs text-slate-500">{post.content.length.toLocaleString()} / 100,000 · {zh ? '离开前请发布，未发布内容仅保留在当前页面' : 'Publish before leaving; unsaved text stays on this page only'}</span><button type="submit" className="studio-button" disabled={saving || !post.title.trim() || !post.content.trim()}><Send size={16} />{saving ? (zh ? '发布中…' : 'Publishing…') : (zh ? '发布文章' : 'Publish post')}</button></div>
      </fieldset>
    </form>}
  </div>;
}
