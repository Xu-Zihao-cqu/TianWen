# 天问 TianWen

个人作品展览网页，展示硬件项目、软件项目、资源分享、在校作业四大类作品。

**技术栈：** React 18 + Vite 5 + Tailwind CSS 3 + Framer Motion 11  
**仓库：** [github.com/Xu-Zihao-cqu/TianWen](https://github.com/Xu-Zihao-cqu/TianWen)

**日常维护：** 见 [usersheet.md](usersheet.md)

---

## 本地启动

```bash
npm install        # 安装依赖（首次）
npm run dev        # 启动开发服务器 → http://localhost:5173
npm run build      # 生产构建
npm run preview    # 预览生产构建
```

---

## 项目状态

| 批次 | 步骤 | 内容 | 状态 |
|------|:----:|------|:----:|
| 第一批 | 1-3 | 脚手架 + 路由 + 数据层 | ✅ |
| 第二批 | 4-6 | 主题+i18n + UI组件 + 布局 | ✅ |
| 第三批 | 7-10 | 全部页面实现 | ✅ |
| 第四批 | 11-13 | 动效 + SEO/性能 + 部署 | ✅ |

**全部 13 步完成，当前已进入内容维护与视觉精修阶段。**

### 已实现功能

- 首页动态电路网格 Hero + 创作工作台 + 技能控制台 + 精选作品舞台 + 联系 CTA
- 玻璃质感导航栏、移动端滑入菜单、暗色科技感 Footer
- 作品集主页 4 张渐变入口卡片，按 `categories.js` 自动生成
- 作品列表页卡片网格 + 标签多选筛选（URL 同步）+ 空状态
- 作品详情页封面预览 + 项目摘要 + Markdown + 系统架构彩色框图 + 附件下载/预览 + 外部链接
- 暗色/亮色双主题（localStorage 持久化，首次跟随系统）
- 中/英双语切换（react-i18next，localStorage 持久化）
- 移动端汉堡菜单（Framer Motion 滑入 + 背景锁定）
- 滚动入场动画（IntersectionObserver + 尊重减动效偏好）
- 路由切换过渡（AnimatePresence fade+up）
- 路由级代码分割（首屏 JS ~118KB gzip）
- SEO meta + OG 标签（每页面独立）
- GA4 + 百度统计（仅生产环境，环境变量控制）
- 四款字体自托管（Inter, Space Grotesk, JetBrains Mono, Noto Sans SC）
- Vercel 一键部署（push 即自动 CI/CD）

---

## 功能划分

```
/ (首页)
├── Hero       动态电路网格 + 头像光环 + 打字机 + 统计数据 + CTA
├── 创作工作台  关于我 + 创作原则 + 四大板块入口
├── 技能控制台  分类 Tab + 技能卡片 + 动态进度条
├── 精选作品    横向滚动，featured:true 的作品
└── 联系 CTA    邮箱 + GitHub + 社交入口

/works (作品集主页)
├── 硬件项目入口 → /works/hardware
├── 软件项目入口 → /works/software
├── 资源分享入口 → /works/resources
└── 在校作业入口 → /works/assignments

/works/:category (作品列表页)
├── 标签筛选栏   多选 OR 逻辑，URL ?tags= 同步
├── 作品卡片网格 桌面 3 列 / 平板 2 列 / 手机 1 列
└── 空状态       暂无作品提示

/works/:category/:workId (作品详情页)
├── 作品封面预览 + 项目摘要 + 日期/附件/链接信息
├── 技术标签 + GitHub 主行动按钮
├── Markdown 完整描述（表格/代码/图片/链接自定义渲染）
├── 文本流程自动渲染为彩色系统框图
├── PDF/代码在线预览 + 文件下载
└── 外部链接（新窗口）
```

---

## 主文件目录

```
tianwen/
├── docs/                         # 设计规范
│   ├── requirements.md
│   ├── TopDesign.md
│   └── Step.md
├── dev-logs/                     # 开发日志
├── src/
│   ├── App.jsx                   # 根组件 (HelmetProvider + ErrorBoundary + I18n + Theme + Router + lazy + AnimatePresence)
│   ├── main.jsx                  # React 入口
│   ├── components/
│   │   ├── ui/        (14)       # Button, Card, Tag, Badge, ProgressBar, Typewriter, LazyImage...
│   │   ├── layout/    (7)        # Layout, Navbar, Footer, ScrollToTop, ThemeToggle, LanguageSwitch, MobileMenu
│   │   └── features/  (17)       # HeroSection, WorkCard, CategoryCard, MarkdownRenderer, PDFViewer, CodeViewer...
│   ├── pages/          (5)       # HomePage, WorksPage, WorksListPage, WorkDetailPage, NotFoundPage
│   ├── data/           (9)       # profile, skills, categories, navigation, seo, works/*.js
│   ├── hooks/          (4)       # useLocalStorage, useI18n, useTagFilter, useScrollReveal
│   ├── i18n/           (4)       # index, detector, zh.json, en.json
│   ├── contexts/       (2)       # ThemeContext, AuthContext (v2 预留)
│   ├── styles/         (3)       # index.css, fonts.css, prism-theme.css
│   ├── utils/          (3)       # constants, helpers, icons
│   └── services/       (1)       # analytics (GA4 + 百度统计)
├── public/
│   ├── fonts/                    # 11 个自托管 woff2
│   ├── images/works/             # 作品封面图目录
│   └── files/                    # 可下载文件目录
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json                   # SPA 路由重写
```

---

## 如何上传作品

常规情况下只编辑数据文件和 `public/` 静态文件，无需改动任何组件代码。更详细的每日/每次上传流程见 [usersheet.md](usersheet.md)。

### 1. 编辑数据文件

打开 `src/data/works/` 下对应板块的 JS 文件，在数组中添加：

```js
{
  id: 'hw-my-project',                  // 全局唯一 ID，格式：{hw/sw/rs/as}-{slug}
  category: 'hardware',
  title: { zh: '我的项目', en: 'My Project' },
  coverImage: '/images/works/hw-my-project/cover.jpg',
  description: {
    short: { zh: '简短描述...', en: 'Short description...' },
    full: { zh: '## 项目简介\n\nMarkdown 详细描述...', en: '## Overview\n\nMarkdown detail...' },
  },
  tags: ['标签1', '标签2', '2025'],
  files: [
    {
      name: 'schematic.pdf',
      type: 'pdf',                     // 'pdf' | 'code' | 'zip' | 'binary' | 'link'
      size: '1.2 MB',
      url: '/files/hardware/hw-my-project/schematic.pdf',
      previewable: true,               // pdf 和单个代码文件可预览
    },
  ],
  externalLinks: [
    { label: 'GitHub', url: 'https://...', icon: 'github' },
  ],
  featured: true,                      // 出现于首页精选（最多 4 个）
  createdAt: '2025-08-01',
},
```

### 2. 放入静态文件

```
public/
├── images/works/hw-my-project/
│   └── cover.jpg                          # 封面图（推荐 800×500）
└── files/hardware/hw-my-project/
    └── schematic.pdf                       # 可下载/预览文件
```

### 3. 完成

保存刷新 — 新作品自动出现在列表和详情页。

---

## 字段速查

| 字段 | 必填 | 说明 |
|------|:----:|------|
| `id` | ✅ | 全局唯一，`{hw/sw/rs/as}-{slug}` |
| `category` | ✅ | 对应 `categories.js` 的 id |
| `title` | ✅ | `{ zh, en }` 双语对象 |
| `coverImage` | ❌ | 封面图路径 |
| `description.short` | ❌ | 卡片用短描述 |
| `description.full` | ❌ | 详情页 Markdown 描述 |
| `tags` | ❌ | 标签数组，用于筛选 |
| `files` | ❌ | type: `pdf` / `code` / `zip` / `binary` / `link` |
| `externalLinks` | ❌ | icon 需在 `utils/icons.js` 注册 |
| `featured` | ❌ | 首页精选（最多 4 个） |
| `createdAt` | ❌ | 日期，排序用 |

---

## 日常维护建议

1. 每次新增内容前，先确认属于四大板块中的哪一类。
2. 先准备封面图和附件，再编辑对应 `src/data/works/*.js`。
3. 新作品必须保证 `id` 全局唯一，路径和文件名大小写一致。
4. 本地运行 `npm run dev` 检查首页卡片、列表页、详情页和附件链接。
5. 发布前运行 `npm run build` 和 `git diff --check`。
6. 当天做过的内容记录到 `dev-logs/YYYY-MM-DD.md`。
