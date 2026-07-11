import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LogOut, Menu, Sparkles, UserRound } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import LanguageSwitch from './LanguageSwitch.jsx';
import MobileMenu from './MobileMenu.jsx';
import { categories } from '../../data/categories.js';
import { useI18n } from '../../hooks/useI18n.js';
import { getIcon } from '../../utils/icons.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale } = useI18n();
  const { profile, role, logout } = useAuth();
  const roleLabel = role || profile?.role || 'User';

  const navLinks = [
    { to: '/', label: locale === 'zh' ? '首页' : 'Home', end: true },
    { to: '/works', label: locale === 'zh' ? '作品集' : 'Works', end: false },
  ];

  const linkClasses = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition-all ${
      isActive
        ? 'bg-slate-950 text-white shadow-md shadow-slate-900/10 dark:bg-white dark:text-slate-950'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
    }`;

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="group inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-900/15 transition-transform group-hover:-rotate-3 dark:bg-white dark:text-slate-950">
              <Sparkles size={17} />
            </span>
            <span className="font-heading text-lg font-black text-slate-950 dark:text-white">
              天问
            </span>
            <span className="hidden text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 sm:inline">
              TianWen
            </span>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/75 p-1 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/5 lg:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/75 p-1 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/5 md:flex">
            {categories.map((c) => (
              <NavLink key={c.id} to={`/works/${c.id}`} className={linkClasses}>
                {({ isActive }) => {
                  const Icon = getIcon(c.icon);
                  return (
                    <span className="inline-flex items-center gap-1.5">
                      {Icon && <Icon size={14} className={isActive ? 'text-current' : 'text-slate-400'} />}
                      {c.name[locale]}
                    </span>
                  );
                }}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/75 p-1 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/5">
            <span className="hidden items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300 sm:inline-flex">
              <UserRound size={14} />
              {roleLabel}
            </span>
            <ThemeToggle />
            <LanguageSwitch />
            <button
              onClick={logout}
              className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label={locale === 'zh' ? '退出登录' : 'Sign out'}
              title={locale === 'zh' ? '退出登录' : 'Sign out'}
            >
              <LogOut size={18} />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 md:hidden"
              aria-label="打开菜单"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
