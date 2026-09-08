import { supabase } from './supabaseClient.js';
import { BLOG_BUCKET, validateUpload } from '../utils/blogAssets.js';

export async function uploadBlogAsset(file, userId) {
  const { mime, kind, ext } = validateUpload(file);
  if (!supabase || !userId) throw new Error('请先配置并登录文章服务 / Sign in to the configured blog service');
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BLOG_BUCKET).upload(path, file, { contentType: mime, cacheControl: '31536000', upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(BLOG_BUCKET).getPublicUrl(path);
  return { name: file.name, path, url: data.publicUrl, size: file.size, kind };
}
