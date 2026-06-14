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
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p>{t('detail.previewNotSupported')}</p>
          <a
            href={file.url}
            download
            className="inline-block mt-2 text-primary dark:text-primary-dark underline"
          >
            {t('detail.clickToDownload')}
          </a>
        </div>
      );
  }
}
