import { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import Badge from '../ui/Badge.jsx';
import FilePreview from './FilePreview.jsx';

export default function FileList({ files = [] }) {
  const { t } = useI18n();
  const [previewFile, setPreviewFile] = useState(null);

  if (!files.length) return null;

  return (
    <div>
      <h3 className="font-heading font-semibold text-lg text-slate-900 dark:text-slate-100 mb-4">
        {t('detail.files')}
      </h3>

      <div className="space-y-2">
        {files.map((file, i) => (
          <div key={i}>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Badge type={file.type} size="md" />
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">{file.size}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {file.previewable && (
                  <button
                    onClick={() => setPreviewFile(previewFile?.url === file.url ? null : file)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary dark:text-primary-dark hover:bg-primary/20 transition-colors"
                  >
                    <Eye size={14} />
                    {previewFile?.url === file.url ? t('common.close') : t('common.preview')}
                  </button>
                )}
                <a
                  href={file.url}
                  download
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  <Download size={14} />
                  {t('common.download')}
                </a>
              </div>
            </div>

            {/* 展开预览 */}
            {previewFile?.url === file.url && (
              <div className="mt-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <FilePreview file={file} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
