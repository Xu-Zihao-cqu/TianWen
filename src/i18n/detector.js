function normalizeLanguage(lang) {
  if (!lang) return 'zh';
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('en')) return 'en';
  return 'zh';
}

export function detectLanguage() {
  try {
    const stored = localStorage.getItem('i18n-language');
    if (stored === 'zh' || stored === 'en') return stored;
  } catch { /* 降级 */ }
  if (typeof navigator !== 'undefined') return normalizeLanguage(navigator.language);
  return 'zh';
}
