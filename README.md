# 天问 TianWen

个人作品展览网页，展示硬件项目、软件项目、资源分享、在校作业四大类作品。

**技术栈：** React 18 + Vite 5 + Tailwind CSS 3 + Framer Motion 11  
**设计风格：** 紫蓝渐变主色调 · 暗色/亮色双主题 · 中英双语 · 响应式布局

---

## 本地启动

```bash
# 1. 安装依赖（首次）
npm install

# 2. 启动开发服务器
npm run dev
# → 浏览器打开 http://localhost:5173

# 3. 生产构建
npm run build

# 4. 预览生产构建
npm run preview
```

---

## 项目状态

| 批次 | 步骤 | 内容 | 状态 |
|------|:----:|------|:----:|
| 第一批 | 1-3 | 脚手架 + 路由 + 数据层 | ✅ |
| 第二批 | 4-6 | 主题+i18n + UI组件 + 布局 | ✅ |
| 第三批 | 7-10 | 全部页面实现 | ✅ |
| 第四批 | 11-13 | 动效集成 + SEO/性能 + 部署 | 🔜 |

### 已实现功能

- **首页 `/`** — Hero 渐变背景 + 打字机轮播 + 关于我 + 技能栈（Tab 分类 + 进度条）+ 精选作品横滑 + 联系方式
- **作品集主页 `/works`** — 4 张渐变动画入口卡片（硬件/软件/资源/作业），悬停放大
- **作品列表页 `/works/:category`** — 卡片网格 + 标签多选筛选（URL ?tags= 同步）+ 空状态提示
- **作品详情页 `/works/:category/:workId`** — Markdown 渲染 + PDF 在线预览 + 代码语法高亮 + 文件下载
- **404 页面** — 渐变标题 + 返回首页
- 暗色/亮色主题切换（localStorage 持久化，首次跟随系统偏好）
- 中/英语言切换（react-i18next，localStorage 持久化）
- 移动端汉堡菜单（Framer Motion 滑入动画）
- 四款字体自托管（Inter, Space Grotesk, JetBrains Mono, Noto Sans SC）

---

## 功能划分

```
天问 TianWen
│
├── 🏠 首页（/）
│   ├── Hero 区 — 渐变背景 + 头像 + 打字机轮播短语 + 下滚箭头
│   ├── 关于我 — 左右两栏（文字 + 装饰）
│   ├── 技能栈 — 分类 Tab 切换 + 进度条动画
│   ├── 精选作品 — 横向滚动（featured: true 的作品）
│   └── 联系方式 — 邮箱 + GitHub + 社交卡片
│
├── 🗂️ 作品集主页（/works）
│   ├── 硬件项目入口 → /works/hardware
│   ├── 软件项目入口 → /works/software
│   ├── 资源分享入口 → /works/resources
│   └── 在校作业入口 → /works/assignments
│
├── 📋 作品列表（/works/:category）
│   ├── 标签筛选栏（多选 OR 逻辑，URL 同步）
│   ├── 作品卡片网格（桌面 3 列 / 平板 2 列 / 手机 1 列）
│   └── 空状态提示
│
└── 📄 作品详情（/works/:category/:workId）
    ├── 作品标题 + 彩色标签
    ├── Markdown 完整描述
    ├── PDF 在线预览（分页导航）
    ├── 代码语法高亮（Prism.js + 复制按钮）
    ├── 文件下载
    └── 外部链接（GitHub 等）
```

---

## 主文件目录

