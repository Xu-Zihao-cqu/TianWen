import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Github, LogIn, Mail, ShieldCheck, UserRound } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import ThemeToggle from '../components/layout/ThemeToggle.jsx';
import LanguageSwitch from '../components/layout/LanguageSwitch.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useI18n } from '../hooks/useI18n.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState('');
  const {
    configReady,
    error,
    notice,
    loginWithEmail,
    loginWithGitHub,
    loginAsGuest,
    clearMessages,
  } = useAuth();
  const { locale } = useI18n();

  const isZh = locale === 'zh';

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    setSubmitting('email');
    await loginWithEmail(email);
    setSubmitting('');
  };

  const handleGitHubLogin = async () => {
    setSubmitting('github');
    await loginWithGitHub();
    setSubmitting('');
  };

  const handleGuestLogin = async () => {
    setSubmitting('guest');
    await loginAsGuest();
    setSubmitting('');
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <Helmet>
        <title>{isZh ? '登录 | 天问 TianWen' : 'Sign in | TianWen'}</title>
        <meta
          name="description"
          content={isZh ? '登录天问作品集' : 'Sign in to TianWen portfolio'}
        />
      </Helmet>

      <div className="home-circuit-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-cyan-400/20 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="inline-flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-950 shadow-lg shadow-cyan-400/20">
            <ShieldCheck size={18} />
          </span>
          <span className="font-heading text-lg font-black">天问</span>
          <span className="hidden text-xs font-semibold uppercase text-slate-400 sm:inline">
            TianWen
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur">
          <ThemeToggle />
          <LanguageSwitch />
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100 backdrop-blur">
            <LogIn size={14} />
            {isZh ? '访问验证' : 'Access Gate'}
          </p>
          <h1 className="font-heading text-4xl font-black leading-tight md:text-6xl">
            {isZh ? '登录后进入天问作品集' : 'Sign in to enter TianWen'}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
            {isZh
              ? '支持 QQ 邮箱、Gmail 邮箱、GitHub 账户，也可以使用游客身份进入。身份会记录在用户数据库中，后续可用于权限分级。'
              : 'Use QQ Mail, Gmail, GitHub, or continue as a guest. User roles are stored in the database for future permission control.'}
          </p>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[
              [isZh ? '邮箱' : 'Email', 'QQ / Gmail'],
              [isZh ? '账户' : 'Account', 'GitHub'],
              [isZh ? '身份' : 'Role', 'Guest / User'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-medium text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-2xl shadow-slate-950/40 backdrop-blur-xl md:p-7">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold">
              {isZh ? '选择登录方式' : 'Choose sign-in method'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isZh
                ? '邮箱登录会发送一次性登录链接。GitHub 会跳转到 GitHub 授权页面。'
                : 'Email sign-in sends a one-time link. GitHub redirects to GitHub authorization.'}
            </p>
          </div>

          {!configReady && (
            <div className="mb-5 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 shrink-0" size={17} />
                <span>
                  {isZh
                    ? '尚未配置 Supabase 环境变量。请在 Vercel 添加 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY 后再使用登录。'
                    : 'Supabase environment variables are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel first.'}
                </span>
              </div>
            </div>
          )}

          {(error || notice) && (
            <button
              type="button"
              onClick={clearMessages}
              className={`mb-5 w-full rounded-2xl border p-4 text-left text-sm leading-6 ${
                error
                  ? 'border-rose-300/25 bg-rose-400/10 text-rose-100'
                  : 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100'
              }`}
            >
              {error || notice}
            </button>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200" htmlFor="login-email">
              {isZh ? 'QQ 邮箱或 Gmail 邮箱' : 'QQ Mail or Gmail'}
            </label>
            <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 focus-within:border-cyan-300/50">
              <span className="flex w-12 items-center justify-center text-slate-400">
                <Mail size={18} />
              </span>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={isZh ? 'name@qq.com 或 name@gmail.com' : 'name@qq.com or name@gmail.com'}
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                disabled={!configReady || Boolean(submitting)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!configReady || !email || Boolean(submitting)}
            >
              <Mail size={17} />
              {submitting === 'email'
                ? (isZh ? '发送中...' : 'Sending...')
                : (isZh ? '发送邮箱登录链接' : 'Send email sign-in link')}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs uppercase text-slate-500">
            <span className="h-px flex-1 bg-white/10" />
            {isZh ? '或者' : 'or'}
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10"
              disabled={!configReady || Boolean(submitting)}
              onClick={handleGitHubLogin}
            >
              <Github size={18} />
              {submitting === 'github' ? (isZh ? '跳转中...' : 'Redirecting...') : 'GitHub'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="bg-white/5 text-white hover:bg-white/10"
              disabled={!configReady || Boolean(submitting)}
              onClick={handleGuestLogin}
            >
              <UserRound size={18} />
              {submitting === 'guest' ? (isZh ? '进入中...' : 'Entering...') : (isZh ? '游客登录' : 'Guest')}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
