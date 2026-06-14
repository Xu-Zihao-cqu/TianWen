import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';

const langMap = {
  py: 'python', js: 'javascript', jsx: 'javascript',
  c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp',
  html: 'markup', css: 'css', json: 'json',
  sh: 'bash', md: 'markdown',
};

function inferLang(filename) {
  const ext = filename?.split('.').pop()?.toLowerCase();
  return langMap[ext] || 'plaintext';
}

export default function CodeViewer({ url, filename }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.text();
      })
      .then((text) => {
        setCode(text);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [url]);

  useEffect(() => {
    if (code) Prism.highlightAll();
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* 降级 */ }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"/></div>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">代码加载失败，请确认文件存在</p>;
  }

  const lang = inferLang(filename);

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 dark:bg-slate-950 rounded-t-xl">
        <span className="text-xs text-slate-400 font-mono">{filename}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="!mt-0 !rounded-t-none">
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
  );
}
