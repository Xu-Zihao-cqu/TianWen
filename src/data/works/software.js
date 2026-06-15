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
        zh: 'My Quant Web - 量化监控系统',
        en: 'My Quant Web - Quantitative Monitoring System',
      },
      full: {
        zh: '## 项目简介\n\nMy Quant Web 是一个基于 React 和 Vite 构建的量化监控系统，提供实时数据可视化和策略回测功能。\n\n## 功能\n\n- 实时数据监控\n- 策略回测\n- 多账户管理',
        en: '## Overview\n\nMy Quant Web is a quantitative monitoring system built with React and Vite, providing real-time data visualization and strategy backtesting functionality.\n\n## Features\n\n- Real-time Data Monitoring\n- Strategy Backtesting\n- Multi-account Management',
      },
    },
    tags: ['React', 'Vite', 'JavaScript', '2025'],
    files: [
      {
        name: 'My-Quant-main.zip',
        type: 'zip',
        size: '89 KB',
        url: '/files/software/My-Quant-main.zip',
      },
    ],
    externalLinks: [
      { label: 'GitHub', url: 'https://github.com/Xu-Zihao-cqu/My-Quant', icon: 'github' },
    ],
    featured: true,
    createdAt: '2025-03-20',
  },

  // The Second
  {
    id: 'sw-sample-1',
    category: 'software',
    title: { zh: '示例软件项目', en: 'Sample Software Project' },
    coverImage: '/images/works/sample-software/cover.jpg',
    description: {
      short: {
        zh: 'Space Shooter Game - 太空射击游戏。',
        en: 'Space Shooter Game - A simple space shooting game.',
      },
      full: {
        zh: '## 项目简介\n\n一个基于 React + Vite 的简单太空射击游戏。\n\n## 功能\n\n- 简单的射击游戏逻辑\n- 界面设计\n- 音效',
        en: '## Overview\n\nA simple space shooting game built with React + Vite.\n\n## Features\n\n- Simple shooting game logic\n- UI Design\n- Sound Effects',
      },
    },
    tags: ['React', 'Vite', 'JavaScript', '2025'],
    files: [
      {
        name: 'space-shooter-main.zip',
        type: 'zip',
        size: '83 KB',
        url: '/files/software/space-shooter-main.zip',
      },
    ],
    externalLinks: [
      { label: 'GitHub', url: 'https://github.com/Xu-Zihao-cqu/space-shooter', icon: 'github' },
    ],
    featured: true,
    createdAt: '2025-03-20',
  },
];
