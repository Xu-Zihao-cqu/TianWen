import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-verilog';
import 'prismjs/components/prism-yaml';
import '../../styles/prism-theme.css';

export default function CodeBlock({ code = '', language = 'text' }) {
  const [copied, setCopied] = useState(false);
  const aliases = { js: 'javascript', ts: 'typescript', py: 'python', sh: 'bash', html: 'markup' };
  const lang = aliases[language] || language;
  const html = useMemo(() => Prism.languages[lang] ? Prism.highlight(code, Prism.languages[lang], lang) : null, [code, lang]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); } catch { setCopied(false); }
  };
  return <div className="blog-code my-7 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1420] text-slate-200">
    <div className="flex items-center justify-between border-b border-white/10 px-5 py-3"><span className="font-mono text-xs uppercase tracking-widest text-teal-300">{language}</span><button type="button" onClick={copy} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white" aria-label="Copy code">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied' : 'Copy'}</button></div>
    <pre className="!m-0 !rounded-none !bg-transparent !p-5 text-sm leading-7"><code className={`language-${lang}`} {...(html === null ? { children: code } : { dangerouslySetInnerHTML: { __html: html } })} /></pre>
  </div>;
}
