# 下载统计与作品上传部署

## 下载统计（任务 3）

在 Supabase SQL Editor 执行 `supabase/migrations/20261011_download_counts.sql`。
前提：现有 profiles、blog_posts 已建好。该脚本可重复执行，不会清空计数。

- download_counts：按文件 URL 路径保存全站共享次数，所有访客可读。
- download_events：事件 UUID 去重；客户端无直接读写权限。
- record_download：已登录用户（含 Guest 匿名会话）可调用，只接收已登记的文件，原子递增，不信任前端提交的次数。
- 静态作品文件已初始化；Blog 附件新增/更新由触发器登记。未来手动添加静态文件，需要将 URL 路径插入 download_counts（ON CONFLICT DO NOTHING）。
- 按钮初次加载、浏览器重新获得焦点时刷新；同页同文件按钮同步。
- 口径是文件获取成功并触发浏览器保存的次数，无法判断用户是否最终保存到磁盘。缺失、网络失败和预览不计数；这是使用统计，不是防作弊审计。
- 无配置或表未建时显示“统计暂不可用”，不影响文件下载；不伪造本地计数。

验证：同一文件下载一次，刷新后应增加 1；缺失文件进入彩蛋页且不增加。其他账号应读到相同次数。对相同事件 UUID 重复调用 RPC，次数只增加一次。普通用户直接 UPDATE download_counts 应被拒绝。
