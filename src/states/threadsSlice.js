import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

const asyncCreateThread = createAsyncThunk(
  'threads/asyncCreateThread',
  async ({ title, body, category }, { rejectWithValue }) => {
    try {
      return await api.createThread({ title, body, category });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncGetThreads = createAsyncThunk(
  'threads/asyncGetThreads',
  async (_, { rejectWithValue }) => {
    try {
      const { threads } = await api.getThreads();
      let users = [];
      try {
        const result = await api.getUsers();
        users = result.users;
      } catch {
        // users data is optional for rendering
      }
      return { threads, users };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    threads: [],
    loading: false,
    error: null,
    categoryFilter: '',
  },
  reducers: {
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asyncGetThreads.fulfilled, (state, action) => {
        state.loading = false;
        const { threads, users } = action.payload;
        const usersMap = Object.fromEntries(users.map((u) => [u.id, u]));
        state.threads = threads.map((t) => ({
          ...t,
          user: usersMap[t.ownerId] || null,
        }));
      })
      .addCase(asyncGetThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(asyncCreateThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asyncCreateThread.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(asyncCreateThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export { asyncGetThreads, asyncCreateThread };
export const { setCategoryFilter } = threadsSlice.actions;
export default threadsSlice.reducer;
