import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import SectionTitle from '../ui/SectionTitle.jsx';
import WorkCard from './WorkCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function FeaturedWorks({ works }) {
  const { locale } = useI18n();

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 md:py-28">
      <div className="flex items-end justify-between mb-10">
        <SectionTitle
          title={locale === 'zh' ? '精选作品' : 'Featured Works'}
          className="mb-0"
        />
        <Link
          to="/works"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary dark:text-primary-dark hover:underline"
        >
          {locale === 'zh' ? '查看全部' : 'View All'}
          <ArrowRight size={16} />
        </Link>
      </div>

      {works.length === 0 ? (
        <EmptyState
          icon="share-2"
          title={locale === 'zh' ? '暂无精选作品' : 'No featured works yet'}
        />
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} compact />
          ))}
        </div>
      )}
    </section>
  );
}
