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
        zh: '一个基于 ESP32 的物联网项目示例。',
        en: 'An example IoT project based on ESP32.',
      },
      full: {
        zh: '## 项目简介\n\n这是一个示例硬件项目。使用 ESP32 微控制器，实现了传感器数据采集与远程监控功能。\n\n## 技术栈\n\n- ESP32\n- Arduino\n- MQTT 协议',
        en: '## Overview\n\nThis is a sample hardware project using ESP32 for sensor data collection and remote monitoring.\n\n## Tech Stack\n\n- ESP32\n- Arduino\n- MQTT Protocol',
      },
    },
    tags: ['ESP32', 'IoT', 'Arduino', '2025'],
    files: [
      {
        name: 'schematic.pdf',
        type: 'pdf',
        size: '1.0 MB',
        url: '/files/hardware/sample-schematic.pdf',
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
      { label: 'GitHub', url: 'https://github.com/yourusername/hw-sample-1', icon: 'github' },
    ],
    featured: true,
    createdAt: '2025-01-15',
  },
];
