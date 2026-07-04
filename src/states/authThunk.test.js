/**
 * Skenario pengujian asyncLogin thunk:
 *
 * - asyncLogin sukses: harus dispatch pending -> fulfilled dengan data user
 * - asyncLogin gagal: harus dispatch pending -> rejected dengan pesan error
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer, { asyncLogin } from './authSlice';
import { api } from '../utils/api';

vi.mock('../utils/api');

describe('asyncLogin thunk', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
    });
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should dispatch fulfilled with user data on successful login', async () => {
    const user = { id: 'user-1', name: 'John', email: 'john@test.com' };
    api.login.mockResolvedValue({ token: 'valid-token' });
    api.getOwnProfile.mockResolvedValue(user);

    await store.dispatch(asyncLogin({ email: 'john@test.com', password: 'secret' }));

    const state = store.getState().auth;
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should dispatch rejected with error message on failed login', async () => {
    api.login.mockRejectedValue(new Error('Email atau password salah'));

    await store.dispatch(asyncLogin({ email: 'wrong@test.com', password: 'wrong' }));

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Email atau password salah');
  });

  it('should dispatch rejected when getOwnProfile fails after login', async () => {
    api.login.mockResolvedValue({ token: 'valid-token' });
    api.getOwnProfile.mockRejectedValue(new Error('Token tidak valid'));

    await store.dispatch(asyncLogin({ email: 'john@test.com', password: 'secret' }));

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe('Token tidak valid');
  });
});
