import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PDFViewer({ url }) {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(800);

  useEffect(() => { setNumPages(null); setPageNumber(1); }, [url]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      setPageWidth(Math.min(Math.max(containerRef.current.clientWidth - 32, 140), 800));
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">PDF Preview</span>
        {numPages && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            {pageNumber} / {numPages}
          </span>
        )}
      </div>

      <div className="p-3 md:p-4">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          }
          error={
            <p className="text-red-500 text-center py-10">PDF 加载失败，请确认文件存在</p>
          }
        >
          <div className="mx-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700">
            <Page pageNumber={pageNumber} width={pageWidth} />
          </div>
        </Document>
      </div>

      {numPages && numPages > 1 && (
        <div className="flex items-center justify-center gap-4 border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="min-w-16 text-center text-sm text-slate-600 dark:text-slate-400">
            {pageNumber} / {numPages}
          </span>
          <button
            type="button"
            aria-label="Next page"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
