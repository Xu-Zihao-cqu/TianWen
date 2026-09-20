/**
 * 在校作业作品
 * ID 命名规范：as-{slug}，全局唯一
 */
export const assignmentsWorks = [
  {
    id: 'as-intelligent-car',
    category: 'assignments',
    title: { zh: '多模式智能小车', en: 'Multi-Mode Intelligent Car' },
    coverImage: '/images/works/intelligent-car.svg',
    description: {
      short: {
        zh: '基于 STM32F103C8T6 的课程设计，集循迹、超声波避障和蓝牙遥控于一体，通过按键切换运行模式。',
        en: 'An STM32F103C8T6 coursework project combining line tracking, ultrasonic obstacle avoidance, and Bluetooth control with button-selectable modes.',
      },
      full: {
        zh: `## 项目概览

这是一辆基于 **STM32F103C8T6** 的多模式智能小车。项目采用 STM32 HAL 库开发，将循迹、超声波避障和蓝牙遥控整合到同一套固件中，并通过用户按键切换运行模式。

## 核心功能

| 模块 | 器件 / 实现 | 作用 |
|---|---|---|
| 主控制器 | STM32F103C8T6 | 读取传感器、判断模式并输出电机控制信号 |
| 循迹 | ITR9909 红外传感器 | 检测地面轨迹，修正小车行驶方向 |
| 避障 | HC-SR04 超声波模块 | 测量前方距离并执行避障动作 |
| 无线控制 | JDY-31 蓝牙模块 | 接收手机或上位机发送的遥控指令 |
| 运动执行 | 四路电机 PWM 驱动 | 驱动四轮完成前进、后退、差速转向与停止 |
| 模式切换 | 用户按键 | 在循迹、避障和蓝牙模式间切换 |

## 控制流程

~~~text
上电初始化
↓
读取用户按键与当前模式
↓
循迹传感器 / 超声波测距 / 蓝牙指令
↓
STM32 状态判断与运动决策
↓
四轮电机差速控制
↓
前进、转向、避障或停止
~~~

## 工程结构

源码按外设划分为 BLUETOOTH、HCSR04、KEY、LED、MOTOR 和 TRACK 等 BSP 模块，附带 Keil MDK 工程、STM32F1 HAL 驱动、编译输出以及可直接烧录的 Mydreamcar.hex。

## 技术栈

- STM32F103C8T6
- C / STM32 HAL
- Keil MDK-ARM
- ITR9909 红外循迹
- HC-SR04 超声波测距
- JDY-31 蓝牙串口通信
- PWM / GPIO 电机控制

项目附件提供完整工程压缩包，可用于查看源码、重新编译或烧录验证。`,
        en: `## Overview

This is a multi-mode intelligent car built around the **STM32F103C8T6**. Developed with the STM32 HAL library, the firmware integrates line tracking, ultrasonic obstacle avoidance, and Bluetooth remote control. A user button switches between operating modes.

## Core Features

| Module | Device / Implementation | Purpose |
|---|---|---|
| Controller | STM32F103C8T6 | Reads sensors, selects behavior, and drives the motors |
| Line tracking | ITR9909 infrared sensors | Detects the track and corrects direction |
| Obstacle avoidance | HC-SR04 ultrasonic module | Measures distance and triggers avoidance maneuvers |
| Wireless control | JDY-31 Bluetooth module | Receives commands from a phone or host application |
| Motion | Four-channel PWM motor drive | Drives four wheels forward, backward, through differential turns, and to a stop |
| Mode selection | User button | Switches among tracking, avoidance, and Bluetooth modes |

## Control Flow

~~~text
Power-on initialization
↓
Read button and active mode
↓
Line sensors / ultrasonic distance / Bluetooth command
↓
STM32 state evaluation and motion decision
↓
Four-wheel differential motor control
↓
Move, steer, avoid, or stop
~~~

## Project Structure

The source is organized into BSP modules for BLUETOOTH, HCSR04, KEY, LED, MOTOR, and TRACK. The download includes the Keil MDK project, STM32F1 HAL drivers, build output, and a ready-to-flash Mydreamcar.hex image.

## Technology

- STM32F103C8T6
- C / STM32 HAL
- Keil MDK-ARM
- ITR9909 infrared tracking
- HC-SR04 ultrasonic ranging
- JDY-31 Bluetooth serial communication
- PWM / GPIO motor control`,
      },
    },
    tags: ['课程设计', 'STM32', '循迹', '超声波避障', '蓝牙', '2026'],
    files: [
      {
        name: 'inte_car.rar',
        type: 'binary',
        size: '857 KB',
        url: '/files/assignments/inte_car/inte-car.rar',
        previewable: false,
      },
    ],
    externalLinks: [],
    featured: false,
    createdAt: '2026-09-19',
  },
];
