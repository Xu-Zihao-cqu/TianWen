import test from 'node:test';
import assert from 'node:assert/strict';
import {
  workFileInfo,
  validateWork,
  toWorkCard,
} from '../src/utils/workAssets.js';
const image = {
  name: 'cover.svg',
  size: 100,
  type: 'image',
  url: 'https://example.com/cover.svg',
  path: 'user/cover.svg',
};
const valid = () => ({
  category: 'hardware',
  title: ' Test ',
  summary: 'A summary',
  content: '# Hello',
  tags: ['STM32'],
  cover_image: image.url,
  images: [image],
  files: [],
});
test('work uploads support requested images, archives and Markdown, with size limits', () => {
  for (const name of [
    'test.svg',
    'test.png',
    'test.jpg',
    'test.zip',
    'test.rar',
    'test.md',
  ])
    assert.ok(workFileInfo({ name, size: 100 }).type);
  for (const file of [
    { name: 'bad.exe', size: 100 },
    { name: 'big.png', size: 9 * 1024 * 1024 },
    { name: 'empty.md', size: 0 },
    { name: 'big.zip', size: 51 * 1024 * 1024 },
  ])
    assert.throws(() => workFileInfo(file));
});
test('publishing requires a real image cover, valid category and bounded fields', () => {
  assert.equal(validateWork(valid()).title, 'Test');
  for (const patch of [
    { category: 'blog' },
    { title: '' },
    { content: '' },
    { images: [] },
    { cover_image: 'https://wrong.example/cover.svg' },
    { tags: Array.from({ length: 13 }, (_, i) => String(i)) },
    { files: [{ ...image, url: 'javascript:alert(1)' }] },
  ])
    assert.throws(() => validateWork({ ...valid(), ...patch }));
});
test('uploaded work adapts to existing bilingual cards and file previews', () => {
  const card = toWorkCard({
    ...valid(),
    id: 'hw-test',
    created_at: '2026-10-11T12:00:00Z',
    author_id: 'author',
    files: [
      {
        name: 'main.c',
        size: 123,
        type: 'code',
        url: 'https://example.com/main.c',
      },
    ],
  });
  assert.equal(card.title.zh, card.title.en);
  assert.equal(card.description.full.zh, '# Hello');
  assert.equal(card.files[0].previewable, true);
  assert.equal(card.files[0].bytes, 123);
  assert.equal(card.createdAt, '2026-10-11');
});
