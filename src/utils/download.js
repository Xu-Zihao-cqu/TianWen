export class MissingDownloadError extends Error {}

// A missing asset can be returned as the SPA shell with HTTP 200.
export async function fetchDownload(url, fetcher = fetch) {
  const response = await fetcher(url);
  if (response.status === 404 || response.status === 410) throw new MissingDownloadError('File not found');
  if (!response.ok) throw new Error('Download failed');
  const blob = await response.blob();
  const prefix = await blob.slice(0, 1024).text();
  const html = /text\/html/i.test(response.headers.get('content-type') || '') || /^\s*(?:<!doctype html|<html[\s>])/i.test(prefix);
  const isHtmlFile = /\.html?(?:[?#]|$)/i.test(url);
  const appShell = /(?:\/src\/main\.|<div\s+id=["']root["']|\/assets\/index-)/i.test(prefix);
  if (html && (!isHtmlFile || appShell)) throw new MissingDownloadError('Received an HTML fallback');
  return blob;
}

export function saveDownload(blob, name) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
}
