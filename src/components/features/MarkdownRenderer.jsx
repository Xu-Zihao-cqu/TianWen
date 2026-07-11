import ReactMarkdown from 'react-markdown';
import { cn } from '../../utils/helpers.js';

function isTableSeparator(line) {
  const cells = line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());

  return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isTableStart(lines, index) {
  return lines[index]?.trim().startsWith('|') && isTableSeparator(lines[index + 1] || '');
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function splitMarkdownBlocks(content = '') {
  const lines = content.split('\n');
  const blocks = [];
  let markdownLines = [];

  const flushMarkdown = () => {
    const text = markdownLines.join('\n').trim();
    if (text) blocks.push({ type: 'markdown', text });
    markdownLines = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    if (isTableStart(lines, i)) {
      flushMarkdown();
      const tableLines = [lines[i], lines[i + 1]];
      i += 2;

      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i += 1;
      }
      i -= 1;

      blocks.push({ type: 'table', rows: tableLines.map(parseTableRow) });
    } else {
      markdownLines.push(lines[i]);
    }
  }

  flushMarkdown();
  return blocks;
}

function MarkdownTable({ rows }) {
  const [header, , ...body] = rows;

  return (
    <div className="my-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800/80">
            <tr>
              {header.map((cell, index) => (
                <th
                  key={`${cell}-${index}`}
                  className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {body.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${cell}-${cellIndex}`}
                    className="px-4 py-3 leading-6 text-slate-600 dark:text-slate-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const markdownComponents = {
  h2: ({ children }) => (
    <h2 className="mt-10 flex items-center gap-3 font-heading text-2xl font-bold text-slate-900 first:mt-0 dark:text-slate-100">
      <span className="h-7 w-1 rounded-full bg-primary dark:bg-primary-dark" />
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600 marker:text-primary dark:text-slate-300 dark:marker:text-primary-dark">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-600 marker:font-semibold marker:text-primary dark:text-slate-300 dark:marker:text-primary-dark">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 leading-7">
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900 dark:text-slate-100">
      {children}
    </strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-2xl border-l-4 border-primary bg-primary/5 px-5 py-4 text-slate-700 dark:border-primary-dark dark:bg-primary-dark/10 dark:text-slate-200">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-100 shadow-inner shadow-black/30">
      {children}
    </pre>
  ),
  code: ({ children, className: codeClass }) => {
    const isInline = !codeClass;
    return isInline ? (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-primary dark:bg-slate-800 dark:text-primary-dark">
        {children}
      </code>
    ) : (
      <code className={codeClass}>{children}</code>
    );
  },
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className="my-6 max-w-full rounded-2xl border border-slate-200 shadow-md dark:border-slate-700"
      loading="lazy"
    />
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 dark:text-primary-dark dark:decoration-primary-dark/30"
    >
      {children}
    </a>
  ),
};

export default function MarkdownRenderer({ content, className }) {
  const blocks = splitMarkdownBlocks(content);

  return (
    <div className={cn('max-w-none', className)}>
      {blocks.map((block, index) => (
        block.type === 'table' ? (
          <MarkdownTable key={index} rows={block.rows} />
        ) : (
          <ReactMarkdown key={index} components={markdownComponents}>
            {block.text}
          </ReactMarkdown>
        )
      ))}
    </div>
  );
}
