# Aplikasi Forum Diskusi

Aplikasi forum diskusi berbasis React yang memanfaatkan Dicoding Forum API. Pengguna dapat mendaftar, login, melihat thread, membuat thread, berkomentar, dan melakukan voting.

## Fitur

### Fungsionalitas Utama
- **Registrasi & Login** — Mendaftar akun baru dan login dengan JWT authentication
- **Daftar Thread** — Menampilkan semua thread dengan informasi judul, konten, waktu, jumlah komentar, dan profil pembuat
- **Detail Thread** — Melihat thread lengkap beserta komentar di dalamnya
- **Buat Thread** — Membuat thread baru (perlu login)
- **Buat Komentar** — Berkomentar di dalam thread (perlu login)
- **Loading Indicator** — Animasi loading saat memuat data dari API

### Fitur Bonus
- **Voting** — Upvote/downvote thread dan komentar dengan indikasi warna
- **Leaderboard** — Halaman peringkat pengguna berdasarkan skor
- **Filter Kategori** — Filter thread berdasarkan kategori (client-side)

## Teknologi

- **React 19** — Library UI
- **Redux Toolkit** — State management
- **React Router** — Routing
- **shadcn/ui** — Komponen UI (Radix UI + Tailwind CSS)
- **Tailwind CSS v4** — Styling
- **Lucide React** — Ikon
- **Vite** — Build tool

## Memulai

### Prasyarat

- Node.js 18+
- npm 9+

### Instalasi

```bash
npm install
```

### Menjalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

### Build Produksi

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## API

Aplikasi ini menggunakan **Dicoding Forum API** dengan base URL `https://forum-api.dicoding.dev/v1`.

### Endpoints yang Digunakan

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/users` | Tidak | Registrasi |
| POST | `/login` | Tidak | Login |
| GET | `/users/me` | Ya | Profil sendiri |
| GET | `/threads` | Tidak | Daftar thread |
| GET | `/threads/:id` | Tidak | Detail thread |
| POST | `/threads` | Ya | Buat thread |
| POST | `/threads/:id/comments` | Ya | Buat komentar |
| POST | `/threads/:id/up-vote` | Ya | Upvote thread |
| POST | `/threads/:id/down-vote` | Ya | Downvote thread |
| POST | `/threads/:id/comments/:cid/up-vote` | Ya | Upvote komentar |
| POST | `/threads/:id/comments/:cid/down-vote` | Ya | Downvote komentar |
| GET | `/leaderboards` | Tidak | Leaderboard |

## Struktur Proyek

```
src/
├── components/       # Komponen UI reusable
│   ├── ui/           # shadcn/ui components
│   ├── Navbar.jsx
│   ├── ThreadItem.jsx
│   ├── CommentItem.jsx
│   ├── VoteButton.jsx
│   ├── CategoryFilter.jsx
│   └── Loading.jsx
├── pages/            # Halaman aplikasi
│   ├── HomePage.jsx
│   ├── DetailPage.jsx
│   ├── CreateThreadPage.jsx
│   ├── RegisterPage.jsx
│   ├── LoginPage.jsx
│   └── LeaderboardPage.jsx
├── states/           # Redux state management
│   ├── store.js
│   ├── authSlice.js
│   ├── threadsSlice.js
│   ├── threadDetailSlice.js
│   └── leaderboardSlice.js
├── hooks/            # Custom hooks
│   └── useAuth.js
├── utils/            # Utility functions
│   └── api.js
├── lib/              # shadcn utilities
│   └── utils.js
├── App.jsx           # Root component dengan routing
├── main.jsx          # Entry point
└── index.css         # Global styles & theme
```

## Tema

Aplikasi menggunakan tema dengan warna hijau sebagai warna primer, dengan dukungan mode terang dan gelap.

### Font
- **Public Sans Variable** — Font utama (sans-serif)
- **Figtree Variable** — Font heading

## Lisensi

Proyek ini dibuat untuk submission kelas Dicoding.
