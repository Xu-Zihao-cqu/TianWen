/**
 * 导航配置
 * 主菜单项 + 板块子链接从 categories.js 动态生成
 */
export const mainNav = [
  { id: 'home',  label: { zh: '首页', en: 'Home' },    path: '/',      showInNav: true },
  { id: 'works', label: { zh: '作品集', en: 'Works' },  path: '/works', showInNav: true },
];

/**
 * 由 categories 派生板块子链接
 */
export function getCategoryLinks(categories) {
  return categories
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({
      id: c.id,
      label: c.name,
      path: `/works/${c.id}`,
      icon: c.icon,
    }));
}
