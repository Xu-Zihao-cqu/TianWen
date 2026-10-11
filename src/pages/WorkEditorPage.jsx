import { formatBytes } from '../utils/blogAssets.js';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  UploadCloud,
  X,
  ArrowUp,
  ArrowDown,
  Check,
  Send,
  FileText,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useI18n } from '../hooks/useI18n.js';
import { categories } from '../data/categories.js';
import { publishWork, uploadWorkAsset } from '../services/works.js';
import {
  WORK_ACCEPT,
  WORK_CATEGORIES,
  workFileInfo,
  validateWork,
  toWorkCard,
} from '../utils/workAssets.js';
import WorkCard from '../components/features/WorkCard.jsx';
import MarkdownRenderer from '../components/features/MarkdownRenderer.jsx';

const blank = () => ({
  draftId: crypto.randomUUID(),
  category: 'hardware',
  title: '',
  summary: '',
  content: '',
  tags: [],
  images: [],
  files: [],
  cover_image: '',
});
const inputStyle =
  'mt-2 w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-700';
export default function WorkEditorPage() {
  const { user, role, loading } = useAuth();
  const { locale } = useI18n();
  const zh = locale === 'zh';
  const navigate = useNavigate();
  const [work, setWork] = useState(blank);
  const [tags, setTags] = useState('');
  const [draft, setDraft] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState('card');
  const lock = useRef(false);
  const editor = useRef(null);
  const key = `tianwen-work-draft:${user?.id}`;
  useEffect(() => {
    try {
      setDraft(JSON.parse(localStorage.getItem(key) || 'null'));
    } catch {
      setDraft(null);
    }
  }, [key]);
  useEffect(() => {
    if (!dirty || role !== 'Developer') return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(work));
        setSaved(true);
      } catch {
        setSaved(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [work, dirty, key, role]);
  useEffect(() => {
    if (!busy && (!dirty || saved)) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, saved, busy]);
  function update(patch) {
    setWork((w) => ({ ...w, ...patch }));
    setDirty(true);
    setSaved(false);
  }
  async function upload(selected) {
    if (lock.current || role !== 'Developer') return;
    const files = Array.from(selected || []);
    if (!files.length) return;
    setError('');
    try {
      const info = files.map(workFileInfo);
      if (
        work.images.length + info.filter((i) => i.type === 'image').length >
          12 ||
        work.files.length + info.filter((i) => i.type !== 'image').length > 20
      )
        throw new Error(
          '最多 12 张图片和 20 个附件 / Maximum 12 images and 20 attachments',
        );
    } catch (e) {
      setError(e.message);
      return;
    }
    lock.current = true;
    setProgress(0);
    const failures = [];
    for (const [index, file] of files.entries()) {
      setBusy(
        `${zh ? '上传' : 'Uploading'} ${index + 1}/${files.length} · ${file.name}`,
      );
      try {
        const asset = await uploadWorkAsset(file, user.id);
        setWork((w) =>
          asset.type === 'image'
            ? {
                ...w,
                images: [...w.images, asset],
                cover_image: w.cover_image || asset.url,
              }
            : { ...w, files: [...w.files, asset] },
        );
        setDirty(true);
        setSaved(false);
      } catch (e) {
        failures.push(`${file.name}: ${e.message}`);
      }
      setProgress(Math.round(((index + 1) / files.length) * 100));
    }
    setError(failures.join('\n'));
    setBusy('');
    lock.current = false;
  }
  async function importMarkdown(file) {
    if (!file || lock.current) return;
    lock.current = true;
    setBusy(zh ? '读取 Markdown…' : 'Reading Markdown…');
    setError('');
    try {
      if (!/\.md$/i.test(file.name) || file.size > 1024 * 1024)
        throw new Error(
          '请选择 1 MB 以内的 .md 文件 / Choose a .md file under 1 MB',
        );
      const content = await file.text();
      if (!content.trim() || content.length > 100000)
        throw new Error(
          '正文为空或超过 100,000 字 / Empty or oversized content',
        );
      update({
        content,
        title:
          work.title ||
          content.match(/^#\s+(.+)$/m)?.[1] ||
          file.name.replace(/\.md$/i, ''),
      });
      setPreview('body');
    } catch (e) {
      setError(e.message);
    } finally {
      lock.current = false;
      setBusy('');
    }
  }
  function restore() {
    try {
      if (
        !draft ||
        typeof draft.title !== 'string' ||
        typeof draft.content !== 'string' ||
        typeof draft.summary !== 'string' ||
        !Object.hasOwn(WORK_CATEGORIES, draft.category) ||
        !Array.isArray(draft.tags) ||
        draft.tags.some((t) => typeof t !== 'string') ||
        !Array.isArray(draft.images) ||
        !Array.isArray(draft.files)
      )
        throw new Error();
      for (const a of [...draft.images, ...draft.files]) {
        workFileInfo(a);
        if (!/^https:\/\//.test(a.url)) throw new Error();
      }
      update({
        ...blank(),
        ...draft,
        draftId: /^[a-f0-9-]{36}$/.test(draft.draftId)
          ? draft.draftId
          : crypto.randomUUID(),
      });
      setTags(draft.tags.join(', '));
      setDraft(null);
    } catch {
      setError(zh ? '草稿已损坏，无法恢复。' : 'Unable to restore draft.');
    }
  }
  function moveImage(index, direction) {
    const images = [...work.images];
    [images[index], images[index + direction]] = [
      images[index + direction],
      images[index],
    ];
    update({ images });
  }
  function insertImage(asset) {
    const start = editor.current?.selectionStart ?? work.content.length;
    const label = asset.name.replace(/[\[\]<>\\\r\n]/g, ' ');
    update({
      content:
        work.content.slice(0, start) +
        `\n\n![${label}](${asset.url})\n\n` +
        work.content.slice(start),
    });
    setPreview('body');
  }
  async function submit(e) {
    e.preventDefault();
    if (lock.current || role !== 'Developer') return;
    try {
      validateWork(work);
    } catch (err) {
      setError(err.message);
      return;
    }
    lock.current = true;
    setBusy(zh ? '正在发布作品…' : 'Publishing…');
    setError('');
    try {
      const id = await publishWork(
        work,
        user.id,
        `${WORK_CATEGORIES[work.category]}-${work.draftId}`,
      );
      setDirty(false);
      try {
        localStorage.removeItem(key);
      } catch {
        /* A saved draft must not block publication. */
      }
      navigate(`/works/${work.category}/${id}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      lock.current = false;
      setBusy('');
    }
  }
  if (loading)
    return (
      <p className="p-12" role="status">
        Loading…
      </p>
    );
  if (role !== 'Developer')
    return (
      <div className="mx-auto max-w-xl px-5 py-24">
        <h1 className="text-2xl">
          {zh
            ? '仅 Developer 可以发布作品'
            : 'Only Developers can publish works'}
        </h1>
        <Link to="/works" className="mt-6 inline-block text-teal-600">
          {zh ? '返回作品集' : 'Back to portfolio'}
        </Link>
      </div>
    );
  const card = toWorkCard({
    ...work,
    id: 'preview',
    title: work.title || (zh ? '你的下一个作品' : 'Your next creation'),
    created_at: new Date().toISOString(),
    author_id: user.id,
  });
  const done = [
    Boolean(work.title.trim() && work.summary.trim()),
    work.images.length > 0,
    Boolean(work.content.trim()),
  ].filter(Boolean).length;
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:py-16">
      <Helmet>
        <title>发布作品 | 天问 TianWen</title>
      </Helmet>
      <Link
        to="/works"
        className="inline-flex items-center gap-2 text-sm text-slate-500"
      >
        <ArrowLeft size={15} />
        {zh ? '作品集' : 'Portfolio'}
      </Link>
      <header className="my-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">CREATOR STUDIO / NEW WORK</p>
          <h1 className="mt-3 text-4xl font-semibold">
            {zh ? '把创意，变成作品。' : 'Give your idea a home.'}
          </h1>
          <p className="mt-4 text-sm text-slate-500">
            {zh
              ? '上传、编排、预览。下一张卡片，由你创造。'
              : 'Upload, arrange, preview. Create your next project card.'}
          </p>
        </div>
        <span className="text-xs text-slate-500" role="status">
          {saved
            ? zh
              ? '文字和已上传资源已保存到本机草稿'
              : 'Draft saved on this device'
            : zh
              ? '尚未保存草稿'
              : 'Draft not saved yet'}
        </span>
      </header>
      {draft && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl bg-teal-500/10 p-4 text-sm">
          <span>
            {zh ? '找到上次的作品草稿。' : 'Found your previous draft.'}
          </span>
          <button
            disabled={Boolean(busy)}
            onClick={restore}
            className="font-semibold text-teal-600"
          >
            {zh ? '继续创作' : 'Restore'}
          </button>
          <button
            disabled={Boolean(busy)}
            onClick={() => {
              setDraft(null);
              try {
                localStorage.removeItem(key);
              } catch {}
            }}
            className="text-slate-500"
          >
            {zh ? '忽略' : 'Dismiss'}
          </button>
        </div>
      )}
      <form
        onSubmit={submit}
        className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
      >
        <fieldset
          disabled={Boolean(busy)}
          className="min-w-0 space-y-6 disabled:opacity-70"
        >
          <section className="studio-panel p-6">
            <h2 className="text-lg font-semibold">
              01 / {zh ? '作品名片' : 'The essentials'}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                {zh ? '所属板块' : 'Category'}
                <select
                  value={work.category}
                  onChange={(e) => update({ category: e.target.value })}
                  className={`${inputStyle} dark:bg-slate-900`}
                >
                  {categories
                    .filter((c) => c.id !== 'blog')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name[locale]}
                      </option>
                    ))}
                </select>
              </label>
              <label className="text-sm">
                {zh ? '作品名称' : 'Title'}
                <input
                  required
                  maxLength={180}
                  value={work.title}
                  onChange={(e) => update({ title: e.target.value })}
                  className={inputStyle}
                  placeholder={zh ? '给你的创作起个名字' : 'Name your creation'}
                />
              </label>
            </div>
            <label className="mt-5 block text-sm">
              {zh ? '一句话介绍' : 'Summary'}
              <textarea
                required
                maxLength={500}
                rows={3}
                value={work.summary}
                onChange={(e) => update({ summary: e.target.value })}
                className={inputStyle}
              />
            </label>
            <label className="mt-4 block text-sm">
              {zh
                ? '技术标签（逗号分隔，最多 12 个）'
                : 'Tags (comma separated, up to 12)'}
              <input
                value={tags}
                maxLength={371}
                onChange={(e) => {
                  setTags(e.target.value);
                  update({
                    tags: e.target.value
                      .split(/[,，]/)
                      .map((t) => t.trim())
                      .filter(Boolean),
                  });
                }}
                className={inputStyle}
                placeholder="React, STM32, Python…"
              />
            </label>
          </section>
          <section className="studio-panel p-6">
            <h2 className="text-lg font-semibold">
              02 / {zh ? '图片与附件' : 'Images & files'}
            </h2>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                if (!busy) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (!busy) upload(e.dataTransfer.files);
              }}
              className={`relative mt-5 rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging ? 'border-teal-500 bg-teal-500/10' : 'border-slate-300 dark:border-slate-600'}`}
            >
              <UploadCloud className="mx-auto text-teal-500" size={30} />
              <p className="mt-3 font-medium">
                {zh
                  ? '拖到这里，或点击选择文件'
                  : 'Drop files here, or click to choose'}
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                SVG / PNG / JPG ≤ 8 MB · PDF / ZIP / RAR / 7Z / DOCX ≤ 50 MB
                <br />
                {zh
                  ? '代码附件 ≤ 1 MB；最多 12 张图片、20 个附件'
                  : 'Code ≤ 1 MB; up to 12 images and 20 files'}
              </p>
              <input
                type="file"
                multiple
                accept={WORK_ACCEPT}
                aria-label={zh ? '上传图片或附件' : 'Upload images or files'}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 focus:opacity-100"
                onChange={(e) => {
                  upload(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {work.images.map((asset, i) => (
                <div
                  key={asset.path}
                  className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="aspect-video w-full bg-slate-100 object-contain dark:bg-slate-950"
                  />
                  <div className="p-3">
                    <p className="truncate text-xs">{asset.name}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => update({ cover_image: asset.url })}
                        className="inline-flex items-center gap-1 text-xs text-teal-600"
                      >
                        {work.cover_image === asset.url && <Check size={13} />}
                        {work.cover_image === asset.url
                          ? zh
                            ? '封面'
                            : 'Cover'
                          : zh
                            ? '设为封面'
                            : 'Use as cover'}
                      </button>
                      <button
                        type="button"
                        onClick={() => insertImage(asset)}
                        className="text-xs text-slate-500"
                      >
                        {zh ? '插入正文' : 'Insert'}
                      </button>
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => moveImage(i, -1)}
                        aria-label={zh ? '图片前移' : 'Move earlier'}
                        className="disabled:opacity-20"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={i === work.images.length - 1}
                        onClick={() => moveImage(i, 1)}
                        aria-label={zh ? '图片后移' : 'Move later'}
                        className="disabled:opacity-20"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label={`${zh ? '移除' : 'Remove'} ${asset.name}`}
                        onClick={() => {
                          const images = work.images.filter(
                            (a) => a.path !== asset.path,
                          );
                          update({
                            images,
                            cover_image:
                              work.cover_image === asset.url
                                ? images[0]?.url || ''
                                : work.cover_image,
                          });
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {work.files.map((asset) => (
                <div
                  key={asset.path}
                  className="flex items-center gap-3 rounded-xl bg-slate-100 p-3 text-xs dark:bg-slate-800"
                >
                  <FileText size={16} />
                  <span className="min-w-0 flex-1 truncate">{asset.name}</span>
                  <span>{formatBytes(asset.size)}</span>
                  <button
                    type="button"
                    aria-label={`${zh ? '移除' : 'Remove'} ${asset.name}`}
                    onClick={() =>
                      update({
                        files: work.files.filter((a) => a.path !== asset.path),
                      })
                    }
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className="studio-panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">
                03 / {zh ? '讲讲你的作品' : 'Tell the story'}
              </h2>
              <label className="cursor-pointer rounded-lg bg-teal-500/10 px-3 py-2 text-xs text-teal-700 dark:text-teal-300">
                {zh
                  ? '导入 Markdown（替换正文）'
                  : 'Import Markdown (replace body)'}
                <input
                  type="file"
                  accept=".md"
                  className="mt-2 block max-w-56 text-xs"
                  onChange={(e) => {
                    importMarkdown(e.target.files[0]);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
            <textarea
              ref={editor}
              required
              maxLength={100000}
              rows={16}
              value={work.content}
              onChange={(e) => update({ content: e.target.value })}
              className={`${inputStyle} font-mono leading-6`}
              placeholder={
                zh
                  ? '# 项目介绍\n\n写下设计思路、实现过程和使用方法…'
                  : '# About this project'
              }
            />
            <p className="mt-2 text-xs text-slate-500">
              {work.content.length.toLocaleString()} / 100,000 ·{' '}
              {zh
                ? 'Markdown 中的本地图片需上传后插入正文'
                : 'Upload local Markdown images and insert them above'}
            </p>
          </section>
        </fieldset>
        <aside className="min-w-0 lg:sticky lg:top-24">
          <div className="studio-panel p-5">
            <div className="mb-5 flex gap-2">
              {['card', 'body'].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  aria-pressed={preview === tab}
                  onClick={() => setPreview(tab)}
                  className={`rounded-full px-4 py-2 text-xs ${preview === tab ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}
                >
                  {tab === 'card'
                    ? zh
                      ? '卡片预览'
                      : 'Card preview'
                    : zh
                      ? '正文预览'
                      : 'Body preview'}
                </button>
              ))}
            </div>
            {preview === 'card' ? (
              <div inert="" className="pointer-events-none">
                <WorkCard work={card} />
              </div>
            ) : (
              <div className="max-h-[55vh] overflow-auto break-words">
                <MarkdownRenderer
                  content={
                    work.content ||
                    (zh ? '在左侧写下第一行。' : 'Write your first line.')
                  }
                />
              </div>
            )}
            <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
              <div className="flex justify-between text-xs text-slate-500">
                <span>{zh ? '发布准备' : 'Ready to publish'}</span>
                <span>{done}/3</span>
              </div>
              <progress
                value={done}
                max={3}
                className="mt-3 h-1.5 w-full accent-teal-500"
                aria-label={zh ? '必填项完成度' : 'Required fields completed'}
              />
              <p className="mt-3 text-xs leading-6 text-slate-500">
                {zh
                  ? '名称与摘要 · 至少一张封面 · Markdown 正文'
                  : 'Title & summary · Cover image · Markdown body'}
              </p>
              <button
                type="submit"
                disabled={Boolean(busy) || done < 3}
                className="studio-button mt-4 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={16} />
                {zh ? '发布到作品集' : 'Publish work'}
              </button>
            </div>
          </div>
          {busy && (
            <div
              role="status"
              className="mt-4 break-words rounded-xl bg-teal-500/10 p-4 text-xs"
            >
              <p>{busy}</p>
              {progress > 0 && (
                <progress
                  value={progress}
                  max={100}
                  className="mt-3 w-full accent-teal-500"
                  aria-label="Upload progress"
                />
              )}
            </div>
          )}
          {error && (
            <p
              role="alert"
              className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300"
            >
              {error}
            </p>
          )}
        </aside>
      </form>
    </div>
  );
}
