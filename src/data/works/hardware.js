/**
 * 硬件项目作品
 * ID 命名规范：hw-{slug}，全局唯一
 */
export const hardwareWorks = [
  {
    id: 'esp8266-wifi-servo',
    category: 'hardware',
    title: { 
      zh: '基于Blynk IoT的WiFi舵机控制器', 
      en: 'WiFi Servo Controller via Blynk IoT' 
    },
    coverImage: '/images/works/wifi-servo/cover.jpg',
    description: {
      short: {
        zh: '基于ESP8266与新版Blynk IoT平台的智能开关/舵机控制器，支持手机App远程无感控制。',
        en: 'An IoT smart switch and servo controller based on ESP8266 and the new Blynk IoT platform, supporting remote mobile control.',
      },
      full: {
        zh: '## 项目简介\n\n本项目基于 WeMos D1 Mini (ESP8266) 与新版 Blynk IoT 平台开发，实现了通过手机 App 远程控制 SG90 舵机进行物理按压或开关的功能。项目针对高校校园网环境提出了移动热点中继方案，并完美解决了旧版 Blynk 代码失效及 Arduino IDE 工具链编译路径冲突等常见硬件开发痛点。\n\n## 技术栈\n\n- ESP8266 (WeMos D1 Mini)\n- Blynk IoT (Blynk 2.0)\n- C++ / Arduino IDE\n- PWM 信号控制',
        en: '## Overview\n\nThis IoT project features a remote-controlled servo mechanism powered by a WeMos D1 Mini (ESP8266) and the updated Blynk IoT platform. It allows users to control an SG90 servo motor for physical switching tasks via a mobile app. The project documents cross-platform configuration pipelines and offers practical workarounds for common hardware pain points, including campus Wi-Fi authentication issues and Arduino IDE toolchain compilation path errors.\n\n## Tech Stack\n\n- ESP8266 (WeMos D1 Mini)\n- Blynk IoT (Blynk 2.0)\n- C++ / Arduino IDE\n- PWM Signal Control',
      },
    },
    tags: ['已完成', 'IoT', 'ESP8266', 'Hardware-Design', '2026'],
    files: [
      {
        name: 'wiring-diagram.pdf',
        type: 'pdf',
        size: '450 KB',
        url: '/files/hardware/wifi-servo/wiring-diagram.pdf',
        previewable: true,
      },
      {
        name: 'firmware-source.zip',
        type: 'binary',
        size: '12 KB',
        url: '/files/hardware/wifi-servo/source.zip',
        previewable: false,
      },
    ],
    externalLinks: [
      { label: 'GitHub', url: 'https://github.com/Xu-Zihao-cqu/Veido', icon: 'github' },
    ],
    featured: true,
    createdAt: '2026-07-04',
  },
  
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
    tags: ['开发中','FPGA', 'Audio Processing', '2025'],
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
