import CategoryCard from './CategoryCard.jsx';
import { useWorks } from '../../hooks/useWorks.js';

export default function CategoryGrid({ categories }) {
  const { works } = useWorks();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...categories]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            count={works.filter(w => w.category === cat.id).length}
          />
        ))}
    </div>
  );
}
