/**
 * 在校作业作品
 * ID 命名规范：as-{slug}，全局唯一
 */
export const assignmentsWorks = [
  {
    id: 'as-sample-1',
    category: 'assignments',
    title: { zh: '示例课程作业', en: 'Sample Assignment' },
    coverImage: '/images/works/sample-assignment/cover.jpg',
    description: {
      short: {
        zh: '一份课程设计或实验报告。',
        en: 'A coursework design or lab report.',
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
