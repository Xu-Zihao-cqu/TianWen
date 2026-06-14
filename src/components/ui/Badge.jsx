import { cn } from '../../utils/helpers.js';

const badgeColors = {
  code: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pdf: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  link: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  binary: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const badgeLabels = {
  code: '源码',
  pdf: 'PDF',
  link: '链接',
  binary: '文件',
};

export default function Badge({ type = 'binary', size = 'sm', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded',
        size === 'sm' && 'px-1.5 py-0.5 text-[10px]',
        size === 'md' && 'px-2 py-0.5 text-xs',
        badgeColors[type] || badgeColors.binary,
        className,
      )}
    >
      {badgeLabels[type] || type}
    </span>
  );
}
