import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchDownload, MissingDownloadError } from '../src/utils/download.js';
test('missing assets and SPA HTML fallback never download as real files', async () => {
  for (const response of [new Response('', { status: 404 }), new Response('<!doctype html><div id="root"></div>', { headers: { 'content-type': 'text/html' } }), new Response('<html>fallback</html>')]) {
    await assert.rejects(fetchDownload('/files/project.zip', async () => response), MissingDownloadError);
  }
});
test('valid bytes and intentional HTML files are preserved', async () => {
  assert.equal(await (await fetchDownload('/test.zip', async () => new Response('PK bytes'))).text(), 'PK bytes');
  assert.equal(await (await fetchDownload('/demo.html', async () => new Response('<html>Demo</html>', { headers: { 'content-type': 'text/html' } }))).text(), '<html>Demo</html>');
});
test('network and permission errors are retryable, not treated as a missing file', async () => {
  await assert.rejects(fetchDownload('/file', async () => new Response('', { status: 403 })), e => !(e instanceof MissingDownloadError));
});
