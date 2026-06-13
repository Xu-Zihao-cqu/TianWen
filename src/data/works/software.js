/**
 * 软件项目作品
 * ID 命名规范：sw-{slug}，全局唯一
 */
export const softwareWorks = [
  {
    id: 'sw-sample-1',
    category: 'software',
    title: { zh: '示例软件项目', en: 'Sample Software Project' },
    coverImage: '/images/works/sample-software/cover.jpg',
    description: {
      short: {
        zh: '一个基于 React 的 Web 应用示例。',
        en: 'An example web application built with React.',
      },
      full: {
        zh: '## 项目简介\n\n一个基于 React + Vite 的现代 Web 应用。\n\n## 功能\n\n- 响应式设计\n- 暗色模式\n- 国际化支持',
        en: '## Overview\n\nA modern web app built with React + Vite.\n\n## Features\n\n- Responsive Design\n- Dark Mode\n- i18n Support',
      },
    },
    tags: ['React', 'Vite', 'JavaScript', '2025'],
    files: [
      {
        name: 'main.js',
        type: 'code',
        size: '2.3 KB',
        url: '/files/software/main.js',
        previewable: true,
      },
    ],
    externalLinks: [
      { label: 'GitHub', url: 'https://github.com/yourusername/sw-sample-1', icon: 'github' },
    ],
    featured: true,
    createdAt: '2025-03-20',
  },
];
