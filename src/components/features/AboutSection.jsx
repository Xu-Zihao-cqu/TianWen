import { useI18n } from '../../hooks/useI18n.js';
import SectionTitle from '../ui/SectionTitle.jsx';

export default function AboutSection({ bio }) {
  const { locale } = useI18n();

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 md:py-28">
      <SectionTitle title={locale === 'zh' ? '关于我' : 'About Me'} />

      <div className="grid md:grid-cols-5 gap-10 items-center">
        {/* 左侧文字 */}
        <div className="md:col-span-3">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {bio[locale]}
          </p>
        </div>

        {/* 右侧装饰 */}
        <div className="md:col-span-2 hidden md:flex justify-center">
          <div className="w-48 h-48 rounded-2xl gradient-primary opacity-20 rotate-6" />
          <div className="w-48 h-48 rounded-2xl gradient-primary opacity-10 -rotate-6 -ml-12" />
        </div>
      </div>
    </section>
  );
}
