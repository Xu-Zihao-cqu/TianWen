import { cn } from '../../utils/helpers.js';

export default function PageHeader({ title, subtitle, breadcrumbs, className }) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 md:p-8', className)}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
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
      <h1 className="font-heading text-3xl font-black text-slate-950 dark:text-white md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
