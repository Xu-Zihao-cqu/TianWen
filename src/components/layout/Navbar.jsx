import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import LanguageSwitch from './LanguageSwitch.jsx';
import MobileMenu from './MobileMenu.jsx';
import { categories } from '../../data/categories.js';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: '首页', end: true },
    { to: '/works', label: '作品集', end: false },
  ];

  const linkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary dark:text-primary-dark'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-heading font-bold gradient-text">
            天问 TianWen
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}

            {/* 板块下拉（简化：直接列出） */}
            {categories.map((c) => (
              <NavLink
                key={c.id}
                to={`/works/${c.id}`}
                className={linkClasses}
              >
                {c.name.zh} / {c.name.en}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitch />
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
