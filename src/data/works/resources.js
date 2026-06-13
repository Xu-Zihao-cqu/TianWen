/**
 * 资源分享作品
 * ID 命名规范：rs-{slug}，全局唯一
 */
export const resourcesWorks = [
  {
    id: 'rs-sample-1',
    category: 'resources',
    title: { zh: '示例资源分享', en: 'Sample Resource' },
    coverImage: '/images/works/sample-resource/cover.jpg',
    description: {
      short: {
        zh: '一份学习笔记或工具推荐。',
        en: 'A study note or tool recommendation.',
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
