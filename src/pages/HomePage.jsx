import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import ThreadItem from '../components/ThreadItem';
import CategoryFilter from '../components/CategoryFilter';
import Loading from '../components/Loading';
import { asyncGetThreads } from '../states/threadsSlice';
import useAuth from '../hooks/useAuth';

function HomePage() {
  const dispatch = useDispatch();
  const { threads, loading, categoryFilter } = useSelector((state) => state.threads);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    dispatch(asyncGetThreads());
  }, [dispatch]);

  const filteredThreads = categoryFilter
    ? threads.filter((t) => t.category === categoryFilter)
    : threads;

  const sortedThreads = [...filteredThreads].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Diskusi Terbaru</h1>
        {isAuthenticated && (
          <Button asChild>
            <Link to="/threads/new">
              <Plus className="h-4 w-4" />
              Buat Thread
            </Link>
          </Button>
        )}
      </div>

      <CategoryFilter />

      {loading ? (
        <Loading />
      ) : sortedThreads.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Belum ada diskusi</p>
          <p className="text-sm mt-1">
            {isAuthenticated
              ? 'Jadilah yang pertama membuat thread!'
              : 'Login untuk membuat thread baru.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedThreads.map((thread) => (
            <ThreadItem key={thread.id} thread={thread} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
