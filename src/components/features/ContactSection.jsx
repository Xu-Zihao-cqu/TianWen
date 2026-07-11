import { motion } from 'framer-motion';
import { ArrowUpRight, Send } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import { getIcon } from '../../utils/icons.js';

export default function ContactSection({ contact }) {
  const { locale } = useI18n();

  const rawItems = [
    ...(contact.email ? [{ icon: 'mail', label: contact.email, href: `mailto:${contact.email}` }] : []),
    ...(contact.github ? [{ icon: 'github', label: 'GitHub', href: contact.github }] : []),
    ...(contact.social || []).map((s) => ({ icon: s.icon, label: s.platform, href: s.url })),
  ];
  const items = rawItems.filter((item, index, list) => (
    list.findIndex((candidate) => candidate.href === item.href) === index
  ));

  return (
    <section className="bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/15 dark:border-slate-700 md:p-10"
        >
          <div className="home-circuit-grid absolute inset-0 opacity-40" />
          <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase text-white/60">
                <Send size={14} className="text-cyan-300" />
                {locale === 'zh' ? '保持连接' : 'Stay Connected'}
              </div>
              <h2 className="font-heading text-3xl font-black md:text-5xl">
                {locale === 'zh' ? '有想法，就继续往下做。' : 'Have an idea? Keep building.'}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/60">
                {locale === 'zh'
                  ? '如果你对某个项目、资料或实现细节感兴趣，可以从这里找到我。'
                  : 'Reach out for project details, notes, implementation ideas, or future collaboration.'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:min-w-[360px] md:grid-cols-1">
              {items.map((item, i) => {
                const Icon = getIcon(item.icon);
                return (
                  <a
                    key={i}
                    href={item.href}
                    target={item.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white/80 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      {Icon && <Icon size={18} className="shrink-0 text-cyan-300" />}
                      <span className="truncate">{item.label}</span>
                    </span>
                    <ArrowUpRight size={16} className="shrink-0 text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
