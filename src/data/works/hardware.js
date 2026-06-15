/**
 * 硬件项目作品
 * ID 命名规范：hw-{slug}，全局唯一
 */
export const hardwareWorks = [
  {
    id: 'hw-sample-1',
    category: 'hardware',
    title: { zh: '示例硬件项目', en: 'Sample Hardware Project' },
    coverImage: '/images/works/sample-hardware/cover.jpg',
    description: {
      short: {
        zh: '基于FPGA的实时图像信号处理器(ISP)。',
        en: 'A real-time image signal processor (ISP) based on FPGA.',
      },
      full: {
        zh: '## 项目简介\n\n这是一个示例硬件项目。使用 FPGA 微控制器，实现了传感器数据采集与远程监控功能。\n\n## 技术栈\n\n- FPGA\n- Arduino\n- MQTT 协议',
        en: '## Overview\n\nThis is a sample hardware project using FPGA for sensor data collection and remote monitoring.\n\n## Tech Stack\n\n- FPGA\n- Arduino\n- MQTT Protocol',
      },
    },
    tags: ['开发中','FPGA', 'Image Processing', '2026'],
    files: [
      {
        name: 'schematic1.pdf',
        type: 'pdf',
        size: '1.0 MB',
        url: '/files/hardware/sample-schematic1.pdf',
        previewable: true,
      },
      {
        name: 'source-code.zip',
        type: 'binary',
        size: '500 KB',
        url: '/files/hardware/source.zip',
        previewable: false,
      },
    ],
    externalLinks: [
      { label: 'GitHub', url: 'https://github.com/Xu-Zihao-cqu/Veido', icon: 'github' },
    ],
    featured: true,
    createdAt: '2025-01-15',
  },

  // 第二个
  {
    id: 'hw-sample-2',
    category: 'hardware',
    title: { zh: '示例硬件项目', en: 'Sample Hardware Project' },
    coverImage: '/images/works/sample-hardware/cover.jpg',
    description: {
      short: {
        zh: '基于FPGA的实时音频信号处理器(ASP)',
        en: 'A real-time audio signal processor (ASP) based on FPGA.',
      },
      full: {
        zh: '## 项目简介\n\n这是一个示例硬件项目。使用 FPGA 微控制器，实现了传感器数据采集与远程监控功能。\n\n## 技术栈\n\n- FPGA\n- Arduino\n- MQTT 协议',
        en: '## Overview\n\nThis is a sample hardware project using FPGA for sensor data collection and remote monitoring.\n\n## Tech Stack\n\n- FPGA\n- Arduino\n- MQTT Protocol',
      },
    },
    tags: ['开发中','FPGA', 'Audio Processing', '2026'],
    files: [
      {
        name: 'schematic2.pdf',
        type: 'pdf',
        size: '1.0 MB',
        url: '/files/hardware/sample-schematic2.pdf',
        previewable: true,
      },
      {
        name: 'source-code.zip',
        type: 'binary',
        size: '500 KB',
        url: '/files/hardware/source.zip',
        previewable: false,
      },
    ],
    externalLinks: [
      { label: 'GitHub', url: 'https://github.com/yourusername/hw-sample-2', icon: 'github' },
    ],
    featured: true,
    createdAt: '2025-01-15',
  },
];
