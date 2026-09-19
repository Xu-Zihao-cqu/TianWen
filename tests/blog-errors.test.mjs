import test from 'node:test';
import assert from 'node:assert/strict';
import { blogServiceError } from '../src/utils/blogErrors.js';

test('explains a missing blog_posts table instead of exposing a schema-cache error', () => {
  const error = blogServiceError({
    code: 'PGRST205',
    message: "Could not find the table 'public.blog_posts' in the schema cache",
  });

  assert.match(error.message, /Blog 数据库尚未初始化/);
  assert.match(error.message, /20260919_blog_bootstrap\.sql/);
});

test('distinguishes incomplete media migration and RLS denial', () => {
  assert.match(
    blogServiceError({ code: 'PGRST204', message: "Could not find the 'attachments' column" }).message,
    /迁移不完整/,
  );
  assert.match(
    blogServiceError({ code: '42501', message: 'new row violates row-level security policy' }).message,
    /Developer/,
  );
});

test('preserves unrelated service errors', () => {
  const source = new Error('Network request failed');
  assert.equal(blogServiceError(source), source);
});
