/**
 * 在校作业作品
 * ID 命名规范：as-{slug}，全局唯一
 */
export const assignmentsWorks = [
  {
    id: 'as-algorithm-lab-report',
    category: 'assignments',
    title: { zh: '算法课程设计与实验报告', en: 'Algorithm Coursework Report' },
    coverImage: '/images/works/sample-assignment/cover.jpg',
    description: {
      short: {
        zh: '围绕数据结构与算法设计的课程作业归档，包含实验报告、实现思路和关键知识点总结。',
        en: 'A coursework archive around data structures and algorithm design, including the report, implementation ideas, and key concept notes.',
      },
      full: {
        zh: '## 作业简介\n\n课程设计或实验报告内容。\n\n## 涉及知识点\n\n- 数据结构\n- 算法设计',
        en: '## Overview\n\nCoursework design or lab report.\n\n## Topics\n\n- Data Structures\n- Algorithm Design',
      },
    },
    tags: ['课程设计', '算法', '2024'],
    files: [
      {
        name: 'report.pdf',
        type: 'pdf',
        size: '1.2 MB',
        url: '/files/assignments/report.pdf',
        previewable: true,
      },
    ],
    externalLinks: [],
    featured: false,
    createdAt: '2024-12-10',
  },
];
