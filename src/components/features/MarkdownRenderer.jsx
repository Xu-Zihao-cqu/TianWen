import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock.jsx';
import {
  Activity,
  ArrowDown,
  Camera,
  Cpu,
  Database,
  Monitor,
  RadioTower,
  ScanLine,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '../../utils/helpers.js';

const flowIcons = [
  Camera,
  RadioTower,
  SlidersHorizontal,
  Activity,
  ScanLine,
  Cpu,
  Activity,
  SlidersHorizontal,
  Cpu,
  Database,
  Monitor,
];

const flowStyles = [
  'from-orange-400 to-red-500',
  'from-sky-400 to-blue-500',
  'from-indigo-400 to-violet-500',
  'from-emerald-400 to-teal-500',
  'from-cyan-400 to-blue-500',
  'from-fuchsia-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-lime-400 to-emerald-500',
  'from-purple-400 to-indigo-500',
  'from-slate-500 to-slate-700',
  'from-rose-400 to-red-500',
];

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

function getFenceStart(line) {
  const match = line.trim().match(/^(`{3,}|~{3,})([a-zA-Z0-9_-]*)/);
  if (!match) return null;

  return {
    char: match[1][0],
    length: match[1].length,
    lang: match[2]?.toLowerCase() || '',
  };
}

function isFenceEnd(line, fence) {
  return line.trim().startsWith(fence.char.repeat(fence.length));
}

function parseFlowSteps(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && /[A-Za-z0-9\u4e00-\u9fa5]/.test(line))
    .filter((line) => !/^[↓→←↑\-\s|]+$/.test(line));
}

function isFlowBlock(fence, text) {
  const steps = parseFlowSteps(text);
  const isPlainText = !fence.lang || fence.lang === 'text' || fence.lang === 'txt';
  const hasFlowMarks = /[↓→]/.test(text);

  return isPlainText && hasFlowMarks && steps.length >= 4;
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
    const fence = getFenceStart(lines[i]);

    if (fence) {
      const fenceLines = [lines[i]];
      const bodyLines = [];
      i += 1;

      while (i < lines.length) {
        if (isFenceEnd(lines[i], fence)) {
          fenceLines.push(lines[i]);
          break;
        }

        bodyLines.push(lines[i]);
        fenceLines.push(lines[i]);
        i += 1;
      }

      const body = bodyLines.join('\n');
      if (isFlowBlock(fence, body)) {
        flushMarkdown();
        blocks.push({ type: 'flow', steps: parseFlowSteps(body) });
      } else {
        markdownLines.push(...fenceLines);
      }
    } else if (isTableStart(lines, i)) {
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

function SystemFlowDiagram({ steps }) {
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
      <div className="flex flex-col gap-2 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
          System Architecture
        </p>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
          系统框图请看附件
        </p>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = flowIcons[index % flowIcons.length];
            const color = flowStyles[index % flowStyles.length];

            return (
              <div key={`${step}-${index}`} className="flex flex-col items-center">
                <div className="group relative flex min-h-[112px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div className={cn('absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b', color)} />
                  <div className="flex w-full items-center gap-4 pl-2">
                    <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md', color)}>
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Stage {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-800 dark:text-slate-100">
                        {step}
                      </p>
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex h-8 items-center justify-center text-slate-300 dark:text-slate-600 sm:hidden">
                    <ArrowDown size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
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
  pre: ({ children }) => <CodeBlock code={String(children?.props?.children || '').replace(/\n$/, '')} language={children?.props?.className?.replace('language-', '') || 'text'} />,
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

export default function MarkdownRenderer({ content, className, components = {} }) {
  const blocks = splitMarkdownBlocks(content);

  return (
    <div className={cn('max-w-none', className)}>
      {blocks.map((block, index) => (
        block.type === 'table' ? (
          <MarkdownTable key={index} rows={block.rows} />
        ) : block.type === 'flow' ? (
          <SystemFlowDiagram key={index} steps={block.steps} />
        ) : (
          <ReactMarkdown key={index} components={{ ...markdownComponents, ...components }}>
            {block.text}
          </ReactMarkdown>
        )
      ))}
    </div>
  );
}
