import MarkdownRenderer from './MarkdownRenderer.jsx';
import { safeAssetUrl } from '../../utils/blogAssets.js';

export function headingId(text) {
  return 'section-' + text.toLowerCase().replace(/[*_`~]/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
}
export function articleHeadings(content = '') {
  let fence = null;
  return content.split('\n').flatMap(line => {
    const match = line.trim().match(/^(`{3,}|~{3,})/);
    if (match) {
      if (!fence) fence = match[1];
      else if (match[1][0] === fence[0] && match[1].length >= fence.length) fence = null;
      return [];
    }
    const heading = !fence && line.match(/^##\s+(.+?)\s*#*\s*$/);
    return heading ? [heading[1]] : [];
  });
}
const nodeText = node => typeof node === 'string' ? node : Array.isArray(node) ? node.map(nodeText).join('') : node?.props ? nodeText(node.props.children) : '';
const components = {
  h2: ({ children }) => <h2 id={headingId(nodeText(children))} className="mb-4 mt-12 scroll-mt-24 text-2xl font-semibold tracking-tight md:text-3xl">{children}</h2>,
  img: ({ src, alt }) => safeAssetUrl(src) ? <img src={src} alt={alt || ''} className="my-8 max-h-[760px] w-full rounded-2xl object-contain" loading="lazy" /> : null,
};
export default function BlogBody({ content = '' }) {
  return <MarkdownRenderer content={content} className="blog-prose min-w-0 break-words" components={components} />;
}
