# Cash Management

Aplikasi prototype pengelolaan keuangan pribadi (v1) berbasis web. Setiap akun
memiliki buku kas sendiri: kategori, transaksi pemasukan/pengeluaran, dan
rekap dashboard bulanan. Antarmuka menggunakan Bahasa Indonesia dan mendukung
mode terang/gelap.

## Ruang lingkup v1

Fitur yang tersedia:

- Autentikasi email + password melalui Supabase Auth (`/signup`, `/login`,
  logout).
- Manajemen kategori: tambah, ubah nama, hapus kategori yang tidak terpakai.
- Manajemen transaksi: tambah, ubah, hapus, dan daftar per bulan.
- Dashboard: kartu pemasukan/pengeluaran/saldo dan rekap per kategori.
- Isolasi data per akun, proteksi route, validasi server, dan state loading /
  error / empty.

Fitur yang **tidak** ada di v1: reset password, verifikasi email, OAuth/MFA,
profil, dompet, budget, transaksi berulang, pencarian, filter, pagination,
grafik, dan ekspor. Pemulihan akun dilakukan manual oleh pemilik proyek lewat
dashboard Supabase (lihat [Pemulihan akun](#pemulihan-akun)).

## Stack dan prasyarat

| Kebutuhan | Versi / catatan |
| --- | --- |
| Node.js | 20.9 atau lebih baru (disarankan LTS 22) |
| pnpm | 10.x (`corepack enable` akan mengaktifkan versi dari `packageManager`) |
| PostgreSQL / Supabase | Satu project Supabase untuk development; koneksi Drizzle memakai *session-mode pooler* port `5432` |
| Browser modern | Untuk QA UI manual (Chrome, Firefox, atau Safari) |

Stack utama: Next.js 16 (App Router, Turbopack, Cache Components), React 19,
TypeScript, Tailwind CSS 4 + shadcn/ui, Drizzle ORM + `postgres`, Supabase Auth
via `@supabase/ssr`, Zod untuk validasi, dan Vitest untuk test otomatis.

## Instalasi

```bash
# 1. Aktifkan pnpm dan instal dependensi
corepack enable
pnpm install

# 2. Salin template environment
cp .env.example .env

# 3. Isi semua variabel di .env (lihat bagian berikutnya)
```

Jangan pernah meng-commit `.env`, password, token, atau kunci
`service_role`. File `.env` sudah masuk `.gitignore`; hanya `.env.example`
yang boleh disimpan di repository.

## Variabel environment

| Variabel | Wajib | Fungsi |
| --- | --- | --- |
| `DATABASE_URL` | Ya | URL koneksi Postgres untuk Drizzle dan `drizzle-kit`. Gunakan *session-mode pooler* Supabase, port `5432`. Hanya dipakai di server. |
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | URL project Supabase, mis. `https://<project-ref>.supabase.co`. Boleh publik. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Ya | Kunci publishable/anon Supabase. Boleh publik karena dilindungi RLS. **Jangan** memakai `service_role` di sini. |
| `ALLOW_DB_TESTS` | Untuk `test:db` | Set `1` hanya saat menjalankan test integrasi pada database development. Nilai default di `.env.example` adalah `0`. |
| `TEST_USER_A_EMAIL`, `TEST_USER_A_PASSWORD` | Untuk `test:db` | Akun uji A. Dibuat otomatis saat pertama kali test dijalankan bila belum ada. |
| `TEST_USER_B_EMAIL`, `TEST_USER_B_PASSWORD` | Untuk `test:db` | Akun uji B untuk memverifikasi isolasi data. |

Contoh isian tanpa data rahasia ada di `.env.example`. Untuk akun uji, pakai
email domain contoh (`example.com`) dan password khusus test yang tidak dipakai
di akun lain. `pnpm test:db` menolak berjalan bila `NODE_ENV=production`,
`ALLOW_DB_TESTS` bukan `1`, atau `DATABASE_URL` kosong.

## Konfigurasi Supabase

Lakukan di dashboard Supabase project development:

1. **Project Settings → API**: salin *Project URL* ke
   `NEXT_PUBLIC_SUPABASE_URL` dan *Publishable key* ke
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. **Connect → Session mode pooler (port 5432)**: salin connection string ke
   `DATABASE_URL` dan isi password database. Jangan memakai kunci
   `service_role`.
3. **Authentication → Providers → Email**: aktifkan provider Email.
4. **Authentication → Settings**:
   - **Confirm email**: **nonaktif** (v1 mengharapkan signup langsung mendapat
     sesi dan masuk ke `/`). Aplikasi sebenarnya juga mendukung confirm email
     aktif, tetapi QA v1 memakai konfigurasi nonaktif.
   - **Minimum password length**: `8`.
   - **Allow new users to sign up**: aktif.
   - **Site URL**: `http://localhost:3000`.
   - Tambahkan `http://localhost:3000/**` pada *Redirect URLs* bila dashboard
     menampilkannya.
5. Pastikan rate limit Supabase Auth dibiarkan aktif; aplikasi memetakan error
   429 ke pesan Bahasa Indonesia dan tidak menonaktifkannya.

> Jika confirm email tidak sengaja aktif, signup tidak menghasilkan sesi.
> Matikan opsi tersebut lalu ulangi QA signup.

## Migrasi database

File migrasi sudah tersedia di `drizzle/` dan berasal dari `db/schema.ts`:

1. `0000_*.sql` — tabel `categories`, `transactions`, tipe enum, index,
   constraint unik `(user_id, lower(name))`, dan check nominal.
2. `0001_auth_user_foreign_keys.sql` — foreign key `user_id` ke `auth.users`
   dengan `ON DELETE CASCADE`.
3. `0002_enable_rls.sql` — mengaktifkan RLS dan membuat policy
   `*_owner_all` untuk `authenticated`.

Dari database development yang kosong:

```bash
pnpm db:migrate
```

Perintah ini mengapply seluruh migrasi di atas. `pnpm db:generate` hanya
diperlukan bila `db/schema.ts` diubah;hasilnya akan menjadi file SQL baru di
`drizzle/`. `pnpm db:studio` membuka Drizzle Studio untuk melihat data.

Catatan penting:

- Jangan jalankan migrasi ke database remote/produksi tanpa persetujuan
  eksplisit pemilik data.
- Jangan membuat tabel `auth.users` tiruan atau mengelola schema `auth` lewat
  Drizzle; schema tersebut milik Supabase.
- Jika upgrading dari skema lama yang sudah berisi data tanpa `user_id`,
  siapkan rencana backfill terlebih dahulu. Untuk instalasi baru, tabel dimulai
  kosong dan tidak perlu seed otomatis.
- RLS adalah pertahanan tambahan untuk akses lewat PostgREST/Supabase client.
  Koneksi Drizzle memakai `DATABASE_URL` langsung dan biasanya melewati RLS,
  sehingga aplikasi **tetap wajib** memfilter `user_id` di setiap query.

## Menjalankan aplikasi

```bash
pnpm dev
```

Buka `http://localhost:3000/signup` untuk membuat akun pertama.

### Alur autentikasi

- **Signup**: `/signup` → isi email, password (minimal 8 karakter), konfirmasi
  password → **Buat Akun**. Dengan confirm email nonaktif, sesi langsung aktif
  dan pengguna diarahkan ke `/` (dashboard).
- **Login**: `/login` → isi email dan password → **Masuk** → `/`. Password
  salah atau email tidak terdaftar memakai pesan generik yang sama.
- **Logout**: tombol **Keluar** di shell → `/login`. Setelah logout, refresh
  atau back pada halaman inti tetap meminta login.
- **Redirect**: pengguna tanpa sesi yang membuka halaman inti diarahkan ke
  `/login`; pengguna yang sudah login dan membuka `/login` atau `/signup`
  diarahkan ke `/`. Tidak ada parameter redirect dari input pengguna.
- Halaman inti: `/` (dashboard), `/transactions`, `/transactions/new`,
  `/transactions/[id]/edit`, `/categories`, `/categories/[id]/edit`.

### Isolasi data

Setiap akun hanya melihat dan mengubah kategori serta transaksinya sendiri.

- `user_id` selalu berasal dari sesi `requireUser()`, bukan dari form, URL,
  atau query string.
- Setiap query dan Server Action memfilter `user_id`.
- ID kategori/transaksi milik akun lain, atau ID yang tidak ada, ditampilkan
  sebagai halaman **404** tanpa mengonfirmasi keberadaan data.
- `categoryId` milik akun lain ditolak dengan pesan
  `Kategori tidak ditemukan. Muat ulang halaman.` dan tidak ada transaksi yang
  tersimpan.
- RLS pada `categories` dan `transactions` menambah lapisan perlindungan bagi
  akses langsung melalui Supabase client/PostgREST.

### Pemulihan akun

v1 belum menyediakan reset password atau verifikasi email. Untuk memulihkan
akun, pemilik proyek dapat mengubah password atau menghapus/mengonfirmasi user
melalui **Supabase Dashboard → Authentication → Users**. Fitur reset password
sendiri masuk kandidat v2.

## Perintah yang tersedia

```bash
pnpm dev         # menjalankan development server di http://localhost:3000
pnpm build       # build produksi (termasuk TypeScript check)
pnpm start       # menjalankan hasil build
pnpm lint        # ESLint
pnpm test        # unit test Vitest (TZ=UTC, tanpa database)
pnpm test:watch  # mode watch untuk loop red → green
pnpm test:db     # test integrasi database (development saja!)
pnpm db:generate # membuat migrasi baru dari perubahan schema
pnpm db:migrate  # mengapply migrasi ke DATABASE_URL
pnpm db:studio   # membuka Drizzle Studio
```

## Testing

Vitest berada di `devDependencies` dan dipakai untuk dua lapis otomatis:

- `pnpm test`: test logika murni dan helper/service (validasi, tanggal/bulan,
  currency, auth, banner, navigasi, tema, agregasi dashboard). Berjalan dengan
  `TZ=UTC` agar perilaku timezone deterministik dan tidak memerlukan database.
- `pnpm test:db`: test integrasi service database dan skema, termasuk isolasi
  dua akun, FK, check constraint, dan RLS. Test ini membuat/menggunakan akun uji
  Supabase yang ditentukan di `.env` dan menghapus hanya data transaksi/
  kategori milik akun uji tersebut.

> **Peringatan:** jalankan `pnpm test:db` hanya pada database development.
> Perintah ini berubah data dan membutuhkan `ALLOW_DB_TESTS=1`. Jangan pernah
> mengarahkannya ke database produksi.

UI (form, dialog, navigasi, theme toggle, responsivitas, dan aksesibilitas)
diverifikasi lewat QA manual di browser; tidak ada jsdom/Testing Library di
proyek ini.

## Hasil QA akhir

QA dijalankan pada 23 November 2026 terhadap development server dan database
development. Ringkasan bukti:

| Pemeriksaan | Hasil |
| --- | --- |
| `pnpm test` | Lulus — 14 file test, 99 test |
| `pnpm test:db` | Lulus — 4 file test integrasi, 43 test |
| `pnpm lint` | Lulus, tanpa error |
| `pnpm build` | Lulus, TypeScript check sukses |
| `pnpm dev` | `/signup`, `/login`, `/`, `/transactions`, `/categories`, dan form dapat dibuka |
| Migrasi dari database kosong | Lulus — 3 migrasi terapply, FK `auth.users` dan RLS + policy terpasang |
| Drift schema | Tidak ada — `pnpm db:generate` melaporkan "No schema changes" dan `drizzle-kit check` bersih |
| QA §12.1.1 (auth & isolasi, QA-AUTH-01..14) | Lulus |
| QA §12.1.2 (fitur keuangan, QA-01..27) | Lulus |
| Responsive §12.2 (375, 768, 1024, 1440 px) | Lulus |
| Command checks §12.3 | Lulus — tidak ada hydration mismatch, proxy menolak request tanpa sesi, tidak ada password/token di log |
| Definition of Done §13 | Terpenuhi seluruhnya |

Rincian eksekusi manual QA, termasuk data uji dua akun, IDOR, timezone, XSS,
double submit, dan keyboard, tersimpan di [`docs/QA-FINAL.md`](docs/QA-FINAL.md).

## Arsitektur dan desain

- `docs/ARCHITECHTURE.md`: aturan route group `(auth)` / `(core)`, penempatan
  halaman, komponen, service, dan test.
- `docs/DESIGN.md`: token warna, tipografi, spacing, komponen, state, motion,
  dan aksesibilitas.
- `docs/PRD.MD`: requirement produk, QA matrix, dan Definition of Done.
