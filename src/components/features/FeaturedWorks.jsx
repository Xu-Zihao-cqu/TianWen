import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n.js';
import WorkCard from './WorkCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function FeaturedWorks({ works }) {
  const { locale } = useI18n();

  return (
    <section className="relative overflow-hidden bg-[#f7f8fb] dark:bg-slate-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              <Sparkles size={14} className="text-amber-500" />
              {locale === 'zh' ? '精选展示' : 'Showcase'}
            </div>
            <h2 className="font-heading text-3xl font-black text-slate-950 dark:text-white md:text-5xl">
              {locale === 'zh' ? '最近值得看的作品' : 'Recent Work Worth Opening'}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
              {locale === 'zh'
                ? '挑几件最能代表方向的项目放在首页，先看封面和摘要，再进入完整细节。'
                : 'A focused shelf of representative projects, from visual summaries to full build notes.'}
            </p>
          </div>
          <Link
            to="/works"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
          >
            {locale === 'zh' ? '查看全部' : 'View All'}
            <ArrowRight size={16} />
          </Link>
        </div>

        {works.length === 0 ? (
          <EmptyState
            icon="share-2"
            title={locale === 'zh' ? '暂无精选作品' : 'No featured works yet'}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-5"
          >
            {works.map((work) => (
              <WorkCard key={work.id} work={work} compact />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
