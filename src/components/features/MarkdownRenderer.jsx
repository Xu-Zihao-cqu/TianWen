import ReactMarkdown from 'react-markdown';
import { cn } from '../../utils/helpers.js';

export default function MarkdownRenderer({ content, className }) {
  return (
    <div className={cn('prose prose-slate dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        components={{
          // 代码块样式
          pre: ({ children }) => (
            <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl p-4 overflow-x-auto text-sm">
              {children}
            </pre>
          ),
          code: ({ children, className: codeClass }) => {
            const isInline = !codeClass;
            return isInline ? (
              <code className="bg-slate-100 dark:bg-slate-800 text-primary dark:text-primary-dark px-1.5 py-0.5 rounded text-sm">
                {children}
              </code>
            ) : (
              <code className={codeClass}>{children}</code>
            );
          },
          // 图片自适应
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="rounded-xl max-w-full" loading="lazy" />
          ),
          // 链接新窗口打开
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary-dark underline">
              {children}
            </a>
          ),
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}
