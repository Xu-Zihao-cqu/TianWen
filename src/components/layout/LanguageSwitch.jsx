import { useTranslation } from 'react-i18next';

export default function LanguageSwitch() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  const toggle = () => {
    const next = isZh ? 'en' : 'zh';
    i18n.changeLanguage(next);
    try { localStorage.setItem('i18n-language', next); } catch { /* 降级 */ }
  };

  return (
    <button
      onClick={toggle}
      className="px-2 py-1 text-xs font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
      title={isZh ? 'Switch to English' : '切换到中文'}
    >
      {isZh ? 'EN' : '中'}
    </button>
  );
}
