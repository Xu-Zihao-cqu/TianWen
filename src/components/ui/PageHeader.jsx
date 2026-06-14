import { cn } from '../../utils/helpers.js';

export default function PageHeader({ title, subtitle, breadcrumbs, className }) {
  return (
    <div className={cn('py-12 md:py-16', className)}>
      {breadcrumbs && (
        <nav className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-4">
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-1">/</span>}
              {crumb.link ? (
                <a href={crumb.link} className="hover:text-primary transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-slate-900 dark:text-slate-100 font-medium">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
