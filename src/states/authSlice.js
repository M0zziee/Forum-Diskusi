import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, removeTokens } from '../utils/api';

const asyncRegister = createAsyncThunk(
  'auth/asyncRegister',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await api.register({ name, email, password });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncLogin = createAsyncThunk(
  'auth/asyncLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await api.login({ email, password });
      const user = await api.getOwnProfile();
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncGetOwnProfile = createAsyncThunk(
  'auth/asyncGetOwnProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await api.getOwnProfile();
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncLogout = createAsyncThunk(
  'auth/asyncLogout',
  async () => {
    await api.logout();
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asyncRegister.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(asyncRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(asyncLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asyncLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(asyncLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(asyncGetOwnProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(asyncGetOwnProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(asyncGetOwnProfile.rejected, (state) => {
        state.loading = false;
        removeTokens();
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(asyncLogout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export { asyncRegister, asyncLogin, asyncGetOwnProfile, asyncLogout };
export const { clearError } = authSlice.actions;
export default authSlice.reducer;
