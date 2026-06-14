import { useI18n } from '../../hooks/useI18n.js';
import SectionTitle from '../ui/SectionTitle.jsx';
import { getIcon } from '../../utils/icons.js';

export default function ContactSection({ contact }) {
  const { locale } = useI18n();

  const items = [
    ...(contact.email ? [{ icon: 'mail', label: contact.email, href: `mailto:${contact.email}` }] : []),
    ...(contact.github ? [{ icon: 'github', label: 'GitHub', href: contact.github }] : []),
    ...(contact.social || []).map((s) => ({ icon: s.icon, label: s.platform, href: s.url })),
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 md:py-28">
      <SectionTitle
        title={locale === 'zh' ? '联系我' : 'Contact Me'}
        align="center"
      />

      <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
        {items.map((item, i) => {
          const Icon = getIcon(item.icon);
          return (
            <a
              key={i}
              href={item.href}
              target={item.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700"
            >
              {Icon && <Icon size={18} className="text-primary dark:text-primary-dark" />}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
