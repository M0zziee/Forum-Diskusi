import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import CreateThreadPage from './pages/CreateThreadPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LeaderboardPage from './pages/LeaderboardPage';
import useAuth from './hooks/useAuth';

function ProtectedPage({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function GuestPage({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans">
        <Navbar />
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/threads/new"
              element={
                <ProtectedPage>
                  <CreateThreadPage />
                </ProtectedPage>
              }
            />
            <Route path="/threads/:id" element={<DetailPage />} />
            <Route
              path="/register"
              element={
                <GuestPage>
                  <RegisterPage />
                </GuestPage>
              }
            />
            <Route
              path="/login"
              element={
                <GuestPage>
                  <LoginPage />
                </GuestPage>
              }
            />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
