/**
 * 软件项目作品
 * ID 命名规范：sw-{slug}，全局唯一
 */
export const softwareWorks = [
  {
    id: 'sw-my-quant-web',
    category: 'software',
    title: { zh: 'My Quant Web 量化监控系统', en: 'My Quant Web Dashboard' },
    coverImage: '/images/works/sample-software/cover.jpg',
    description: {
      short: {
        zh: '面向个人量化实验的 React/Vite 看板，聚合实时数据、策略回测和多账户状态，让交易策略运行情况更容易被观察。',
        en: 'A React/Vite dashboard for personal quant experiments, bringing live data, strategy backtesting, and multi-account status into one observable workspace.',
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
    id: 'sw-space-shooter',
    category: 'software',
    title: { zh: 'Space Shooter 太空射击游戏', en: 'Space Shooter Game' },
    coverImage: '/images/works/sample-software/cover.jpg',
    description: {
      short: {
        zh: '基于 React + Vite 的轻量级街机射击游戏，包含移动、射击、碰撞与音效反馈，适合作为前端游戏练习样例。',
        en: 'A lightweight arcade shooter built with React and Vite, covering movement, firing, collisions, and sound feedback as a focused frontend game practice.',
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
