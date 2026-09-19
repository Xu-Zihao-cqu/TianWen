/**
 * 资源分享作品
 * ID 命名规范：rs-{slug}，全局唯一
 */
export const resourcesWorks = [
  {
    id: 'rs-learning-notes-toolkit',
    category: 'resources',
    title: { zh: '学习笔记与工具推荐', en: 'Learning Notes and Toolkit' },
    coverImage: '/images/works/learning-toolkit.svg',
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

  {
    id: 'Intellignet Car',
    category: 'resources',
    title: { zh: '智能小车', en: 'Intellignet Car' },
    coverImage: '/images/works/inte-car.svg',
    description: {
      short: {
        zh: '支持循迹、超声波避障、蓝牙的智能小车项目 。',
        en: 'Smart car project supporting line tracking, ultrasonic obstacle avoidance, and Bluetooth connectivity.',
      },
      full: {
        zh: '## 内容简介\n\n该项目使用IRT9909实现循迹功能、使用JDY-31实现蓝牙通信、使用HCSR04实现超声波避障,不同功能依靠用户按键切换。',
        en: '## Overview\n\nThis project utilizes the IRT9909 for line-following, the JDY-31 for Bluetooth communication, and the HCSR04 for ultrasonic obstacle avoidance, with different functions toggled via user buttons.',
      },
    },
    tags: ['On-school Honework',  '2026'],
    files: [
      {
        name: 'inte_car.rar',
        type: 'rar',
        size: '800 KB',
        url: '/files/resources/inte_car.rar',
        previewable: true,
      },
    ],
    externalLinks: [],
    featured: false,
    createdAt: '2025-09-19',
  }

];
