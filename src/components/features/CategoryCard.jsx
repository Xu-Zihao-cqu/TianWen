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
    <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <Link
        to={`/works/${category.id}`}
        className="group relative block h-full min-h-[220px] overflow-hidden rounded-2xl border border-white/20 p-6 shadow-xl shadow-slate-900/10"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_42%,rgba(0,0,0,0.18))]" />
        <div className="absolute inset-x-6 top-0 h-px bg-white/60" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-2xl bg-white/20 p-3 shadow-lg shadow-black/10 backdrop-blur-sm">
              {Icon && <Icon size={28} className="text-white" />}
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white/75 backdrop-blur transition-all group-hover:bg-white group-hover:text-slate-950">
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          <div>
            <h3 className="font-heading text-2xl font-black text-white">
              {category.name[locale]}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/80">
              {category.description[locale]}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/60">
              {category.id === 'blog' ? (locale === 'zh' ? '阅读手记 →' : 'Read the journal →') : `${count} ${locale === 'zh' ? '个作品' : 'works'}`}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
