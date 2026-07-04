import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Clock, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import Loading from '../components/Loading';
import VoteButton from '../components/VoteButton';
import CommentItem from '../components/CommentItem';
import useAuth from '../hooks/useAuth';
import {
  asyncGetThreadDetail,
  asyncCreateComment,
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncNeutralVoteThread,
  asyncUpVoteComment,
  asyncDownVoteComment,
  asyncNeutralVoteComment,
  clearThreadDetail,
  optimisticVoteThread,
  optimisticVoteComment,
} from '../states/threadDetailSlice';
import { asyncGetThreads } from '../states/threadsSlice';

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { thread, comments, loading } = useSelector((state) => state.threadDetail);
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    dispatch(asyncGetThreadDetail(id));
    return () => {
      dispatch(clearThreadDetail());
    };
  }, [dispatch, id]);

  const handleUpVoteThread = () => {
    if (!isAuthenticated || !user) return;
    const voteType = thread.upVotesBy.includes(user.id) ? 'neutral' : 'upvote';
    dispatch(optimisticVoteThread({ userId: user.id, voteType }));
    if (voteType === 'neutral') {
      dispatch(asyncNeutralVoteThread(thread.id));
    } else {
      dispatch(asyncUpVoteThread(thread.id));
    }
  };

  const handleDownVoteThread = () => {
    if (!isAuthenticated || !user) return;
    const voteType = thread.downVotesBy.includes(user.id) ? 'neutral' : 'downvote';
    dispatch(optimisticVoteThread({ userId: user.id, voteType }));
    if (voteType === 'neutral') {
      dispatch(asyncNeutralVoteThread(thread.id));
    } else {
      dispatch(asyncDownVoteThread(thread.id));
    }
  };

  const handleUpVoteComment = (commentId) => {
    if (!isAuthenticated || !thread || !user) return;
    const comment = comments.find((c) => c.id === commentId);
    const voteType = comment?.upVotesBy?.includes(user.id) ? 'neutral' : 'upvote';
    dispatch(optimisticVoteComment({ commentId, userId: user.id, voteType }));
    if (voteType === 'neutral') {
      dispatch(asyncNeutralVoteComment({ threadId: thread.id, commentId }));
    } else {
      dispatch(asyncUpVoteComment({ threadId: thread.id, commentId }));
    }
  };

  const handleDownVoteComment = (commentId) => {
    if (!isAuthenticated || !thread || !user) return;
    const comment = comments.find((c) => c.id === commentId);
    const voteType = comment?.downVotesBy?.includes(user.id) ? 'neutral' : 'downvote';
    dispatch(optimisticVoteComment({ commentId, userId: user.id, voteType }));
    if (voteType === 'neutral') {
      dispatch(asyncNeutralVoteComment({ threadId: thread.id, commentId }));
    } else {
      dispatch(asyncDownVoteComment({ threadId: thread.id, commentId }));
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!content.trim() || !thread) return;
    setCommentLoading(true);
    try {
      await dispatch(asyncCreateComment({ threadId: thread.id, content: content.trim() }));
      setContent('');
      dispatch(asyncGetThreads());
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading && !thread) return <Loading size="lg" />;

  if (!thread) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">Thread tidak ditemukan</p>
        <Button variant="ghost" onClick={() => navigate('/')} className="mt-2">
          Kembali ke beranda
        </Button>
      </div>
    );
  }

  const sortedComments = [...comments].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="font-heading text-xl mb-2">{thread.title}</CardTitle>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={thread.user?.avatar} alt={thread.user?.name} />
                    <AvatarFallback className="text-[10px]">
                      {thread.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{thread.user?.name}</span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatTime(thread.createdAt)}
                </span>
                {thread.category && <Badge variant="secondary">{thread.category}</Badge>}
              </div>
            </div>
            <VoteButton
              upVotes={thread.upVotesBy}
              downVotes={thread.downVotesBy}
              userId={user?.id}
              onUpVote={handleUpVoteThread}
              onDownVote={handleDownVoteThread}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: thread.body }}
          />
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="font-heading font-semibold text-lg mb-4">
          Komentar ({comments.length})
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0 mt-1">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Tulis komentar..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                />
                <Button type="submit" disabled={commentLoading || !content.trim()} size="sm">
                  <Send className="h-3.5 w-3.5" />
                  {commentLoading ? 'Mengirim...' : 'Kirim Komentar'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 bg-muted rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              <Button variant="link" className="px-0 h-auto text-sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              {' '}untuk memberikan komentar
            </p>
          </div>
        )}

        {sortedComments.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        ) : (
          <Card>
            <CardContent className="p-0 divide-y">
              {sortedComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  userId={user?.id}
                  onUpVote={() => handleUpVoteComment(comment.id)}
                  onDownVote={() => handleDownVoteComment(comment.id)}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DetailPage;
