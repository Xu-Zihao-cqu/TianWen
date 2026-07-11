# TianWen 日常上传与维护手册

这份文档给自己日常维护作品集使用。目标是：每次新增一个资源、项目、作业或附件时，知道应该改哪里、放哪里、检查哪里。

## 一次上传的标准流程

### 1. 先判断内容属于哪一块

| 内容类型 | 放入板块 | 数据文件 | ID 前缀 | 附件目录 |
|----------|----------|----------|---------|----------|
| FPGA、IoT、电路、嵌入式 | 硬件项目 | `src/data/works/hardware.js` | `hw-` | `public/files/hardware/` |
| Web、工具、小游戏、脚本 | 软件项目 | `src/data/works/software.js` | `sw-` | `public/files/software/` |
| 笔记、教程、资料、工具推荐 | 资源分享 | `src/data/works/resources.js` | `rs-` | `public/files/resources/` |
| 课程设计、实验报告、作业 | 在校作业 | `src/data/works/assignments.js` | `as-` | `public/files/assignments/` |

### 2. 给内容取一个唯一 ID

格式建议：

```text
{板块前缀}-{英文 slug}
```

例子：

```text
hw-fpga-vision-gesture-controller
sw-space-shooter
rs-learning-notes-toolkit
as-algorithm-lab-report
```

注意：

- `id` 全站唯一，不能重复。
- `category` 必须和板块一致，如 `hardware`、`software`、`resources`、`assignments`。
- 文件夹名最好和 `id` 一致，后续不容易乱。

### 3. 准备封面和附件

封面图建议放在：

```text
public/images/works/{id}/cover.jpg
```

附件建议放在：

```text
public/files/{板块}/{id}/
```

例如硬件项目：

```text
public/images/works/hw-demo-project/cover.jpg
public/files/hardware/hw-demo-project/report.pdf
public/files/hardware/hw-demo-project/source.zip
```

文件路径写进数据时，要从网站根路径开始：

```js
coverImage: '/images/works/hw-demo-project/cover.jpg'
url: '/files/hardware/hw-demo-project/report.pdf'
```

### 4. 编辑对应数据文件

打开 `src/data/works/` 下对应文件，在数组里新增一项：

```js
{
  id: 'hw-demo-project',
  category: 'hardware',
  title: {
    zh: '示例硬件项目',
    en: 'Demo Hardware Project',
  },
  coverImage: '/images/works/hw-demo-project/cover.jpg',
  description: {
    short: {
      zh: '一句话讲清楚项目做了什么，显示在卡片和详情摘要里。',
      en: 'One sentence summary shown on cards and detail pages.',
    },
    full: {
      zh: `## 项目概览

这里写完整介绍，支持 Markdown。

## 系统架构

~~~text
Input
      ↓
Processing
      ↓
Output
~~~

## 技术栈

- React
- FPGA
- Python
`,
      en: `## Overview

Write the English detail here.`,
    },
  },
  tags: ['已完成', 'FPGA', '2026'],
  files: [
    {
      name: 'report.pdf',
      type: 'pdf',
      size: '200 KB',
      url: '/files/hardware/hw-demo-project/report.pdf',
      previewable: true,
    },
    {
      name: 'source.zip',
      type: 'zip',
      size: '1.2 MB',
      url: '/files/hardware/hw-demo-project/source.zip',
      previewable: false,
    },
  ],
  externalLinks: [
    {
      label: 'GitHub',
      url: 'https://github.com/your-name/your-repo',
      icon: 'github',
    },
  ],
  featured: false,
  createdAt: '2026-07-11',
}
```

### 5. 检查本地页面

启动开发服务器：

```bash
npm run dev
```

重点检查：

- 首页：如果 `featured: true`，是否出现在精选作品。
- `/works`：板块入口数量是否正确。
- `/works/{category}`：卡片标题、封面、短介绍、标签是否正常。
- `/works/{category}/{id}`：详情页是否能打开。
- 附件：PDF 是否能预览，ZIP/文件是否能下载。
- 外链：GitHub 或其他链接是否能打开。
- 中英文：切换语言后标题和描述是否完整。
- 暗色模式：颜色是否仍然清楚。

### 6. 发布前检查

```bash
npm run build
git diff --check
```

