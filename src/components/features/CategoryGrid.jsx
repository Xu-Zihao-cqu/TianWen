import CategoryCard from './CategoryCard.jsx';
import { getWorksByCategory } from '../../data/works/index.js';

export default function CategoryGrid({ categories }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...categories]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            count={getWorksByCategory(cat.id).length}
          />
        ))}
    </div>
  );
}
