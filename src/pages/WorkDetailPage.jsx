import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  FolderOpen,
  Layers3,
  Tags,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n.js';
import { getWorkById } from '../data/works/index.js';
import { categories } from '../data/categories.js';
import Badge from '../components/ui/Badge.jsx';
import LazyImage from '../components/ui/LazyImage.jsx';
import MarkdownRenderer from '../components/features/MarkdownRenderer.jsx';
import FileList from '../components/features/FileList.jsx';
import ExternalLinks from '../components/features/ExternalLinks.jsx';
import '../styles/prism-theme.css';

function WorkHeader({ work }) {
  const { locale } = useI18n();
  const categoryInfo = categories.find((item) => item.id === work.category);
  const categoryName = categoryInfo?.name?.[locale] || work.category;
  const accent = categoryInfo?.gradient || { from: '#667eea', to: '#764ba2' };
  const title = work.title?.[locale] || work.title?.zh || work.title?.en || work.id;
  const summary =
    work.description?.short?.[locale] || work.description?.short?.zh || work.description?.short?.en;
  const dateLabel = work.createdAt?.replace(/-/g, '.');
  const files = work.files || [];
  const links = work.externalLinks || [];
  const primaryLinkLabel =
    typeof links[0]?.label === 'object' ? links[0].label[locale] : links[0]?.label;
  const fileTypes = [...new Set(files.map((file) => file.type))];
  const gradientStyle = {
    background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
  };
  const softGradientStyle = {
    background: `linear-gradient(135deg, ${accent.from}1f, ${accent.to}14)`,
  };
  const tagAccentStyle = {
    borderColor: `${accent.from}33`,
  };

  return (
    <section className="mb-10">
      <Link
        to={`/works/${work.category}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-dark transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        {locale === 'zh' ? '返回作品列表' : 'Back to works'}
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/30">
        <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="relative min-h-[280px] overflow-hidden lg:min-h-[430px]" style={gradientStyle}>
            <LazyImage src={work.coverImage} alt={title} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-950/75 dark:text-slate-200">
                {categoryName}
              </span>
              {fileTypes.map((type) => (
                <Badge key={type} type={type} size="md" className="shadow-sm" />
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <Layers3 size={14} />
                {locale === 'zh' ? '项目预览' : 'Project Preview'}
              </p>
              <h1 className="max-w-3xl font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex flex-col p-5 md:p-7 lg:p-8">
            {summary && (
              <div className="rounded-2xl border border-slate-200/80 p-5 dark:border-slate-700" style={softGradientStyle}>
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  {locale === 'zh' ? '项目摘要' : 'Summary'}
                </p>
                <p className="mt-3 text-base leading-8 text-slate-700 dark:text-slate-200">
                  {summary}
                </p>
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <CalendarDays size={15} />
                  {locale === 'zh' ? '创建时间' : 'Created'}
                </div>
                <div className="mt-2 font-heading text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {dateLabel}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <FolderOpen size={15} />
                  {locale === 'zh' ? '项目附件' : 'Files'}
                </div>
                <div className="mt-2 font-heading text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {locale === 'zh' ? `${files.length} 个` : `${files.length}`}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ExternalLink size={15} />
                  {locale === 'zh' ? '外部链接' : 'Links'}
                </div>
                <div className="mt-2 font-heading text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {locale === 'zh' ? `${links.length} 个` : `${links.length}`}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  <Tags size={14} />
                  {locale === 'zh' ? '技术标签' : 'Tags'}
                </span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {work.tags?.length || 0}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {work.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300"
                    style={tagAccentStyle}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {links[0] && (
              <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
                <a
                  href={links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20"
                  style={gradientStyle}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/18 text-white backdrop-blur">
                      <ExternalLink size={17} />
                    </span>
                    <span className="truncate">
                      {primaryLinkLabel}
                    </span>
                  </span>
                  <ArrowUpRight size={18} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WorkDetailPage() {
  const { category, workId } = useParams();
  const { locale } = useI18n();

  const work = getWorkById(workId);

  if (!work) {
    return <Navigate to="/not-found" replace />;
  }

  const seoTitle = `${work.title[locale]} | 天问 TianWen`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={work.description?.short?.[locale]} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={work.description?.short?.[locale]} />
        <meta property="og:image" content={work.coverImage} />
      </Helmet>
      <WorkHeader work={work} />
      <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/30 md:p-8">
        <MarkdownRenderer content={work.description?.full?.[locale]} />
      </section>
      {work.files?.length > 0 && (
        <section className="mb-10">
          <FileList files={work.files} />
        </section>
      )}
      {work.externalLinks?.length > 0 && (
        <section>
          <ExternalLinks links={work.externalLinks} />
        </section>
      )}
    </div>
  );
}
