import { formatBytes } from './blogAssets.js';
const MB = 1024 * 1024;
export const WORK_BUCKET = 'work-assets';
export const WORK_CATEGORIES = {
  hardware: 'hw',
  software: 'sw',
  resources: 'res',
  assignments: 'as',
};
const images = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};
const archives = {
  zip: 'application/zip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
};
const documents = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
const code = [
  'md',
  'txt',
  'js',
  'jsx',
  'ts',
  'tsx',
  'py',
  'c',
  'h',
  'cpp',
  'hpp',
  'json',
  'css',
  'v',
  'sv',
  'sql',
  'yaml',
  'yml',
];
export const WORK_ACCEPT = [
  ...Object.keys(images),
  ...Object.keys(archives),
  ...Object.keys(documents),
  ...code,
]
  .map((x) => `.${x}`)
  .join(',');
export function workFileInfo(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const type = images[ext]
    ? 'image'
    : archives[ext]
      ? 'archive'
      : ext === 'pdf'
        ? 'pdf'
        : ext === 'docx'
          ? 'docx'
          : code.includes(ext)
            ? 'code'
            : null;
  if (!type) throw new Error('不支持此格式 / Unsupported format');
  const limit = type === 'image' ? 8 * MB : type === 'code' ? MB : 50 * MB;
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > limit)
    throw new Error(`文件不能为空，最大 ${limit / MB} MB / Invalid file size`);
  return {
    ext,
    type,
    mime: images[ext] || archives[ext] || documents[ext] || 'text/plain',
  };
}
export function validateWork(work) {
  if (!Object.hasOwn(WORK_CATEGORIES, work.category))
    throw new Error('请选择作品板块 / Choose a category');
  if (!work.title?.trim() || work.title.trim().length > 180)
    throw new Error('名称需要 1–180 字 / Title: 1–180 characters');
  if (!work.summary?.trim() || work.summary.length > 500)
    throw new Error('摘要需要 1–500 字 / Summary: 1–500 characters');
  if (!work.content?.trim() || work.content.length > 100000)
    throw new Error('正文需要 1–100,000 字 / Content: 1–100,000 characters');
  if (
    !Array.isArray(work.images) ||
    !work.images.length ||
    work.images.length > 12
  )
    throw new Error('请上传 1–12 张图片 / Upload 1–12 images');
  if (!Array.isArray(work.files) || work.files.length > 20)
    throw new Error('最多 20 个附件 / Maximum 20 attachments');
  const assets = [...work.images, ...work.files];
  for (const asset of assets) {
    const info = workFileInfo(asset);
    if (
      typeof asset.path !== 'string' ||
      asset.path.length > 500 ||
      !/^https:\/\//.test(asset.url) ||
      asset.name.length > 255 ||
      info.type !== asset.type
    )
      throw new Error('上传文件信息无效 / Invalid uploaded asset');
  }
  if (
    work.images.some((a) => a.type !== 'image') ||
    !work.images.some((a) => a.url === work.cover_image)
  )
    throw new Error('请从图片中选择封面 / Choose a cover image');
  const tags = [...new Set(work.tags.map((t) => t.trim()).filter(Boolean))];
  if (tags.length > 12 || tags.some((t) => t.length > 30))
    throw new Error('最多 12 个标签，每个不超过 30 字 / Invalid tags');
  return {
    category: work.category,
    title: work.title.trim(),
    summary: work.summary.trim(),
    content: work.content.trim(),
    cover_image: work.cover_image,
    images: work.images,
    files: work.files,
    tags,
  };
}
export function toWorkCard(row) {
  const bilingual = (value) => ({ zh: value, en: value });
  return {
    id: row.id,
    category: row.category,
    title: bilingual(row.title),
    description: {
      short: bilingual(row.summary),
      full: bilingual(row.content),
    },
    coverImage: row.cover_image,
    images: row.images,
    files: row.files.map((f) => ({
      ...f,
      type:
        f.type === 'archive'
          ? f.name.toLowerCase().endsWith('.zip')
            ? 'zip'
            : 'binary'
          : f.type === 'docx'
            ? 'binary'
            : f.type,
      bytes: f.size,
      size: formatBytes(f.size),
      previewable: ['pdf', 'code'].includes(f.type),
    })),
    tags: row.tags,
    createdAt: row.created_at.slice(0, 10),
    authorId: row.author_id,
    externalLinks: [],
    featured: false,
  };
}
