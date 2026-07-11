import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../../data/categories.js';
import { getIcon } from '../../utils/icons.js';

export default function MobileMenu({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const linkClasses = ({ isActive }) =>
    `block px-4 py-3 text-lg font-medium rounded-xl transition-colors ${
      isActive
        ? 'text-primary dark:text-primary-dark bg-primary/10'
        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-80 max-w-[86vw] overflow-hidden border-l border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95"
          >
            <div className="home-circuit-grid pointer-events-none absolute inset-0 opacity-10" />
            <div className="relative flex items-center justify-between border-b border-slate-200 p-4 dark:border-white/10">
              <Link to="/" onClick={onClose} className="inline-flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Sparkles size={17} />
                </span>
                <span className="font-heading text-lg font-black text-slate-950 dark:text-white">天问</span>
              </Link>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-white/10"
                aria-label="关闭菜单"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="relative flex flex-col gap-2 p-4">
              <NavLink to="/" end onClick={onClose} className={linkClasses}>
                首页
              </NavLink>
              <NavLink to="/works" onClick={onClose} className={linkClasses}>
                作品集
              </NavLink>

              <div className="my-2 border-t border-slate-200 dark:border-white/10" />

              {categories
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((c) => {
                  const Icon = getIcon(c.icon);
                  return (
                    <NavLink
                      key={c.id}
                      to={`/works/${c.id}`}
                      onClick={onClose}
                      className={linkClasses}
                    >
                      <span className="inline-flex items-center gap-2">
                        {Icon && <Icon size={17} />}
                        {c.name.zh}
                      </span>
                    </NavLink>
                  );
                })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
