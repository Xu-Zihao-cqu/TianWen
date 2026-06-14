import { cn } from '../../utils/helpers.js';

export default function Skeleton({ variant = 'text', width, height, className }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-700 rounded',
        variant === 'text' && 'h-4 w-full',
        variant === 'card' && 'h-48 w-full rounded-2xl',
        variant === 'image' && 'h-48 w-full',
        className,
      )}
      style={{ width, height }}
    />
  );
}
