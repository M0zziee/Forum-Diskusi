/**
 * Skenario pengujian LoginPage component:
 *
 * - LoginPage harus menampilkan form login dengan field email dan password
 * - LoginPage harus menampilkan tombol "Login" yang dapat diklik
 * - LoginPage harus menampilkan link ke halaman register
 * - LoginPage harus menampilkan error dari Redux state
 */

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../states/authSlice';
import LoginPage from './LoginPage';

function createStore(initialState) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: initialState },
  });
}

function renderWithProviders(ui, initialState) {
  const store = createStore(initialState);
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );
}

describe('LoginPage component', () => {
  it('should render login form with email and password fields', () => {
    renderWithProviders(<LoginPage />, {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    expect(screen.getByPlaceholderText('Masukkan email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should render link to register page', () => {
    renderWithProviders(<LoginPage />, {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    expect(screen.getByText('Daftar di sini')).toBeInTheDocument();
    expect(screen.getByText('Daftar di sini').closest('a')).toHaveAttribute(
      'href',
      '/register',
    );
  });

  it('should display error message from Redux state', () => {
    renderWithProviders(<LoginPage />, {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: 'Email atau password salah',
    });

    expect(screen.getByText('Email atau password salah')).toBeInTheDocument();
  });

  it('should disable submit button when loading', () => {
    renderWithProviders(<LoginPage />, {
      user: null,
      isAuthenticated: false,
      loading: true,
      error: null,
    });

    expect(screen.getByRole('button', { name: /Memproses/i })).toBeDisabled();
  });
});
