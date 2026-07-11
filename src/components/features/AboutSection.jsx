import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, CircuitBoard, Hammer, Lightbulb, Share2 } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import SectionTitle from '../ui/SectionTitle.jsx';
import { categories } from '../../data/categories.js';
import { getWorksByCategory } from '../../data/works/index.js';
import { getIcon } from '../../utils/icons.js';

const MotionLink = motion(Link);

export default function AboutSection({ bio }) {
  const { locale } = useI18n();
  const principles = [
    {
      icon: Lightbulb,
      title: locale === 'zh' ? '从问题出发' : 'Problem First',
      text: locale === 'zh' ? '先把需求和限制讲清楚，再选择硬件、软件或文档表达。' : 'Clarify constraints first, then choose hardware, software, or writing.',
    },
    {
      icon: CircuitBoard,
      title: locale === 'zh' ? '软硬结合' : 'Hardware + Software',
      text: locale === 'zh' ? '把电路、嵌入式逻辑和 Web 可视化放进同一个作品叙事里。' : 'Connect circuits, embedded logic, and web interfaces in one story.',
    },
    {
      icon: Share2,
      title: locale === 'zh' ? '可复用沉淀' : 'Reusable Notes',
      text: locale === 'zh' ? '把踩坑、资料和附件整理出来，后续自己和别人都能快速复盘。' : 'Turn lessons, files, and notes into material worth revisiting.',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <SectionTitle
          title={locale === 'zh' ? '创作工作台' : 'Creation Desk'}
          subtitle={locale === 'zh' ? '硬件、软件、笔记和课程项目在这里汇合' : 'Where hardware, software, notes, and coursework meet'}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
              <Hammer size={14} />
              {locale === 'zh' ? 'About TianWen' : 'About TianWen'}
            </div>
            <p className="text-lg leading-9 text-slate-700 dark:text-slate-200">
              {bio[locale]}
            </p>

            <div className="mt-8 space-y-3">
              {principles.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-dark">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map((category, index) => {
              const Icon = getIcon(category.icon);
              const count = getWorksByCategory(category.id).length;
              return (
                <MotionLink
                  key={category.id}
                  to={`/works/${category.id}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="group relative min-h-[190px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: `linear-gradient(90deg, ${category.gradient.from}, ${category.gradient.to})` }}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${category.gradient.from}, ${category.gradient.to})` }}
                    >
                      {Icon && <Icon size={22} />}
                    </div>
                    <ArrowUpRight size={18} className="text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary dark:group-hover:text-primary-dark" />
                  </div>
                  <div className="mt-8">
                    <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">
                      {category.name[locale]}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {category.description[locale]}
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                      {count} {locale === 'zh' ? '个作品' : 'works'}
                    </p>
                  </div>
                </MotionLink>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
