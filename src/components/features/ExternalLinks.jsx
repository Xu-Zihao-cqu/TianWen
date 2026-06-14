import { ExternalLink } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import { getIcon } from '../../utils/icons.js';

export default function ExternalLinks({ links = [] }) {
  const { t, locale } = useI18n();

  if (!links.length) return null;

  return (
    <div>
      <h3 className="font-heading font-semibold text-lg text-slate-900 dark:text-slate-100 mb-4">
        {t('detail.externalLinks')}
      </h3>

      <div className="flex flex-wrap gap-3">
        {links.map((link, i) => {
          const Icon = getIcon(link.icon);
          const label = typeof link.label === 'object' ? link.label[locale] : link.label;
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {Icon && <Icon size={16} />}
              {label}
              <ExternalLink size={12} className="opacity-50" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
