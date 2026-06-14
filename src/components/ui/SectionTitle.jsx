import { cn } from '../../utils/helpers.js';

export default function SectionTitle({ title, subtitle, align = 'left', className }) {
  return (
    <div
      className={cn(
        'mb-10',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3',
          align === 'center' && 'justify-center',
        )}
      >
        <div className="w-1 h-6 rounded-full gradient-primary" />
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-2 text-slate-500 dark:text-slate-400 ml-4">
          {subtitle}
        </p>
      )}
    </div>
  );
}
