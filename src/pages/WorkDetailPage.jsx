import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n.js';
import { getWorkById } from '../data/works/index.js';
import Tag from '../components/ui/Tag.jsx';
import MarkdownRenderer from '../components/features/MarkdownRenderer.jsx';
import FileList from '../components/features/FileList.jsx';
import ExternalLinks from '../components/features/ExternalLinks.jsx';
import '../styles/prism-theme.css';

function WorkHeader({ work }) {
  const { locale } = useI18n();

  return (
    <>
      <Link
        to={`/works/${work.category}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-dark transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        返回
      </Link>

      <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-4">
        {work.title[locale]}
      </h1>

      <div className="flex flex-wrap gap-1.5 mb-8">
        {work.tags?.map((tag) => (
          <Tag key={tag} variant="colored">{tag}</Tag>
        ))}
      </div>
    </>
  );
}

export default function WorkDetailPage() {
  const { category, workId } = useParams();
  const { locale } = useI18n();

  const work = getWorkById(workId);

  if (!work) {
    return <Navigate to="/not-found" replace />;
  }

  const seoTitle = `${work.title[locale]} | 天问 TianWen`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={work.description?.short?.[locale]} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={work.description?.short?.[locale]} />
        <meta property="og:image" content={work.coverImage} />
      </Helmet>
      <WorkHeader work={work} />
      <section className="mb-12">
        <MarkdownRenderer content={work.description?.full?.[locale]} />
      </section>
      {work.files?.length > 0 && (
        <section className="mb-10">
          <FileList files={work.files} />
        </section>
      )}
      {work.externalLinks?.length > 0 && (
        <section>
          <ExternalLinks links={work.externalLinks} />
        </section>
      )}
    </div>
  );
}
