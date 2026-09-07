import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, PenLine } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useI18n } from '../hooks/useI18n.js';
import { getPost } from '../services/blog.js';
import MarkdownRenderer from '../components/features/MarkdownRenderer.jsx';

export default function BlogDetailPage() {
  const { postId } = useParams();
  const { user, role } = useAuth();
  const { locale } = useI18n();
  const zh = locale === 'zh';
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    getPost(postId).then(p => { if (active) setPost(p); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [postId]);
  return <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
    <Link to="/works/blog" className="inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={16} />{zh ? '全部文章' : 'All posts'}</Link>
    {loading ? <p className="mt-10" role="status">{zh ? '加载中…' : 'Loading…'}</p> : error ? <p role="alert" className="mt-10">{zh ? '加载失败，请刷新重试。' : 'Unable to load this post. Please reload.'}</p> : !post ? <h1 className="mt-10 text-3xl">{zh ? '文章不存在' : 'Post not found'}</h1> : <>
      <Helmet><title>{post.title} | 天问 Blog</title><meta name="description" content={post.excerpt} /></Helmet>
      <p className="eyebrow mt-12">JOURNAL / {new Date(post.published_at).toLocaleDateString(zh ? 'zh-CN' : 'en-US')}</p>
      <h1 className="mt-6 break-words text-4xl font-bold leading-tight tracking-tight md:text-6xl">{post.title}</h1>
      {post.excerpt && <p className="mt-6 break-words text-lg leading-8 text-slate-500">{post.excerpt}</p>}
      {role === 'Developer' && user?.id === post.author_id && <Link className="mt-6 inline-flex items-center gap-2 text-teal-600" to={`/works/blog/${post.id}/edit`}><PenLine size={16} />{zh ? '编辑文章' : 'Edit post'}</Link>}
      <div className="my-10 border-t border-slate-200 dark:border-slate-700" /><MarkdownRenderer content={post.content} className="break-words" />
    </>}
  </article>;
}
