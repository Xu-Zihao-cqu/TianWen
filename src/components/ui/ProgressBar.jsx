import { cn } from '../../utils/helpers.js';

export default function ProgressBar({ level = 0, label, animated = false, className }) {
  return (
    <div className={cn('w-full', className)}>
      {(label || label === 0) && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">{level}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full gradient-primary rounded-full',
            animated && 'transition-all duration-1000',
          )}
          style={{ width: `${Math.min(100, Math.max(0, level))}%` }}
        />
      </div>
    </div>
  );
}
