import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';

function VoteButton({
  upVotes = [],
  downVotes = [],
  onUpVote,
  onDownVote,
  userId,
}) {
  const hasUpVoted = userId && upVotes.includes(userId);
  const hasDownVoted = userId && downVotes.includes(userId);

  const handleUpVote = (e) => {
    e.stopPropagation();
    if (onUpVote) onUpVote();
  };

  const handleDownVote = (e) => {
    e.stopPropagation();
    if (onDownVote) onDownVote();
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleUpVote}
          className={hasUpVoted ? 'text-blue-600 hover:text-blue-700' : 'text-muted-foreground'}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium tabular-nums text-muted-foreground min-w-[1rem] text-center">
          {upVotes.length}
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleDownVote}
          className={hasDownVoted ? 'text-red-600 hover:text-red-700' : 'text-muted-foreground'}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium tabular-nums text-muted-foreground min-w-[1rem] text-center">
          {downVotes.length}
        </span>
      </div>
    </div>
  );
}

export default VoteButton;
