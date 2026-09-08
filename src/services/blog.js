import { supabase } from './supabaseClient.js';
import { safeAssetUrl, validateAssets } from '../utils/blogAssets.js';

export function validatePost(post) {
  if (!post.title?.trim() || post.title.trim().length > 180) throw new Error('标题不能为空，且不能超过 180 字 / Title: 1–180 characters');
  if (!post.content?.trim() || post.content.length > 100000) throw new Error('正文不能为空，且不能超过 100,000 字 / Content: 1–100,000 characters');
  if ((post.excerpt || '').length > 500) throw new Error('摘要不能超过 500 字 / Excerpt: max 500 characters');
  const attachments = validateAssets(post.attachments);
  const cover_image = post.cover_image || '';
  if (cover_image && !safeAssetUrl(cover_image)) throw new Error('封面地址无效 / Invalid cover URL');
  return { title: post.title.trim(), content: post.content.trim(), excerpt: (post.excerpt || '').trim(), attachments, cover_image };
}

function client() {
  if (!supabase) throw new Error('文章服务尚未配置 / Blog service is not configured');
  return supabase;
}

export async function listPosts() {
  const { data, error } = await client().from('blog_posts').select('id,title,excerpt,published_at,author_id,cover_image').order('published_at', { ascending: false }).limit(100);
  if (error) throw error;
  return data;
}

export async function getPost(id) {
  const { data, error } = await client().from('blog_posts').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function publishPost(post, authorId, id) {
  const payload = { ...validatePost(post), author_id: authorId };
  const query = id ? client().from('blog_posts').update(payload).eq('id', id) : client().from('blog_posts').insert(payload);
  const { data, error } = await query.select('id').single();
  if (error) throw error;
  return data.id;
}
