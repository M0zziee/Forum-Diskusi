import { Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import VoteButton from './VoteButton';

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

function CommentItem({ comment, userId, onUpVote, onDownVote }) {
  return (
    <div className="flex gap-3 py-4 border-b last:border-b-0">
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        <AvatarImage src={comment.user?.avatar} alt={comment.user?.name} />
        <AvatarFallback className="text-xs">
          {comment.user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">{comment.user?.name || 'Pengguna'}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
        <div className="mt-2">
          <VoteButton
            upVotes={comment.upVotesBy}
            downVotes={comment.downVotesBy}
            userId={userId}
            onUpVote={onUpVote}
            onDownVote={onDownVote}
            size="xs"
          />
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
