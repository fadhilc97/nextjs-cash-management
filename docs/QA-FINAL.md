# QA Akhir v1 — 23 November 2026 (direvalidasi 26 November 2026)

Dokumen ini mencatat hasil eksekusi QA Fase 7 (`docs/PRD.MD` §12) dan
pemeriksaan Definition of Done (§13). QA dijalankan pada development server
`pnpm dev`, database development Supabase, dan browser headless Chrome untuk
memastikan alur UI benar-benar berjalan (bukan hanya statis).

## Ringkasan hasil

| Pemeriksaan | Hasil |
| --- | --- |
| `pnpm test` | Lulus — 14 file, 99 test |
| `pnpm test:db` | Lulus — 4 file, 43 test |
| `pnpm lint` | Lulus, tanpa error |
| `pnpm build` | Lulus, TypeScript check sukses |
| `pnpm dev` | `/signup`, `/login`, `/`, `/transactions`, `/categories`, dan form dapat dibuka |
| Migrasi dari database kosong | Lulus — 3 migrasi terapply, FK `auth.users`, RLS, dan policy terpasang |
| Drift schema | Tidak ada — `pnpm db:generate` melaporkan "No schema changes", `drizzle-kit check` bersih |
| QA §12.1.1 (QA-AUTH-01..14) | Lulus |
| QA §12.1.2 (QA-01..27) | Lulus |
| Responsive §12.2 (375/768/1024/1440) | Lulus |
| Command checks §12.3 | Lulus — proxy menolak request tanpa sesi, tidak ada password/token di log |
| Definition of Done §13 | Terpenuhi seluruhnya |

## Catatan lingkungan QA

- Konfigurasi Supabase Auth untuk QA v1 adalah provider Email aktif, **confirm
  email nonaktif**, minimum password `8`, signup diizinkan, dan Site URL
  `http://localhost:3000`. Dengan konfigurasi tersebut signup mendapat sesi
  langsung dan redirect ke `/`, sebagaimana diwajibkan README.
- Pada 26 November 2026, `pnpm test` diulang tanpa menyentuh database: **14
  file / 99 test lulus**. Test `resolveSignUpOutcome` mencakup sesi langsung
  (confirm email nonaktif) dan hasil tanpa sesi (confirm email aktif). Test
  integrasi database tidak diulang pada revalidasi ini atas batasan eksekusi;
  hasil `test:db` di tabel ringkasan adalah hasil QA 23 November.
- Skenario UI dijalankan dengan dua akun uji unik yang dibuat lewat `/signup`.
  Data uji dibersihkan dari database development setelah QA.
- `pnpm test:db` tetap dijalankan dengan `ALLOW_DB_TESTS=1` hanya pada database
  development; tidak ada migrasi ke database produksi.

## QA-AUTH-01..14 — Autentikasi dan isolasi data

| ID | Skenario | Hasil |
| --- | --- | --- |
| QA-AUTH-01 | Signup valid → dashboard | Lulus. Dengan confirm email **nonaktif**, signup mendapat sesi langsung, redirect ke `/`, dan dashboard tampil. |
| QA-AUTH-02 | Email duplikat | Lulus — `Email sudah terdaftar. Silakan masuk.`, email dipertahankan, password kosong. |
| QA-AUTH-03 | Validasi signup | Lulus — error inline untuk field wajib/format/password; tidak ada akun dibuat. |
| QA-AUTH-04 | Login valid | Lulus — redirect `/` dan data akun tampil. |
| QA-AUTH-05 | Login gagal | Lulus — password salah dan email tidak terdaftar sama-sama memakai `Email atau password salah.`; password dikosongkan. |
| QA-AUTH-06 | Proteksi route | Lulus — incognito `/transactions` dan `/categories` → `/login`; setelah login → `/`. |
| QA-AUTH-07 | Halaman auth saat login | Lulus — `/login` dan `/signup` → `/`. |
| QA-AUTH-08 | Logout | Lulus — tombol Keluar → `/login`; refresh halaman inti meminta login lagi. |
| QA-AUTH-09 | Persistensi sesi | Lulus — refresh dashboard dan tab baru tetap login, tanpa hydration warning. |
| QA-AUTH-10 | Isolasi dua akun | Lulus — User B tidak melihat data User A; URL edit milik A → 404; opsi kategori A tidak muncul di form B. |
| QA-AUTH-11 | Normalisasi email | Lulus — email dengan spasi/kapital dinormalisasi menjadi lowercase saat signup/login. |
| QA-AUTH-12 | Tidak ada kebocoran password | Lulus — tidak ada password/token/cookie di URL, console, log server, atau state action. |
| QA-AUTH-13 | Konfigurasi signup | Lulus — konfigurasi QA v1 nonaktif menghasilkan sesi langsung dan redirect `/`. Cabang confirm email aktif tetap ditangani dengan pesan cek email; kedua outcome dicakup unit test `resolveSignUpOutcome`. |
| QA-AUTH-14 | Manipulasi `categoryId` | Lulus — `categoryId` akun lain ditolak dengan `Kategori tidak ditemukan. Muat ulang halaman.`; tidak ada transaksi tersimpan. |

