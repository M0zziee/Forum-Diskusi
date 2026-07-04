import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

const asyncGetLeaderboard = createAsyncThunk(
  'leaderboard/asyncGetLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const { leaderboards } = await api.getLeaderboard();
      return leaderboards;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    leaderboards: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asyncGetLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboards = action.payload;
      })
      .addCase(asyncGetLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export { asyncGetLeaderboard };
export default leaderboardSlice.reducer;
