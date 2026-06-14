import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../../data/categories.js';

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
            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <span className="text-lg font-heading font-bold gradient-text">天问</span>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="关闭菜单"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="p-4 flex flex-col gap-1">
              <NavLink to="/" end onClick={onClose} className={linkClasses}>
                首页
              </NavLink>
              <NavLink to="/works" onClick={onClose} className={linkClasses}>
                作品集
              </NavLink>

              <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

              {categories
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((c) => (
                  <NavLink
                    key={c.id}
                    to={`/works/${c.id}`}
                    onClick={onClose}
                    className={linkClasses}
                  >
                    {c.name.zh}
                  </NavLink>
                ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
