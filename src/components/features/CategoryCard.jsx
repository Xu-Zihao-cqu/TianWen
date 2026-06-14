import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import { getIcon } from '../../utils/icons.js';

export default function CategoryCard({ category, count = 0 }) {
  const { locale } = useI18n();
  const Icon = getIcon(category.icon);
  const { from, to } = category.gradient;

  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <Link
        to={`/works/${category.id}`}
        className="block relative p-8 rounded-2xl overflow-hidden shadow-lg group h-full min-h-[200px]"
        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {/* 装饰圆形 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-8 -translate-y-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-6 translate-y-6" />

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              {Icon && <Icon size={28} className="text-white" />}
            </div>
            <ArrowRight size={20} className="text-white/60 group-hover:translate-x-1 transition-transform" />
          </div>

          <div>
            <h3 className="text-2xl font-heading font-bold text-white mb-1">
              {category.name[locale]}
            </h3>
            <p className="text-white/80 text-sm mb-1">
              {category.description[locale]}
            </p>
            <p className="text-white/60 text-xs">
              {count} {locale === 'zh' ? '个作品' : 'works'}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
