import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, CalendarDays, FolderOpen } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import { categories } from '../../data/categories.js';
import LazyImage from '../ui/LazyImage.jsx';
import Tag from '../ui/Tag.jsx';
import Badge from '../ui/Badge.jsx';

/**
 * 作品卡片
 * compact=false: 标准模式（列表页）— 封面 + 标题 + 短描述 + 标签组 + 文件类型标识
 * compact=true:  精简模式（首页精选）— 封面 + 标题 + 短描述 + 前2标签
 */
export default function WorkCard({ work, compact = false }) {
  const { locale } = useI18n();

  if (!work) return null;

  const category = categories.find((item) => item.id === work.category);
  const accent = category?.gradient || { from: '#667eea', to: '#764ba2' };
  const title = work.title?.[locale] || work.title?.zh || work.title?.en || work.id;
  const description =
    work.description?.short?.[locale] || work.description?.short?.zh || work.description?.short?.en;
  const dateLabel = work.createdAt?.replace(/-/g, '.');
  const fileTypes = [...new Set(work.files?.map((f) => f.type) || [])];
  const fileCount = work.files?.length || 0;
  const coverStyle = {
    background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
  };
  const accentStyle = {
    borderLeftColor: accent.from,
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="shrink-0 w-[300px] md:w-[320px]"
      >
        <Link
          to={`/works/${work.category}/${work.id}`}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-900/5 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-950/30 dark:hover:border-primary-dark/50"
        >
          <div className="relative h-40 overflow-hidden" style={coverStyle}>
            <LazyImage src={work.coverImage} alt={title} className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/80 dark:text-slate-200">
              {category?.name?.[locale]}
            </div>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <h3 className="font-heading text-base font-semibold text-slate-900 transition-colors line-clamp-2 group-hover:text-primary dark:text-slate-100 dark:group-hover:text-primary-dark">
              {title}
            </h3>
            {description && (
              <p
                className="mt-3 border-l-2 pl-3 text-sm leading-6 text-slate-600 line-clamp-2 dark:text-slate-300"
                style={accentStyle}
              >
                {description}
              </p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {work.tags?.slice(0, 2).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-400 dark:text-slate-500">
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={13} />
                {dateLabel}
              </span>
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // 标准模式（用于列表页，详见 Step 9）
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="h-full"
    >
      <Link
        to={`/works/${work.category}/${work.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-900/5 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-950/30 dark:hover:border-primary-dark/50"
      >
        <div className="h-48 overflow-hidden relative" style={coverStyle}>
          <LazyImage src={work.coverImage} alt={title} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent opacity-80" />
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/80 dark:text-slate-200">
            {category?.name?.[locale]}
          </div>
          {fileTypes.length > 0 && (
            <div className="absolute top-2 right-2 flex gap-1">
              {fileTypes.map((t) => (
                <Badge key={t} type={t} size="md" />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={13} />
              {dateLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              <FolderOpen size={13} />
              {locale === 'zh' ? `${fileCount} 个附件` : `${fileCount} files`}
            </span>
          </div>
          <h3 className="font-heading font-semibold text-lg text-slate-900 transition-colors line-clamp-2 group-hover:text-primary dark:text-slate-100 dark:group-hover:text-primary-dark">
            {title}
          </h3>
          {description && (
            <p
              className="mt-3 border-l-2 pl-3 text-sm leading-6 text-slate-600 line-clamp-3 dark:text-slate-300"
              style={accentStyle}
            >
              {description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {work.tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-end pt-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all group-hover:bg-primary group-hover:text-white dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-primary-dark">
              <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
