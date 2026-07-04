import { Link } from 'react-router-dom';
import { MessageCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

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

function ThreadItem({ thread }) {
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const cleanBody = stripHtml(thread.body).substring(0, 150);

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/threads/${thread.id}`}
            className="font-heading font-semibold text-base hover:text-primary transition-colors leading-tight"
          >
            {thread.title}
          </Link>
          {thread.category && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              {thread.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {cleanBody && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {cleanBody}
            {thread.body.length > 150 ? '...' : ''}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={thread.user?.avatar} alt={thread.user?.name} />
              <AvatarFallback className="text-[9px]">
                {thread.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span>{thread.user?.name || 'Pengguna'}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(thread.createdAt)}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {thread.totalComments}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ThreadItem;
