# Blog 发布与多媒体

Blog 与硬件、软件、资源、作业并列，沿用现有 Supabase 登录与 Developer 角色。

## 使用

- `/works/blog`：封面卡片、搜索最近 100 篇、动态 Journal 主视觉。
- `/works/blog/new`：Developer 编辑器。支持 Markdown、图片粘贴、文件选择及拖放。
- 图片：PNG/JPEG/WebP/GIF，单张 8 MB；上传后插入正文，可设为文章封面。
- 代码：JS/TS/JSX/TSX、Python、C/C++、Verilog、SQL、JSON、Shell 等，每个 1 MB；附件可展开高亮预览并复制。正文代码块通过工具栏插入并填写语言。
- PDF：每个 20 MB，按需加载并分页预览。
- DOCX：每个 20 MB，浏览器本地解析内容并清理 HTML；保留标题、段落、表格、图片等，复杂排版以下载原件为准。
- DOC：每个 20 MB，下载或主动点击 Microsoft 在线预览。仅点击后将公开文件 URL 提交给 Microsoft；服务不可用时可下载或改传 DOCX。
- 每篇最多 20 个附件；标题最多 180 字、摘要 500 字、正文 100,000 字。
- 草稿按当前用户与文章保存在本机浏览器，可手动恢复。发布成功后清除；本机存储不可用时显示未保存状态。
- 上传失败按文件报告，已成功上传的附件保留。发布时禁止重复上传或重复提交。
- 文件上传后即有公开地址，适合公开博客材料。移除附件只修改文章引用，不删除存储对象，避免损坏其他引用。未发布文件和旧版本可在 Storage 控制台另行清理。

## 一次性数据库与 Storage 配置

按顺序执行：
1. `supabase/schema.sql`（已有认证项目无须重复）。
2. `supabase/migrations/20260907_blog.sql`（文章表，已执行则跳过）。
3. `supabase/migrations/20260908_blog_media.sql`（新增 attachments/cover_image 字段和 blog-assets 存储桶）。

blog-assets 为公开附件桶；最大 20 MB，限制 MIME 类型。RLS 只允许 Developer 向自身用户 ID 目录上传，不授予覆盖和删除权限。现有文章作者编辑权限保持不变。浏览器不包含服务端密钥。

GitHub 推送、Vercel 前端构建不会自动执行 SQL。按用户指示本次不操作线上 Supabase，因此线上上传发布需要先应用迁移；尚未进行真实线上上传验证。

## 实现依据

- [Supabase 标准上传](https://supabase.com/docs/guides/storage/uploads/standard-uploads)
- [Supabase 存储权限](https://supabase.com/docs/guides/storage/security/access-control)
- [Mammoth DOCX 解析与安全说明](https://github.com/mwilliamson/mammoth.js)