如果 `npm run build` 成功，说明语法和打包基本没问题。

### 7. 记录开发日志

当天做过的新增和修改，写进：

```text
dev-logs/YYYY-MM-DD.md
```

建议格式：

```markdown
## 完成事项

- 新增 xxx 项目数据。
- 上传 xxx.pdf / xxx.zip。
- 检查详情页和附件预览。

## 待办事项

- 补充英文详情。
- 替换更清晰的封面图。
```

## 每一块是怎么工作的

### 首页

入口文件：

```text
src/pages/HomePage.jsx
```

首页主要由这些组件组成：

```text
HeroSection       动态首屏、头像、打字机、统计数据
AboutSection      创作工作台、四大板块入口
SkillsSection     技能控制台
FeaturedWorks     首页精选作品
ContactSection    联系方式 CTA
```

首页精选作品来自：

```js
getFeaturedWorks()
```

只有作品数据里 `featured: true` 的内容才会进入首页精选，并且会按 `createdAt` 倒序展示。

### 作品集主页

路径：

```text
/works
```

入口文件：

```text
src/pages/WorksPage.jsx
```

它读取：

```text
src/data/categories.js
```

然后通过 `CategoryGrid` 和 `CategoryCard` 自动生成四个板块入口。

### 作品列表页

路径：

```text
/works/:category
```

入口文件：

```text
src/pages/WorksListPage.jsx
```

工作方式：

- 根据 URL 里的 `category` 调用 `getWorksByCategory(category)`。
- 根据作品 `tags` 生成筛选按钮。
- 筛选状态同步到 URL 的 `?tags=`。
- 每个作品用 `WorkCard` 显示。

### 作品详情页

路径：

```text
/works/:category/:workId
```

入口文件：

```text
src/pages/WorkDetailPage.jsx
```

工作方式：

- 根据 `workId` 调用 `getWorkById(workId)`。
- 顶部显示封面、摘要、创建时间、附件数量、外链数量。
- `description.full` 交给 `MarkdownRenderer` 渲染。
- `files` 交给 `FileList` 渲染下载和预览。
- `externalLinks` 交给 `ExternalLinks` 渲染。

### Markdown 详情

组件：

```text
src/components/features/MarkdownRenderer.jsx
```

支持：

- `##` / `###` 标题样式。
- 普通段落、列表、链接、图片。
- Markdown 表格美化。
- 代码块美化。
- 类似下面的纯文本流程会自动变成彩色系统框图：

```text
Input
      ↓
Processing
      ↓
Output
```

### 附件系统

组件：

```text
FileList.jsx
FilePreview.jsx
PDFViewer.jsx
CodeViewer.jsx
```

附件字段：

| 字段 | 说明 |
|------|------|
| `name` | 文件显示名 |
| `type` | `pdf` / `code` / `zip` / `binary` / `link` |
| `size` | 文件大小文字 |
| `url` | 文件路径 |
| `previewable` | 是否显示预览按钮 |

注意：

- `pdf` 可以用 PDF 预览。
- `code` 可以用代码预览。
- `zip` / `binary` 一般只下载，不预览。

### 导航和板块

导航栏、作品集入口、移动端菜单都依赖：

```text
src/data/categories.js
```

如果以后要新增第五个板块，需要：

1. 在 `categories.js` 增加配置。
2. 新建对应 `src/data/works/{category}.js`。
3. 在 `src/data/works/index.js` import 并合并。
4. 确认图标在 `src/utils/icons.js` 中存在。

当前四大板块暂时够用，平时只需要往已有四个数据文件里添加作品。

## 最容易出错的地方

- `id` 重复：详情页会打开错作品。
- `category` 写错：作品不会出现在对应列表。
- `coverImage` 或 `files.url` 路径写错：图片/附件加载失败。
- PDF 路径不存在：预览会失败。
- `featured: true` 太多：首页只展示前几个精选作品。
- Markdown 字符串忘记反引号：多行正文会导致 JS 语法错误。
- 中文和英文只写一边：切换语言后会缺内容。

## 推荐上传节奏

每次新增内容按这个顺序：

```text
先放文件 → 再写数据 → 本地查看 → 构建检查 → 写开发日志 → 提交/推送
```