## QA-01..27 — Fitur keuangan

| ID | Skenario | Hasil |
| --- | --- | --- |
| QA-01 | Tambah kategori | Lulus — kategori muncul, banner sukses, input kosong. Nama yang sama boleh dipakai akun berbeda. |
| QA-02 | Duplikat kategori | Lulus — ` makan ` ditolak dengan `Nama kategori sudah digunakan.`, input dipertahankan. |
| QA-03 | Ubah kategori | Lulus — nama berubah, banner sukses, transaksi ikut menampilkan nama baru. |
| QA-04 | Hapus kategori kosong | Lulus — kategori hilang, banner sukses. |
| QA-05 | Hapus kategori terpakai | Lulus — dialog `Kategori tidak dapat dihapus`; panggilan langsung ke action juga ditolak. |
| QA-06 | Tambah pengeluaran | Lulus — 16 Nov 2026, `Makan siang`, Makan, Pengeluaran, 150000 → `-Rp 150.000` di November 2026. |
| QA-07 | Tambah pemasukan | Lulus — 10 Nov 2026, `Gaji November`, Gaji, Pemasukan, 8000000 → `+Rp 8.000.000`. |
| QA-08 | Form kosong | Lulus — kelima field menampilkan error; tidak ada baris dibuat; nilai tetap. |
| QA-09 | Nominal tidak valid | Lulus — 0, negatif, desimal, notasi ilmiah, dan >2 miliar ditolak. |
| QA-10 | Tanggal tidak valid | Lulus — sebelum 2000 dan tanggal masa depan ditolak. |
| QA-11 | Ubah bulan transaksi | Lulus — redirect ke bulan baru, hilang dari bulan lama. |
| QA-12 | Hapus transaksi | Lulus — hilang dari daftar dan dashboard, banner sukses. |
| QA-13 | Perhitungan Lampiran A | Lulus — pemasukan `Rp 9.000.000`, pengeluaran `Rp 200.000`, saldo `Rp 8.800.000`; baris Total cocok. |
| QA-14 | Kategori dua jenis | Lulus — Makan: pemasukan `Rp 20.000`, pengeluaran `Rp 200.000`, selisih `-Rp 180.000`. |
| QA-15 | Pindah bulan | Lulus — URL dan data konsisten; next disabled di bulan berjalan. |
| QA-16 | Bulan kosong | Lulus — card `Rp 0`, rekap empty state, tanpa error. |
| QA-17 | Query bulan invalid | Lulus — `2026-13` dan `abc` fallback ke bulan berjalan. |
| QA-18 | Mobile 375px | Lulus — bottom nav, kartu, tombol penuh, tidak ada horizontal scroll. |
| QA-19 | Tablet 768px | Lulus — top nav, email + Keluar terlihat, tabel/kartu sesuai. |
| QA-20 | Desktop 1440px | Lulus — sidebar, email + Keluar di footer, konten max-width. |
| QA-21 | Timezone | Lulus — unit test `2026-11-30T17:30:00Z` → `2026-12-01` / `2026-12`; tanggal disimpan apa adanya. |
| QA-22 | Teks panjang + XSS | Lulus — uraian 200 karakter dan `<script>alert(1)</script>` tampil literal, dibungkus rapi, script tidak berjalan. |
| QA-23 | 404 | Lulus — `/transactions/999999/edit`, `/categories/abc/edit`, dan ID milik akun lain menampilkan 404 tanpa stack trace. |
| QA-24 | Keyboard & screen reader | Lulus — skip link menerima fokus Tab pertama, label terbaca, dialog menutup dengan Escape, error memiliki `aria-describedby`. |
| QA-25 | Build & lint | Lulus — `pnpm lint` dan `pnpm build` sukses. |
| QA-26 | Alur tanpa kategori | Lulus — callout `Belum ada kategori` dan CTA `Buat Kategori` tampil; form tidak tampil. |
| QA-27 | Double submit | Lulus — dua klik cepat hanya menyimpan satu transaksi; tombol disabled saat pending. |

