import { cn } from '../../utils/helpers.js';
import { getIcon } from '../../utils/icons.js';

export default function EmptyState({ icon = 'share-2', title, description, className }) {
  const Icon = getIcon(icon);

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {Icon && <Icon size={48} className="text-slate-300 dark:text-slate-600 mb-4" />}
      <h3 className="text-lg font-heading font-semibold text-slate-600 dark:text-slate-400">
        {title || '暂无内容'}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
}
