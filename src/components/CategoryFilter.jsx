import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter } from '../states/threadsSlice';

function CategoryFilter() {
  const dispatch = useDispatch();
  const { threads, categoryFilter } = useSelector((state) => state.threads);

  const categories = [...new Set(threads.map((t) => t.category).filter(Boolean))];

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <button
        onClick={() => dispatch(setCategoryFilter(''))}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          !categoryFilter
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => dispatch(setCategoryFilter(cat))}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            categoryFilter === cat
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
