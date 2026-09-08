import test from 'node:test';
import assert from 'node:assert/strict';
import { fileKind, validateUpload, validateAssets, safeAssetUrl, assetMarkdown } from '../src/utils/blogAssets.js';

test('classifies images, PDF, Word and source code', () => {
  for (const [name, kind] of [['cover.PNG', 'image'], ['report.pdf', 'pdf'], ['report.doc', 'doc'], ['report.docx', 'docx'], ['main.py', 'code'], ['logic.v', 'code']]) assert.equal(fileKind(name).kind, kind);
});
test('rejects active or unrecognized attachment formats', () => {
  for (const name of ['bad.svg', 'run.exe', 'macro.docm', 'archive.zip']) assert.throws(() => validateUpload({ name, size: 10 }));
});
test('enforces independent file size ceilings and rejects empty uploads', () => {
  for (const [name, limit] of [['a.png', 8], ['a.pdf', 20], ['a.docx', 20], ['a.js', 1]]) {
    assert.doesNotThrow(() => validateUpload({ name, size: limit * 1024 * 1024 }));
    assert.throws(() => validateUpload({ name, size: limit * 1024 * 1024 + 1 }));
    assert.throws(() => validateUpload({ name, size: 0 }));
  }
});
test('only HTTPS attachment URLs are accepted', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,x', 'http://example.com/file', '//example.com/file', '/file', null]) assert.equal(safeAssetUrl(url), '');
  assert.equal(safeAssetUrl('https://example.com/file'), 'https://example.com/file');
});
const asset = { name: 'image.png', path: 'user/uuid.png', url: 'https://example.com/image.png', size: 200, kind: 'image' };
test('attachment manifests enforce types, sizes and count', () => {
  assert.equal(validateAssets([asset])[0].kind, 'image');
  for (const value of [null, {}, Array(21).fill(asset), [{ ...asset, kind: 'doc' }], [{ ...asset, size: Infinity }], [{ ...asset, url: 'javascript:alert(1)' }]]) assert.throws(() => validateAssets(value));
});
test('Markdown attachment labels cannot break out into another link', () => {
  const result = assetMarkdown({ ...asset, name: 'a]([evil]).png' });
  assert.match(result, /^!\[[^\[\]]+\]\(<https:\/\/example.com\/image.png>\)$/);
});
