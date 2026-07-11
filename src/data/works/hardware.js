/**
 * 硬件项目作品
 * ID 命名规范：hw-{slug}，全局唯一
 */
export const hardwareWorks = [
  // FPGA 实时视觉手势控制器
// FPGA 实时视觉手势控制器
{
  id: 'hw-fpga-vision-gesture-controller',
  category: 'hardware',

  title: {
    zh: 'FPGA 实时视觉手势控制器',
    en: 'FPGA Vision Gesture Controller',
  },

  coverImage: '/images/works/fpga-vision-gesture-controller/cover.jpg',

  description: {
    short: {
      zh: '把 OV5640 视频采集、YCbCr 分割、手指数估计和 7 帧投票完整压进 FPGA，输出 720p HDMI 与稳定手势控制信号。',
      en: 'A pure-RTL FPGA vision pipeline that turns OV5640 video, YCbCr segmentation, finger estimation, and seven-frame voting into stable 720p gesture control.',
    },

    full: {
      zh: `## 项目概览

FPGA Vision Gesture Controller 是一套面向嵌入式人机交互的纯硬件实时视觉控制系统。

系统使用 OV5640 摄像头采集视频，在 FPGA 内完成图像处理、手部检测、手指数识别、拳头抑制和多帧投票，并通过 SDRAM 帧缓存输出 1280 × 720 HDMI 图像及稳定的控制状态。

整个识别链路由 Verilog RTL 实现，不依赖嵌入式 CPU、操作系统或神经网络推理框架，适用于非接触式设备控制、智能照明、人机交互终端和 FPGA 图像处理教学。

## 项目亮点

| 特性 | 实现方式 |
|---|---|
| 实时视频采集 | OV5640 DVP 摄像头输入 |
| 图像分辨率 | 1280 × 720 |
| 视频输出 | HDMI / TMDS |
| 图像缓存 | SDRAM 帧缓存 |
| 手势识别 | YCbCr 肤色分割与多扫描线统计 |
| 输出稳定 | 7 帧滑动投票与时间滞回 |
| 光照适应 | 中心测光与自适应色调映射 |
| 硬件平台 | Intel Cyclone IV E FPGA |

## 系统架构

~~~text
OV5640 Camera
      ↓
DVP Video Capture
      ↓
RGB565 → RGB888 → YCbCr
      ↓
Luminance Analysis and Tone Mapping
      ↓
Skin-Color Segmentation
      ↓
Hand-Region Extraction
      ↓
Multi-Scanline Finger Estimation
      ↓
Fist Suppression
      ↓
Seven-Frame Voting
      ↓
Stable Control Output
      ↓
SDRAM Frame Buffer
      ↓
720p HDMI / TMDS Display
~~~

## 核心算法

### 定点色彩空间转换

摄像头输出的 RGB565 视频流首先扩展为 RGB888，随后通过定点整数运算转换为 YCbCr。

亮度分量 Y 用于曝光统计，Cb 和 Cr 分量用于肤色判定。所有运算均采用定点系数、舍入和饱和处理，以降低 FPGA 资源消耗。

### 自适应亮度处理

系统对画面中心区域进行降采样统计，计算平均亮度、暗像素比例和高亮像素比例。

根据统计结果自动选择：

- 正常模式；
- 低照度增强模式；
- 高光压缩模式。

模式切换使用进入和退出双阈值，并要求连续帧确认，从而减少临界光照下的画面闪烁。

### 肤色分割

手部检测基于亮度约束的 YCbCr 肤色模型：

- Y 亮度范围；
- Cb 色度范围；
- Cr 色度范围；
- Cr 与 Cb 的差值约束。

分割结果还会经过水平方向三点多数滤波，用于去除孤立噪点并填补小范围空洞。

### 手部区域提取

系统不保存完整二值掩膜，而是边接收像素边完成行统计。

通过有效行数量、肤色像素跨度、区域面积和宽高约束提取手部候选区域，并使用手框平滑、快速移动直接跟随和短时漏检保持机制降低手框抖动。

### 多扫描线手指数识别

系统在手部区域内部生成六条水平扫描线：

- 五条扫描线用于统计手指连续段；
- 一条扫描线用于估计掌心肤色密度。

每条扫描线采用游程统计计算连续肤色区域数量，并允许合并较小的黑色间隙。

最终取五条手指扫描线结果中的第二大值作为当前帧的手指数候选，从而降低单条扫描线噪声和掌心粘连对结果的影响。

### 拳头抑制

系统结合以下信息判断拳头：

- 扫描线连续段数量；
- 上部扫描线肤色密度；
- 掌心参考线肤色密度；
- 连续帧确认结果。

强拳头证据可立即清零，阴影造成的碎裂拳头需要连续两帧确认，以兼顾响应速度和识别稳定性。

### 七帧投票

单帧识别结果不会直接驱动控制输出，而是进入七帧滑动窗口。

| 状态变化 | 投票门限 |
|---|---:|
| 首次识别手势 | 4 / 7 |
| 手势切换 | 5 / 7 |
| 普通状态释放 | 5 / 7 |
| 票数相同 | 保持当前状态 |

这种不对称门限设计可以在保持首次响应速度的同时，抑制相邻手势之间的频繁跳变和短时漏检。

## 技术栈

- Verilog HDL
- RTL Design
- Intel Quartus Prime
- Intel Cyclone IV E FPGA
- OV5640 DVP Camera
- SDRAM Frame Buffer
- HDMI / TMDS
- Fixed-Point Image Processing
- Python Reference Tests
- GitHub Actions CI

## 应用方向

- 非接触式设备控制
- 智能照明与档位调节
- 嵌入式人机交互
- FPGA 图像处理教学
- 传统计算机视觉硬件加速
- 低资源实时视觉系统`,

      en: `## Overview

FPGA Vision Gesture Controller is a fully hardware-based real-time vision and gesture-control system implemented in Verilog RTL.

The system captures video from an OV5640 camera and performs color conversion, adaptive luminance analysis, skin-color segmentation, hand-region extraction, finger-count estimation, fist suppression, and seven-frame voting directly inside the FPGA.

Processed 1280 × 720 video is buffered through SDRAM and displayed over HDMI, while the stabilized gesture result is exposed as a digital control output.

## Key Features

| Feature | Implementation |
|---|---|
| Camera input | OV5640 DVP |
| Resolution | 1280 × 720 |
| Video output | HDMI / TMDS |
| Frame buffer | SDRAM |
| Gesture recognition | YCbCr segmentation and multi-scanline analysis |
| Output stabilization | Seven-frame voting and temporal hysteresis |
| Lighting adaptation | Center-weighted metering and tone mapping |
| FPGA platform | Intel Cyclone IV E |

## Processing Pipeline

~~~text
OV5640 Camera
      ↓
DVP Video Capture
      ↓
RGB565 → RGB888 → YCbCr
      ↓
Luminance Analysis and Tone Mapping
      ↓
Skin-Color Segmentation
      ↓
Hand-Region Extraction
      ↓
Multi-Scanline Finger Estimation
      ↓
Fist Suppression
      ↓
Seven-Frame Voting
      ↓
Stable Control Output
      ↓
SDRAM Frame Buffer
      ↓
720p HDMI / TMDS Display
~~~

## Core Algorithms

### Fixed-Point Color Conversion

RGB565 camera data is expanded to RGB888 and converted to YCbCr using fixed-point integer arithmetic, rounding, and saturation.

### Adaptive Luminance Processing

The system measures center-region luminance, dark-pixel ratio, and highlight ratio. It automatically switches between normal, low-light enhancement, and highlight-compression modes.

### Skin-Color Segmentation

A luminance-constrained YCbCr model is used to identify skin pixels. A horizontal three-point majority filter removes isolated noise and fills small gaps.

### Streaming Hand-Region Extraction

The hand region is extracted through row-level statistics without storing a complete binary mask frame. Bounding-box smoothing and short-dropout tolerance reduce visible jitter.

### Multi-Scanline Finger Estimation

Five upper scanlines estimate finger segments, while a sixth scanline provides a palm-density reference. The second-largest scanline count is used as the frame-level gesture candidate.

### Fist Suppression

Segment counts, upper-region density, palm density, and temporal confirmation are combined to distinguish fists from open-hand gestures.

### Seven-Frame Voting

Gesture candidates enter a seven-frame sliding window:

- Initial acquisition: 4 / 7 votes
- Gesture switching: 5 / 7 votes
- Ordinary release: 5 / 7 votes
- Equal votes: keep the current stable state

## Technology Stack

- Verilog HDL
- RTL Design
- Intel Quartus Prime
- Intel Cyclone IV E FPGA
- OV5640 DVP Camera
- SDRAM Frame Buffer
- HDMI / TMDS
- Fixed-Point Image Processing
- Python Reference Tests
- GitHub Actions CI`,
    },
  },

  tags: [
    '已完成',
    'FPGA',
    'Verilog',
    'Computer-Vision',
    '2026',
  ],

  files: [
    {
      name: 'system-block-diagram.pdf',
      type: 'pdf',
      size: '请填写实际大小',
      url: '/files/hardware/fpga-vision-gesture-controller/system-block-diagram.pdf',
      previewable: true,
    },
    {
      name: 'fpga-vision-gesture-controller.zip',
      type: 'binary',
      size: '6.921 MB',
      url: '/files/hardware/fpga-vision-gesture-controller/fpga-vision-gesture-controller.zip',
      previewable: false,
    },
  ],

  externalLinks: [
    {
      label: 'GitHub',
      url: 'https://github.com/Xu-Zihao-cqu/fpga-vision-gesture-controller',
      icon: 'github',
    },
  ],

  featured: true,
  createdAt: '2026-07-11',
},



  {
    id: 'hw-esp8266-wifi-servo',
    category: 'hardware',
    title: { 
      zh: '基于Blynk IoT的WiFi舵机控制器', 
      en: 'WiFi Servo Controller via Blynk IoT' 
    },
    coverImage: '/images/works/wifi-servo/cover.jpg',
    description: {
      short: {
        zh: '用 ESP8266 + Blynk IoT 驱动 SG90 舵机，把手机指令转换成可靠的远程物理开关控制，并记录校园网与工具链避坑方案。',
        en: 'An ESP8266 and Blynk IoT servo controller that turns mobile commands into reliable remote physical switching, with campus-network and toolchain workarounds documented.',
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
  }

  

];
