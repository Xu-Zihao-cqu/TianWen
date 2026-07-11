import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import { getIcon } from '../../utils/icons.js';

export default function ExternalLinks({ links = [] }) {
  const { t, locale } = useI18n();

  if (!links.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/30 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            {locale === 'zh' ? '继续探索' : 'Explore More'}
          </p>
          <h3 className="mt-1 font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">
            {t('detail.externalLinks')}
          </h3>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-dark">
          <ExternalLink size={20} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link, i) => {
          const Icon = getIcon(link.icon);
          const label = typeof link.label === 'object' ? link.label[locale] : link.label;
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 transition-all hover:border-primary/40 hover:bg-white hover:text-primary hover:shadow-md hover:shadow-primary/5 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-primary-dark/50 dark:hover:bg-slate-800 dark:hover:text-primary-dark"
            >
              <span className="flex min-w-0 items-center gap-3">
                {Icon && <Icon size={18} className="shrink-0" />}
                <span className="truncate">{label}</span>
              </span>
              <ArrowUpRight size={17} className="shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-current" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
