import {
  Cpu, Code2, Share2, BookOpen,
  Github, Video, Mail,
  Sun, Moon, ExternalLink,
  Menu, X, ArrowUp,
  Download, Copy, Eye, FileText, FileCode,
} from 'lucide-react';

/**
 * Lucide 图标名 → 组件映射表
 * 数据文件中 icon 字段存字符串，渲染时通过此表查找组件
 * 新增图标只需在此处扩展
 */
export const iconMap = {
  // 板块图标
  'cpu':       Cpu,
  'code-2':    Code2,
  'share-2':   Share2,
  'book-open': BookOpen,

  // 社交 / 链接
  'github':    Github,
  'video':     Video,
  'mail':      Mail,

  // 功能图标
  'sun':               Sun,
  'moon':              Moon,
  'external-link':     ExternalLink,
  'menu':              Menu,
  'x':                 X,
  'arrow-up':          ArrowUp,
  'download':          Download,
  'copy':              Copy,
  'eye':               Eye,
  'file-text':         FileText,
  'file-code':         FileCode,
};

/**
 * 根据图标名字符串返回对应的 Lucide 组件
 * @param {string} name - 图标名 (kebab-case)
 * @returns {React.Component|null}
 */
export function getIcon(name) {
  return iconMap[name] || null;
}
