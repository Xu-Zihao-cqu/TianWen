# 天问 — 分步模块划分 (Step.md)

**项目名称：天问 (TianWen)**
**设计版本：v1.0**
**创建日期：2026-06-11**
**上游文档：TopDesign.md → requirements.md**

---

## 划分原则

1. **依赖优先**：被依赖的模块先做，用它的模块后做
2. **每步可验证**：每一步完成后都可在浏览器中看到效果，不攒到最后
3. **逐层推进**：脚手架 → 骨架 → 数据 → 基础设施 → 原子 → 布局 → 页面 → 动效 → 优化 → 部署
4. **承接性强**：上一步的产出是下一步的直接输入，不存在跳跃依赖
5. **单一步骤粒度适中**：每步 3~8 个文件，约 0.5~1.5 小时工作量

---

## 依赖拓扑图

```
Step 1  脚手架          (无依赖)
   ↓
Step 2  路由骨架+布局壳  (依赖 Step 1)
   ↓
Step 3  数据层           (依赖 Step 1，物理上不依赖 Step 2，但 Step 2 先做可验证路由)
   ↓
Step 4  主题+i18n 基础   (依赖 Step 1 的 Tailwind 配置)
   ↓
Step 5  UI 原子组件      (依赖 Step 4 的 useI18n)
   ↓
Step 6  布局完善         (依赖 Step 2 骨架 + Step 4 主题/i18n + Step 5 原子组件)
   ↓
Step 7  首页             (依赖 Step 3 数据 + Step 5 原子 + Step 6 布局)
   ↓
Step 8  作品集主页       (依赖 Step 3 数据 + Step 5 原子 + Step 6 布局)
   ↓
Step 9  作品列表页       (依赖 Step 3 数据 + Step 5 原子 + Step 7 WorkCard)
   ↓
Step 10 作品详情页       (依赖 Step 3 数据 + Step 5 原子)
   ↓
Step 11 动效集成         (依赖 Step 7-10 所有页面)
   ↓
Step 12 SEO + 性能       (依赖 Step 7-10 所有页面)
   ↓
Step 13 部署上线         (依赖 Step 12 构建产物验证通过)
```

---

## Step 1：项目脚手架

**目标**：一个可运行的空项目，Tailwind 可用，目录结构就位。

**依赖**：无

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | `package.json` | `npm create vite@latest` 生成，安装全部依赖 |
| 2 | `vite.config.js` | Vite 配置（React 插件 + 路径别名 `@/` → `src/`） |
| 3 | `tailwind.config.js` | 色板扩展（primary/accent 渐变）、字体栈、`darkMode: 'class'` |
| 4 | `postcss.config.js` | Tailwind + autoprefixer 插件 |
| 5 | `index.html` | 字体 preconnect（Google Fonts × 4）、lang 属性、favicon 引用 |
| 6 | `src/main.jsx` | React 入口，渲染 `<App />` |
| 7 | `src/styles/index.css` | Tailwind 三指令 + CSS 变量（色板、阴影、圆角） |
| 8 | `src/styles/fonts.css` | `@font-face` 定义，`display=swap`；Noto Sans SC 建议自托管（下载 woff2 子集放 `public/fonts/`），避免 Google Fonts 在大陆被墙导致中文字体加载失败（详见 TopDesign §7.2）|
| 9 | 目录结构 | 创建所有空目录：`src/`下（`components/ui/`, `components/layout/`, `components/features/`, `pages/`, `data/works/`, `hooks/`, `i18n/locales/`, `contexts/`, `styles/`, `utils/`, `services/`）；`public/`下（`fonts/`, `images/works/`, `files/hardware/`, `files/software/`, `files/resources/`, `files/assignments/`） |
| 10 | `.gitignore` | node_modules, dist, .env, .env.local（**不要**把 `public/files/` 加入 gitignore，应在 `.gitattributes` 中配置 LFS 追踪） |

### 安装依赖清单

```
生产依赖:
  react, react-dom
  react-router-dom
  react-i18next, i18next, i18next-browser-languagedetector
  framer-motion
  tailwindcss, postcss, autoprefixer
  lucide-react
  react-helmet-async
  react-markdown
  react-pdf
  prismjs
  react-ga4 (Google Analytics 4)
  # 百度统计无 npm 包，在 analytics.js 中通过动态插入 <script> 标签实现

开发依赖:
  vite, @vitejs/plugin-react
```

