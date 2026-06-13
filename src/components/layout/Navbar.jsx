import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: '首页' },
  { to: '/works', label: '作品集' },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-heading font-bold gradient-text">
          天问 TianWen
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary dark:text-primary-dark'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Placeholder: ThemeToggle + LanguageSwitch (Step 4) + MobileMenu (Step 6) */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700" title="暗色/亮色切换 (Step 4)" />
          <div className="w-12 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center text-slate-500" title="语言切换 (Step 4)">
            中/EN
          </div>
        </div>
      </nav>
    </header>
  );
}
