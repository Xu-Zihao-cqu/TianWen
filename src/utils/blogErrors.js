const MISSING_TABLE_CODES = new Set(['42P01', 'PGRST205']);
const MISSING_COLUMN_CODES = new Set(['42703', 'PGRST204']);

export function blogServiceError(error) {
  const code = String(error?.code || '');
  const message = String(error?.message || error || 'Unknown error');

  if (
    MISSING_TABLE_CODES.has(code)
    || /blog_posts/i.test(message) && /schema cache|does not exist|could not find/i.test(message)
  ) {
    return new Error(
      'Blog 数据库尚未初始化。请在 Supabase SQL Editor 执行 supabase/migrations/20260919_blog_bootstrap.sql。',
      { cause: error },
    );
  }

  if (
    MISSING_COLUMN_CODES.has(code)
    || /attachments|cover_image/i.test(message) && /schema cache|column|could not find/i.test(message)
  ) {
    return new Error(
      'Blog 数据库迁移不完整。请重新执行 supabase/migrations/20260919_blog_bootstrap.sql。',
      { cause: error },
    );
  }

  if (code === '42501' || /row-level security|permission denied/i.test(message)) {
    return new Error(
      '当前账号没有发布权限。请确认 profiles.role 为 Developer，并重新登录后再试。',
      { cause: error },
    );
  }

  return error instanceof Error ? error : new Error(message);
}
