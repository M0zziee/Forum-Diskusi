import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trophy, ArrowLeft, Medal, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import Loading from '../components/Loading';
import { asyncGetLeaderboard } from '../states/leaderboardSlice';

const rankIcons = {
  0: Crown,
  1: Medal,
  2: Medal,
};

const rankColors = {
  0: 'text-yellow-500',
  1: 'text-gray-400',
  2: 'text-amber-600',
};

function LeaderboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leaderboards, loading } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(asyncGetLeaderboard());
  }, [dispatch]);

  const sorted = [...leaderboards].sort((a, b) => b.score - a.score);

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loading />
          ) : sorted.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Belum ada data leaderboard
            </p>
          ) : (
            <div className="space-y-2">
              {sorted.map((item, index) => {
                const RankIcon = rankIcons[index];
                return (
                  <div
                    key={item.user.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      index < 3 ? 'bg-muted/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 shrink-0">
                      {index < 3 ? (
                        <RankIcon className={`h-5 w-5 ${rankColors[index]}`} />
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={item.user.avatar} alt={item.user.name} />
                      <AvatarFallback>
                        {item.user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.user.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{item.score}</p>
                      <p className="text-xs text-muted-foreground">poin</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LeaderboardPage;
