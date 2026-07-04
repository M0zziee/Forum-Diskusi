import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { asyncGetThreads, asyncCreateThread } from '../states/threadsSlice';

function CreateThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.threads);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { title: '', category: '', body: '' },
  });

  const onSubmit = async (data) => {
    const result = await dispatch(asyncCreateThread({
      title: data.title.trim(),
      body: data.body.trim(),
      category: data.category.trim(),
    }));

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(asyncGetThreads());
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Buat Thread Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                placeholder="Masukkan judul thread..."
                {...register('title', {
                  required: 'Judul wajib diisi',
                  minLength: {
                    value: 5,
                    message: 'Judul minimal 5 karakter',
                  },
                })}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                placeholder="Contoh: redux, react, javascript"
                {...register('category', {
                  required: 'Kategori wajib diisi',
                })}
              />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Konten</Label>
              <Textarea
                id="body"
                placeholder="Tulis konten thread di sini..."
                {...register('body', {
                  required: 'Konten wajib diisi',
                  minLength: {
                    value: 10,
                    message: 'Konten minimal 10 karakter',
                  },
                })}
                rows={8}
              />
              {errors.body && (
                <p className="text-sm text-destructive">{errors.body.message}</p>
              )}
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              <Send className="h-4 w-4" />
              {loading ? 'Mempublikasikan...' : 'Publikasikan Thread'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateThreadPage;
