import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight, PenLine, Search, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useI18n } from '../hooks/useI18n.js';
import { listPosts } from '../services/blog.js';

export default function BlogPage() {
  const { role } = useAuth();
  const { locale } = useI18n();
  const zh = locale === 'zh';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    listPosts().then(data => { if (active) setPosts(data); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  const filtered = posts.filter(p => `${p.title} ${p.excerpt}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
    <Helmet><title>Blog | 天问 TianWen</title><meta name="description" content={zh ? '记录工程实践、开发思考与持续探索。' : 'Engineering notes, ideas and discoveries.'} /></Helmet>
    <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
      <div><p className="eyebrow">THE JOURNAL / 05</p><h1 className="mt-5 text-5xl font-bold tracking-tight md:text-7xl">{zh ? '思考，持续发生。' : 'Ideas in progress.'}</h1><p className="mt-6 text-slate-500 dark:text-slate-400">{zh ? '写下构建的过程，也留下探索的轨迹。' : 'Notes from the process. Discoveries along the way.'}</p></div>
      {role === 'Developer' && <Link className="studio-button" to="/works/blog/new"><PenLine size={17} />{zh ? '发布文章' : 'Write a post'}</Link>}
    </div>
    <label className="mb-8 flex max-w-md items-center gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><Search size={18} className="text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} aria-label={zh ? '搜索文章' : 'Search posts'} placeholder={zh ? '搜索文章与灵感…' : 'Search notes and ideas…'} className="w-full bg-transparent outline-none" /></label>
    {loading ? <p role="status">{zh ? '正在加载文章…' : 'Loading posts…'}</p> : error ? <div role="alert" className="studio-panel p-8"><p>{zh ? '文章暂时无法加载，请稍后重试。' : 'Unable to load posts. Please retry.'}</p>{role === 'Developer' && <p className="mt-3 text-sm text-slate-500">{error}</p>}<button className="mt-4 underline" onClick={() => setAttempt(n => n + 1)}>{zh ? '重试' : 'Retry'}</button></div> : filtered.length ? <div className="grid gap-6 md:grid-cols-2">{filtered.map((post, i) => <Link key={post.id} to={`/works/blog/${post.id}`} className="studio-panel group flex min-h-64 flex-col p-8 transition duration-300 hover:-translate-y-1 hover:border-teal-500/50"><div className="flex items-center justify-between text-xs text-slate-500"><span className="font-mono">{String(i + 1).padStart(2, '0')} / JOURNAL</span><time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString(zh ? 'zh-CN' : 'en-US')}</time></div><h2 className="mt-7 break-words text-2xl font-semibold group-hover:text-teal-600 dark:group-hover:text-teal-400">{post.title}</h2><p className="mt-4 line-clamp-3 break-words leading-7 text-slate-500 dark:text-slate-400">{post.excerpt}</p><ArrowUpRight className="ml-auto mt-auto pt-3" size={32} /></Link>)}</div> : <div className="studio-panel py-20 text-center"><BookOpen className="mx-auto mb-5 text-teal-500" size={32} /><h2 className="text-xl font-semibold">{query ? (zh ? '没有匹配的文章' : 'No matching posts') : (zh ? '下一篇故事，从这里开始。' : 'The next story starts here.')}</h2><p className="mt-3 text-slate-500">{zh ? '工程实践、灵感和思考，都值得记录。' : 'A place for practice, inspiration and reflection.'}</p></div>}
  </div>;
}
