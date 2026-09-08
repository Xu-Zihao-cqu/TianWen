import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, PenLine, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useI18n } from '../hooks/useI18n.js';
import { getPost } from '../services/blog.js';
import BlogBody, { articleHeadings, headingId } from '../components/features/BlogBody.jsx';
import BlogAttachments from '../components/features/BlogAttachments.jsx';
import { safeAssetUrl } from '../utils/blogAssets.js';

export default function BlogDetailPage() {
  const { postId } = useParams();
  const { user, role } = useAuth();
  const { locale } = useI18n();
  const zh = locale === 'zh';
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const article = useRef(null);
  const { scrollYProgress } = useScroll({ target: article, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 30 });
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    getPost(postId).then(p => { if (active) setPost(p); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [postId]);
  const headings = articleHeadings(post?.content);
  const cover = safeAssetUrl(post?.cover_image);
  return <article ref={article} className="relative">
    <motion.div className="fixed left-0 right-0 top-16 z-40 h-0.5 origin-left bg-teal-400" style={{ scaleX: progress }} />
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      <Link to="/works/blog" className="inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={16} />{zh ? '返回手记' : 'Back to journal'}</Link>
      {loading ? <div role="status" className="my-16 h-64 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" aria-label="Loading" /> : error ? <p role="alert" className="mt-10">{zh ? '加载失败，请刷新重试。' : 'Unable to load this post. Please reload.'}</p> : !post ? <h1 className="mt-10 text-3xl">{zh ? '文章不存在' : 'Post not found'}</h1> : <>
        <Helmet><title>{post.title} | 天问 Blog</title><meta name="description" content={post.excerpt} /><meta property="og:title" content={post.title} />{cover && <meta property="og:image" content={cover} />}</Helmet>
        <header className="max-w-4xl py-12 md:py-16"><p className="eyebrow">FIELD NOTES / JOURNAL</p><h1 className="mt-6 break-words text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{post.title}</h1>{post.excerpt && <p className="mt-7 max-w-3xl break-words text-lg leading-8 text-slate-500 dark:text-slate-400">{post.excerpt}</p>}<div className="mt-8 flex flex-wrap items-center gap-5 text-xs text-slate-500"><time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString(zh ? 'zh-CN' : 'en-US')}</time><span className="flex items-center gap-2"><Clock size={14} />{Math.max(1, Math.ceil(post.content.length / (zh ? 450 : 1200)))} {zh ? '分钟阅读' : 'min read'}</span>{role === 'Developer' && user?.id === post.author_id && <Link className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-300" to={`/works/blog/${post.id}/edit`}><PenLine size={14} />{zh ? '编辑文章' : 'Edit story'}</Link>}</div></header>
        {cover && <img src={cover} alt={post.title} className="mb-12 max-h-[520px] w-full rounded-3xl object-cover" />}
        <div className="grid gap-12 border-t border-slate-200 pt-10 dark:border-white/10 lg:grid-cols-[180px_minmax(0,1fr)]">
          <aside className="hidden lg:block"><div className="sticky top-28"><p className="eyebrow mb-6">ON THIS PAGE</p><nav aria-label={zh ? '文章目录' : 'Table of contents'} className="space-y-4">{headings.map((title, i) => <a key={`${title}-${i}`} href={`#${headingId(title)}`} className="block break-words text-xs leading-6 text-slate-500 transition hover:text-teal-600 dark:hover:text-teal-300"><span className="mr-2 font-mono text-slate-400">{String(i + 1).padStart(2, '0')}</span>{title.replace(/[*_`]/g, '')}</a>)}</nav><Link to="/works/blog" className="mt-10 inline-flex items-center gap-2 text-xs text-teal-600 dark:text-teal-300">{zh ? '更多手记' : 'More stories'}<ArrowUpRight size={14} /></Link></div></aside>
          <div className="min-w-0 max-w-3xl"><BlogBody content={post.content} /><BlogAttachments files={post.attachments || []} /><div className="mt-16 border-t border-slate-200 pt-8 dark:border-white/10"><p className="eyebrow">KEEP EXPLORING.</p><Link to="/works/blog" className="mt-4 inline-flex items-center gap-5 text-2xl font-semibold">{zh ? '下一个灵感，正在路上。' : 'The next idea awaits.'}<ArrowUpRight size={24} /></Link></div></div>
        </div>
      </>}
    </div>
  </article>;
}
