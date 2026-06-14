import { useTranslation } from 'react-i18next';

/**
 * 扩展国际化 Hook
 * - t(key): 翻译 UI 文案
 * - locale: 当前语言 'zh' | 'en'
 * - isZh / isEn: 语言判断快捷方式
 *
 * 内容文案（数据文件中 { zh, en } 对象）直接 locale 索引：
 *   const { locale } = useI18n();
 *   <span>{work.title[locale]}</span>
 */
export function useI18n() {
  const { t, i18n } = useTranslation();
  return {
    t,
    locale: i18n.language,
    isZh: i18n.language === 'zh',
    isEn: i18n.language === 'en',
  };
}
