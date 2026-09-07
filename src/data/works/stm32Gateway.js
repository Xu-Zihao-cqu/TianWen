export const stm32Gateway = {
  id: 'hw-stm32-industrial-gateway',
  category: 'hardware',
  title: { zh: 'STM32 工业边缘网关', en: 'STM32 Industrial Edge Gateway' },
  coverImage: '/images/works/stm32-gateway.svg',
  description: {
    short: {
      zh: '让现场设备连接数字世界。以 STM32F407 与 FreeRTOS 为核心，集成 Modbus 采集、网页监控、MQTT 上行、本地自动联动与摄像头运动检测。',
      en: 'Connecting field devices to the digital world. An STM32F407 / FreeRTOS gateway with Modbus, web monitoring, MQTT, local automation and motion detection.',
    },
    full: {
      zh: `## 从现场总线，到浏览器

基于正点原子探索者 V2（STM32F407ZGT6）开发板构建的轻量级工业边缘网关。它把本地 IO、RS485/Modbus 设备、局域网管理页面、远程平台通信和摄像头运动检测整合到一台嵌入式设备中。

## 核心能力

| 模块 | 实现 |
|---|---|
| 现场采集 | RS485 / Modbus RTU、GPIO、光敏 ADC |
| 数据处理 | CRC 校验、测点统一建模、工程公式换算 |
| 网页管理 | 实时监控、测点配置、备份、执行器控制、系统诊断 |
| 网络上行 | TCP、UDP、MQTT，JSON 遥测与远程命令 |
| 自动控制 | 单测点联动、多条件自动化组与优先级判断 |
| 配置持久化 | 外部 Flash，校验与双副本更新 |
| 边缘视觉 | OV5640、LCD 显示、轻量运动检测 |
| 任务组织 | FreeRTOS 采集、数据、控制、网络、存储与视觉模块 |

## 系统链路

~~~text
现场 IO / RS485 Modbus 设备
↓
STM32F407 / FreeRTOS
↓
校验、工程量换算与测点状态管理
↓
本地自动联动与执行器控制
↓
Web 监控 / TCP、UDP、MQTT 平台
↓
控制命令与状态反馈
~~~

## 让设备具备本地决策能力

网关将不同数据来源统一为测点，同时保存工程值、通信状态和更新时间。自动化逻辑在设备本地执行，支持工程值、通信异常与多条件组合判断，减少对上位机持续在线的依赖。

浏览器可直接完成配置与诊断，平台可下发控制、单点查询、全量上报和 RS485 透传命令。板载 LED 与蜂鸣器用于演示本地控制闭环，PC 模拟 Modbus 从站用于验证现场通信。

## 视觉扩展与工程优化

OV5640 提供现场画面，LCD 展示视频及运动区域。显示路径通过 RGB565 行缓冲与可见区刷新减少重复写入；运动检测包含全局亮度补偿、连续帧确认和区域提示。

## 验证边界

截至项目 2026-07-31 的开发日志，最新视觉版本记录了 ARMCC5 编译零错误、零警告，以及 10 项主机回归通过。约 15 FPS 是调度目标，仍需实机帧计数和网络共存验证；真实工业设备接入及长期稳定性不作为已经完成的生产认证。

## 技术栈

STM32F407 · C · FreeRTOS · RS485 · Modbus RTU · Ethernet · MQTT · HTTP · JSON · OV5640 · LCD

适用于工业设备联网原型、实验室教学、独立设备监控与边缘自动化验证。`,
      en: `## From fieldbus to browser

A lightweight industrial edge gateway built on the Explorer V2 STM32F407ZGT6 board. Local IO, RS485 / Modbus devices, browser management, remote telemetry and camera motion detection share one embedded platform.

## Capabilities

- Modbus RTU acquisition, CRC validation and engineering-unit conversion.
- A unified point model for GPIO, ADC and fieldbus devices.
- Embedded web monitoring, configuration backup, control and diagnostics.
- JSON telemetry and commands over TCP, UDP or MQTT.
- Local single-point rules and multi-condition automation groups.
- External Flash configuration with validation and dual-copy updates.
- OV5640 camera, LCD output and lightweight motion detection.
- Modular acquisition, data, control, network, storage and vision tasks under FreeRTOS.

## Engineering details

The LCD path reuses an RGB565 line buffer and refreshes the visible video region to reduce redundant writes. Motion detection includes global brightness compensation, consecutive-frame confirmation and region feedback.

## Validation status

The July 31, 2026 development log records an ARMCC5 build with zero errors and warnings and ten passing host regression checks. Approximately 15 FPS is a scheduling target awaiting board-level frame counts and network coexistence testing. Real industrial integration and long-duration stability are not claimed as production certification.

## Applications

Industrial connectivity prototypes, embedded-systems teaching, standalone device monitoring and local automation experiments.`,
    },
  },
  tags: ['STM32', 'FreeRTOS', 'Modbus', 'MQTT', 'Edge-Vision', '2026'],
  files: [],
  externalLinks: [],
  featured: true,
  createdAt: '2026-07-31',
};