### 完成验证

```
npm run dev → 浏览器打开 localhost:5173，显示空白页，无报错
浏览器 DevTools → Elements 面板 → <html> 包含 Tailwind 注入样式
npm run build → 无错误，dist/ 目录生成
```

---

## Step 2：路由骨架 + 布局壳

**目标**：5 个页面可以互相跳转，共享 Navbar + Footer 外壳。

**依赖**：Step 1

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/App.jsx` | BrowserRouter + Routes 配置，包裹 Layout |
| 2 | `src/components/layout/Layout.jsx` | Navbar + `<Outlet />` + Footer 的持久布局 |
| 3 | `src/components/layout/Navbar.jsx` | **骨架版**：Logo + 板块链接（hardcode）+ 占位按钮位置 |
| 4 | `src/components/layout/Footer.jsx` | **骨架版**：版权文字 + 社交链接占位 |
| 5 | `src/components/layout/ScrollToTop.jsx` | 路由变化时 `window.scrollTo(0, 0)` |
| 6 | `src/pages/HomePage.jsx` | 占位：`<h1>首页</h1>` |
| 7 | `src/pages/WorksPage.jsx` | 占位：`<h1>作品集</h1>` |
| 8 | `src/pages/WorksListPage.jsx` | 占位：读取 URL `:category` 参数并显示 |
| 9 | `src/pages/WorkDetailPage.jsx` | 占位：读取 URL `:category` + `:workId` 参数并显示 |
| 10 | `src/pages/NotFoundPage.jsx` | 占位：`<h1>404</h1>` + 返回首页链接 |

### 路由配置

```jsx
// App.jsx 核心结构
<BrowserRouter>
  <ScrollToTop />
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="works" element={<WorksPage />} />
      <Route path="works/:category" element={<WorksListPage />} />
      <Route path="works/:category/:workId" element={<WorkDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

### 完成验证

```
/              → 显示 "首页" + Navbar + Footer
/works         → 显示 "作品集"
/works/hardware → 显示 "硬件项目 作品列表"
/works/hardware/hw-sample-1  → 显示 "作品详情: hw-sample-1"
/anything      → 显示 "404" + 返回首页链接
Navbar 上的板块链接可点击跳转
```

---

## Step 3：数据层

**目标**：所有数据文件就位，可 import 使用，占位数据覆盖全部场景。

**依赖**：Step 1（仅依赖目录结构，可与 Step 2 并行或在前）

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/utils/constants.js` | 全局常量（站点名、默认语言、`VITE_GA_ID` 占位、`VITE_BAIDU_ID` 占位等） |
| 2 | `src/utils/helpers.js` | 通用工具函数（`cn()` 类名合并等） |
| 3 | `src/data/profile.js` | 个人信息占位（昵称、头像、bio、heroPhrases、contact） |
| 4 | `src/data/skills.js` | 技能列表占位 × 6（含 name、level、category、icon） |
| 5 | `src/data/categories.js` | 四大板块配置（id、name、description、icon、gradient、sortOrder） |
| 6 | `src/data/navigation.js` | 主导航项 + 从 categories 派生板块链接的工具函数 |
| 7 | `src/data/seo.js` | 全局 SEO 默认值（title、description、ogImage、siteName） |
| 8 | `src/data/works/hardware.js` | 示例硬件作品 × 1~2 |
| 9 | `src/data/works/software.js` | 示例软件作品 × 1~2 |
| 10 | `src/data/works/resources.js` | 示例资源分享 × 1~2 |
| 11 | `src/data/works/assignments.js` | 示例在校作业 × 1~2 |
| 12 | `src/data/works/index.js` | 汇总导出 + 工具函数：`getAllWorks()`, `getWorksByCategory(id)`, `getWorkById(id)`, `getFeaturedWorks()`, `getAllTags()` |

### 工具函数接口

```js
// src/data/works/index.js
export function getAllWorks()           // → Work[]  所有作品（按 createdAt 倒序）
export function getWorksByCategory(id)  // → Work[]  某板块作品
export function getWorkById(id)         // → Work | undefined  单个作品
export function getFeaturedWorks()      // → Work[]  精选作品（最多 4 个）
export function getAllTags(category?)   // → string[]  全部标签（可选按板块过滤）
```

### 完成验证

```
浏览器 Console:
  import { getAllWorks } from './src/data/works/index.js'
  getAllWorks() → 返回 4~8 个作品对象的数组
  getWorksByCategory('hardware') → 返回硬件作品
  getWorkById('hw-sample-1') → 返回单个作品（ID 命名规范：{板块缩写}-{slug}，与 TopDesign §5.2 一致）
  getAllTags() → 返回去重标签列表
  getFeaturedWorks() → 返回 featured: true 的作品
```

---

## Step 4：主题 + 国际化基础设施

**目标**：暗色/亮色切换和语言切换的底层能力就位，供后续所有组件使用。

**依赖**：Step 1（Tailwind darkMode 配置）、Step 3（不需要，但逻辑上应先有常量）

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/hooks/useLocalStorage.js` | 封装 `localStorage` 读写，支持 JSON 序列化 + SSR 安全 |
| 2 | `src/contexts/ThemeContext.jsx` | ThemeProvider + useTheme hook：`{ theme, toggle, isDark }` |
| 3 | `src/i18n/locales/zh.json` | 中文 UI 文案（nav、footer、common 按钮文字等） |
| 4 | `src/i18n/locales/en.json` | 英文 UI 文案 |
| 5 | `src/i18n/detector.js` | 语言检测：localStorage → navigator.language → 默认 `'zh'` |
| 6 | `src/i18n/index.js` | i18next 初始化配置（资源加载、detector、fallbackLng） |
| 7 | `src/hooks/useI18n.js` | 扩展 hook：`t(obj)` 自动解 `{ zh, en }` 对象，返回当前语言对应的字符串 |
| 8 | `src/components/layout/ThemeToggle.jsx` | ☀️/🌙 切换按钮（图标用 Lucide `Sun`/`Moon`） |
| 9 | `src/components/layout/LanguageSwitch.jsx` | 中/EN 切换按钮 |

### Provider 嵌套（更新 App.jsx）

```jsx
<I18nextProvider>
  <ThemeProvider>
    <BrowserRouter>
      ...
    </BrowserRouter>
  </ThemeProvider>
</I18nextProvider>
```

### 完成验证

```
点击 ThemeToggle → 页面背景/文字在亮暗之间切换，F12 看 <html> 上 .dark 类切换
刷新页面 → 主题保持（localStorage 持久化）
点击 LanguageSwitch → i18n 切换中/EN，控制台 i18n.language 变化
刷新页面 → 语言保持
prefers-color-scheme 模拟 → 首次访问时主题跟随系统
```

---

## Step 5：UI 原子组件

**目标**：所有可复用的纯 UI 组件就位，无业务逻辑，仅接收 props 渲染。

**依赖**：Step 4（useI18n hook 用于内部文本）

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/components/ui/Button.jsx` | 渐变按钮，variant（primary/outline/ghost），size（sm/md/lg） |
| 2 | `src/components/ui/Card.jsx` | 通用卡片容器，`rounded-2xl` + shadow，`className` 透传 |
| 3 | `src/components/ui/Tag.jsx` | 胶囊标签，彩色变体，可选 `onClick` |
| 4 | `src/components/ui/Badge.jsx` | 小徽标（文件类型标识：源码/PDF/链接） |
| 5 | `src/components/ui/ProgressBar.jsx` | 技能进度条，`level` 0-100，带动画预留 |
| 6 | `src/components/ui/SectionTitle.jsx` | 分区标题组件，左侧色条 + 文字，支持 `subtitle` |
| 7 | `src/components/ui/PageHeader.jsx` | 页面标题组件，标题 + 可选副标题 + 可选面包屑 |
| 8 | `src/components/ui/Typewriter.jsx` | 打字机效果：接收 `phrases[]`，逐字打印 → 删除 → 轮播 |
| 9 | `src/components/ui/LazyImage.jsx` | 图片懒加载容器，Intersection Observer + 模糊占位渐入 |
| 10 | `src/components/ui/Skeleton.jsx` | 骨架屏脉冲占位，variant（text/card/image） |
| 11 | `src/components/ui/EmptyState.jsx` | 空状态提示，图标 + 标题 + 描述 |
| 12 | `src/components/ui/LoadingScreen.jsx` | 全屏加载占位（路由懒加载 fallback 用） |
| 13 | `src/components/ui/ErrorBoundary.jsx` | React Error Boundary class 组件，fallback UI |
| 14 | `src/components/ui/index.js` | 桶文件，统一导出以上全部 |

### 完成验证

```
在任一页面占位中临时引入各组件渲染：
  <Button variant="primary">点击</Button> → 渐变按钮显示
  <Tag>React</Tag> → 胶囊标签显示
  <ProgressBar level={75} /> → 进度条 75% 填充
  <Typewriter phrases={['你好', 'Hello']} /> → 逐字打字动画
  <LazyImage src="..." /> → 图片懒加载（占位 → 真实图）
  <EmptyState /> → 空状态提示显示
  <ErrorBoundary> → 故意抛错，fallback UI 显示
```

---

## Step 6：布局完善

**目标**：Navbar 和 Footer 完整实现，包含主题切换、语言切换、移动端适配。

**依赖**：Step 2（骨架）+ Step 4（ThemeToggle/LanguageSwitch）+ Step 5（UI 原子）+ Step 3（categories 数据）

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/components/layout/Navbar.jsx` | **完整版**：整合 Logo、NavLinks（从 categories 生成）、ThemeToggle、LanguageSwitch、MobileMenu |
| 2 | `src/components/layout/MobileMenu.jsx` | 汉堡菜单展开/收起，Framer Motion 动画，点击导航项自动关闭 |
| 3 | `src/components/layout/Footer.jsx` | **完整版**：版权、社交图标链接（Lucide 图标）、"回到顶部"按钮 |
| 4 | `src/components/layout/Layout.jsx` | 更新：`<main className="min-h-screen pt-16">`（为固定 Navbar 留空间） |

### 交互行为

```
桌面端 (≥1024px):
  Navbar: 水平固定顶部，半透明毛玻璃背景
  NavLinks: 水平排列，当前页高亮
  ThemeToggle + LanguageSwitch: 右侧图标按钮

平板/手机 (<1024px):
  Navbar: Logo + 汉堡按钮
  点击汉堡 → MobileMenu 从右侧滑入
  点击导航项 → 跳转 + 菜单关闭
  点击遮罩层 → 菜单关闭
```

### 完成验证

```
Navbar 在桌面端显示完整导航链 + 图标按钮
窗口缩窄到 <1024px → 导航折叠为汉堡菜单
点击 ThemeToggle → 亮暗切换，Navbar 样式跟随
点击 LanguageSwitch → 中英切换，Navbar 文字跟随
Footer 显示版权和社交链接
各页面间跳转，Navbar 当前页高亮正确
```

---

## Step 7：首页

**目标**：完整的首页，包含 Hero、About、Skills、FeaturedWorks、Contact 五大区块。

**依赖**：Step 3（数据）+ Step 5（原子组件）+ Step 6（布局）

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/components/features/WorkCard.jsx` | 作品卡片：封面 LazyImage + 标题 + 短描述 + 标签组 + FileTypeBadge（先于 FeaturedWorks 创建，供 Step 7/8/9 共用） |
| 2 | `src/components/features/HeroSection.jsx` | 全宽渐变背景 + 头像 + 昵称 + 打字机轮播 + 向下滚动箭头 |
| 3 | `src/components/features/AboutSection.jsx` | 个人背景长文，两栏布局（左文字右装饰图） |
| 4 | `src/components/features/SkillsSection.jsx` | 技能展示：分类标签云 + ProgressBar 列表，Tab 切换分类 |
| 5 | `src/components/features/ContactSection.jsx` | 邮箱 + GitHub + 社交链接，卡片式布局 |
| 6 | `src/components/features/FeaturedWorks.jsx` | 精选作品横向滚动（`featured: true` 的作品），使用 WorkCard，点击跳转详情 |
| 7 | `src/pages/HomePage.jsx` | 组装以上 6 个组件，导入数据文件 |

### 数据绑定

```
profile.js  → HeroSection (nickname, heroPhrases, avatar)
            → AboutSection (bio)
            → ContactSection (contact)

skills.js   → SkillsSection (skills[])

works/index.js → FeaturedWorks (getFeaturedWorks())
```

### 完成验证

```
/ 首页完整展示 5 个区块
打字机逐字打印 + 轮播短语
技能进度条 + 标签云显示
精选作品卡片横向排列，点击可跳转到 /works/:category/:workId
联系方式邮箱可复制、GitHub 可跳转
响应式：手机端各区块垂直堆叠，布局正常
```

---

## Step 8：作品集主页

**目标**：板块入口网格页，4 张 CategoryCard 引导进入各板块。

**依赖**：Step 3（categories 数据）+ Step 5（Card）+ Step 6（布局）

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/components/features/CategoryCard.jsx` | 大卡片：渐变色背景 + Lucide 图标 + 板块名称 + 描述 + 作品计数 + 箭头 |
| 2 | `src/components/features/CategoryGrid.jsx` | 响应式网格（桌面 2×2 / 平板 2×2 / 手机 1×4），渲染 CategoryCard 列表 |
| 3 | `src/pages/WorksPage.jsx` | 组装 PageHeader + CategoryGrid，导入 categories 数据 |

### 交互行为

```
整张 CategoryCard 为可点击区域（<Link> 包裹）
悬停: scale(1.03) + shadow-xl + 渐变微动
点击 → 跳转到 /works/:category
```

### 实现注意

- **动态渐变色**：`categories.js` 中的 `gradient` 字段为 Tailwind 类名字符串（如 `from-orange-400 to-red-500`），但不能用模板字符串动态拼接（Tailwind JIT 编译时无法识别）。改用 `style={{ backgroundImage: 'linear-gradient(...)' }}` 内联样式。
- **作品计数**：通过 `getWorksByCategory(category.id).length` 获取该板块作品总数。

### 完成验证

```
/works 显示 4 张板块入口卡片
卡片渐变色各不同（橙红/蓝靛/绿青/紫粉）
卡片悬停有放大+阴影效果
点击任意卡片 → 跳转到对应 /works/:category
响应式：桌面 2×2 网格，手机 1 列
```

---

## Step 9：作品列表页

**目标**：某板块下的作品卡片网格 + 标签筛选功能。

**依赖**：Step 3（作品数据）+ Step 5（Tag、Card、Badge、EmptyState、LazyImage）+ Step 7（WorkCard）

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/components/features/WorkCardGrid.jsx` | 响应式网格（桌面 3 列 / 平板 2 列 / 手机 1 列），import `WorkCard` 组件（该组件在 Step 7 中创建，是组件级依赖，非页面级依赖） |
| 2 | `src/components/features/TagFilter.jsx` | 标签筛选栏：横向排列的 TagChip，多选，即时过滤，活跃标签高亮 |
| 3 | `src/hooks/useTagFilter.js` | 标签筛选逻辑：接收全部作品 + 选中标签，返回过滤后作品 + 可用标签 |
| 4 | `src/pages/WorksListPage.jsx` | 组装 PageHeader + TagFilter + WorkCardGrid / EmptyState |

### 核心逻辑

```js
// useTagFilter 工作流
输入: works[], selectedTags[]
1. 如果 selectedTags 为空 → 返回全部作品
2. 过滤：作品 tags 包含任意选中标签 → 保留（OR 逻辑）
3. 可用标签：过滤后作品中出现的所有标签（去重 + 排序）
4. 返回: { filteredWorks, availableTags }
```

### 完成验证

```
/works/hardware → 显示硬件板块的示例作品卡片（1~2 张）
/works/software → 显示软件板块的示例作品卡片
无作品的板块 → 显示 EmptyState "暂无作品，敬请期待"
TagFilter 显示该板块所有可用标签
点击标签 → 即时过滤，URL 同步 ?tags=xxx
多选标签 → 显示包含任一标签的作品
清空标签 → 恢复全部作品
响应式：桌面 3 列，平板 2 列，手机 1 列
```

---

## Step 10：作品详情页

**目标**：完整作品详情，包含 Markdown 描述、PDF 预览、代码查看、文件下载。

**依赖**：Step 3（作品数据）+ Step 5（Tag、Button、LazyImage）

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/components/features/MarkdownRenderer.jsx` | react-markdown 封装，自定义渲染器（代码块、图片、链接样式） |
| 2 | `src/components/features/PDFViewer.jsx` | react-pdf 封装，分页导航（上一页/下一页/页码），加载状态 |
| 3 | `src/components/features/CodeViewer.jsx` | Prism.js 封装，语言自动检测，行号，复制按钮 |
| 4 | `src/components/features/FilePreview.jsx` | 文件预览调度器：`type=pdf` → PDFViewer，`type=code` → CodeViewer，其他 → 下载提示 |
| 5 | `src/components/features/FileList.jsx` | 文件列表：文件名 + 大小 + 类型图标 + 预览/下载按钮 |
| 6 | `src/components/features/ExternalLinks.jsx` | 外部链接列表（GitHub、演示地址等），Lucide 图标 + 新窗口打开 |
| 7 | `src/pages/WorkDetailPage.jsx` | 组装以上全部 + WorkHeader（标题+标签）+ 返回按钮 |
| 8 | `src/styles/prism-theme.css` | Prism.js 代码高亮主题（适配亮/暗模式） |

### 交互行为

```
文件类型为 'pdf' → 点击预览 → PDFViewer 展开（分页浏览 + 缩放）
文件类型为 'code' → 点击预览 → CodeViewer 展开（语法高亮 + 复制）
文件类型为 'binary' → 仅显示下载按钮
外部链接 → 新标签页打开
不存在的作品 ID → 显示 NotFoundPage
```

### 完成验证

```
/works/hardware/hw-sample-1 → 显示完整详情页（使用 TopDesign §5.2 约定的 ID 命名：{板块缩写}-{slug}）
Markdown 描述正确渲染（标题、列表、链接、代码块）
PDF 文件 → 预览可用，分页导航正常
代码文件 → 语法高亮正常，复制按钮可用
下载按钮 → 触发浏览器下载
外部链接 → 新窗口打开目标 URL
无匹配 ID → 重定向到 404 页面
返回按钮 → 回到上一页（板块列表）
```

---

## Step 11：动效集成

**目标**：全站动效统一接入，提升交互体验，同时确保无障碍。

**依赖**：Step 7-10（所有页面已完成）

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/hooks/useScrollReveal.js` | Intersection Observer + Framer Motion `useAnimation`，元素进入视口时触发入场动画 |
| 2 | `src/components/features/ScrollReveal.jsx` | 包装组件：`<ScrollReveal><YourComponent /></ScrollReveal>`，自动应用入场动画 |
| 3 | 更新 `src/App.jsx` | 添加 `AnimatePresence` 包裹 Routes，页面切换 fade+up 过渡 |
| 4 | 更新 `CategoryCard.jsx` | `whileHover` scale(1.03) + shadow 动画 |
| 5 | 更新 `WorkCard.jsx` | `whileHover` scale(1.02) + glow 效果 |
| 6 | 更新 `HeroSection.jsx` | 背景渐变 CSS 流动动画 |
| 7 | 更新 `SkillsSection.jsx` | ProgressBar 滚动入视口时从 0 动画填充 |

### 动效开关

```js
// useScrollReveal 内部
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) return { animate: false }; // 直接显示，无动画
```

### 完成验证

```
首页各区块滚动入视口 → 逐个 fade-up 入场
页面间跳转 → 淡入淡出过渡（0.3s）
卡片悬停 → 放大 + 阴影增强
SkillsSection 滚动到 → 进度条从 0 填充到目标值
Hero 背景渐变 → 缓慢流动
系统开启 "减少动效" → 所有动画降级为静态显示
```

---

## Step 12：SEO + 性能优化

**目标**：首屏 < 3s，SEO 到位，生产就绪。

**依赖**：Step 7-10（所有页面已完成）

### 创建内容

| # | 文件 | 说明 |
|---|------|------|
| 1 | 更新 `src/App.jsx` | 页面级 `React.lazy()` + `<Suspense fallback={<LoadingScreen />}>` |
| 2 | 更新 `src/pages/HomePage.jsx` | `<Helmet>` 设置 title + meta description + OG 标签 |
| 3 | 更新 `src/pages/WorksPage.jsx` | `<Helmet>` 动态 SEO |
| 4 | 更新 `src/pages/WorksListPage.jsx` | `<Helmet>` 动态 SEO（板块名） |
| 5 | 更新 `src/pages/WorkDetailPage.jsx` | `<Helmet>` 动态 SEO（作品名 + 短描述） |
| 6 | `src/services/analytics.js` | GA4 初始化（环境变量 `VITE_GA_ID` 控制）+ 百度统计初始化（环境变量 `VITE_BAIDU_ID` 控制），均仅生产环境加载 |

### 优化清单

```
页面级 lazy():      HomePage, WorksPage, WorksListPage, WorkDetailPage, NotFoundPage
PDF 库懒加载:        react-pdf 仅在 WorkDetailPage 按需 import
Prism.js 按需:       仅引入 C/C++/Python/JS/HTML/CSS/Arduino 语言包
图片:                LazyImage 组件已在 Step 5 实现，验证全局生效
字体:                display=swap + 预连接已在 Step 1 配置
```

### 完成验证

```
npm run build → 产物检查：
  dist/assets/ 下有多个 JS chunk（路由级分割）
  react-pdf / prismjs 为独立 chunk
