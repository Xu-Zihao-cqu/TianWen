import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LogOut, Menu, Orbit } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import LanguageSwitch from './LanguageSwitch.jsx';
import MobileMenu from './MobileMenu.jsx';
import { categories } from '../../data/categories.js';
import { useI18n } from '../../hooks/useI18n.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale } = useI18n();
  const { role, logout } = useAuth();
  const home = useLocation().pathname === '/';
  return <>
    <a href="#main-content" className="skip-content">{locale === 'zh' ? '跳至主要内容' : 'Skip to content'}</a>
    <header className={`site-nav ${home ? 'site-nav-space' : ''}`}><nav aria-label={locale === 'zh' ? '主导航' : 'Main navigation'}>
      <Link to="/" className="site-brand"><Orbit size={29} strokeWidth={1.2} /><span>天问<span>TIANWEN / LAB</span></span></Link>
      <div className="site-nav-links"><NavLink to="/" end>{locale === 'zh' ? '首页' : 'Home'}</NavLink><NavLink to="/works" end>{locale === 'zh' ? '作品集' : 'Work'}</NavLink>{categories.map(c => <NavLink key={c.id} to={`/works/${c.id}`}>{c.name[locale]}</NavLink>)}</div>
      <div className="site-nav-tools"><span className="nav-role">{role || 'User'}</span><ThemeToggle /><LanguageSwitch /><button type="button" onClick={logout} aria-label={locale === 'zh' ? '退出登录' : 'Sign out'} title={locale === 'zh' ? '退出登录' : 'Sign out'}><LogOut size={17} /></button><button type="button" className="site-menu-toggle" onClick={() => setMenuOpen(true)} aria-label={locale === 'zh' ? '打开菜单' : 'Open menu'} aria-expanded={menuOpen}><Menu size={21} /></button></div>
    </nav></header><MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
  </>;
}