```
tianwen/
├── docs/                           # 设计规范文档
│   ├── requirements.md             #   功能需求
│   ├── TopDesign.md                #   顶层设计（架构/组件树/数据/设计系统）
│   └── Step.md                     #   13 步分步实施计划
│
├── dev-logs/                       # 开发日志
│   └── YYYY-MM-DD.md               #   每日完成事项与待办
│
├── public/                         # 静态资源（直接复制到 dist/）
│   ├── favicon.svg                 #   渐变"天"字图标
│   ├── fonts/                      #   自托管字体（11 个 woff2 文件）
│   ├── images/
│   │   ├── avatar.jpg              #   个人头像（待替换）
│   │   ├── og-image.jpg            #   OG 社交分享图（待替换）
│   │   └── works/                  #   作品封面图（按作品 ID 分目录）
│   └── files/                      #   可下载/预览文件（按板块分目录）
│       ├── hardware/
│       ├── software/
│       ├── resources/
│       └── assignments/
│
├── src/
│   ├── App.jsx                     # 根组件（Provider 嵌套 + 路由配置）
│   ├── main.jsx                    # React 应用入口
│   │
│   ├── components/
│   │   ├── ui/                     # 原子 UI 组件（14 个）
│   │   │   ├── Button.jsx          #   渐变按钮（primary/outline/ghost × sm/md/lg）
│   │   │   ├── Card.jsx            #   卡片容器（rounded-2xl + hover 效果）
│   │   │   ├── Tag.jsx             #   胶囊标签（支持 active + onClick）
│   │   │   ├── Badge.jsx           #   文件类型徽标（code/pdf/link/binary）
│   │   │   ├── ProgressBar.jsx     #   技能进度条（0-100）
│   │   │   ├── SectionTitle.jsx    #   分区标题（左侧色条 + 副标题）
│   │   │   ├── PageHeader.jsx      #   页面标题（标题 + 副标题 + 面包屑）
│   │   │   ├── Typewriter.jsx      #   打字机效果（逐字打印/删除/轮播）
│   │   │   ├── LazyImage.jsx       #   图片懒加载（IntersectionObserver）
│   │   │   ├── Skeleton.jsx        #   骨架屏占位
│   │   │   ├── EmptyState.jsx      #   空状态提示
│   │   │   ├── LoadingScreen.jsx   #   全屏加载 Spinner
│   │   │   ├── ErrorBoundary.jsx   #   错误边界（class 组件）
│   │   │   └── index.js            #   统一导出桶文件
│   │   │
│   │   ├── layout/                 # 布局组件（7 个）
│   │   │   ├── Layout.jsx          #   页面外壳（Navbar + main + Footer）
│   │   │   ├── Navbar.jsx          #   固定导航栏（Logo + 链接 + 主题/语言切换）
│   │   │   ├── Footer.jsx          #   页脚（版权 + GitHub + 回到顶部）
│   │   │   ├── ScrollToTop.jsx     #   路由切换自动滚回顶部
│   │   │   ├── ThemeToggle.jsx     #   亮/暗切换按钮
│   │   │   ├── LanguageSwitch.jsx  #   中/EN 切换按钮
│   │   │   └── MobileMenu.jsx      #   移动端汉堡菜单（Framer Motion 滑入）
│   │   │
│   │   └── features/               # 业务特征组件（16 个）
│   │       ├── HeroSection.jsx     #   首页 Hero 区
│   │       ├── AboutSection.jsx    #   关于我
│   │       ├── SkillsSection.jsx   #   技能栈
│   │       ├── FeaturedWorks.jsx   #   精选作品横滑
│   │       ├── ContactSection.jsx  #   联系方式
│   │       ├── WorkCard.jsx        #   作品卡片（标准 + 精简模式）
│   │       ├── WorkCardGrid.jsx    #   作品卡片网格
│   │       ├── TagFilter.jsx       #   标签筛选栏
│   │       ├── CategoryCard.jsx    #   板块入口渐变卡片
│   │       ├── CategoryGrid.jsx    #   板块入口网格
│   │       ├── MarkdownRenderer.jsx#   Markdown 渲染
│   │       ├── PDFViewer.jsx       #   PDF 在线预览
│   │       ├── CodeViewer.jsx      #   代码语法高亮
│   │       ├── FilePreview.jsx     #   文件预览调度
│   │       ├── FileList.jsx        #   文件列表（预览 + 下载）
│   │       └── ExternalLinks.jsx   #   外部链接列表
│   │
│   ├── pages/                      # 页面组件（5 个，对应路由）
│   │   ├── HomePage.jsx            #   /
│   │   ├── WorksPage.jsx           #   /works
│   │   ├── WorksListPage.jsx       #   /works/:category
│   │   ├── WorkDetailPage.jsx      #   /works/:category/:workId
│   │   └── NotFoundPage.jsx        #   /* (404)
│   │
│   ├── data/                       # 数据层
│   │   ├── profile.js              #   个人信息（昵称/头像/bio/联系方式）
│   │   ├── skills.js               #   技能列表（名称/熟练度/分类）
│   │   ├── categories.js           #   板块配置（ID/名称/图标/渐变色/排序）
│   │   ├── navigation.js           #   导航配置
│   │   ├── seo.js                  #   全局 SEO 默认值
│   │   └── works/                  #   作品数据（新增作品只需编辑这里）
│   │       ├── index.js            #     汇总 + getAllWorks/getWorkById 等工具函数
│   │       ├── hardware.js         #     硬件项目作品
│   │       ├── software.js         #     软件项目作品
│   │       ├── resources.js        #     资源分享作品
│   │       └── assignments.js      #     在校作业作品
│   │
│   ├── hooks/                      # 自定义 Hook
│   │   ├── useLocalStorage.js      #   localStorage 封装
│   │   ├── useI18n.js              #   双语内容取值（t + locale）
│   │   └── useTagFilter.js         #   标签筛选逻辑
│   │
│   ├── i18n/                       # 国际化
│   │   ├── index.js                #   i18next 初始化
│   │   ├── detector.js             #   语言检测（localStorage → 浏览器 → 默认 zh）
│   │   └── locales/
│   │       ├── zh.json             #     中文 UI 文案
│   │       └── en.json             #     英文 UI 文案
│   │
│   ├── contexts/                   # React Context
│   │   ├── ThemeContext.jsx        #   主题管理（亮/暗切换 + 持久化）
│   │   └── AuthContext.jsx         #   v2 预留（用户认证空壳）
│   │
│   ├── styles/                     # 全局样式
│   │   ├── index.css               #   Tailwind 指令 + CSS 变量（亮/暗色板）
│   │   ├── fonts.css               #   字体 @font-face（4 款自托管）
│   │   └── prism-theme.css         #   Prism.js 代码高亮主题
│   │
│   ├── utils/                      # 工具函数
│   │   ├── constants.js            #   全局常量（站点名/GA ID 占位等）
│   │   ├── helpers.js              #   cn() 类名合并
│   │   └── icons.js                #   Lucide 图标映射表 + getIcon()
│   │
│   └── services/                   # 服务层（v2 实现）
│
├── CLAUDE.md                       # 项目开发指引（给 Claude Code 使用）
├── package.json                    # 依赖配置
├── vite.config.js                  # Vite 配置（@/ 别名 + React 插件）
├── tailwind.config.js              # Tailwind 主题扩展（色板/字体/darkMode）
├── postcss.config.js               # PostCSS 配置
├── vercel.json                     # Vercel SPA 路由重写
├── .gitignore                      # Git 忽略规则
└── index.html                      # HTML 入口
```

