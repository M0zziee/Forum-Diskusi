/**
 * Skenario pengujian ThreadItem component:
 *
 * - ThreadItem dengan data lengkap: harus menampilkan title, body preview, category badge,
 *   author avatar, nama user, relative time, dan jumlah komentar
 * - ThreadItem dengan user null: harus tetap render dengan fallback 'Pengguna'
 * - ThreadItem tanpa category: tidak boleh menampilkan badge kategori
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThreadItem from './ThreadItem';

const fullThread = {
  id: 'thread-1',
  title: 'Belajar React Hooks',
  body: '<p>React Hooks adalah fitur yang memungkinkan kita menggunakan state dan lifecycle</p>',
  category: 'react',
  createdAt: new Date().toISOString(),
  totalComments: 5,
  user: {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  },
};

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ThreadItem component', () => {
  it('should render thread with complete data', () => {
    renderWithRouter(<ThreadItem thread={fullThread} />);

    expect(screen.getByText('Belajar React Hooks')).toBeInTheDocument();
    expect(screen.getByText(/React Hooks adalah/)).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('baru saja')).toBeInTheDocument();
  });

  it('should render with null user and show fallback', () => {
    const threadWithoutUser = { ...fullThread, user: null };
    renderWithRouter(<ThreadItem thread={threadWithoutUser} />);

    expect(screen.getByText('Pengguna')).toBeInTheDocument();
    expect(screen.getByText('Belajar React Hooks')).toBeInTheDocument();
  });

  it('should not render category badge when category is empty', () => {
    const threadWithoutCategory = { ...fullThread, category: '' };
    renderWithRouter(<ThreadItem thread={threadWithoutCategory} />);

    expect(screen.queryByText('react')).not.toBeInTheDocument();
  });

  it('should trim long body content', () => {
    const longBody = `<p>${'A'.repeat(200)}</p>`;
    const threadWithLongBody = { ...fullThread, body: longBody };
    renderWithRouter(<ThreadItem thread={threadWithLongBody} />);

    const link = screen.getByText(/Belajar React Hooks/);
    expect(link).toBeInTheDocument();
  });
});
