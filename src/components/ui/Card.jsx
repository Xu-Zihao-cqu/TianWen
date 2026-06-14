import { cn } from '../../utils/helpers.js';

export default function Card({ children, className, hover = 'none', ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/30 border border-slate-200 dark:border-slate-700 transition-all duration-300',
        hover === 'elevate' && 'hover:shadow-xl hover:shadow-primary/20 dark:hover:shadow-primary/30 hover:-translate-y-1',
        hover === 'glow' && 'hover:shadow-lg hover:shadow-primary/20',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
