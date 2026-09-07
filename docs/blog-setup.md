# Blog 发布

Blog 与硬件、软件、资源、作业并列，由 categories.js 驱动入口。

- 列表：`/works/blog`，按发布时间倒序，支持搜索最近 100 篇文章。
- 详情：`/works/blog/:postId`，渲染 Markdown。
- 发布：`/works/blog/new`，仅现有 `Developer` 角色可见与使用。
- 编辑：`/works/blog/:postId/edit`，仅 Developer 作者可编辑本人文章。
- 标题 1–180 字、摘要最多 500 字、正文 1–100,000 字；数据库与前端均校验。
- 发布失败时保留当前页面内容；离开或刷新前应发布，未发布内容没有持久化为草稿。
- 原有登录流程和 Supabase 环境变量不变。

## 数据库迁移（已有连接也需要文章表）

在现有 Supabase 项目执行 `supabase/migrations/20260907_blog.sql`，依赖之前的 `supabase/schema.sql`。
该迁移新增 `blog_posts`、索引和 RLS 策略，不修改已有账号或角色。
读取对访客开放，写入在数据库侧检查 `current_profile_role() = 'Developer'` 和作者身份。

GitHub 推送或 Vercel 前端构建不会自动执行这份 SQL。若没有配置迁移流水线，必须执行一次 SQL 才能加载与发布文章。
本次按用户要求仅提交代码和迁移文件，没有连接或修改线上 Supabase，也没有进行线上发布文章测试。
