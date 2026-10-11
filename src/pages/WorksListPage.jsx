import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n.js';
import { useTagFilter } from '../hooks/useTagFilter.js';
import { useWorks } from '../hooks/useWorks.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { categories } from '../data/categories.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import TagFilter from '../components/features/TagFilter.jsx';
import WorkCardGrid from '../components/features/WorkCardGrid.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function WorksListPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { locale } = useI18n();

  const { works: allWorks, loading, error, retry } = useWorks();
  const { role } = useAuth();
  const works = useMemo(() => category ? allWorks.filter(w => w.category === category) : allWorks, [allWorks, category]);

  const selectedTags = useMemo(
    () => searchParams.get('tags')?.split(',').filter(Boolean) || [],
    [searchParams],
  );

  const { filteredWorks, availableTags } = useTagFilter(works, selectedTags);

  const handleTagToggle = (tag) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    if (next.length) {
      setSearchParams({ tags: next.join(',') });
    } else {
      setSearchParams({});
    }
  };

  const categoryInfo = categories.find((c) => c.id === category);
  const title = categoryInfo
    ? categoryInfo.name[locale]
    : (locale === 'zh' ? '全部作品' : 'All Works');
  const subtitle = categoryInfo
    ? categoryInfo.description[locale]
    : undefined;
  const seoTitle = categoryInfo
    ? `${categoryInfo.name[locale]} | 天问 TianWen`
    : '天问 TianWen';

  const allTags = useMemo(() => [...new Set(works.flatMap(w => w.tags))].sort(), [works]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Helmet>
        <title>{seoTitle}</title>
        {subtitle && <meta name="description" content={subtitle} />}
      </Helmet>
      <PageHeader title={title} subtitle={subtitle} className="mb-8" />
      {role === 'Developer' && <Link to="/works/new" className="studio-button mb-6">{locale === 'zh' ? '上传作品' : 'Upload work'}</Link>}
      {loading && <p role="status" className="mb-4 text-sm text-slate-500">{locale === 'zh' ? '正在加载线上作品…' : 'Loading uploaded works…'}</p>}
      {error && <p role="alert" className="mb-4 text-sm text-slate-500">{error} <button onClick={retry} className="underline">{locale === 'zh' ? '重试' : 'Retry'}</button></p>}
      <TagFilter
        availableTags={allTags}
        selectedTags={selectedTags}
        onToggle={handleTagToggle}
      />
      {filteredWorks.length > 0 ? (
        <WorkCardGrid works={filteredWorks} />
      ) : (
        <EmptyState
          icon="share-2"
          title={locale === 'zh' ? '暂无作品' : 'No works yet'}
          description={locale === 'zh' ? '敬请期待更多作品发布' : 'Stay tuned for more works'}
        />
      )}
    </div>
  );
}