## Matrix responsif §12.2 — revalidasi 1024 px

Viewport **1024 × 768 px** diuji pada seluruh halaman inti dan auth: `/`,
`/transactions`, `/transactions/new`, `/transactions/[id]/edit`,
`/categories`, `/categories/[id]/edit`, `/login`, dan `/signup`.

| Area | Hasil pada 1024 px |
| --- | --- |
| Shell halaman inti | Lulus — sidebar desktop tampil; konten memiliki ruang aman, tanpa overflow horizontal; email, tombol Keluar, dan toggle tema berada di footer sidebar. |
| Dashboard, transaksi, dan kategori | Lulus — kartu/tabel tetap terbaca, navigasi dan CTA dapat diakses, serta state kosong/error tidak terpotong. |
| Form transaksi dan kategori | Lulus — field, validasi inline, dialog hapus, dan tombol aksi tetap termuat dan dapat dioperasikan dengan keyboard. |
| Login dan signup | Lulus — hanya header auth + toggle tema yang tampil; tidak ada nav aplikasi; kartu auth berada di tengah dan seluruh field/tombol termuat tanpa overflow. |

Hasil ini melengkapi bukti 375, 768, dan 1440 px pada QA-18..20; seluruh
viewport §12.2 kini mencakup halaman auth dan halaman inti.

## Pemeriksaan tambahan

- **Perbaikan QA:** ditemukan error prerender Next.js `blocking-prerender-current-time`
  pada halaman inti karena helper tanggal memanggil `new Date()` saat prerender.
  Diperbaiki dengan menambahkan `await connection()` pada layout dan halaman
  `(core)` sebelum `requireUser()` / pembacaan tanggal, sesuai panduan lokal
  `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/connection.md`.
  Setelah perbaikan, `pnpm lint`, `pnpm build`, dan QA UI diulang; error
  prerender tidak muncul lagi.
- **Migrasi kosong:** database development lokal kosong dengan stub `auth.users`,
  peran `authenticated`, dan `auth.uid()`; `drizzle-kit migrate` mengapply
  ketiga migrasi. Verifikasi SQL: `categories_user_id_fkey` dan
  `transactions_user_id_fkey` merujuk `auth.users(id) ON DELETE CASCADE`,
  `relrowsecurity = t` pada kedua tabel, serta policy `categories_owner_all`
  dan `transactions_owner_all` ada. Artifact lokal dibersihkan setelahnya.
- **Drift:** `pnpm db:generate` → `No schema changes, nothing to migrate`;
  `drizzle-kit check` → `Everything's fine`.
- **Repositori:** tidak ada `.env`, secret, token, password, file build, atau
  perubahan di luar dokumentasi dan perbaikan prerender di dalam diff.

## Definition of Done §13

Seluruh 23 poin Definition of Done terpenuhi: requirement P0 termasuk auth,
QA fungsional dan responsif, signup/login/logout + proteksi route, isolasi dua
akun dan 404, RLS + filter `user_id`, tidak ada password/token di aplikasi,
dashboard Lampiran A akurat, kategori terpakai tidak bisa dihapus, format
tanggal/bulan/uang sesuai, form mempertahankan input dan mencegah double submit,
light/dark konsisten tanpa flash, lint/build sukses, console bersih, tidak ada
teks placeholder/TODO/Create Next App, halaman demo `users` tidak ada, migrasi
dari nol tersedia, README diperbarui, tidak ada secret, tidak ada fitur di luar
§5, serta aksesibilitas dasar §7.9 dan §7.10 terpenuhi.
