import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import threadsReducer from './threadsSlice';
import threadDetailReducer from './threadDetailSlice';
import leaderboardReducer from './leaderboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboard: leaderboardReducer,
  },
});

export default store;
