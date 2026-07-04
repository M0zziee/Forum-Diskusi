import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MessageSquare, Trophy, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import useAuth from '../hooks/useAuth';
import { asyncLogout } from '../states/authSlice';

function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(asyncLogout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-4xl">
        <Link to="/" className="flex items-center gap-2 font-heading font-semibold text-lg">
          <MessageSquare className="h-5 w-5 text-primary" />
          Forum Diskusi
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/leaderboard">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2" disabled>
                  <User className="h-4 w-4" />
                  {user?.name}
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/register">
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
