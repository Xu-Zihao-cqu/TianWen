/**
 * 板块配置
 * 驱动：导航栏链接、作品集主页入口卡片、路由 /works/:category 动态匹配
 * 新增板块：只需在此数组添加一项 + 创建对应的数据文件 src/data/works/{id}.js
 */
export const categories = [
  {
    id: 'hardware',
    name: { zh: '硬件项目', en: 'Hardware' },
    description: { zh: '嵌入式、IoT、电路设计', en: 'Embedded, IoT, Circuits' },
    icon: 'cpu',
    gradient: { from: '#fb923c', to: '#ef4444' },
    sortOrder: 1,
  },
  {
    id: 'software',
    name: { zh: '软件项目', en: 'Software' },
    description: { zh: 'Web 应用、工具、开源库', en: 'Web Apps, Tools, Libraries' },
    icon: 'code-2',
    gradient: { from: '#60a5fa', to: '#6366f1' },
    sortOrder: 2,
  },
  {
    id: 'resources',
    name: { zh: '资源分享', en: 'Resources' },
    description: { zh: '教程、笔记、推荐工具', en: 'Tutorials, Notes, Tools' },
    icon: 'share-2',
    gradient: { from: '#34d399', to: '#06b6d4' },
    sortOrder: 3,
  },
  {
    id: 'assignments',
    name: { zh: '在校作业', en: 'Assignments' },
    description: { zh: '课程设计、实验报告', en: 'Coursework, Lab Reports' },
    icon: 'book-open',
    gradient: { from: '#a78bfa', to: '#ec4899' },
    sortOrder: 4,
  },
  {
    id: 'blog',
    name: { zh: '博客', en: 'Blog' },
    description: { zh: '开发手记、思考与探索', en: 'Engineering notes, ideas & discoveries' },
    icon: 'file-text',
    gradient: { from: '#14b8a6', to: '#0f766e' },
    sortOrder: 5,
  },
];
