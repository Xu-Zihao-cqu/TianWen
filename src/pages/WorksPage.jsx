import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import CategoryGrid from '../components/features/CategoryGrid.jsx';
import { categories } from '../data/categories.js';

export default function WorksPage() {
  const { locale, t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <Helmet>
        <title>{t('nav.works')} | 天问 TianWen</title>
        <meta name="description" content={locale === 'zh'
          ? '硬件、软件、资源、作业与博客 — 五个持续探索的方向。'
          : 'Hardware, software, resources, assignments and Blog — five disciplines.'} />
      </Helmet>
      <PageHeader
        className="mb-8"
        title={locale === 'zh' ? '作品集' : 'Portfolio'}
        subtitle={locale === 'zh'
          ? '五个方向，一份持续生长的创造记录'
          : 'Five disciplines. One ever-evolving body of work.'}
      />
      <CategoryGrid categories={categories} />
    </div>
  );
}
