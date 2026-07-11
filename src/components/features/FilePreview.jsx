import { useI18n } from '../../hooks/useI18n.js';
import PDFViewer from './PDFViewer.jsx';
import CodeViewer from './CodeViewer.jsx';

export default function FilePreview({ file }) {
  const { t } = useI18n();

  if (!file) return null;

  switch (file.type) {
    case 'pdf':
      return <PDFViewer url={file.url} />;
    case 'code':
      return <CodeViewer url={file.url} filename={file.name} />;
    default:
      return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
          <p className="text-sm font-medium">{t('detail.previewNotSupported')}</p>
          <a
            href={file.url}
            download
            className="mt-4 inline-flex rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 dark:text-primary-dark"
          >
            {t('detail.clickToDownload')}
          </a>
        </div>
      );
  }
}
