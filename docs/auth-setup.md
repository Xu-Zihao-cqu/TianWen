# 登录与用户数据库配置

本项目新增登录功能使用 Supabase Auth + Supabase Postgres。代码已经在仓库内完成，但真实数据库、OAuth 凭据和 Vercel 环境变量需要你在控制台手动配置。

## 已实现

- 用户打开 `https://tianwen-azure.vercel.app/` 时，未登录会先看到登录页。
- QQ 邮箱、Gmail 邮箱使用邮箱一次性登录链接。
- GitHub 使用 OAuth 登录。
- 游客登录使用 Supabase Anonymous Sign-ins。
- 用户资料写入 `profiles` 表，包含：
  - `role`: `Developer` / `User` / `Guest`
  - `login_provider`: `qq_email` / `gmail_email` / `github` / `guest`
  - `is_online`
  - `last_seen_at`

## 1. 创建 Supabase 项目

1. 进入 Supabase 控制台，新建项目。
2. 打开 SQL Editor。
3. 执行仓库中的 `supabase/schema.sql`。

## 2. 配置 Authentication

在 Supabase 控制台打开 Authentication。

### URL 配置

Site URL:

```text
https://tianwen-azure.vercel.app
```

Redirect URLs 建议加入：

```text
https://tianwen-azure.vercel.app/**
http://localhost:5173/**
```

### 邮箱登录

启用 Email provider。当前前端只允许：

```text
@qq.com
@gmail.com
@googlemail.com
```

### GitHub 登录

1. 在 GitHub Developer Settings 创建 OAuth App。
2. Authorization callback URL 填：

```text
https://你的 Supabase Project Ref.supabase.co/auth/v1/callback
```

3. 把 GitHub Client ID 和 Client Secret 填回 Supabase 的 GitHub provider 配置。

### 游客登录

在 Supabase Authentication Providers 中启用 Anonymous Sign-ins。

## 3. 配置 Vercel 环境变量

在 Vercel 项目中添加：

```text
VITE_SUPABASE_URL=https://你的 Supabase Project Ref.supabase.co
VITE_SUPABASE_ANON_KEY=你的 Supabase anon public key
```

本地开发可复制 `.env.example` 为 `.env.local` 后填写同样的值。

## 4. 手动授予 Developer 身份

默认规则：

- 游客登录：`Guest`
- 邮箱或 GitHub 登录：`User`
- `Developer` 必须由你手动授权

在 Supabase SQL Editor 执行：

```sql
update public.profiles
set role = 'Developer'
where email = 'your-email@gmail.com';
```

## 5. 注意事项

- `is_online` 会在登录后置为 `true`，退出登录时置为 `false`，登录期间每 60 秒刷新一次 `last_seen_at`。
- 如果用户直接关闭浏览器，`is_online` 可能短时间不准确，后期可以加服务端定时任务按 `last_seen_at` 自动判离线。
- 如果你想把 Gmail 改成 Google 账户 OAuth，需要再启用 Supabase Google provider，并在前端增加 Google OAuth 按钮。

