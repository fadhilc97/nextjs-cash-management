# Arsitektur Dasar

Dokumen ini adalah acuan struktur kode aplikasi Cash Management. Aturan di sini wajib diikuti untuk setiap halaman dan fitur baru.

Aplikasi memakai Next.js App Router dengan dua route group utama.

| Route group | Peruntukan | Contoh |
| --- | --- | --- |
| `app/(auth)/` | Semua halaman dan fitur autentikasi yang dapat diakses tanpa sesi. | Login, signup/register, lupa/reset password, callback auth, Server Action autentikasi |
| `app/(core)/` | Semua halaman dan fitur yang memerlukan autentikasi. | Dashboard, transaksi, kategori, pengaturan, Server Action fitur tersebut |

## Struktur yang diharapkan

```text
app/
├─ layout.tsx                 # root layout: html/body, font, metadata, theme
├─ globals.css
├─ (auth)/
│  ├─ layout.tsx              # layout auth, tanpa sidebar/nav aplikasi
│  ├─ login/page.tsx          # /login
│  ├─ signup/page.tsx         # /signup (register / Buat Akun)
│  └─ actions.ts              # signIn, signUp, signOut
└─ (core)/
   ├─ layout.tsx              # AppShell + user aktif
   ├─ page.tsx                # / (Dashboard)
   ├─ transactions/
   │  ├─ page.tsx             # /transactions
   │  ├─ new/page.tsx         # /transactions/new
   │  ├─ [id]/edit/page.tsx   # /transactions/:id/edit
   │  └─ actions.ts
   └─ categories/
      ├─ page.tsx             # /categories
      ├─ [id]/edit/page.tsx   # /categories/:id/edit
      └─ actions.ts
```

Route group tidak memengaruhi URL. `app/(auth)/login/page.tsx` menghasilkan `/login`, sedangkan `app/(core)/page.tsx` menghasilkan `/`.

## Aturan penempatan

- Halaman atau fitur yang membutuhkan sesi login **wajib** berada di `app/(core)/`. Jangan membuat halaman bisnis langsung di `app/` atau di `app/(auth)/`.
- Semua yang berkaitan dengan autentikasi **wajib** berada di `app/(auth)/`, termasuk layout, form, dan Server Action autentikasi. Action tersebut tetap boleh diimpor oleh komponen di `(core)`, misalnya tombol logout.
- Root `app/layout.tsx` hanya berisi `html`, `body`, font, metadata, dan theme. Jangan memuat AppShell, navigasi aplikasi, atau query database di sini.
- Jangan membuat path yang sama di kedua group karena akan bentrok. Dashboard harus berada di `app/(core)/page.tsx`, bukan `app/page.tsx`.
- Komponen khusus satu fitur disimpan dekat fiturnya, misalnya `app/(core)/transactions/_components/`. Komponen UI bersama disimpan di `components/`.
- Logika server dan akses data disimpan di `services/`, `db/`, dan `lib/`. Jangan mengimpor modul tersebut dari Client Component.
- Semua mutasi memakai Server Action tervalidasi yang berada di group terkait. Jangan membuat REST API/route handler hanya untuk mutasi.

## Proteksi route dan sesi

- `proxy.ts` hanya melakukan refresh sesi dan guard optimistis. Proxy bukan satu-satunya pengaman.
- Setiap page di `app/(core)/` dan setiap Server Action yang membaca atau mengubah data **wajib** memanggil `requireUser()` dari `lib/auth.ts` sebelum mengakses data, meskipun layout sudah memanggilnya.
- Pengguna tanpa sesi yang membuka area `(core)` diarahkan ke `/login`. Pengguna yang sudah login dan membuka halaman `(auth)` diarahkan ke `/`.
- `user_id` selalu berasal dari sesi hasil `requireUser()`. Jangan pernah mengambil `user_id` dari `FormData`, query string, atau URL.
- Autentikasi memakai Supabase Auth melalui `@supabase/ssr`; CRUD data memakai Drizzle melalui `services/`.

> Catatan: bila `docs/PRD.MD` masih menyebut route group `(app)` atau `app/actions/auth.ts`, ikuti aturan di dokumen ini: gunakan `(core)` dan tempatkan fitur/action autentikasi di `(auth)`.
