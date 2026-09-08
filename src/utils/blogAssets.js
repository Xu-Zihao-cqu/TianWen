export const BLOG_BUCKET = 'blog-assets';
export const MAX_ATTACHMENTS = 20;
const MB = 1024 * 1024;
export const codeLanguages = { js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx', py: 'python', c: 'c', h: 'c', cpp: 'cpp', hpp: 'cpp', css: 'css', html: 'markup', json: 'json', md: 'markdown', txt: 'text', sh: 'bash', sql: 'sql', v: 'verilog', yaml: 'yaml', yml: 'yaml' };
const imageTypes = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' };
export const BLOG_ACCEPT = [...Object.keys(imageTypes), ...Object.keys(codeLanguages), 'pdf', 'doc', 'docx'].map(ext => `.${ext}`).join(',');

export function fileKind(name = '') {
  const ext = name.split('.').pop().toLowerCase();
  if (Object.hasOwn(imageTypes, ext)) return { kind: 'image', mime: imageTypes[ext], limit: 8 * MB, ext };
  if (ext === 'pdf') return { kind: 'pdf', mime: 'application/pdf', limit: 20 * MB, ext };
  if (ext === 'docx') return { kind: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', limit: 20 * MB, ext };
  if (ext === 'doc') return { kind: 'doc', mime: 'application/msword', limit: 20 * MB, ext };
  if (Object.hasOwn(codeLanguages, ext)) return { kind: 'code', mime: 'text/plain', limit: MB, ext };
  throw new Error('不支持此文件类型 / Unsupported file type');
}

export function validateUpload(file) {
  const info = fileKind(file.name);
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > info.limit) throw new Error(`文件不能为空，最大 ${info.limit / MB} MB / Empty or oversized file`);
  return info;
}

export function safeAssetUrl(value) {
  if (typeof value !== 'string') return '';
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}

export function formatBytes(size = 0) {
  return size >= MB ? `${(size / MB).toFixed(1)} MB` : `${Math.ceil(size / 1024)} KB`;
}

export function assetMarkdown(asset) {
  const label = asset.name.replace(/[\\[\]<>\r\n]/g, ' ').trim();
  const url = safeAssetUrl(asset.url);
  if (!url) throw new Error('附件地址无效 / Invalid attachment URL');
  return `${asset.kind === 'image' ? '!' : ''}[${label}](<${url}>)`;
}

export function validateAssets(assets = []) {
  if (!Array.isArray(assets) || assets.length > MAX_ATTACHMENTS) throw new Error('最多 20 个附件 / Maximum 20 attachments');
  return assets.map(asset => {
    if (!asset || typeof asset.name !== 'string' || asset.name.length > 255 || typeof asset.path !== 'string' || asset.path.length > 500 || !safeAssetUrl(asset.url) || !Number.isFinite(asset.size)) throw new Error('附件数据无效 / Invalid attachment');
    const info = validateUpload(asset);
    if (asset.kind !== info.kind) throw new Error('附件类型不匹配 / Attachment type mismatch');
    return { name: asset.name, path: asset.path, url: safeAssetUrl(asset.url), size: asset.size, kind: info.kind };
  });
}