npm run preview → 
  打开首页 → Network 面板 JS 总大小 < 150KB（首屏）
  页面 title 显示"天问 - 个人作品集"
  页面 source 含 <meta name="description"> + OG 标签
  GA 仅在 VITE_GA_ID 有值时加载（本地开发不加载）
  百度统计仅在 VITE_BAIDU_ID 有值时加载
Lighthouse → Performance > 90
```

---

## Step 13：部署上线

**目标**：网站可通过公网 URL 访问。

**依赖**：Step 12（构建验证通过）

### 操作步骤

| # | 步骤 | 说明 |
|---|------|------|
| 1 | `git init && git add -A && git commit -m "init: 天问 v1"` | 初始化 Git 仓库 |
| 2 | GitHub 创建仓库 `tianwen` | 关联远程 `git remote add origin ...` |
| 3 | `git push -u origin main` | 推送代码 |
| 4 | Vercel 导入 GitHub 仓库 | vercel.com → New Project → 选择 tianwen |
| 5 | Vercel 自动检测 Vite | Framework Preset: Vite，无需手动配置 |
| 6 | 添加环境变量 | `VITE_GA_ID`（可选，GA 就绪后再填）；`VITE_BAIDU_ID`（可选，百度统计就绪后再填） |
| 7 | Deploy | Vercel 自动构建 + 部署 |
| 8 | 验证生产环境 | 逐页检查功能完整性 |
| 9 | 域名设置（可选） | Vercel → Domains → 绑定自定义域名 |

### 完成验证

```
https://tianwen-*.vercel.app 可公网访问
所有路由页面正常显示
亮暗切换、语言切换在生产环境正常工作
图片、文件资源加载正常
GA 数据上报（若已配置 VITE_GA_ID）
百度统计数据上报（若已配置 VITE_BAIDU_ID）
```

---

## 步骤总览表

| 步骤 | 名称 | 新增文件数 | 产出物 |
|------|------|:--------:|--------|
| 1 | 项目脚手架 | 10 | 可运行空项目 |
| 2 | 路由骨架 + 布局壳 | 10 | 5 页面可跳转 |
| 3 | 数据层 | 12 | 完整占位数据 |
| 4 | 主题 + i18n 基础 | 9 | 暗色/亮色 + 中英切换可用 |
| 5 | UI 原子组件 | 14 | 14 个复用组件 |
| 6 | 布局完善 | 4 | Navbar/Footer 完整 |
| 7 | 首页 | 7 | 首页 5 区块 + WorkCard |
| 8 | 作品集主页 | 3 | 板块入口网格 |
| 9 | 作品列表页 | 4 | 卡片网格 + 标签筛选 |
| 10 | 作品详情页 | 8 | 详情页 + PDF/代码预览 |
| 11 | 动效集成 | 2 新建 + 5 更新 | 全站动效 |
| 12 | SEO + 性能 | 5 更新 + 1 新建 | SEO 标签 + 代码分割 + 统计脚本 |
| 13 | 部署上线 | 0 (操作) | 公网可访问 |

---

*本文档遵循逐层推进原则，每一步的输出是下一步的输入。开发时请严格按顺序执行，每步完成后验证通过再进入下一步。*
