import DOMPurify from 'dompurify';
import { supabase } from './supabaseClient.js';
import {
  WORK_BUCKET,
  WORK_CATEGORIES,
  workFileInfo,
  validateWork,
  toWorkCard,
} from '../utils/workAssets.js';
let cached = null;
let expires = 0;
let pending = null;
export async function listUploadedWorks() {
  if (!supabase) return [];
  if (cached && Date.now() < expires) return cached;
  if (pending) return pending;
  pending = (async () => {
    const rows = [];
    for (let offset = 0; ; offset += 200) {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id')
        .range(offset, offset + 199);
      if (error)
        throw new Error(
          '线上作品暂时无法加载，请稍后重试。/ Unable to load uploaded works.',
        );
      rows.push(...data.map(toWorkCard));
      if (data.length < 200) break;
    }
    cached = rows;
    expires = Date.now() + 30000;
    return rows;
  })();
  try {
    return await pending;
  } finally {
    pending = null;
  }
}
export async function uploadWorkAsset(file, userId) {
  if (!supabase || !userId) throw new Error('请先登录 / Sign in first');
  const info = workFileInfo(file);
  let body = file;
  if (info.ext === 'svg') {
    const source = await file.text();
    const clean = DOMPurify.sanitize(source, {
      USE_PROFILES: { svg: true, svgFilters: true },
      FORBID_TAGS: [
        'foreignObject',
        'feImage',
        'style',
        'a',
        'image',
        'use',
        'animate',
        'set',
        'animateTransform',
      ],
      FORBID_ATTR: ['style'],
    });
    const doc = new DOMParser().parseFromString(clean, 'image/svg+xml');
    if (
      doc.querySelector('parsererror') ||
      doc.documentElement.localName !== 'svg'
    )
      throw new Error('SVG 无效 / Invalid SVG');
    body = new Blob([clean], { type: info.mime });
  }
  if (info.type === 'image') {
    const url = URL.createObjectURL(body);
    try {
      await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = () =>
          reject(new Error('图片无法解码，请选择有效图片 / Invalid image'));
        image.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  const path = `${userId}/${crypto.randomUUID()}.${info.ext}`;
  const { error } = await supabase.storage
    .from(WORK_BUCKET)
    .upload(path, body, {
      contentType: info.mime,
      upsert: false,
      cacheControl: '31536000',
    });
  if (error) throw new Error(`上传失败，请检查作品存储配置：${error.message}`);
  const { data } = supabase.storage.from(WORK_BUCKET).getPublicUrl(path);
  return {
    name: file.name,
    path,
    url: data.publicUrl,
    size: body.size,
    type: info.type,
  };
}
export async function publishWork(work, userId, id) {
  if (!supabase || !userId) throw new Error('请先登录 / Sign in first');
  const payload = validateWork(work);
  if (!id.startsWith(`${WORK_CATEGORIES[payload.category]}-`))
    throw new Error('作品编号与板块不匹配 / Invalid work ID');
  const { error } = await supabase
    .from('works')
    .insert({ ...payload, id, author_id: userId });
  if (error) {
    // A lost response may follow a successful commit. Recover without creating duplicates.
    if (error.code === '23505') {
      const { data } = await supabase
        .from('works')
        .select('id,author_id')
        .eq('id', id)
        .maybeSingle();
      if (data?.author_id === userId) {
        cached = null;
        return id;
      }
    }
    throw new Error(
      `发布失败，请确认作品迁移已执行且账号为 Developer：${error.message}`,
    );
  }
  cached = null;
  expires = 0;
  return id;
}
