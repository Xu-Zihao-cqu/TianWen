# 天问 — 顶层设计文档

**项目名称：天问 (TianWen)**
**设计版本：v1.0**
**创建日期：2026-06-11**
**对应需求：requirements.md v0.1**

---

## 目录

1. [总体架构概览](#1-总体架构概览)
2. [功能板块划分](#2-功能板块划分)
3. [路由设计](#3-路由设计)
4. [组件树](#4-组件树)
5. [数据架构](#5-数据架构)
6. [技术栈明细](#6-技术栈明细)
7. [设计系统](#7-设计系统)
8. [国际化方案](#8-国际化方案)
9. [主题系统（暗色/亮色）](#9-主题系统暗色亮色)
10. [动效体系](#10-动效体系)
11. [性能策略](#11-性能策略)
12. [SEO 方案](#12-seo-方案)
13. [部署架构](#13-部署架构)
14. [v2+ 扩展预留](#14-v2-扩展预留)
15. [项目目录结构](#15-项目目录结构)

---

## 1. 总体架构概览

```
                              ┌──────────────────────────────────────┐
                              │            Vercel CDN                │
                              │  (自动 CI/CD → GitHub Push 即部署)    │
                              └──────────────┬───────────────────────┘
                                             │
                              ┌──────────────▼───────────────────────┐
                              │         单页应用 (SPA)                │
                              │      React 18 + React Router 6       │
                              └──────────────┬───────────────────────┘
                                             │
              ┌──────────────────────────────┼──────────────────────────────┐
              │                              │                              │
    ┌─────────▼──────────┐     ┌────────────▼───────────┐    ┌─────────────▼──────────┐
    │   表现层 (View)     │     │    逻辑层 (Hooks)       │    │   数据层 (Data)         │
    │                    │     │                        │    │                        │
    │ • Pages (5 页面)   │◄───►│ • useI18n              │◄──►│ • profile.js (个人信息) │
    │ • Components       │     │ • useTheme             │    │ • skills.js (技能数据)  │
    │   ├─ ui/ (原子)    │     │ • useScrollReveal      │    │ • categories.js (板块)  │
    │   ├─ layout/ (布局)│     │ • useTagFilter         │    │ • works/ (作品数据)     │
    │   └─ features/(业务)│    │ • useLocalStorage      │    │ • navigation.js (导航)  │
    └────────────────────┘     └────────────────────────┘    └────────────────────────┘
              │                              │                              │
              └──────────────────────────────┼──────────────────────────────┘
                                             │
                              ┌──────────────▼───────────────────────┐
                              │           基础设施层                   │
                              │                                      │
                              │  • i18next (中英双语)                 │
                              │  • Tailwind CSS (样式 + 暗色模式)     │
                              │  • Framer Motion (动效)               │
                              │  • react-pdf (PDF 预览)               │
                              │  • Prism.js (代码高亮)                │
                              │  • react-helmet-async (SEO)           │
                              │  • Google Analytics (访问统计·国际)   │
                              │  • 百度统计 (访问统计·国内)            │
                              └──────────────────────────────────────┘
```

### 架构原则

| 原则 | 说明 |
|------|------|
| **数据驱动** | 作品内容全部外置为 JS/JSON 数据文件，新增作品零代码改动 |
| **板块可配置** | 四大板块通过 `categories.js` 配置，增删板块仅修改配置 |
| **组件化分层** | UI 原子 → 布局 → 业务特征 → 页面，四层单向依赖 |
| **渐进增强** | 静态展示优先，动效/交互作为增强层，核心内容不依赖 JS 也可访问 |
| **v2 友好** | 数据层与视图层分离，后续接入 API 仅需替换数据读取层 |

---

## 2. 功能板块划分

```
天问 (TianWen)
│
├── 🏠 首页 / 个人介绍 (Home)
│   ├── Hero 区（渐变背景 + 头像 + 打字机轮播标题）
│   ├── 关于我（个人背景介绍）
│   ├── 技能栈（进度条 / 标签云可视化）
│   ├── 精选作品（featured 作品横向展示，最多 4 个）
│   └── 联系方式（邮箱、GitHub、社交链接）
│
├── 🗂️ 作品集主页 (Works Hub)
│   ├── 硬件项目入口卡片 → /works/hardware
│   ├── 软件项目入口卡片 → /works/software
│   ├── 资源分享入口卡片 → /works/resources
│   └── 在校作业入口卡片 → /works/assignments
│
├── 📋 作品列表页 (Works List) × 4
│   ├── 标签筛选栏（多选，按标签过滤）
│   ├── 作品卡片网格
│   │   ├── 封面图 / 预览图
│   │   ├── 作品名称 + 简短描述
│   │   ├── 标签组（技术栈、类别、年份等）
│   │   └── 文件类型标识（源码 / PDF / 链接）
│   └── 空状态提示（暂无作品时显示）
│
├── 📄 作品详情页 (Work Detail) × N
│   ├── 作品标题 + 标签列表
│   ├── 完整描述（Markdown 渲染）
│   ├── 文件列表
│   │   ├── PDF 在线预览（react-pdf）
│   │   ├── 源代码在线查看（Prism.js 高亮）
│   │   └── 文件下载按钮
│   └── 外部链接（GitHub、演示地址等）
│
├── 🧭 全局导航 (Navbar)
│   ├── Logo / 站点名称
│   ├── 各板块快速跳转
│   ├── 中/英语言切换
│   ├── 暗色/亮色模式切换
│   └── （v2 预留：登录入口）
│
└── 📱 响应式适配
    ├── 桌面端（≥1024px）：完整导航 + 多列网格
    ├── 平板端（768-1023px）：折叠导航 + 双列网格
    └── 手机端（<768px）：汉堡菜单 + 单列布局
```

---

## 3. 路由设计

```
URL 结构                          页面组件            说明
──────────────────────────────────────────────────────────────────
/                                 HomePage            首页 · 个人介绍
/works                            WorksPage           作品集主页（板块入口）
/works/:category                  WorksListPage       某板块作品列表（支持标签过滤 ?tags=a,b）
/works/:category/:workId          WorkDetailPage      作品详情
/*                                NotFoundPage        404 页面
```

### 路由参数约定

| 参数 | 可选值 | 说明 |
|------|--------|------|
| `:category` | `hardware` / `software` / `resources` / `assignments` | 板块标识 |
| `:workId` | 作品唯一 ID（slug） | 对应数据文件中的 `id` 字段 |
| `?tags=` | 逗号分隔的标签名 | 可选查询参数，用于标签筛选 |

### 路由过渡

所有路由切换包裹在 Framer Motion `AnimatePresence` 中，实现统一淡入淡出 + 轻微上移动效。

---

## 4. 组件树

```
App
├── HelmetProvider (SEO)
├── I18nextProvider (国际化)
├── ThemeProvider (暗色/亮色)
├── ErrorBoundary (全局错误捕获)
├── BrowserRouter
│   ├── ScrollToTop (路由切换时自动滚回顶部)
│   └── AnimatePresence (路由过渡)
│       └── Suspense (路由懒加载 fallback → LoadingScreen)
│           └── Routes
│               ├── Layout (持久布局壳)
│               │   ├── Navbar
│               │   │   ├── Logo
│               │   │   ├── NavLinks (各板块链接)
│               │   │   ├── ThemeToggle (☀️/🌙)
│               │   │   ├── LanguageSwitch (中/EN)
│               │   │   └── MobileMenu (汉堡菜单)
│               │   ├── <main> (页面内容区)
│               │   │   ├── [HomePage]
│               │   │   │   ├── HeroSection
│               │   │   │   │   ├── Avatar
│               │   │   │   │   ├── Typewriter (轮播短语)
│               │   │   │   │   └── GradientBackground
│               │   │   │   ├── AboutSection
│               │   │   │   ├── SkillsSection
│               │   │   │   │   └── SkillItem[] (ProgressBar / TagCloud)
│               │   │   │   ├── FeaturedWorks (精选作品横滑)
│               │   │   │   │   └── WorkCard[] (compact 变体)
│               │   │   │   └── ContactSection
│               │   │   │
│               │   │   ├── [WorksPage]
│               │   │   │   ├── PageHeader
│               │   │   │   └── CategoryGrid
│               │   │   │       └── CategoryCard[] × 4+
│               │   │   │
│               │   │   ├── [WorksListPage]
│               │   │   │   ├── PageHeader
│               │   │   │   ├── TagFilter
│               │   │   │   │   └── TagChip[] (多选，即时过滤)
│               │   │   │   ├── WorkCardGrid (桌面3列/平板2列/手机1列)
│               │   │   │   │   └── WorkCard[]
│               │   │   │   │       ├── CoverImage (LazyImage)
│               │   │   │   │       ├── FileTypeBadge
│               │   │   │   │       └── TagGroup
│               │   │   │   └── EmptyState (条件渲染)
│               │   │   │
│               │   │   ├── [WorkDetailPage]
│               │   │   │   ├── WorkHeader
│               │   │   │   ├── MarkdownRenderer (完整描述)
│               │   │   │   ├── FilePreview
│               │   │   │   │   ├── PDFViewer (react-pdf)
│               │   │   │   │   └── CodeViewer (Prism.js)
│               │   │   │   ├── FileList
│               │   │   │   │   └── DownloadButton[]
│               │   │   │   └── ExternalLinks
│               │   │   │
│               │   │   └── [NotFoundPage]
│               │   │
│               │   └── Footer
│               │       ├── Copyright
│               │       └── SocialLinks
│
└── Analytics (条件加载，仅生产环境：GoogleAnalytics + BaiduAnalytics)
```

---

## 5. 数据架构

### 5.1 数据文件职责

```
src/data/
├── profile.js        ← 个人基本信息（头像、简介、联系方式）
├── skills.js         ← 技能列表（名称、熟练度、图标）
├── categories.js     ← 板块配置（ID、名称、图标、描述、排序）
├── navigation.js     ← 导航菜单项配置
├── seo.js            ← 全局 SEO 默认值（站点名、描述、OG 图）
└── works/
    ├── index.js      ← 作品总表（合并导出 + 工具函数：getAllWorks / getWorksByCategory / getWorkById / getFeaturedWorks / getAllTags）
    ├── hardware.js   ← 硬件项目作品
    ├── software.js   ← 软件项目作品
    ├── resources.js  ← 资源分享作品
    └── assignments.js← 在校作业作品
```

### 5.2 核心数据结构

#### 个人信息 (profile.js)

```js
export const profile = {
  nickname: { zh: '你的昵称', en: 'Your Nickname' },
  avatar: '/images/avatar.jpg',
  bio: {
    zh: '个人背景介绍的详细中文内容...',
    en: 'Detailed English bio content...',
  },
  heroPhrases: {
    zh: ['硬件爱好者', '开源贡献者', '终身学习者'],
    en: ['Hardware Enthusiast', 'Open Source Contributor', 'Lifelong Learner'],
  },
  contact: {
    email: 'your-email@example.com',
    github: 'https://github.com/yourusername',
    social: [
      { platform: 'qq',      url: 'mailto:your-qq@qq.com', icon: 'mail' },
      { platform: 'bilibili', url: 'https://bilibili.com/...', icon: 'video' },
      // 可按需扩展更多社交链接
    ],
  },
};
```

#### 技能 (skills.js)

```js
export const skills = [
  {
    name: { zh: 'React', en: 'React' },
    level: 85,          // 0-100，用于进度条
    category: 'frontend', // 分类，用于标签云分组
    icon: 'react',       // 对应图标库的 key
  },
  // ...
];
```

#### 板块配置 (categories.js)

```js
export const categories = [
  {
    id: 'hardware',
    name: { zh: '硬件项目', en: 'Hardware Projects' },
    description: { zh: '嵌入式、IoT、电路设计...', en: 'Embedded, IoT, Circuit Design...' },
    icon: 'cpu',
    gradient: 'from-orange-400 to-red-500',  // Tailwind 渐变
    sortOrder: 1,
  },
  {
    id: 'software',
    name: { zh: '软件项目', en: 'Software Projects' },
    description: { zh: 'Web 应用、工具、开源库...', en: 'Web Apps, Tools, Open Source...' },
    icon: 'code-2',
    gradient: 'from-blue-400 to-indigo-500',
    sortOrder: 2,
  },
  {
    id: 'resources',
    name: { zh: '资源分享', en: 'Resources' },
    description: { zh: '教程、笔记、推荐工具...', en: 'Tutorials, Notes, Recommendations...' },
    icon: 'share-2',
    gradient: 'from-green-400 to-teal-500',
    sortOrder: 3,
  },
  {
    id: 'assignments',
    name: { zh: '在校作业', en: 'School Assignments' },
    description: { zh: '课程设计、实验报告...', en: 'Coursework, Lab Reports...' },
    icon: 'book-open',
    gradient: 'from-purple-400 to-pink-500',
    sortOrder: 4,
  },
];
```

#### 导航配置 (navigation.js)

```js
export const navigation = [
  { id: 'home',   label: { zh: '首页', en: 'Home' },             path: '/',              showInNav: true },
  { id: 'works',  label: { zh: '作品集', en: 'Portfolio' },       path: '/works',         showInNav: true },
  // 以下为导航菜单下拉子项（可选实现），或直接从 categories.js 生成
  // 桌面端：顶部固定导航栏水平排列
  // 移动端：汉堡菜单垂直展开
];
// 实际渲染时，板块子链接从 categories.js 动态生成：
// categories.map(c => ({ label: c.name, path: `/works/${c.id}`, icon: c.icon }))
```

#### 作品 (works/hardware.js 示例)

```js
export const hardwareWorks = [
  {
    id: 'smart-plant-monitor',               // URL slug
    category: 'hardware',
    title: { zh: '智能植物监护仪', en: 'Smart Plant Monitor' },
    coverImage: '/images/works/smart-plant-monitor/cover.jpg',
    description: {
      short: {
        zh: '基于 ESP32 的物联网植物监护设备...',
        en: 'IoT plant monitoring device based on ESP32...',
      },
      full: {
        zh: '完整的 Markdown 格式详细描述...',
        en: 'Full detailed description in Markdown...',
      },
    },
    tags: ['ESP32', 'IoT', 'Arduino', '传感器', '2025'],
    files: [
      {
        name: 'source-code.zip',
        type: 'code',              // 'code' | 'pdf' | 'binary' | 'link'
        size: '2.3 MB',
        url: '/files/hardware/smart-plant-monitor/source.zip',
        previewable: false,        // zip 压缩包无法在浏览器内预览，仅支持下载；可预览的 code 类型应为单个源文件（.py/.js/.c 等）
      },
      {
        name: 'schematic.pdf',
        type: 'pdf',
        size: '1.1 MB',
        url: '/files/hardware/smart-plant-monitor/schematic.pdf',
        previewable: true,
      },
    ],
    externalLinks: [
      { label: 'GitHub', url: 'https://github.com/yourusername/smart-plant-monitor', icon: 'github' },
      { label: { zh: '演示视频', en: 'Demo Video' }, url: 'https://bilibili.com/...', icon: 'video' },
    ],
    featured: true,               // 是否精选（可首页展示）
    createdAt: '2025-06-01',
  },
  // ...更多作品
];
```

> **约束**：`id` 必须全局唯一（跨所有板块不重复）。`getWorkById()` 直接按 ID 检索，不区分板块。建议命名规范：`{板块缩写}-{项目slug}`，如 `hw-smart-plant`、`sw-chat-app`。

### 5.3 数据流

```
数据层 (src/data/)                    逻辑层 (hooks)                     视图层 (pages/components)
─────────────────                    ────────────────                   ──────────────────────────
                                    
profile.js ──────────────────────────────────────────────► HomePage
  ├─ nickname, avatar ──────────────────────────────────► HeroSection, AboutSection
  ├─ heroPhrases ───────────────────────────────────────► Typewriter
  ├─ bio ───────────────────────────────────────────────► AboutSection
  └─ contact ───────────────────────────────────────────► ContactSection

skills.js ───────────────────────────────────────────────► SkillsSection
  └─ skills[] ──────────────────────────────────────────► SkillItem (ProgressBar / TagCloud)

categories.js ───────────────────────────────────────────► WorksPage, Navbar
  └─ categories[] ──────► CategoryGrid ──► CategoryCard[]

works/*.js ──────► index.js (汇总) ─── useTagFilter ────► WorksListPage, WorkDetailPage
  ├─ allWorks[] ────────────────────────────────────────► WorkCardGrid
  ├─ tags[] ────────────────────────────────────────────► TagFilter
  └─ singleWork ────────────────────────────────────────► WorkDetailPage
                                                              ├─ FilePreview → PDFViewer / CodeViewer
                                                              └─ ExternalLinks
  
navigation.js ───────────────────────────────────────────► Navbar
```

---

## 6. 技术栈明细

| 层级 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| **构建工具** | Vite | ^5.x | 极速 HMR，零配置支持 React JSX，与 Vercel 无缝集成 |
| **UI 框架** | React | ^18.x | 组件化，生态丰富，v2 动态功能平滑升级 |
| **路由** | React Router | ^6.x | 标准 SPA 路由，支持嵌套路由、URL 参数 |
| **样式方案** | Tailwind CSS | ^3.x | 原子化 CSS，内置暗色模式，渐变工具类丰富 |
| **动效** | Framer Motion | ^11.x | 声明式动画 API，支持布局动画、手势、AnimatePresence |
| **国际化** | react-i18next | ^14.x | React 生态最成熟的 i18n 方案，支持命名空间和懒加载 |
| **图标** | Lucide React | ^0.x | 高质量开源图标库，按需导入，Tree-shaking 友好 |
| **PDF 预览** | react-pdf | ^9.x | 在浏览器中渲染 PDF，支持分页，无需后端 |
| **代码高亮** | Prism.js | ^1.x | 轻量，支持大量语言，可定制主题 |
| **Markdown** | react-markdown | ^9.x | 作品描述支持 Markdown 格式 |
| **SEO** | react-helmet-async | ^2.x | 每个页面独立设置 meta / OG 标签 |
| **分析（国际）** | Google Analytics 4 (`react-ga4`) | - | 国际用户访问统计，环境变量 `VITE_GA_ID` 控制，仅生产环境加载 |
| **分析（国内）** | 百度统计（script 注入，无 npm 包） | - | 国内用户访问统计，环境变量 `VITE_BAIDU_ID` 控制，仅生产环境加载 |

### 不选用 TypeScript 的说明

v1 采用 JavaScript + JSDoc 注释方式，降低初期开发复杂度。若后续需要，Vite + React 迁移到 TypeScript 成本较低（改后缀 + 渐进添加类型）。

---

## 7. 设计系统

### 7.1 色彩体系

```
                       亮色模式                          暗色模式
                   ────────────────                 ────────────────
主渐变 (Primary)    #667eea → #764ba2                 #818cf8 → #a78bfa
                    (深度紫蓝 → 紫罗兰)                 (更亮的紫蓝渐变)
                    
辅渐变 (Accent)     #00d2ff → #3a7bd5                 #38bdf8 → #60a5fa
                    (青蓝 → 宝蓝)                       (亮青 → 蓝)
                    
背景 (Bg)           #ffffff → #f8fafc                 #0f172a → #1e293b
                    (纯白 → 极浅灰)                     (深蓝灰 → 次深)

表面 (Surface)      #ffffff (纯白)                     #1e293b (次深)

文字 (Text)         #1e293b (近黑)                     #f1f5f9 (近白)
                    
次要文字            #64748b (灰)                       #94a3b8 (浅灰)
                    
成功 / 信息 / 警告  标准语义色 (绿/蓝/黄/红)             对应提亮版本
```

### 7.2 字体

| 用途 | 字体 | 加载方式 |
|------|------|----------|
| 中文正文 | Noto Sans SC (思源黑体) | Google Fonts CDN |
| 英文正文 | Inter | Google Fonts CDN |
| 英文标题 | Space Grotesk | Google Fonts CDN |
| 代码 | JetBrains Mono | Google Fonts CDN |

> ⚠️ **国内网络注意**：Google Fonts CDN 在中国大陆可能被墙，导致字体加载失败。v1 建议将 Noto Sans SC（思源黑体）自托管（下载 woff2 子集放入 `public/fonts/`），英文字体保持 CDN 加载并配置 `font-family` 回退到系统字体栈（`system-ui`, `-apple-system`, `Microsoft YaHei` 等），保证国内环境下仍有可读的排版效果。

### 7.3 间距与圆角

- **基础单位**：4px（Tailwind 默认）
- **页面最大宽度**：`max-w-6xl` (1152px)，内容居中
- **卡片圆角**：`rounded-2xl` (16px)
- **按钮圆角**：`rounded-xl` (12px)
- **标签圆角**：`rounded-full`（胶囊形）

### 7.4 阴影

| 层级 | 亮色模式 | 暗色模式 |
|------|----------|----------|
| 卡片默认 | `shadow-md` | `shadow-md shadow-slate-900/30` |
| 卡片悬停 | `shadow-xl shadow-primary/20` | `shadow-xl shadow-primary/30` |
| 导航栏 | `shadow-sm` + 底部渐变分割线 | 同左 + 半透明 |

---

## 8. 国际化方案

### 8.1 架构

```
i18n/
├── index.js            ← i18next 初始化配置
├── detector.js         ← 语言检测逻辑（localStorage → 浏览器偏好 → 默认中文）
└── locales/
    ├── zh.json         ← 中文翻译（UI 文案）
    └── en.json         ← 英文翻译（UI 文案）
```

### 8.2 翻译策略

- **UI 文案**（导航、按钮、提示等）：存储在 `locales/{lang}.json` 中，通过 `useTranslation()` hook 调用
- **内容文案**（作品名、描述等）：直接存储在数据文件的 `{ zh, en }` 对象中，通过自定义 `useI18n()` hook 取值
- **语言切换**：Navbar 中的 `LanguageSwitch` 按钮，点击后调用 `i18n.changeLanguage()`，同步写入 `localStorage`
- **语言检测优先级**：`localStorage` → `navigator.language` → 默认 `'zh'`

### 8.3 自定义 useI18n Hook

```js
// hooks/useI18n.js — 简化双语内容取值的工具 hook
function useI18n() {
  const { i18n } = useTranslation();
  const t = (obj) => {
    if (typeof obj === 'object' && obj !== null && ('zh' in obj || 'en' in obj)) {
      return obj[i18n.language] || obj.zh;
    }
    return obj;
  };
  return { t, locale: i18n.language };
}
```

---

## 9. 主题系统（暗色/亮色）

### 9.1 实现方案

- **Tailwind 策略**：`darkMode: 'class'` — 在 `<html>` 上切换 `.dark` 类
- **状态管理**：自定义 `useTheme` hook + React Context
- **持久化**：`localStorage.setItem('theme', 'dark' | 'light')`
- **初始检测**：`localStorage` → 系统偏好 `prefers-color-scheme` → 默认 `'light'`

### 9.2 切换流程

```
用户点击 ThemeToggle
    → useTheme.toggle()
        → 更新 Context 状态
        → document.documentElement.classList.toggle('dark')
        → localStorage.setItem('theme', newTheme)
        → Tailwind 所有 dark:* 类自动生效
```

---

## 10. 动效体系

### 10.1 动效分类

| 类型 | 实现方式 | 说明 |
|------|----------|------|
| **页面路由过渡** | Framer Motion `AnimatePresence` | 淡入 + 上移 20px，duration 0.3s |
| **滚动入场** | 自定义 `useScrollReveal` hook | Intersection Observer + Framer Motion，元素进入视口时触发 |
| **卡片悬停** | Framer Motion `whileHover` | scale(1.03) + shadow 增强 + 微弱辉光 |
| **打字机效果** | 自定义 `Typewriter` 组件 | 逐字打印 + 闪烁光标 + 轮播多条短语 |
| **标签云浮动** | Framer Motion `animate` | 技能标签微浮动 + 随机延迟 |
| **进度条动画** | Framer Motion `useInView` | 技能进度条从 0 填充到目标值 |
| **渐变流动** | CSS `@keyframes` + `background-position` | Hero 背景渐变缓慢移动 |
| **骨架屏** | 纯 CSS `animate-pulse` | 图片/卡片加载前的占位动画 |

### 10.2 动效约束

- 所有动效尊重 `prefers-reduced-motion` 媒体查询，开启后降级为静态
- `duration` 不超过 0.5s，确保交互流畅
- 滚动入场仅触发一次（`once: true`），避免重复动画干扰
- 移动端减少动效强度（如去掉视差、减少位移量）

---

## 11. 性能策略

| 策略 | 实现 | 目标 |
|------|------|------|
| **代码分割** | React `lazy()` + `Suspense` 按路由拆分 | 首屏 JS < 150KB |
| **图片懒加载** | `LazyImage` 组件 + Intersection Observer | 不可见图片不加载 |
| **字体优化** | Google Fonts `display=swap` + `subset` | 不阻塞渲染 |
| **PDF 懒加载** | `react-pdf` 仅在详情页按需加载 | 不影响首屏 |
| **Prism.js 按需** | 仅引入实际使用的语言包 | 减少 JS 体积 |
| **静态资源** | Vercel CDN 全球分发 + 长效缓存 | 二次访问秒开 |
| **预连接提示** | `<link rel="preconnect">` 提前连接 Google Fonts | 减少 DNS/TLS 延迟 |

---

## 12. SEO 方案

### 12.1 实现

- 使用 `react-helmet-async` 为每个页面设置独立的 `<title>` `<meta>` 和 `<link>` 标签
- 全局默认 SEO 值存储在 `src/data/seo.js`

### 12.2 各页面 SEO 配置

```js
// seo.js
export const defaultSEO = {
  title: '天问 - 个人作品集',
  description: {
    zh: '一个热爱硬件与软件的个人作品展览空间。',
    en: 'A personal portfolio showcasing hardware and software projects.',
  },
  ogImage: '/images/og-image.jpg',
  siteName: '天问 TianWen',
};
```

| 页面 | title 格式 | description |
|------|------------|-------------|
| 首页 | `天问 - 个人作品集` | 默认简介 |
| 作品集主页 | `作品集 | 天问` | 板块概览 |
| 作品列表 | `{板块名} | 天问` | 该板块简介 |
| 作品详情 | `{作品名} | 天问` | 作品简短描述 |

---

## 13. 部署架构

```
开发者本地 (VS Code)
    │  git push
    ▼
GitHub 仓库 (tianwen)
    │  Webhook 触发
    ▼
Vercel
    ├── 自动检测 Vite 项目
    ├── 执行 vite build
    ├── 产出 dist/ 静态文件
    └── 部署到 Vercel CDN 全球边缘节点
    
访问地址: https://tianwen-*.vercel.app
         (v1 使用 Vercel 默认域名，v2+ 可绑定自定义域名)
```

### GitHub 仓库建议

```
主仓库:   yourusername/tianwen          ← 源代码 + 小型资源
文件存储: 直接放在 public/files/ 下       ← 使用 Git LFS 管理大文件

备选:     yourusername/tianwen-files    ← 若单仓库过大，独立文件仓库
          → 通过 Raw URL 引用
```

注意：`public/files/` **不应加入 `.gitignore`**，而应在 `.gitattributes` 中配置 Git LFS 追踪规则（如 `public/files/**/* filter=lfs diff=lfs merge=lfs -text`）。`.gitignore` 会阻止 LFS 追踪文件，两者互斥。仅将 `.env` 等敏感文件加入 `.gitignore`。

---

## 14. v2+ 扩展预留

v1 架构已为以下未来功能预留扩展点：

| 功能 | 预留设计 |
|------|----------|
| **后台管理** | 作品数据已外置为独立文件，仅需将数据层替换为 API 调用即可接入后端 |
| **用户认证** | Navbar 已预留登录按钮位置；AuthContext 接口已定义（空实现） |
| **评论系统** | 详情页组件支持在文件列表下方插入评论模块 |
| **评论附件** | FileList 组件支持扩展为通用附件列表（作品附件 + 评论附件） |
| **新板块** | `categories.js` 配置驱动，新增板块仅需添加配置项 + 对应数据文件 |
| **动态路由** | 路由参数化（`:category`），新增板块自动获得路由 |
| **API 迁移** | `src/data/` 下的导出函数可替换为 `fetch()` 调用，视图层代码无需修改 |

### 预留目录

```
src/
├── contexts/
│   └── AuthContext.jsx     ← 空壳，v2 实现
├── services/
│   ├── analytics.js        ← v1 已实现（GA4 + 百度统计初始化）
│   └── api.js              ← 空壳，v2 实现 API 调用
└── pages/
    └── admin/              ← v2：后台管理页面目录
```

---

## 15. 项目目录结构

```
tianwen/
├── index.html                          # HTML 入口
├── package.json                        # 依赖配置
├── vite.config.js                      # Vite 构建配置
├── tailwind.config.js                  # Tailwind 主题扩展（色板/字体/暗色）
├── postcss.config.js                   # PostCSS 插件配置
├── .gitignore                          # Git 忽略规则
├── .gitattributes                      # Git LFS 规则
│
├── requirements.md                     # 需求文档（上游）
├── TopDesign.md                        # 本文件（顶层设计）
│
├── public/                             # 静态资源（直接复制到构建产物）
│   ├── favicon.svg
│   ├── fonts/                          # 自托管字体（Noto Sans SC woff2 子集，避免 Google Fonts 在大陆被墙）
│   ├── images/
│   │   ├── avatar.jpg                  # 个人头像占位
│   │   ├── og-image.jpg                # 默认 OG 社交分享图
│   │   └── works/                      # 作品封面/预览图（按作品 ID 分目录）
│   │       ├── sample-hardware/
│   │       ├── sample-software/
│   │       ├── sample-resource/
│   │       └── sample-assignment/
│   └── files/                          # 可下载/预览文件（Git LFS 管理）
│       ├── hardware/
│       ├── software/
│       ├── resources/
│       └── assignments/
│
└── src/
    ├── main.jsx                        # 应用入口，挂载 React
    ├── App.jsx                         # 根组件：Provider 嵌套 + 路由配置
    │
    ├── components/                     # 组件目录
    │   ├── ui/                         # 原子 UI 组件
    │   │   ├── Button.jsx
    │   │   ├── Card.jsx
    │   │   ├── Tag.jsx
    │   │   ├── Badge.jsx
    │   │   ├── ProgressBar.jsx
    │   │   ├── Typewriter.jsx
    │   │   ├── LazyImage.jsx
    │   │   ├── SectionTitle.jsx
    │   │   ├── PageHeader.jsx          # 页面标题（标题+副标题+可选面包屑）← ui/ 而非 features/
    │   │   ├── EmptyState.jsx
    │   │   ├── Skeleton.jsx            # 骨架屏
    │   │   ├── ErrorBoundary.jsx       # 错误边界（全局 + 页面级）
    │   │   ├── LoadingScreen.jsx       # 路由懒加载 fallback
    │   │   └── index.js                # 统一导出
    │   │
    │   ├── layout/                     # 布局组件
    │   │   ├── Layout.jsx              # 页面布局壳（Navbar + main + Footer）
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ThemeToggle.jsx
    │   │   ├── LanguageSwitch.jsx
    │   │   ├── MobileMenu.jsx
    │   │   └── ScrollToTop.jsx
    │   │
    │   └── features/                   # 业务特征组件
    │       ├── HeroSection.jsx
    │       ├── AboutSection.jsx
    │       ├── SkillsSection.jsx
    │       ├── ContactSection.jsx
    │       ├── CategoryCard.jsx
    │       ├── CategoryGrid.jsx
    │       ├── WorkCard.jsx
    │       ├── WorkCardGrid.jsx
    │       ├── TagFilter.jsx
    │       ├── FileList.jsx
    │       ├── FilePreview.jsx
    │       ├── PDFViewer.jsx
    │       ├── CodeViewer.jsx
    │       ├── ExternalLinks.jsx
    │       ├── ScrollReveal.jsx        # 滚动入场动画容器
    │       ├── FeaturedWorks.jsx       # 首页精选作品横滑
    │       └── MarkdownRenderer.jsx    # Markdown 渲染组件
    │
    ├── pages/                          # 页面组件（对应路由）
    │   ├── HomePage.jsx
    │   ├── WorksPage.jsx
    │   ├── WorksListPage.jsx
    │   ├── WorkDetailPage.jsx
    │   └── NotFoundPage.jsx
    │
    ├── data/                           # 数据层
    │   ├── profile.js                  # 个人信息（占位）
    │   ├── skills.js                   # 技能数据（占位）
    │   ├── categories.js              # 板块配置
    │   ├── navigation.js              # 导航配置
    │   ├── seo.js                      # SEO 默认值
    │   └── works/
    │       ├── index.js               # 汇总导出 + getAllWorks / getWorksByCategory / getWorkById / getFeaturedWorks / getAllTags
    │       ├── hardware.js            # 示例硬件作品 × 1~2
    │       ├── software.js            # 示例软件作品 × 1~2
    │       ├── resources.js           # 示例资源分享 × 1~2
    │       └── assignments.js         # 示例在校作业 × 1~2
    │
    ├── hooks/                          # 自定义 Hooks
    │   ├── useI18n.js                  # 双语内容取值
    │   ├── useScrollReveal.js          # Intersection Observer 动画
    │   ├── useTagFilter.js             # 标签筛选逻辑
    │   └── useLocalStorage.js          # localStorage 封装
    │                                   # 注：useTheme hook 定义在 contexts/ThemeContext.jsx 内部导出，无独立文件
    │
    ├── i18n/                           # 国际化配置
    │   ├── index.js                    # i18next 初始化
    │   ├── detector.js                 # 语言检测
    │   └── locales/
    │       ├── zh.json                 # UI 文案（中文）
    │       └── en.json                 # UI 文案（英文）
    │
    ├── contexts/                       # React Context（v1 最小化）
    │   ├── ThemeContext.jsx
    │   └── AuthContext.jsx             # v2 预留空壳
    │
    ├── styles/                         # 全局样式
    │   ├── index.css                   # Tailwind 指令 + 全局 CSS 变量
    │   ├── fonts.css                   # 字体定义 @font-face
    │   └── prism-theme.css            # Prism.js 代码高亮主题
    │
    ├── utils/                          # 工具函数
    │   ├── constants.js               # 全局常量
    │   └── helpers.js                  # 通用工具函数
    │
    └── services/                       # 服务层（v1 含 analytics，其余 v2 实现）
        └── analytics.js               # Google Analytics 4 + 百度统计 初始化（占位 ID）
```

---

## 附录 A：待用户提供的内容清单

v1 开发过程中，以下数据使用占位符填充，用户后续自行替换：

| 数据项 | 位置 | 占位形式 |
|--------|------|----------|
| 个人昵称 | `data/profile.js` | `"你的昵称"` |
| 个人头像 | `public/images/avatar.jpg` | 占位 SVG 头像 |
| 个人背景介绍 | `data/profile.js` → `bio` | 简短占位文字 |
| 技能列表 | `data/skills.js` | 示例技能项 × 6 |
| 联系方式 | `data/profile.js` → `contact` | `your-email@example.com` |
| 轮播短语 | `data/profile.js` → `heroPhrases` | 示例短语 × 3 |
| Google Analytics ID | `services/analytics.js` | `G-XXXXXXXXXX` |
| 百度统计 ID | `services/analytics.js` | `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| 真实作品 | `data/works/*.js` | 各板块 1~2 个示例作品 |
| 作品封面图 | `public/images/works/` | Unsplash 占位图 |
| OG 分享图 | `public/images/og-image.jpg` | 占位图 |
| 作品文件 | `public/files/` | 示例 PDF / ZIP 文件 |

---

## 附录 B：开发顺序

具体开发步骤见 [Step.md](Step.md)（13 步逐层推进，每步可独立验证）。

---

*本文档为顶层设计，指导 v1 全部开发工作。随开发推进，如发现设计与实现偏差，需回更新此文档。*
