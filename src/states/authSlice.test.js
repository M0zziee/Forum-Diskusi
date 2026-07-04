/**
 * Skenario pengujian authSlice reducer:
 *
 * - asyncLogin.fulfilled: harus mengisi user dan isAuthenticated = true
 * - asyncLogin.rejected: harus mengisi error dan loading = false
 * - clearError: harus menghapus error
 * - asyncLogout.fulfilled: harus mereset user dan isAuthenticated = false
 * - asyncGetOwnProfile.fulfilled: harus memperbarui user
 * - asyncGetOwnProfile.rejected: harus reset token dan isAuthenticated
 */

import authReducer, {
  asyncLogin,
  asyncLogout,
  asyncGetOwnProfile,
  clearError,
} from './authSlice';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

describe('authSlice reducer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should handle asyncLogin.fulfilled', () => {
    const user = { id: 'user-1', name: 'John', email: 'john@test.com' };
    const action = { type: asyncLogin.fulfilled.type, payload: user };
    const state = authReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle asyncLogin.rejected', () => {
    const action = {
      type: asyncLogin.rejected.type,
      payload: 'Email atau password salah',
    };
    const state = authReducer(
      { ...initialState, loading: true },
      action,
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Email atau password salah');
    expect(state.isAuthenticated).toBe(false);
  });

  it('should handle clearError', () => {
    const state = authReducer(
      { ...initialState, error: 'Some error' },
      clearError(),
    );

    expect(state.error).toBeNull();
  });

  it('should handle asyncLogout.fulfilled', () => {
    const loggedInState = {
      user: { id: 'user-1', name: 'John' },
      isAuthenticated: true,
      loading: false,
      error: null,
    };
    const action = { type: asyncLogout.fulfilled.type };
    const state = authReducer(loggedInState, action);

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should handle asyncGetOwnProfile.fulfilled', () => {
    const user = { id: 'user-1', name: 'John Updated', email: 'john@test.com' };
    const action = { type: asyncGetOwnProfile.fulfilled.type, payload: user };
    const state = authReducer(
      { ...initialState, isAuthenticated: true, loading: true },
      action,
    );

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(user);
  });

  it('should handle asyncGetOwnProfile.rejected', () => {
    const action = { type: asyncGetOwnProfile.rejected.type };
    const state = authReducer(
      { ...initialState, isAuthenticated: true, loading: true },
      action,
    );

    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
