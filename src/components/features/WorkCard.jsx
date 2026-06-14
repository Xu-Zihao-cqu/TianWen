import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n.js';
import LazyImage from '../ui/LazyImage.jsx';
import Tag from '../ui/Tag.jsx';
import Badge from '../ui/Badge.jsx';

/**
 * 作品卡片
 * compact=false: 标准模式（列表页）— 封面 + 标题 + 短描述 + 标签组 + 文件类型标识
 * compact=true:  精简模式（首页精选）— 封面 + 标题 + 前2标签，固定宽280px
 */
export default function WorkCard({ work, compact = false }) {
  const { locale } = useI18n();

  if (!work) return null;

  const fileTypes = [...new Set(work.files?.map((f) => f.type) || [])];

  if (compact) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} className="shrink-0 w-[280px]">
        <Link
          to={`/works/${work.category}/${work.id}`}
          className="block bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className="h-40 overflow-hidden">
            <LazyImage src={work.coverImage} alt={work.title[locale]} className="w-full h-full" />
          </div>
          <div className="p-4">
            <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100 truncate">
              {work.title[locale]}
            </h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {work.tags?.slice(0, 2).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // 标准模式（用于列表页，详见 Step 9）
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Link
        to={`/works/${work.category}/${work.id}`}
        className="block bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700"
      >
        <div className="h-48 overflow-hidden relative">
          <LazyImage src={work.coverImage} alt={work.title[locale]} className="w-full h-full" />
          {fileTypes.length > 0 && (
            <div className="absolute top-2 right-2 flex gap-1">
              {fileTypes.map((t) => (
                <Badge key={t} type={t} size="md" />
              ))}
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-heading font-semibold text-lg text-slate-900 dark:text-slate-100 mb-1">
            {work.title[locale]}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
            {work.description?.short?.[locale]}
          </p>
          <div className="flex flex-wrap gap-1">
            {work.tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
