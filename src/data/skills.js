/**
 * 技能列表
 * name: { zh, en } — 技能名
 * level: 0-100 — 熟练度
 * category: string — 分类（用于标签云分组）
 * icon: string — 图标 key（可选）
 */
export const skills = [
  { name: { zh: 'JavaScript', en: 'JavaScript' }, level: 80, category: 'frontend', icon: 'code-2' },
  { name: { zh: 'React', en: 'React' }, level: 75, category: 'frontend', icon: 'code-2' },
  { name: { zh: 'Python', en: 'Python' }, level: 70, category: 'backend', icon: 'code-2' },
  { name: { zh: 'C/C++', en: 'C/C++' }, level: 90, category: 'embedded', icon: 'cpu' },
  { name: { zh: '嵌入式开发', en: 'Embedded' }, level: 95, category: 'embedded', icon: 'cpu' },
  { name: { zh: 'Git', en: 'Git' }, level: 75, category: 'tooling', icon: 'code-2' },
];
