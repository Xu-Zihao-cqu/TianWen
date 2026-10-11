import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight, PenLine, Search, BookOpen, Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useI18n } from '../hooks/useI18n.js';
import { listPosts } from '../services/blog.js';
import { safeAssetUrl } from '../utils/blogAssets.js';
import { profile } from '../data/profile.js';

export default function BlogPage() {
  const { role } = useAuth();
  const { locale } = useI18n();
  const zh = locale === 'zh';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    listPosts().then(data => { if (active) setPosts(data); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  const getYear = p => String(new Date(p.published_at).getFullYear());
  const years = [...new Set(posts.map(getYear))].sort().reverse();
  const filtered = posts.filter(p => (year === 'all' || getYear(p) === year) && `${p.title} ${p.excerpt}`.toLowerCase().includes(query.trim().toLowerCase()));
  const groups = years.map(y => [y, filtered.filter(p => getYear(p) === y)]).filter(([, items]) => items.length);
  return <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">
    <Helmet><title>Blog · 开发手记 | 天问 TianWen</title><meta name="description" content="工程实践、开发手记与持续探索。" /></Helmet>
    <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
      <aside><div className="lg:sticky lg:top-28">
        <Link to="/" className="inline-flex items-center gap-3"><img src={profile.avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-4 ring-teal-500/10" /><span className="text-lg font-semibold">{profile.nickname[locale]}<span className="mt-1 block font-mono text-[10px] tracking-widest text-slate-500">BUILD. LEARN. SHARE.</span></span></Link>
        <p className="mt-6 text-sm leading-7 text-slate-500 dark:text-slate-400">{zh ? '在硬件与代码之间，记录每一次探索。把做过的事，写成值得分享的故事。' : 'Notes from the space between hardware and code. Experiments, discoveries, and stories worth sharing.'}</p>
        <a href={profile.contact.github} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs text-slate-500 hover:text-teal-600"><Github size={15} />GitHub<ArrowUpRight size={13} /></a>
        <div className="mt-8 hidden border-t border-slate-200 pt-7 dark:border-white/10 lg:block"><p className="eyebrow mb-4">{zh ? '文字的足迹' : 'THE ARCHIVE'}</p><p className="font-heading text-4xl font-semibold">{loading || error ? '—' : posts.length}<span className="ml-3 text-xs font-normal text-slate-500">{zh ? '篇手记' : 'stories'}</span></p><p className="mt-4 text-xs text-slate-500">{zh ? '保持好奇，持续更新。' : 'Stay curious. Keep creating.'}</p></div>
        {role === 'Developer' && <Link to="/works/blog/new" className="studio-button mt-7"><PenLine size={15} />{zh ? '写一篇手记' : 'Write a story'}</Link>}
      </div></aside>
      <div className="min-w-0">
        <header className="border-b border-slate-200 pb-8 dark:border-white/10"><p className="eyebrow">THE BLOG / FIELD NOTES</p><h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{zh ? '思考，落在字里行间。' : 'Ideas, put into words.'}</h1><p className="mt-5 text-sm leading-7 text-slate-500">{zh ? '关于技术、创造，以及解决问题的过程。' : 'On technology, making things, and figuring things out.'}</p></header>
        <div className="my-7 flex flex-wrap items-center justify-between gap-4"><nav aria-label={zh ? '按年份筛选' : 'Filter by year'} className="flex flex-wrap gap-2">{['all', ...years].map(y => <button key={y} onClick={() => setYear(y)} aria-pressed={year === y} className={`rounded-full px-4 py-2 text-xs transition ${year === y ? 'bg-teal-700 text-white dark:bg-teal-300 dark:text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-teal-50 dark:bg-white/5 dark:text-slate-400'}`}>{y === 'all' ? (zh ? '全部文章' : 'All posts') : y}</button>)}</nav><label className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-white/10 sm:w-56"><Search size={15} className="text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} aria-label={zh ? '搜索文章' : 'Search posts'} placeholder={zh ? '搜索一个想法…' : 'Find an idea…'} className="w-full min-w-0 bg-transparent text-xs outline-none" /></label></div>
        {loading ? <div role="status" aria-label="Loading" className="space-y-5">{[1,2,3].map(n => <div key={n} className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />)}</div> : error ? <div role="alert" className="studio-panel p-7"><p>{zh ? '文章暂时无法加载。' : 'Unable to load stories.'}</p>{role === 'Developer' && <p className="mt-3 break-words text-xs text-slate-500">{error}</p>}<button onClick={() => setAttempt(n => n + 1)} className="mt-4 text-teal-600 underline">{zh ? '重新加载' : 'Retry'}</button></div> : groups.length ? groups.map(([y, items]) => <section key={y} className="mb-12"><div className="mb-2 flex items-baseline gap-3"><h2 className="font-heading text-3xl font-semibold">{y}</h2><span className="text-xs text-slate-400">{items.length} {zh ? '篇文章' : 'stories'}</span></div><div className="divide-y divide-slate-200/70 dark:divide-white/10">{items.map(post => <Link key={post.id} to={`/works/blog/${post.id}`} className="group flex items-start gap-4 rounded-lg py-6 transition hover:bg-teal-500/5 sm:gap-6"><time dateTime={post.published_at} className="mt-1 shrink-0 font-mono text-xs text-slate-400">{new Date(post.published_at).toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit' }).split('/').reverse().join('·')}</time><div className="min-w-0 flex-1"><h3 className="break-words text-lg font-medium leading-7 transition group-hover:text-teal-700 dark:group-hover:text-teal-300">{post.title}</h3>{post.excerpt && <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">{post.excerpt}</p>}</div>{safeAssetUrl(post.cover_image) && <img src={post.cover_image} alt="" loading="lazy" className="hidden h-16 w-24 rounded-lg object-cover sm:block" />}<ArrowUpRight size={17} className="mt-1 shrink-0 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-teal-600" /></Link>)}</div></section>) : <div className="py-20 text-center"><BookOpen className="mx-auto text-teal-500" size={30} /><h2 className="mt-5 text-xl">{zh ? '这里，等待一个新想法。' : 'Room for a new idea.'}</h2><p className="mt-3 text-sm text-slate-500">{query || year !== 'all' ? (zh ? '试试其他关键词或年份。' : 'Try another keyword or year.') : (zh ? '第一篇手记即将到来。' : 'The first story is on its way.')}</p>{(query || year !== 'all') && <button onClick={() => { setQuery(''); setYear('all'); }} className="mt-5 text-sm text-teal-600 underline">{zh ? '清除筛选' : 'Clear filters'}</button>}</div>}
      </div>
    </div>
  </div>;
}
