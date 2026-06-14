import { cn } from '../../utils/helpers.js';

export default function Tag({ children, variant = 'default', active = false, onClick, className }) {
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-block px-3 py-1 text-xs font-medium rounded-full transition-colors',
        onClick && 'cursor-pointer select-none',
        variant === 'colored' && 'gradient-primary text-white',
        variant === 'default' && !active && 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
        active && 'gradient-primary text-white',
        className,
      )}
    >
      {children}
    </span>
  );
}
