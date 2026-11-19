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

components/
└─ ui/                        # primitif shadcn/ui (button, card, input, label, alert)

lib/
├─ auth/
│  ├─ index.ts                # getUser dan requireUser
│  ├─ errors.ts               # pemetaan error auth
│  ├─ routing.ts              # aturan redirect auth
│  └─ state.ts                # state error action auth
├─ utils.ts                   # helper cn (clsx + tailwind-merge)
├─ date.ts                    # helper tanggal Asia/Jakarta
├─ month.ts                   # helper bulan dan rentang query
├─ currency.ts                # format rupiah dan parsing nominal
└─ validation.ts              # validasi field dan copy error

utils/
└─ types/
   └─ auth.ts                 # tipe, interface, dan enum auth

tests/
├─ auth/
│  ├─ errors.test.ts          # unit test pemetaan error auth
│  ├─ routing.test.ts         # unit test aturan redirect auth
│  └─ state.test.ts           # unit test state error auth
├─ date.test.ts               # unit test helper tanggal
├─ month.test.ts              # unit test helper bulan
├─ currency.test.ts           # unit test helper mata uang
├─ validation.test.ts         # unit test validasi
└─ *.integration.test.ts      # test integrasi database (T03)
```

Route group tidak memengaruhi URL. `app/(auth)/login/page.tsx` menghasilkan `/login`, sedangkan `app/(core)/page.tsx` menghasilkan `/`.

## Aturan penempatan

- Halaman atau fitur yang membutuhkan sesi login **wajib** berada di `app/(core)/`. Jangan membuat halaman bisnis langsung di `app/` atau di `app/(auth)/`.
- Semua yang berkaitan dengan autentikasi **wajib** berada di `app/(auth)/`, termasuk layout, form, dan Server Action autentikasi. Action tersebut tetap boleh diimpor oleh komponen di `(core)`, misalnya tombol logout.
- Root `app/layout.tsx` hanya berisi `html`, `body`, font, metadata, dan theme. Jangan memuat AppShell, navigasi aplikasi, atau query database di sini.
- Jangan membuat path yang sama di kedua group karena akan bentrok. Dashboard harus berada di `app/(core)/page.tsx`, bukan `app/page.tsx`.
- Komponen khusus satu fitur disimpan dekat fiturnya, misalnya `app/(core)/transactions/_components/`. Komponen UI bersama disimpan di `components/`.
- Primitif UI wajib memakai shadcn/ui di `components/ui/`. Tambahkan komponen lewat `pnpm dlx shadcn@latest add <nama>`; jangan menulis ulang Button, Input, Card, Label, atau Alert dari nol. Sesuaikan tampilan lewat token, variant, dan `className`.
- Logika server dan akses data disimpan di `services/`, `db/`, dan `lib/`. Jangan mengimpor modul tersebut dari Client Component.
- Logika auth berada di `lib/auth/`; tipe, interface, dan enum auth yang diekspor disimpan di `utils/types/auth.ts`, bukan di file logika.
- Semua mutasi memakai Server Action tervalidasi yang berada di group terkait. Jangan membuat REST API/route handler hanya untuk mutasi.

## Penempatan test

- Seluruh test otomatis disimpan di `tests/`, bukan di samping file implementasi. Pengecualian hanya file konfigurasi seperti `vitest.config.mts`.
- Kelompokkan test fitur ke subdirektori bernama fitur, misalnya `tests/auth/`, tanpa prefix nama fitur pada nama file (`routing.test.ts`, bukan `auth-routing.test.ts`).
- Test fungsi murni dan service memakai akhiran `*.test.ts`; test integrasi database memakai akhiran `*.integration.test.ts`.
- `pnpm test` menjalankan seluruh `tests/**/*.test.ts` dengan Vitest environment Node dan `TZ=UTC`, serta mengecualikan `*.integration.test.ts`.
- `pnpm test:watch` dipakai untuk loop red → green. Test integrasi database dijalankan terpisah pada ticket yang membutuhkannya.
- Gunakan alias `@` untuk mengimpor modul aplikasi dari `tests/`, misalnya `@/lib/date`.
- Jangan menambahkan jsdom atau Testing Library. Test komponen/browser tidak dipakai; UI diverifikasi manual.
- Vitest hanya boleh berada di `devDependencies`. Jangan menambah library tanggal, uang, atau validasi baru untuk keperluan test.

## Proteksi route dan sesi

- `proxy.ts` hanya melakukan refresh sesi dan guard optimistis. Proxy bukan satu-satunya pengaman.
- Setiap page di `app/(core)/` dan setiap Server Action yang membaca atau mengubah data **wajib** memanggil `requireUser()` dari `lib/auth` sebelum mengakses data, meskipun layout sudah memanggilnya.
- Pengguna tanpa sesi yang membuka area `(core)` diarahkan ke `/login`. Pengguna yang sudah login dan membuka halaman `(auth)` diarahkan ke `/`.
- `user_id` selalu berasal dari sesi hasil `requireUser()`. Jangan pernah mengambil `user_id` dari `FormData`, query string, atau URL.
- Autentikasi memakai Supabase Auth melalui `@supabase/ssr`; CRUD data memakai Drizzle melalui `services/`.
- Email confirmation didukung. Bila aktif, signup membuat user tanpa sesi dan form menampilkan instruksi konfirmasi (bukan error); setelah konfirmasi pengguna masuk lewat `/login`. Bila nonaktif, signup langsung membuat sesi dan redirect `/`.

> Catatan: bila `docs/PRD.MD` masih menyebut route group `(app)` atau `app/actions/auth.ts`, ikuti aturan di dokumen ini: gunakan `(core)` dan tempatkan fitur/action autentikasi di `(auth)`.
