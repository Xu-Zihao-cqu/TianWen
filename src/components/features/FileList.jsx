import { useState } from 'react';
import { Download, Eye, FileStack } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import Badge from '../ui/Badge.jsx';
import FilePreview from './FilePreview.jsx';

export default function FileList({ files = [] }) {
  const { t, locale } = useI18n();
  const [previewFile, setPreviewFile] = useState(null);

  if (!files.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/30 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            {locale === 'zh' ? '项目资源' : 'Project Assets'}
          </p>
          <h3 className="mt-1 font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">
            {t('detail.files')}
          </h3>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-dark">
          <FileStack size={20} />
        </div>
      </div>

      <div className="space-y-3">
        {files.map((file, i) => (
          <div key={i}>
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white hover:shadow-md hover:shadow-primary/5 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-primary-dark/50 dark:hover:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <Badge type={file.type} size="md" />
                <div className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {file.name}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    {file.size}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {file.previewable && (
                  <button
                    type="button"
                    onClick={() => setPreviewFile(previewFile?.url === file.url ? null : file)}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 dark:text-primary-dark"
                  >
                    <Eye size={14} />
                    {previewFile?.url === file.url ? t('common.close') : t('common.preview')}
                  </button>
                )}
                <a
                  href={file.url}
                  download
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  <Download size={14} />
                  {t('common.download')}
                </a>
              </div>
            </div>

            {/* 展开预览 */}
            {previewFile?.url === file.url && (
              <div className="mt-3 rounded-2xl border border-primary/20 bg-white p-4 shadow-inner shadow-slate-900/5 dark:border-primary-dark/20 dark:bg-slate-950">
                <FilePreview file={file} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
