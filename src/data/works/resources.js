/**
 * 资源分享作品
 * ID 命名规范：rs-{slug}，全局唯一
 */
export const resourcesWorks = [
  {
    id: 'rs-learning-notes-toolkit',
    category: 'resources',
    title: { zh: '学习笔记与工具推荐', en: 'Learning Notes and Toolkit' },
    coverImage: '/images/works/sample-resource/cover.jpg',
    description: {
      short: {
        zh: '把课程学习、开发工具和踩坑记录整理成可复用的资源清单，方便后续查阅、复盘与分享。',
        en: 'A reusable collection of study notes, development tools, and hard-won setup notes for quick review, reuse, and sharing.',
      },
      full: {
        zh: '## 内容简介\n\n学习笔记、教程整理或开发工具推荐。',
        en: '## Overview\n\nStudy notes, tutorials, or dev tool recommendations.',
      },
    },
    tags: ['教程', '笔记', '2025'],
    files: [
      {
        name: 'notes.pdf',
        type: 'pdf',
        size: '800 KB',
        url: '/files/resources/notes.pdf',
        previewable: true,
      },
    ],
    externalLinks: [],
    featured: false,
    createdAt: '2025-06-01',
  },
];
