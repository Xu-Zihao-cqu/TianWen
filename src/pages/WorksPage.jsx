import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import CategoryGrid from '../components/features/CategoryGrid.jsx';
import { categories } from '../data/categories.js';

export default function WorksPage() {
  const { locale, t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Helmet>
        <title>{t('nav.works')} | 天问 TianWen</title>
        <meta name="description" content={locale === 'zh'
          ? '硬件、软件、资源分享与在校作业 — 四大板块作品集。'
          : 'Hardware, software, resources and assignments — four categories of works.'} />
      </Helmet>
      <PageHeader
        className="mb-8"
        title={locale === 'zh' ? '作品集' : 'Portfolio'}
        subtitle={locale === 'zh'
          ? '四大板块，涵盖硬件、软件、资源与作业'
          : 'Four categories covering hardware, software, resources, and assignments'}
      />
      <CategoryGrid categories={categories} />
    </div>
  );
}
