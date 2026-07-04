/**
 * Skenario pengujian asyncGetThreads thunk:
 *
 * - asyncGetThreads sukses: harus memuat threads dengan data user yang sudah di-mapping
 * - asyncGetThreads gagal: harus mengisi state error
 * - asyncGetThreads ketika getUsers gagal: tetap harus memuat threads tanpa data user
 */

import { configureStore } from '@reduxjs/toolkit';
import threadsReducer, { asyncGetThreads } from './threadsSlice';
import { api } from '../utils/api';

vi.mock('../utils/api');

describe('asyncGetThreads thunk', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { threads: threadsReducer },
    });
    vi.clearAllMocks();
  });

  it('should dispatch fulfilled with threads mapped to users', async () => {
    const threads = [
      { id: 'thread-1', title: 'Thread 1', ownerId: 'user-1', body: 'Body 1' },
      { id: 'thread-2', title: 'Thread 2', ownerId: 'user-2', body: 'Body 2' },
    ];
    const users = [
      { id: 'user-1', name: 'John' },
      { id: 'user-2', name: 'Jane' },
    ];

    api.getThreads.mockResolvedValue({ threads });
    api.getUsers.mockResolvedValue({ users });

    await store.dispatch(asyncGetThreads());

    const state = store.getState().threads;
    expect(state.loading).toBe(false);
    expect(state.threads).toHaveLength(2);
    expect(state.threads[0].user).toEqual(users[0]);
    expect(state.threads[1].user).toEqual(users[1]);
    expect(state.error).toBeNull();
  });

  it('should dispatch rejected when getThreads fails', async () => {
    api.getThreads.mockRejectedValue(new Error('Gagal memuat threads'));

    await store.dispatch(asyncGetThreads());

    const state = store.getState().threads;
    expect(state.loading).toBe(false);
    expect(state.threads).toEqual([]);
    expect(state.error).toBe('Gagal memuat threads');
  });

  it('should still load threads when getUsers fails', async () => {
    const threads = [
      { id: 'thread-1', title: 'Thread 1', ownerId: 'user-1', body: 'Body 1' },
    ];

    api.getThreads.mockResolvedValue({ threads });
    api.getUsers.mockRejectedValue(new Error('Gagal memuat users'));

    await store.dispatch(asyncGetThreads());

    const state = store.getState().threads;
    expect(state.loading).toBe(false);
    expect(state.threads).toHaveLength(1);
    expect(state.threads[0].user).toBeNull();
  });
});