---

## 如何上传作品

只需编辑数据文件，无需改动任何组件代码。以下以新增一个硬件作品为例：

### 1. 编辑作品数据文件

打开 `src/data/works/hardware.js`，在数组中添加新对象：

```js
{
  id: 'hw-esp32-weather',                  // 唯一 ID，格式：hw-{slug}
  category: 'hardware',
  title: { zh: 'ESP32 气象站', en: 'ESP32 Weather Station' },
  coverImage: '/images/works/hw-esp32-weather/cover.jpg',
  description: {
    short: {
      zh: '基于 ESP32 的物联网气象监测设备。',
      en: 'IoT weather monitoring device based on ESP32.',
    },
    full: {
      zh: '## 项目简介\n\n详细的 Markdown 描述...\n\n## 技术栈\n\n- ESP32\n- BME280 传感器\n- MQTT',
      en: '## Overview\n\nDetailed Markdown description...\n\n## Tech Stack\n\n- ESP32\n- BME280 Sensor\n- MQTT',
    },
  },
  tags: ['ESP32', 'IoT', '传感器', 'MQTT', '2025'],       // 多标签
  files: [
    {
      name: 'schematic.pdf',
      type: 'pdf',                        // 'pdf' | 'code' | 'binary'
      size: '1.2 MB',
      url: '/files/hardware/hw-esp32-weather/schematic.pdf',
      previewable: true,                   // PDF 和单文件代码可在线预览
    },
    {
      name: 'firmware.zip',
      type: 'binary',                     // ZIP 等压缩包不能预览
      size: '340 KB',
      url: '/files/hardware/hw-esp32-weather/firmware.zip',
      previewable: false,
    },
  ],
  externalLinks: [
    { label: 'GitHub', url: 'https://github.com/yourusername/esp32-weather', icon: 'github' },
  ],
  featured: true,                          // true = 出现在首页精选
  createdAt: '2025-08-01',                // 排序用，新作品在前
},
```

### 2. 放入静态资源

```
public/
├── images/works/hw-esp32-weather/
│   └── cover.jpg                           # 封面图（推荐 800×500）
└── files/hardware/hw-esp32-weather/
    ├── schematic.pdf                        # PDF 文件
    └── firmware.zip                         # 下载文件
```

### 3. 完成

保存文件，刷新浏览器 — 新作品自动出现在列表页和详情页，无需其他操作。

### 字段说明

| 字段 | 必填 | 说明 |
|------|:----:|------|
| `id` | ✅ | 全局唯一，建议格式 `{hw/sw/rs/as}-{slug}` |
| `category` | ✅ | 对应 `categories.js` 中的 id |
| `title` | ✅ | `{ zh, en }` 双语对象 |
| `coverImage` | ❌ | 封面图路径，不提供则显示灰色占位 |
| `description.short` | ❌ | 短描述，卡片用 |
| `description.full` | ❌ | 完整描述，支持 Markdown |
| `tags` | ❌ | 标签数组，用于筛选 |
| `files` | ❌ | 文件数组，type 支持 `pdf`/`code`/`binary` |
| `externalLinks` | ❌ | 外部链接，icon 需在 `utils/icons.js` 中注册 |
| `featured` | ❌ | 是否首页精选（最多展示 4 个） |
| `createdAt` | ❌ | 日期字符串，用于排序 |

---

## 项目文档

| 文档 | 说明 |
|------|------|
| [docs/requirements.md](docs/requirements.md) | 功能需求文档 |
| [docs/TopDesign.md](docs/TopDesign.md) | 顶层设计文档 |
| [docs/Step.md](docs/Step.md) | 13 步分步实施计划 |
| [dev-logs/](dev-logs/) | 开发日志 |
| [CLAUDE.md](CLAUDE.md) | 项目开发指引 |
