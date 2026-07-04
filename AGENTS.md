# 天问 (TianWen) — 项目开发指引

## 项目简介

个人作品展览网页，React 18 + Vite + Tailwind CSS。展示硬件项目、软件项目、资源分享、在校作业四大类作品。

## 关键文件路径

### 设计规范文档 (docs/)
| 文件 | 说明 |
|------|------|
| [docs/requirements.md](docs/requirements.md) | 功能需求文档（14 项需求 + 待确认事项） |
| [docs/TopDesign.md](docs/TopDesign.md) | 顶层设计文档（架构、路由、组件树、数据架构、设计系统、动效体系） |
| [docs/Step.md](docs/Step.md) | 13 步分步实施计划（每步可独立验证） |

### 开发日志 (dev-logs/)
- `dev-logs/YYYY-MM-DD.md` — 每天的开发完成事项和待办事项

### 实现计划
- 参见 Codex Plan 文件（本会话内）

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 构建 | Vite | ^5.x |
| UI | React | ^18.x |
| 路由 | React Router | ^6.x |
| 样式 | Tailwind CSS | ^3.x |
| 动效 | Framer Motion | ^11.x |
| 国际化 | react-i18next | ^14.x |
| 图标 | Lucide React | ^0.x |
| PDF | react-pdf | ^9.x |
| 代码高亮 | Prism.js | ^1.x |
| Markdown | react-markdown | ^9.x |
| SEO | react-helmet-async | ^2.x |
| 分析 | react-ga4 + 百度统计 | - |

## 工作原则

1. **逐步推进**：严格按 docs/Step.md 顺序开发，每步完成后验证通过再进下一步
2. **稳定优先**：不做大跨步，每步只做 3~8 个文件，确保每步可独立验证
3. **先问后改**：有大的改动或不确定的地方，先确认再动手；小问题可自行修正
4. **每天记录**：在 dev-logs/ 下创建当天日志，列出完成事项和待办
5. **保持文档同步**：如实现与设计有偏差，及时回更新 docs/ 下的设计文档

## 关键设计约定

- **图标映射**：所有 icon 字段存字符串，渲染时通过 `src/utils/icons.js` 的 iconMap 查找组件
- **动态渐变色**：categories 的 gradient 使用内联 style，不用 Tailwind 动态类名
- **useI18n hook**：自定义 `t(obj)` 自动解 `{ zh, en }` 对象
- **作品 ID 命名**：`{板块缩写}-{slug}`，全局唯一
- **字体自托管**：四款字体 woff2 文件放在 `public/fonts/`，通过 `src/styles/fonts.css` 引入
- **板块可配置**：`src/data/categories.js` 驱动导航和路由
- **数据驱动**：作品数据外置为 JS 文件，新增作品零代码改动

## 开发命令

```bash
npm run dev      # 启动开发服务器 (localhost:5173)
npm run build    # 生产构建
npm run preview  # 预览生产构建
```

## 目录结构速查

```
src/
├── components/
│   ├── ui/          # 原子 UI 组件 (Button, Card, Tag, ...)
│   ├── layout/      # 布局组件 (Navbar, Footer, Layout, ...)
│   └── features/    # 业务特征组件 (HeroSection, WorkCard, ...)
├── pages/           # 页面组件 (对应路由)
├── data/            # 数据层 (profile, skills, categories, works/)
├── hooks/           # 自定义 Hooks
├── i18n/            # 国际化配置 + 翻译文件
├── contexts/        # React Context (Theme, Auth)
├── styles/          # 全局样式 (Tailwind, fonts, prism)
├── utils/           # 工具函数 (constants, helpers, icons)
└── services/        # 服务层 (analytics, api)
```
