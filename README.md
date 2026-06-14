# 天问 TianWen

个人作品展览网页 — 展示硬件项目、软件项目、资源分享、在校作业四大类作品。

**技术栈：** React 18 + Vite 5 + Tailwind CSS 3 + Framer Motion 11

## 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
# → 浏览器打开 http://localhost:5173

# 3. 生产构建
npm run build

# 4. 预览生产构建
npm run preview
```

## 当前进度

| 批次 | 步骤 | 状态 |
|------|------|:----:|
| 第一批 | Step 1-3（脚手架 + 路由 + 数据层） | ✅ |
| 第二批 | Step 4-6（主题+i18n + UI组件 + 布局） | ✅ |
| 第三批 | Step 7-10（页面实现） | 🔜 |

### 已实现功能
- 5 页面路由骨架（首页、作品集、列表、详情、404）
- 暗色/亮色主题切换（localStorage 持久化）
- 中/英语言切换（react-i18next）
- 移动端汉堡菜单（Framer Motion 滑入动画）
- 14 个 UI 原子组件（Button, Card, Tag, Badge, ProgressBar, Typewriter 等）
- 四款字体自托管（Inter, Space Grotesk, JetBrains Mono, Noto Sans SC）
- 数据层就位（profile, skills, categories, works）

### 测试路由

| 路径 | 说明 |
|------|------|
| `/` | 首页（占位） |
| `/works` | 作品集主页（占位） |
| `/works/hardware` | 硬件项目列表（占位） |
| `/works/hardware/hw-sample-1` | 作品详情（占位） |
| `/*` | 404 页面 |

## 项目文档

| 文档 | 说明 |
|------|------|
| [docs/requirements.md](docs/requirements.md) | 功能需求文档 |
| [docs/TopDesign.md](docs/TopDesign.md) | 顶层设计文档 |
| [docs/Step.md](docs/Step.md) | 13 步分步实施计划 |
| [dev-logs/](dev-logs/) | 开发日志 |
| [CLAUDE.md](CLAUDE.md) | 项目开发指引 |

## 目录结构

```
src/
├── App.jsx                     # 根组件（Provider 嵌套 + 路由）
├── main.jsx                    # React 入口
├── components/
│   ├── ui/                     # 14 个原子 UI 组件
│   ├── layout/                 # 布局组件（Navbar, Footer, ...）
│   └── features/               # 业务特征组件（待添加）
├── pages/                      # 5 页面（当前为占位）
├── data/                       # 数据层（profile, skills, categories, works/）
├── hooks/                      # useLocalStorage, useI18n
├── i18n/                       # 国际化配置 + 翻译文件
├── contexts/                   # ThemeContext, AuthContext
├── utils/                      # 工具函数
├── styles/                     # 全局样式 + 字体
└── services/                   # 服务层（待添加）
```
