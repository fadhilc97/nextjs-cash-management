# Product Requirements Document (PRD)
## Cash Management v1 — Prototype Pengelolaan Keuangan Pribadi

| Field | Nilai |
|---|---|
| Versi dokumen | 1.1 |
| Status | Siap implementasi |
| Tanggal | 18 November 2026 |
| Pemilik produk | Product Manager |
| Target pembaca | Junior developer atau AI coding agent |
| Jenis produk | Web app responsif (desktop, tablet, mobile) |
| Stack tersedia | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Drizzle ORM, PostgreSQL + Supabase Auth |
| Bahasa UI | Bahasa Indonesia |
| Bahasa kode | Inggris (nama variabel, fungsi, file, komentar teknis) |

> **Ringkasan eksekusi:** Autentikasi **Supabase Auth email + password** (signup, login, logout, proteksi route, isolasi data per akun), 2 tabel baru (`categories`, `transactions`) dengan `user_id`, 2 halaman auth (Masuk, Buat Akun), 3 halaman utama (Dashboard, Transaksi, Kategori), form transaksi create/edit, dashboard agregasi bulanan per kategori. Semua mutasi lewat Server Actions. Target: akurat, responsif di 375–1440 px, dan selesai dalam 8 fase (§11).
>
> **Perubahan v1.1:** v1.0 menyatakan aplikasi tanpa auth. Mulai v1.1, seluruh halaman inti wajib login, signup tersedia, dan setiap pengguna hanya dapat mengakses data miliknya sendiri.

> **Dokumen ini adalah sumber kebenaran.** Jika ada instruksi yang bertentangan, ikuti dokumen ini. Jangan menambah fitur di luar §5 tanpa persetujuan Product.
>
> Sebelum menulis kode Next.js, baca dokumentasi versi yang terpasang di `node_modules/next/dist/docs/`. Versi ini memiliki perubahan API dibanding Next.js pada umumnya. Panduan teknis ada di §9.5.

---

## Daftar Isi

1. [Ringkasan Produk](#1-ringkasan-produk)
2. [Tujuan dan Metrik](#2-tujuan-dan-metrik)
3. [Pengguna dan Kebutuhan](#3-pengguna-dan-kebutuhan)
4. [Keputusan Produk](#4-keputusan-produk)
5. [Ruang Lingkup v1](#5-ruang-lingkup-v1)
6. [Informasi dan Navigasi](#6-informasi-dan-navigasi)
7. [Spesifikasi Fungsional](#7-spesifikasi-fungsional)
8. [Model Data dan Aturan Bisnis](#8-model-data-dan-aturan-bisnis)
9. [Arsitektur Teknis](#9-arsitektur-teknis)
10. [UI dan Design Requirements](#10-ui-dan-design-requirements)
11. [Rencana Implementasi](#11-rencana-implementasi)
12. [Acceptance Test dan QA](#12-acceptance-test-dan-qa)
13. [Definition of Done](#13-definition-of-done)
14. [Risiko dan Mitigasi](#14-risiko-dan-mitigasi)
15. [Asumsi dan Pertanyaan Terbuka](#15-asumsi-dan-pertanyaan-terbuka)

---

## 1. Ringkasan Produk

### 1.1 Latar Belakang

Banyak orang kehilangan visibilitas atas keuangan pribadinya karena pencatatan dilakukan di banyak tempat: catatan HP, spreadsheet, pesan chat, atau tidak dicatat sama sekali. Akibatnya, pertanyaan sederhana seperti "bulan ini saya habis berapa untuk makan?" sulit dijawab.

Produk ini adalah **prototype v1** aplikasi web untuk mencatat pemasukan dan pengeluaran pribadi, lalu melihat rekap bulanan per kategori. Fokus v1 adalah alur inti yang cepat dan akurat, bukan platform akuntansi lengkap.

### 1.2 Solusi

Pengguna dapat:

1. Membuat akun baru dengan email dan password, lalu langsung masuk ke dashboard.
2. Masuk dan keluar dari akun dengan email dan password.
3. Mengelola daftar kategori (hanya nama) miliknya sendiri.
4. Mencatat transaksi dengan tanggal, uraian, kategori, jenis, dan nominal.
5. Melihat rekap pemasukan, pengeluaran, dan saldo per kategori untuk bulan yang dipilih di dashboard.
6. Mengubah atau menghapus data yang salah.
7. Mengakses seluruh fitur dari desktop, tablet, dan mobile.

### 1.3 Prinsip Produk

1. **Cepat dicatat** — transaksi baru selesai dalam satu formulir, tanpa langkah berlebihan.
2. **Jelas dan akurat** — angka, tanda pemasukan/pengeluaran, dan periode bulan tidak boleh ambigu.
3. **Mobile-first** — alur utama nyaman digunakan dengan satu tangan di layar kecil.
4. **Sederhana secara sengaja** — tidak ada dompet, budget, atau grafik kompleks di v1. Akun pengguna hanya untuk memisahkan data, bukan untuk fitur profil yang rumit.
5. **Tidak menebak** — semua aturan validasi dan perilaku error ditulis eksplisit di dokumen ini.

---

## 2. Tujuan dan Metrik

### 2.1 Tujuan

| ID | Tujuan | Ukuran keberhasilan |
|---|---|---|
| G1 | Pengguna dapat mencatat transaksi baru dengan cepat | Formulir hanya memiliki 5 input; transaksi baru tersimpan dalam < 60 detik |
| G2 | Pengguna dapat memahami pengeluaran per kategori dalam satu bulan | Dashboard menampilkan total pemasukan, pengeluaran, saldo, dan rekap per kategori yang akurat |
| G3 | Pengguna dapat mengelola kategori sendiri | Create, read, update, delete kategori berfungsi dengan aturan yang jelas |
| G4 | Aplikasi nyaman dipakai di semua ukuran layar | Tidak ada horizontal scroll pada lebar 375 px, 768 px, 1024 px, dan 1440 px |
| G5 | Prototype dapat diserahkan dan dijalankan ulang dengan mudah | `pnpm lint` dan `pnpm build` lulus; setup terdokumentasi di README |
| G6 | Pengguna dapat mendaftar dan masuk dengan email dan password | Signup membuat akun dan langsung redirect ke `/`; login/logout berfungsi; halaman inti tidak dapat diakses tanpa sesi |

### 2.2 Metrik Keberhasilan v1

- 100% acceptance test P0 di §12 lulus.
- Signup, login, logout, dan proteksi route berfungsi sesuai §7.10.
- Tidak ada pengguna yang dapat melihat atau mengubah data pengguna lain, termasuk lewat IDOR.
- Perhitungan dashboard cocok dengan data uji manual (lihat Lampiran A).
- Tidak ada error console di browser pada alur utama.
- Semua teks UI berbahasa Indonesia dan tidak ada placeholder/lorem ipsum.
- Build produksi berhasil tanpa error TypeScript.

### 2.3 Non-Tujuan (Out of Scope v1)

Fitur berikut **tidak boleh** diimplementasikan pada v1:

- Reset/lupa password, verifikasi email, magic link, login sosial/OAuth, MFA, ganti email, dan ganti password.
- Peran/admin, berbagi data antar akun, organisasi, atau multi-tenant.
- Profil pengguna (nama, avatar, preferensi) dan pengaturan akun.
- Akun/dompet keuangan (cash account/wallet), saldo awal, transfer antar dompet, dan rekonsiliasi.
- Budget, target tabungan, utang/piutang, investasi, dan aset.
- Transaksi berulang (recurring), cicilan, atau jadwal.
- Multi-currency dan nilai tukar. Semua nominal dalam **IDR**.
- Import/export CSV, PDF, atau Excel.
- Pencarian, filter jenis transaksi, pagination, dan sorting yang dapat diklik.
- Grafik/chart, library chart, dan animasi kompleks.
- Tema kustom, tema per halaman, atau pengaturan tampilan selain toggle terang/gelap.
- Notifikasi, email transaksional dari aplikasi, PWA, offline mode, dan sinkronisasi realtime.
- Audit log, soft delete, dan restore.
- Internationalization (i18n) selain Bahasa Indonesia.

---

## 3. Pengguna dan Kebutuhan

### 3.1 Persona Utama

**Rina, 28 tahun, karyawan.**
- Membuat akun dengan email dan password, lalu mencatat pengeluaran harian dari HP setelah membayar.
- Ingin tahu kategori apa yang paling banyak menguras uang setiap bulan.
- Tidak ingin mempelajari aplikasi akuntansi yang rumit.
- Kadang meninjau dan merapikan data dari laptop di akhir bulan.
- Ingin yakin datanya hanya terlihat oleh dirinya sendiri.

### 3.2 User Stories

| ID | Sebagai | Saya ingin | Agar | Prioritas | Referensi |
|---|---|---|---|---|---|
| US-01 | pengguna | mencatat transaksi dengan tanggal, uraian, kategori, jenis, dan nominal | pengeluaran/pemasukan tercatat | P0 | §7.3 |
| US-02 | pengguna | melihat rekap bulanan per kategori | tahu ke mana uang saya pergi | P0 | §7.2 |
| US-03 | pengguna | menambah, mengubah, dan menghapus kategori | kategori sesuai kebutuhan saya | P0 | §7.4 |
| US-04 | pengguna | mengubah atau menghapus transaksi | memperbaiki kesalahan input | P0 | §7.3 |
| US-05 | pengguna | memakai aplikasi dari HP, tablet, dan desktop | mencatat kapan saja | P0 | §7.8 |
| US-06 | pengguna | berpindah bulan pada dashboard dan daftar transaksi | meninjau bulan lalu | P0 | §7.2, §7.3 |
| US-07 | pengguna | mendapat pesan yang jelas saat input salah | tahu apa yang harus diperbaiki | P0 | §7.5 |
| US-08 | calon pengguna | mendaftar akun dengan email dan password | dapat mulai memakai aplikasi | P0 | §7.10 |
| US-09 | pengguna | masuk dan keluar dari akun | data saya tetap aman | P0 | §7.10 |
| US-10 | pengguna | hanya melihat data milik saya | privasi keuangan saya terjaga | P0 | §7.10, §8.7 |

---

## 4. Keputusan Produk

Keputusan berikut sudah final untuk v1. Jangan mengubahnya tanpa persetujuan Product.

| ID | Topik | Keputusan |
|---|---|---|
| D1 | Model pengguna | **Multi-user dengan Supabase Auth (email + password).** Setiap pengguna memiliki akun sendiri dan hanya dapat mengakses data miliknya. `user_id` **wajib** ada di `categories` dan `transactions`; tidak ada data keuangan global yang dibagi antar pengguna. |
| D2 | Mata uang | **IDR saja.** Nominal disimpan sebagai bilangan bulat rupiah tanpa desimal. Tidak ada kolom currency. |
| D3 | Model nominal | Nominal selalu **positif**. Jenis transaksi disimpan terpisah (`income` / `expense`), bukan sebagai nominal negatif. |
| D4 | Kategori | Kategori **hanya memiliki nama**. Tidak ada tipe kategori, warna, ikon, budget, atau deskripsi. Satu kategori boleh dipakai untuk pemasukan maupun pengeluaran. |
| D5 | Relasi kategori | Setiap transaksi **wajib** memiliki tepat satu kategori. Tidak ada transaksi tanpa kategori. |
| D6 | Tanggal | Tanggal transaksi adalah **date-only** (tanpa jam), disimpan `YYYY-MM-DD`. Zona waktu acuan aplikasi: **Asia/Jakarta (UTC+7)**. |
| D7 | Periode rekap | Bulan ditentukan dari tanggal transaksi. Bulan berjalan diambil dari Asia/Jakarta, bukan zona waktu server. |
| D8 | State bulan | Bulan aktif disimpan di query parameter `?month=YYYY-MM`. Default: bulan berjalan. Nilai tidak valid jatuh ke bulan berjalan. |
| D9 | Hapus kategori | **Ditolak** jika kategori masih dipakai transaksi. Tidak ada cascade delete dan tidak ada kategori "Tanpa Kategori". |
| D10 | Hapus transaksi | **Hard delete** dengan dialog konfirmasi. Tidak ada soft delete/restore. |
| D11 | Bentuk formulir | Form transaksi (create/edit) dan edit kategori memakai **halaman penuh**, bukan modal. Tambah kategori memakai form inline di halaman kategori. Hanya konfirmasi hapus yang memakai dialog. |
| D12 | Tampilan rekap | Rekap per kategori berupa **tabel** (desktop/tablet) dan **kartu** (mobile). Tidak ada chart library. |
| D13 | Tema | **Light-first + dark mode.** Default terang; toggle manual tersimpan di `localStorage`; kelas `.dark` dipasang di `<html>`. Jangan mengganti tema otomatis lewat `prefers-color-scheme`. |
| D14 | Data layer | Gunakan **Drizzle ORM** dan `services/drizzle.service.ts` untuk semua CRUD kategori/transaksi. **Supabase JS client hanya untuk Auth** (signup, login, logout, refresh session), bukan untuk CRUD keuangan. |
| D15 | Mutasi | Gunakan **Server Actions** + `useActionState`. Tidak perlu membuat REST API/route handler. |
| D16 | Dependensi | **shadcn/ui diizinkan** beserta primitif Radix yang dibawanya. `@supabase/ssr` dan `@supabase/supabase-js` sudah terpasang dan dipakai untuk auth. Tidak menambah state manager, library tanggal, library chart, library ikon (termasuk `lucide-react`), atau komponen UI lain di luar shadcn. Gunakan Tailwind, React, shadcn/ui, inline SVG, dan helper internal. |
| D17 | Autentikasi | **Supabase Auth email + password.** Signup, login, dan logout lewat Server Actions dengan `@supabase/ssr`. Tidak ada tabel password kustom. **Email confirmation dimatikan** di v1 agar signup langsung membuat sesi aktif. |
| D18 | Redirect auth | Signup dan login sukses **redirect ke `/`** (dashboard). Logout redirect ke `/login`. Tidak memakai parameter `next`, sehingga tidak ada open redirect dan alur selalu kembali ke halaman inti. |
| D19 | Isolasi data | Semua query dan Server Action memfilter `user_id` dari sesi. `user_id` tidak pernah diambil dari FormData atau URL. ID milik pengguna lain diperlakukan seperti tidak ditemukan (404). |
| D20 | Reset password | **Tidak ada di v1.** Pemulihan akun dilakukan manual lewat dashboard Supabase. |

---

## 5. Ruang Lingkup v1

### 5.1 Fitur yang Harus Ada

| Fitur | Prioritas | Ringkasan |
|---|---|---|
| Buat akun (signup) | P0 | Email + password + konfirmasi; sukses langsung redirect ke dashboard |
| Masuk (login) | P0 | Email + password; error generik untuk kredensial salah |
| Keluar (logout) | P0 | Server Action; redirect ke `/login` |
| Proteksi route | P0 | Semua halaman inti wajib sesi; halaman auth tidak boleh diakses saat login |
| Isolasi data per akun | P0 | Semua kategori/transaksi difilter `user_id`; ID user lain → 404 |
| App shell responsif | P0 | Sidebar desktop, top nav tablet, bottom nav mobile |
| Dashboard bulanan | P0 | Ringkasan pemasukan/pengeluaran/saldo + rekap per kategori |
| Pemilih bulan | P0 | Prev/next + input bulan, sinkron dengan URL |
| Daftar transaksi | P0 | Daftar per bulan, urut terbaru, tabel di desktop dan kartu di mobile |
| Tambah transaksi | P0 | Form tanggal, uraian, kategori, jenis, nominal |
| Ubah transaksi | P0 | Form yang sama, data terisi otomatis |
| Hapus transaksi | P0 | Dialog konfirmasi + hard delete |
| Daftar kategori | P0 | Daftar nama + jumlah transaksi |
| Tambah kategori | P0 | Form inline di halaman kategori |
| Ubah kategori | P0 | Halaman edit nama kategori |
| Hapus kategori | P0 | Ditolak jika masih dipakai |
| Empty/loading/error states | P0 | Semua halaman memiliki state yang jelas |
| Tema terang/gelap | P1 | Light-first; dark mode manual, preferensi tersimpan |
| Validasi server-side | P0 | Pesan error Indonesia, input dipertahankan |

### 5.2 Secara Eksplisit Tidak Ada di v1

- Reset/lupa password, verifikasi email, magic link, OAuth/social login, MFA, dan pengaturan akun.
- Peran/admin, berbagi data antar akun, dan multi-tenant.
- Pencarian dan filter lanjutan.
- Pagination. Satu bulan ditampilkan seluruhnya (target wajar < 500 baris/bulan).
- Grafik tren bulanan atau pie chart.
- Ringkasan tahunan.
- Ekspor dan cetak.
- Data contoh otomatis saat first run.
- Pengaturan profil, mata uang, atau bahasa.

## 6. Informasi dan Navigasi

### 6.1 Peta Halaman

| Path | Halaman | Query/Param | Keterangan |
|---|---|---|---|
| `/login` | Masuk | — | Publik; jika sudah login → redirect `/` |
| `/signup` | Buat Akun | — | Publik; jika sudah login → redirect `/` |
| `/` | Dashboard | `?month=YYYY-MM` | Wajib login; halaman inti; ringkasan dan rekap kategori |
| `/transactions` | Daftar transaksi | `?month=YYYY-MM&status=kode` | Wajib login; daftar transaksi bulan terpilih |
| `/transactions/new` | Tambah transaksi | `?month=YYYY-MM` | Wajib login; form create; `month` dipakai untuk tombol Batal |
| `/transactions/[id]/edit` | Ubah transaksi | `id` | Wajib login; form edit; 404 jika tidak ditemukan atau milik user lain |
| `/categories` | Daftar kategori | `?status=kode&error=kode` | Wajib login; form tambah inline + daftar kategori |
| `/categories/[id]/edit` | Ubah kategori | `id` | Wajib login; form edit nama; 404 jika tidak ditemukan atau milik user lain |
| `*` | 404 | — | Halaman tidak ditemukan |

**Aturan URL:**

- Nama path dan query menggunakan bahasa Inggris; teks UI menggunakan Bahasa Indonesia.
- Semua path selain `/login` dan `/signup` **wajib sesi aktif**. Tanpa sesi → redirect `/login`.
- Pengguna yang sudah login dan membuka `/login` atau `/signup` → redirect `/`.
- Setelah login atau signup sukses, redirect selalu ke `/`. Jangan menambahkan parameter `next` atau URL tujuan dari input pengguna.
- Logout bukan route/halaman; logout adalah Server Action yang dipanggil dari tombol di app shell.
- `month` harus cocok dengan regex `^\d{4}-(0[1-9]|1[0-2])$`. Nilai kosong, tidak valid, atau di luar rentang 2000-01 s.d. bulan berjalan dianggap tidak ada dan fallback ke bulan berjalan.
- `id` harus bilangan bulat positif. Selain itu → `notFound()`. ID yang valid tetapi bukan milik user aktif juga → `notFound()`.
- Parameter `status` dan `error` hanya boleh berisi kode yang diizinkan (§7.6). Kode lain diabaikan.
- Semua tautan internal yang menuju halaman berbulan wajib mempertahankan `month` yang sedang aktif.
- Jangan menambahkan state bulan di local storage atau state global. URL adalah sumber kebenaran.

### 6.2 Pola Navigasi

| Breakpoint | Header | Navigasi utama | Konten |
|---|---|---|---|
| Mobile `< 768px` | Top bar 56px berisi nama aplikasi + tombol "Keluar" + theme toggle | Fixed bottom bar 64px + safe-area inset; 3 item: Dashboard, Transaksi, Kategori | Padding horizontal 16px; padding bawah ≥ 88px |
| Tablet `768–1023px` | Sticky top header berisi nama aplikasi + nav horizontal + email pengguna (dipotong) + "Keluar" + theme toggle | Nav horizontal di header | Padding horizontal 24px; max-width 1120px |
| Desktop `≥ 1024px` | Tidak ada top header | Sidebar kiri fixed 240px berisi nama aplikasi + nav vertikal; footer berisi email pengguna, tombol "Keluar", dan theme toggle | Margin-left 240px; padding 32px; max-width 1120px |
| Halaman auth `< 1024px` | Header ringan berisi nama aplikasi + theme toggle | Tidak ada nav aplikasi | Kartu auth di tengah, padding 16–24px |
| Halaman auth `≥ 1024px` | Header ringan berisi nama aplikasi + theme toggle | Tidak ada nav aplikasi | Kartu auth max-width 420px di tengah viewport |

**Aturan navigasi:**

- Item aktif memiliki `aria-current="page"` dan penanda visual (background/underline + teks tebal). Jangan hanya mengandalkan warna.
- Dashboard aktif hanya untuk path `/`; Transaksi aktif untuk `/transactions` dan semua turunannya; Kategori aktif untuk `/categories` dan turunannya.
- Nav boleh berupa satu Client Component kecil (`NavLinks`) karena membutuhkan `usePathname()`.
- Ikon navigasi menggunakan inline SVG sederhana dengan `aria-hidden="true"`; teks label selalu tampil.
- Di mobile, bottom nav tidak boleh menutupi konten. Gunakan padding bawah pada `<main>`.
- Theme toggle berupa icon-only 44×44 dengan `aria-label="Ganti tema"`, tersedia di top bar (mobile/tablet), footer sidebar (desktop), dan header halaman auth.
- Email pengguna ditampilkan sebagai teks (bukan tautan), dipotong dengan ellipsis bila terlalu panjang, dan memiliki `title` berisi email lengkap. Email tidak ditampilkan di top bar mobile karena keterbatasan ruang.
- Tombol "Keluar" selalu tersedia di semua breakpoint. Di mobile/tablet berada di top bar; di desktop berada di footer sidebar. Tombol memakai `<form action={signOut}>`, menampilkan "Keluar…" saat pending, lalu redirect ke `/login`.
- Halaman auth memakai layout terpisah tanpa sidebar, top nav aplikasi, atau bottom nav. Hanya ada nama aplikasi, theme toggle, dan kartu form.
- Tidak ada hamburger menu, drawer, atau dropdown di v1.
- Tambahkan skip link "Lewati ke konten" sebagai elemen fokus pertama pada halaman inti. Halaman auth boleh memakai skip link yang sama ke form.

### 6.3 Alur Pengguna Utama

**A. Membuat akun baru:**

1. Buka `/signup`.
2. Isi email, password, dan konfirmasi password → "Buat Akun".
3. Bila valid, akun dibuat, sesi langsung aktif, dan pengguna diarahkan ke `/`.
4. Dashboard kosong menampilkan CTA "Buat Kategori" karena akun baru belum memiliki data.

**B. Masuk ke akun:**

1. Buka `/login`.
2. Isi email dan password → "Masuk".
3. Bila valid, redirect ke `/` dan dashboard menampilkan data milik pengguna tersebut.
4. Bila salah, tampilkan pesan generik dan tetap di `/login`.

**C. Pengguna baru (belum punya kategori):**

1. Setelah signup, dashboard kosong menampilkan CTA "Buat Kategori".
2. Buka `/categories` → isi nama kategori → simpan.
3. Buka `/transactions/new` → isi transaksi → simpan.
4. Dashboard menampilkan ringkasan dan rekap kategori.

**D. Mencatat pengeluaran harian:**

1. Dari halaman mana pun, buka Transaksi → "Tambah Transaksi".
2. Tanggal terisi hari ini (Asia/Jakarta), jenis default "Pengeluaran".
3. Isi uraian, pilih kategori, isi nominal → "Simpan Transaksi".
4. Redirect ke daftar transaksi bulan dari tanggal tersebut, dengan banner sukses.

**E. Meninjau bulan lalu:**

1. Di Dashboard atau Transaksi, gunakan panah/input bulan.
2. Ringkasan, rekap, dan daftar berubah sesuai bulan.
3. URL berubah menjadi `?month=YYYY-MM` dan dapat di-refresh/bookmark.

**F. Memperbaiki kesalahan:**

1. Buka daftar transaksi → "Ubah" atau "Hapus".
2. Edit → simpan → kembali ke daftar dengan banner sukses.
3. Hapus → dialog konfirmasi → data hilang permanen dan dashboard ikut berubah.

**G. Keluar:**

1. Klik "Keluar" di app shell.
2. Sesi dihapus dan pengguna diarahkan ke `/login`.
3. Membuka kembali halaman inti (refresh atau navigasi baru) akan meminta login. Jangan mengandalkan tombol Back browser untuk mengakses data setelah logout.

### 6.4 Wireframe Acuan

Wireframe bersifat acuan hierarki dan proporsi, bukan spesifikasi pixel. Implementasi tetap mengikuti §10.

**Desktop — Dashboard (≥ 1024px):**

```text
┌──────────────────────┬────────────────────────────────────────────────────────┐
│  Cash Management     │  Dashboard                          [+ Tambah Transaksi]│
│                      │  Ringkasan keuangan pribadi Anda.                     │
│  ▸ Dashboard         │                                                        │
│    Transaksi         │  ‹   [ November 2026 ▾ ]   ›                           │
│    Kategori          │                                                        │
│                      │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │
│                      │  │ Pemasukan  │ │ Pengeluaran│ │ Saldo bulan ini    │  │
│                      │  │ Rp 9.000.000│ │ Rp 200.000 │ │ Rp 8.800.000      │  │
│                      │  └────────────┘ └────────────┘ └────────────────────┘  │
│                      │                                                        │
│                      │  Rekap per Kategori                 Lihat semua transaksi│
│                      │  ┌──────────────────────────────────────────────────┐  │
│                      │  │ Kategori │ Pemasukan │ Pengeluaran │ Selisih     │  │
│                      │  ├──────────────────────────────────────────────────┤  │
│                      │  │ Gaji     │ 8.000.000 │ 0           │ +8.000.000  │  │
│                      │  │ Makan    │ 0         │ 200.000     │ -200.000    │  │
│                      │  ├──────────────────────────────────────────────────┤  │
│                      │  │ Total    │ 9.000.000 │ 200.000     │ +8.800.000  │  │
│                      │  └──────────────────────────────────────────────────┘  │
│                      │                                                        │
│  rina@email.com      │                                                        │
│  [Keluar]  [tema]    │                                                        │
└──────────────────────┴────────────────────────────────────────────────────────┘
```

**Masuk / Buat Akun (< 1024px dan ≥ 1024px):**

```text
┌──────────────────────────────────────────────┐
│  Cash Management                    [tema]   │
│                                              │
│          ┌────────────────────────┐          │
│          │  Masuk                 │          │
│          │  Masuk untuk melanjut… │          │
│          │                        │          │
│          │  Email                 │          │
│          │  [__________________]  │          │
│          │  Password              │          │
│          │  [__________________]  │          │
│          │  [      Masuk       ]  │          │
│          │                        │          │
│          │  Belum punya akun?     │          │
│          │  Daftar                │          │
│          └────────────────────────┘          │
└──────────────────────────────────────────────┘
```

> Buat Akun memakai kerangka yang sama, dengan field **Konfirmasi Password** di antara Password dan tombol submit, serta tautan "Sudah punya akun? Masuk".

**Mobile — Dashboard (< 768px):**

```text
┌──────────────────────────────┐
│  Cash Management             │
│                              │
│  Dashboard                   │
│  Ringkasan keuangan          │
│  pribadi Anda.               │
│  ┌──────────────────────────┐│
│  │ + Tambah Transaksi       ││
│  └──────────────────────────┘│
│  ‹   November 2026 ▾   ›    │
│                              │
│  ┌──────────────────────────┐│
│  │ Pemasukan                ││
│  │ Rp 9.000.000             ││
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │ Pengeluaran              ││
│  │ Rp 200.000               ││
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │ Saldo bulan ini          ││
│  │ Rp 8.800.000             ││
│  └──────────────────────────┘│
│                              │
│  Rekap per Kategori          │
│  ┌──────────────────────────┐│
│  │ Gaji                     ││
│  │ Pemasukan    Rp 8.000.000││
│  │ Pengeluaran  Rp 0        ││
│  │ Selisih      +Rp 8.000.000│
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │ Makan                    ││
│  │ Pemasukan    Rp 0        ││
│  │ Pengeluaran  Rp 200.000  ││
│  │ Selisih      -Rp 200.000 ││
│  └──────────────────────────┘│
│                              │
│  [Dashboard] [Transaksi] [Kategori]  ← fixed
└──────────────────────────────┘
```

**Mobile — Daftar transaksi (< 768px):**

```text
┌──────────────────────────────┐
│  Transaksi                   │
│  12 transaksi di bulan ini.  │
│  ┌──────────────────────────┐│
│  │ + Tambah Transaksi       ││
│  └──────────────────────────┘│
│  ‹   November 2026 ▾   ›    │
│                              │
│  ┌──────────────────────────┐│
│  │ 16 Nov 2026   [Pengeluaran]│
│  │ Makan siang              ││
│  │ Makan                    ││
│  │              -Rp 150.000 ││
│  │ [Ubah] [Hapus]           ││
│  └──────────────────────────┘│
│  ...                         │
│  [Dashboard] [Transaksi] [Kategori]
└──────────────────────────────┘
```

---

## 7. Spesifikasi Fungsional

Istilah status:
- **Wajib (MUST)** = bagian dari acceptance v1.
- **Tidak boleh (MUST NOT)** = pelanggaran scope.
- **P0** = blocker rilis.

### 7.1 App Shell dan Layout

| ID | Requirement | Acceptance |
|---|---|---|
| APP-01 | Root layout memakai `<html lang="id">`, font Geist Sans, background halaman, dan metadata produk "Cash Management". | Tidak ada teks Inggris bawaan "Create Next App". |
| APP-02 | App shell responsif mengikuti §6.2 dan hanya dipakai pada halaman inti yang sudah login. | Tidak ada horizontal scroll di 375, 768, 1024, 1440 px. |
| APP-03 | Navigasi memiliki state aktif yang dapat dikenali tanpa warna saja. | `aria-current="page"` ada pada item aktif. |
| APP-04 | Setiap halaman memiliki tepat satu `<h1>` dan hierarki heading yang benar. | Dashboard, Transaksi, Kategori, form create/edit, Masuk, dan Buat Akun masing-masing punya `h1`. |
| APP-05 | Skip link tersedia dan berfungsi. | Fokus keyboard pertama menampilkan "Lewati ke konten"; Enter memindahkan fokus ke `<main id="main-content">`. |
| APP-06 | Aplikasi memiliki `app/loading.tsx`, `app/error.tsx`, dan `app/not-found.tsx` yang berlaku untuk route utama. | Loading tidak menampilkan layar kosong; error page punya tombol "Coba lagi"; 404 punya tautan kembali. |
| APP-07 | Semua halaman yang membaca database atau sesi dirender per request, bukan di-cache. | Data dashboard berubah setelah transaksi ditambah/dihapus tanpa server restart; data user A tidak pernah muncul untuk user B. |
| APP-08 | Tidak ada data sensitif, query database, atau password di Client Component. | `services/`, `db/`, dan `lib/auth.ts` tidak diimpor dari file `"use client"`. |
| APP-09 | Theme toggle tersedia di semua breakpoint dan preferensi tersimpan tanpa flash tema. | Pilihan bertahan setelah refresh; tidak ada hydration warning; toggle juga ada di halaman auth. |
| APP-10 | Halaman inti memakai layout `(app)` dengan AppShell; halaman auth memakai layout `(auth)` tanpa sidebar/nav aplikasi. | Tidak ada nav Transaksi/Kategori di `/login` dan `/signup`. |
| APP-11 | Route inti memanggil `requireUser()` di page/action; proxy hanya lapisan optimistis. | Akses langsung tanpa sesi → `/login`; memalsukan cookie tidak memberi akses data. |
| APP-12 | App shell menampilkan email pengguna dan tombol "Keluar" sesuai §6.2. | Email terlihat di desktop/tablet; "Keluar" berfungsi di semua breakpoint. |

**Catatan implementasi shell:**

- Root layout **hanya** berisi `<html>`, `<body>`, metadata, font, dan slot konten. Jangan melakukan query database atau memuat data keuangan di root layout.
- App shell berada di `app/(app)/layout.tsx`. Layout ini boleh membaca user via `requireUser()` untuk email di sidebar/top bar, tetapi **bukan** pengganti guard di halaman/action.
- Halaman auth berada di `app/(auth)/layout.tsx` dan tidak menampilkan navigasi aplikasi.
- Halaman bertanggung jawab atas `h1`, subjudul, dan tombol aksi utama.
- Gunakan `max-width: 1120px` dan center content pada desktop.
- Pertahankan `export const instant = false;` di root layout (lihat §9.5).

### 7.2 Dashboard

**Tujuan:** menampilkan ringkasan dan rekap bulanan per kategori untuk bulan yang dipilih.

**Urutan konten:**

1. Page header: `h1` "Dashboard", subjudul "Ringkasan keuangan pribadi Anda.", tombol utama "Tambah Transaksi".
2. Month picker.
3. Tiga summary card: Pemasukan, Pengeluaran, Saldo bulan ini.
4. Section "Rekap per Kategori" dengan tautan "Lihat semua transaksi".
5. Empty state bila belum ada data.

| ID | Requirement | Acceptance |
|---|---|---|
| DASH-01 | Route `/` menerima `?month=YYYY-MM`; default bulan berjalan Asia/Jakarta. | Tanpa query, URL menampilkan bulan berjalan; query valid menampilkan bulan tersebut. |
| DASH-02 | Month picker memiliki tombol prev/next dan input bulan. Prev/next mengubah URL; input bulan mengubah URL saat nilainya berubah. | Klik prev dari November 2026 menampilkan Oktober 2026; URL ikut berubah. |
| DASH-03 | Month picker dibatasi 2000-01 s.d. bulan berjalan. Tombol next disabled di bulan berjalan; prev disabled di 2000-01. | Tombol disabled tidak bisa diklik dan tidak mengubah URL. |
| DASH-04 | Summary card menampilkan total pemasukan, total pengeluaran, dan saldo bulan terpilih. | Angka sama dengan perhitungan Lampiran A dan total tabel. |
| DASH-05 | Rekap per kategori menampilkan kolom: Kategori, Pemasukan, Pengeluaran, Selisih. | Setiap kategori yang punya ≥ 1 transaksi di bulan itu muncul tepat satu baris. |
| DASH-06 | Baris rekap diurutkan menurun berdasarkan total aktivitas (`pemasukan + pengeluaran`); tie-break nama kategori A–Z. | Urutan sesuai aturan untuk data uji. |
| DASH-07 | Tabel memiliki baris Total di bagian bawah, konsisten dengan summary card. | Total pemasukan/pengeluaran/selisih sama dengan card. |
| DASH-08 | Kategori tanpa transaksi pada bulan terpilih tidak ditampilkan. | Kategori kosong tidak muncul sebagai baris Rp 0. |
| DASH-09 | Nominal memakai format rupiah. Kolom Pemasukan/Pengeluaran pada rekap menampilkan nilai absolut (tanpa tanda) karena sudah diberi label kolom; kolom Selisih memakai awalan `+`/`-`. Warna bukan satu-satunya pembeda. | Nilai kolom sesuai Lampiran A; selisih negatif diberi `-`; label kolom tetap terbaca tanpa warna. |
| DASH-10 | Tautan "Lihat semua transaksi" menuju `/transactions?month=<bulan-aktif>`. | Bulan yang terbuka di daftar sama dengan dashboard. |
| DASH-11 | Bila belum ada transaksi di bulan terpilih, tampilkan empty state dan CTA yang sesuai. | Jika belum ada kategori sama sekali, CTA utama "Buat Kategori"; jika kategori ada, CTA "Tambah Transaksi". |
| DASH-12 | Saldo boleh negatif dan ditampilkan dengan jelas. | Bulan dengan pengeluaran > pemasukan menampilkan saldo negatif, tidak crash. |
| DASH-13 | Dashboard hanya menampilkan kategori dan transaksi milik user aktif. | Dua akun dengan transaksi berbeda tidak pernah saling melihat angka atau baris rekap. |

**Aturan perhitungan dashboard:**

- Ambil hanya transaksi milik user aktif (`transactions.user_id = session.user.id`) pada rentang `[tanggal awal bulan, tanggal awal bulan berikutnya)`. Jangan pernah menjalankan agregasi lintas user.
- `totalIncome = Σ amount` untuk `type = income`.
- `totalExpense = Σ amount` untuk `type = expense`.
- `balance = totalIncome - totalExpense`.
- Untuk setiap kategori: `categoryIncome`, `categoryExpense`, `categoryNet = categoryIncome - categoryExpense`.
- `activity = categoryIncome + categoryExpense`.
- Hanya kategori dengan minimal satu transaksi pada bulan tersebut yang masuk rekap.
- Semua agregasi harus berasal dari dataset yang sama agar card dan tabel konsisten.
- Nominal disimpan sebagai integer; agregasi boleh dilakukan di TypeScript (target data < 500 baris/bulan) agar tidak berurusan dengan string hasil `SUM` PostgreSQL.

**Acceptance dashboard:**

- [ ] Ringkasan dan rekap berubah segera setelah transaksi ditambah, diubah, atau dihapus.
- [ ] Pindah bulan mengubah seluruh section secara konsisten.
- [ ] Dashboard dapat di-refresh tanpa kehilangan bulan aktif.
- [ ] Empty state tidak menampilkan tabel kosong tanpa penjelasan.
- [ ] Layout 375 px menampilkan kartu rekap, bukan tabel yang terpotong.

### 7.3 Transaksi

#### 7.3.1 Daftar Transaksi — `/transactions`

| ID | Requirement | Acceptance |
|---|---|---|
| TX-01 | Halaman menerima `?month=YYYY-MM`; default bulan berjalan. Bulan aktif ditampilkan oleh month picker yang sama dengan dashboard. | Query valid mengubah daftar; query tidak valid fallback ke bulan berjalan. |
| TX-02 | Header menampilkan `h1` "Transaksi", subjudul berisi jumlah transaksi bulan terpilih, dan tombol "Tambah Transaksi". | Subjudul berbentuk "12 transaksi di bulan ini." atau "Belum ada transaksi di bulan ini." |
| TX-03 | Tombol "Tambah Transaksi" menuju `/transactions/new?month=<bulan-aktif>`. | Tombol Batal di form kembali ke bulan yang sama. |
| TX-04 | Data diurutkan `date DESC, created_at DESC`. | Transaksi terbaru muncul paling atas; transaksi di tanggal sama diurutkan yang terakhir dibuat lebih dulu. |
| TX-05 | Tabel (≥768px) memiliki kolom: Tanggal, Uraian, Kategori, Nominal, Aksi. Badge jenis ("Pemasukan"/"Pengeluaran") ditampilkan di dalam sel Uraian. Di mobile, setiap transaksi menjadi kartu. | Tidak ada informasi yang hilang saat beralih dari tabel ke kartu; tabel muat di 768px tanpa horizontal scroll. |
| TX-06 | Nominal pemasukan diawali `+`, pengeluaran `-`; jenis ditampilkan sebagai teks/badge "Pemasukan"/"Pengeluaran". | Warna dan tanda konsisten; jenis tetap terbaca tanpa warna. |
| TX-07 | Tanggal ditampilkan `16 Nov 2026`; uraian panjang dibungkus (`break-words`), tidak memicu scroll horizontal. | Uraian 200 karakter tetap terbaca dan tidak merusak layout. |
| TX-08 | Setiap baris memiliki aksi "Ubah" (tautan) dan "Hapus" (tombol). | Ubah menuju `/transactions/[id]/edit`; Hapus membuka dialog. |
| TX-09 | Tidak ada pagination; seluruh transaksi bulan terpilih ditampilkan. | Bulan dengan 100 transaksi menampilkan 100 baris/kartu. |
| TX-10 | Empty state tampil bila tidak ada transaksi pada bulan terpilih. | Ada pesan "Belum ada transaksi di bulan ini." dan CTA yang sesuai. |
| TX-11 | Bila belum ada kategori, CTA empty state mengarah ke `/categories`, bukan form transaksi. | Pengguna tidak masuk ke form yang tidak bisa disimpan. |
| TX-12 | Banner status tampil jika URL memiliki `status` yang valid (§7.6). | Setelah create/edit/delete, banner sukses muncul; tombol Tutup menghapus parameter dari URL. |

**Aturan mobile card:**

- Baris 1: tanggal + badge jenis.
- Baris 2: uraian (tebal).
- Baris 3: nama kategori.
- Baris 4: nominal rata kanan dengan `tabular-nums`.
- Baris 5: tombol "Ubah" dan "Hapus".
- Seluruh kartu dalam satu kolom; target sentuh minimal 44 × 44 px.

#### 7.3.2 Tambah Transaksi — `/transactions/new`

| ID | Requirement | Acceptance |
|---|---|---|
| TX-13 | Form memiliki field dengan urutan: Tanggal, Uraian, Kategori, Jenis, Nominal. | Urutan visual dan urutan tab sama. |
| TX-14 | Tanggal default hari ini (Asia/Jakarta), `min="2000-01-01"`, `max=<hari ini>`. | Field terisi otomatis dan tidak bisa memilih masa depan lewat date picker. |
| TX-15 | Uraian wajib, `maxlength=200`, placeholder "Contoh: Makan siang". | Whitespace saja ditolak. |
| TX-16 | Kategori berupa `<select>` wajib dengan opsi placeholder "Pilih kategori" (disabled). Opsi hanya berisi kategori milik user aktif dan diurutkan A–Z. | Tidak ada kategori terpilih secara default; kategori user lain tidak pernah muncul. |
| TX-17 | Jenis berupa dua radio yang mudah diakses, default "Pengeluaran". Opsi: "Pengeluaran" dan "Pemasukan". | Radio dapat dioperasikan dengan keyboard; default terlihat jelas. |
| TX-18 | Nominal wajib, berupa bilangan bulat rupiah positif, min 1, max 2.000.000.000. Input memakai prefix "Rp" dan `inputMode="numeric"`. | Server menolak 0, negatif, desimal, dan nilai > 2 miliar. |
| TX-19 | Tombol "Simpan Transaksi" berada di bawah form; tombol "Batal" mengarah kembali ke `/transactions?month=<month>` (atau bulan hari ini jika tidak ada). | Batal tidak menyimpan apa pun. |
| TX-20 | Saat submit, tombol disabled dan teks berubah "Menyimpan…"; error field ditampilkan inline. | Double submit tidak membuat dua transaksi. |
| TX-21 | Validasi wajib dijalankan di server, bukan hanya HTML. | Request langsung ke Server Action dengan data salah tetap ditolak. |
| TX-22 | Setelah sukses, redirect ke `/transactions?month=<bulan-dari-tanggal-transaksi>&status=created`. | Transaksi muncul di bulan yang benar dengan banner sukses. |
| TX-23 | Jika tidak ada kategori, halaman menampilkan callout: "Belum ada kategori. Buat kategori terlebih dahulu sebelum mencatat transaksi." dengan tombol "Buat Kategori"; form disembunyikan. | Pengguna tidak bisa submit transaksi tanpa kategori. |
| TX-24 | Nilai form yang sudah diisi dipertahankan setelah error validasi, termasuk jenis dan tanggal. | Tidak ada input yang hilang saat kembali dari server. |
| TX-25 | Tombol "Tambah Transaksi" dari dashboard juga menuju form ini. | `month` aktif terbawa jika ada. |

**Detail copy form tambah transaksi:**

| Elemen | Copy |
|---|---|
| Judul halaman | Tambah Transaksi |
| Subjudul | Catat pemasukan atau pengeluaran baru. |
| Label tanggal | Tanggal |
| Label uraian | Uraian |
| Placeholder uraian | Contoh: Makan siang |
| Label kategori | Kategori |
| Placeholder kategori | Pilih kategori |
| Label jenis | Jenis transaksi |
| Opsi jenis | Pengeluaran, Pemasukan |
| Label nominal | Nominal (Rp) |
| Helper nominal | Masukkan angka tanpa titik atau koma. |
| Tombol simpan | Simpan Transaksi |
| Tombol batal | Batal |
| Pending | Menyimpan… |

#### 7.3.3 Ubah Transaksi — `/transactions/[id]/edit`

| ID | Requirement | Acceptance |
|---|---|---|
| TX-26 | Form sama dengan create, seluruh field terisi data existing. | Tanggal, uraian, kategori, jenis, dan nominal sesuai database. |
| TX-27 | Judul halaman "Ubah Transaksi", tombol simpan "Simpan Perubahan". | Tidak ada duplikasi logika form; gunakan komponen yang sama dengan mode berbeda. |
| TX-28 | `id` tidak valid, tidak ditemukan, atau bukan integer positif → 404. | Tidak ada crash atau halaman kosong. |
| TX-29 | Setelah sukses, redirect ke `/transactions?month=<bulan-dari-tanggal-transaksi>&status=updated`. | Perubahan langsung terlihat di daftar dan dashboard. |
| TX-30 | Jika kategori yang sedang dipakai transaksi sudah tidak ada (kasus tidak normal), tampilkan form error, bukan crash. | Pesan "Kategori tidak ditemukan. Muat ulang halaman." |

#### 7.3.4 Hapus Transaksi

| ID | Requirement | Acceptance |
|---|---|---|
| TX-31 | Tombol "Hapus" membuka dialog konfirmasi; tidak langsung menghapus. | Klik Hapus menampilkan dialog; data belum berubah. |
| TX-32 | Dialog berisi judul "Hapus transaksi?", uraian yang menyebut deskripsi transaksi, tombol "Batal" dan "Hapus". | Tombol Batal menutup dialog tanpa perubahan. |
| TX-33 | Konfirmasi menghapus transaksi secara permanen dan redirect ke `/transactions?month=<bulan-transaksi>&status=deleted`. | Transaksi hilang dari daftar dan dashboard. |
| TX-34 | Tombol hapus menampilkan state "Menghapus…" dan disabled saat proses. | Double click tidak menghasilkan error. |
| TX-35 | Jika transaksi sudah tidak ada, redirect tetap sukses (idempotent) atau 404; jangan menampilkan stack trace. | Tidak ada error mentah ke pengguna. |
| TX-36 | Semua daftar, detail, update, dan delete transaksi difilter `user_id` dari sesi. | ID transaksi milik user lain → 404; tidak ada data yang bocor lewat URL langsung. |

**Copy dialog hapus transaksi:**

- Judul: `Hapus transaksi?`
- Isi: `Transaksi "<uraian>" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`
- Tombol sekunder: `Batal`
- Tombol destruktif: `Hapus`

> Dialog memakai `shadcn/ui` Dialog dengan label `aria-labelledby`, focus trap aktif, dan fokus awal pada tombol "Batal". Tekan Escape menutup dialog dan fokus kembali ke tombol pemicu.

---

### 7.4 Kategori

#### 7.4.1 Daftar Kategori — `/categories`

| ID | Requirement | Acceptance |
|---|---|---|
| CAT-01 | Halaman memiliki `h1` "Kategori" dan subjudul "Kelola kategori untuk mengelompokkan transaksi." | Halaman dapat diakses dari nav. |
| CAT-02 | Form tambah kategori tampil inline di atas daftar dengan satu field "Nama Kategori" dan tombol "Tambah Kategori". | Submit valid langsung menambah baris baru. |
| CAT-03 | Nama kategori wajib, setelah trim 1–50 karakter. Spasi berlebih di awal/akhir dihapus; spasi ganda di tengah dirapikan menjadi satu. | "  Makan   siang  " tersimpan sebagai "Makan siang". |
| CAT-04 | Nama unik tanpa membedakan huruf besar/kecil. Duplikat ditolak. | "Makan", "makan", dan " MAKAN " dianggap sama. |
| CAT-05 | Daftar kategori diurutkan A–Z (case-insensitive). | Urutan konsisten setelah tambah/ubah. |
| CAT-06 | Setiap baris menampilkan nama, jumlah transaksi (semua bulan, semua jenis), dan aksi "Ubah"/"Hapus". | Count sesuai jumlah transaksi yang memakai kategori tersebut. |
| CAT-07 | Di mobile, setiap kategori menjadi kartu; di tablet/desktop menjadi tabel 3 kolom. | Tidak ada horizontal scroll. |
| CAT-08 | Empty state tampil jika belum ada kategori. Form tambah tetap terlihat. | Pesan "Belum ada kategori." + arahan menambah. |
| CAT-09 | Setelah create sukses, redirect ke `/categories?status=created`; field kembali kosong. | Banner sukses muncul. |
| CAT-10 | Error validasi ditampilkan inline dan input yang sudah diketik dipertahankan. | Nama duplikat tidak menghilangkan input. |

**Copy form tambah kategori:**

| Elemen | Copy |
|---|---|
| Judul halaman | Kategori |
| Subjudul | Kelola kategori untuk mengelompokkan transaksi. |
| Label | Nama Kategori |
| Placeholder | Contoh: Transportasi |
| Tombol | Tambah Kategori |
| Pending | Menyimpan… |
| Empty | Belum ada kategori. Tambahkan kategori pertama Anda. |

#### 7.4.2 Ubah Kategori — `/categories/[id]/edit`

| ID | Requirement | Acceptance |
|---|---|---|
| CAT-11 | Halaman edit hanya berisi field nama, judul "Ubah Kategori", tombol "Simpan Perubahan" dan "Batal". | Batal kembali ke `/categories` tanpa perubahan. |
| CAT-12 | Validasi sama dengan create; cek duplikat mengecualikan ID kategori itu sendiri. | Mengganti nama menjadi nama sendiri (beda kapitalisasi) diperbolehkan. |
| CAT-13 | Setelah sukses, redirect ke `/categories?status=updated`. | Nama baru langsung muncul di daftar transaksi dan rekap dashboard. |
| CAT-14 | `id` tidak valid/tidak ditemukan → 404. | Tidak ada crash. |

#### 7.4.3 Hapus Kategori

| ID | Requirement | Acceptance |
|---|---|---|
| CAT-15 | Tombol "Hapus" membuka dialog konfirmasi. | Data belum berubah sebelum konfirmasi. |
| CAT-16 | Jika kategori **tidak** dipakai transaksi, konfirmasi menghapus permanen dan redirect ke `/categories?status=deleted`. | Kategori hilang dari daftar. |
| CAT-17 | Jika kategori **dipakai** transaksi, penghapusan ditolak. Dialog menjelaskan bahwa kategori masih digunakan dan hanya menyediakan tombol "Mengerti". | Tidak ada transaksi yang ikut terhapus. |
| CAT-18 | Server action tetap memeriksa jumlah pemakaian dan foreign key; jika tetap dipanggil langsung, redirect ke `/categories?error=category-in-use`. | Tidak ada error 500/stack trace. |
| CAT-19 | Dialog penolakan menyebut jumlah transaksi. | Contoh: "Kategori ini masih digunakan oleh 3 transaksi. Hapus atau ubah transaksi tersebut terlebih dahulu." |
| CAT-20 | Setelah rename, transaksi lama otomatis menampilkan nama kategori baru (relasi by ID). | Tidak ada data nama kategori yang diduplikasi di transaksi. |
| CAT-21 | Semua daftar, detail, update, dan delete kategori difilter `user_id` dari sesi. Keunikan nama hanya berlaku dalam lingkup user tersebut. | User A tidak melihat kategori user B; ID kategori user B → 404; dua user boleh punya kategori "Makan". |
| CAT-22 | Saat membuat/mengubah transaksi, kategori yang dipilih harus milik user aktif. | Memalsukan `categoryId` milik user lain ditolak dengan "Kategori tidak ditemukan. Muat ulang halaman." |

**Copy dialog hapus kategori:**

- Jika tidak dipakai:
  - Judul: `Hapus kategori?`
  - Isi: `Kategori "<nama>" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`
  - Tombol: `Batal`, `Hapus`
- Jika dipakai:
  - Judul: `Kategori tidak dapat dihapus`
  - Isi: `Kategori ini masih digunakan oleh <N> transaksi. Hapus atau ubah transaksi tersebut terlebih dahulu.`
  - Tombol: `Mengerti`

**Aturan tambahan kategori:**

- Kategori tidak memiliki halaman detail.
- Kategori tidak bisa dibuat dari form transaksi di v1.
- Jika semua kategori dihapus (hanya mungkin jika tidak dipakai transaksi), halaman transaksi harus menampilkan callout §7.3.2 TX-23.
- Jangan menambahkan kategori default otomatis. Pengguna membuat sendiri.

### 7.5 Validasi

Validasi **wajib dijalankan di server** pada setiap Server Action. Atribut HTML (`required`, `min`, `max`, `maxlength`) hanya untuk kenyamanan dan tidak dianggap sebagai pengaman.

| Kode | Field | Kondisi | Pesan error (exact copy) |
|---|---|---|---|
| VAL-01 | `date` | Kosong | `Tanggal wajib diisi.` |
| VAL-02 | `date` | Format bukan `YYYY-MM-DD` atau tanggal tidak ada (mis. 2026-02-30) | `Tanggal tidak valid.` |
| VAL-03 | `date` | Sebelum 2000-01-01 | `Tanggal tidak boleh sebelum 1 Januari 2000.` |
| VAL-04 | `date` | Setelah hari ini (Asia/Jakarta) | `Tanggal tidak boleh di masa depan.` |
| VAL-05 | `description` | Kosong atau hanya whitespace | `Uraian wajib diisi.` |
| VAL-06 | `description` | Setelah trim > 200 karakter | `Uraian maksimal 200 karakter.` |
| VAL-07 | `categoryId` | Kosong/bukan integer | `Kategori wajib dipilih.` |
| VAL-08 | `categoryId` | Kategori tidak ada atau bukan milik user aktif | `Kategori tidak ditemukan. Muat ulang halaman.` |
| VAL-09 | `type` | Bukan `income`/`expense` | `Jenis transaksi tidak valid.` |
| VAL-10 | `amount` | Kosong | `Nominal wajib diisi.` |
| VAL-11 | `amount` | Bukan bilangan bulat (termasuk desimal, `1e3`, titik, koma, tanda minus) | `Nominal harus berupa bilangan bulat.` |
| VAL-12 | `amount` | ≤ 0 | `Nominal harus lebih dari 0.` |
| VAL-13 | `amount` | > 2.000.000.000 | `Nominal maksimal Rp 2.000.000.000.` |
| VAL-14 | `name` (kategori) | Kosong setelah trim | `Nama kategori wajib diisi.` |
| VAL-15 | `name` (kategori) | > 50 karakter setelah trim | `Nama kategori maksimal 50 karakter.` |
| VAL-16 | `name` (kategori) | Duplikat case-insensitive dalam lingkup user | `Nama kategori sudah digunakan.` |
| VAL-17 | Semua | Error database tak terduga | `Terjadi kesalahan. Silakan coba lagi.` |
| VAL-18 | `email` (auth) | Kosong setelah trim | `Email wajib diisi.` |
| VAL-19 | `email` (auth) | Format email tidak valid | `Format email tidak valid.` |
| VAL-20 | `password` (auth) | Kosong | `Password wajib diisi.` |
| VAL-21 | `password` (auth) | Kurang dari 8 karakter | `Password minimal 8 karakter.` |
| VAL-22 | `confirmPassword` (signup) | Tidak sama dengan `password` | `Konfirmasi password tidak cocok.` |
| VAL-23 | Auth | Kredensial salah saat login | `Email atau password salah.` |
| VAL-24 | Auth | Email sudah terdaftar saat signup | `Email sudah terdaftar. Silakan masuk.` |
| VAL-25 | Auth | Rate limit Supabase | `Terlalu banyak percobaan. Coba lagi beberapa saat lagi.` |

**Aturan validasi:**

- Normalisasi `description`: `trim()`; karakter internal dipertahankan.
- Normalisasi `name`: `trim()` lalu ganti `/\s+/g` dengan satu spasi.
- Normalisasi `email` (auth): `trim()` lalu lowercase. Jangan menormalisasi password selain memeriksa panjang; spasi di dalam password dipertahankan.
- Normalisasi `amount`: ambil string dari `FormData`, `trim()`, lalu validasi dengan regex `^\d+$` sebelum `Number()`. Jangan memakai `parseInt` longgar.
- `categoryId` divalidasi sebagai integer positif, lalu dicek keberadaannya **dan kepemilikannya** (`user_id` dari sesi) di database pada request yang sama.
- `type` divalidasi dengan allowlist `["income", "expense"]`.
- Tanggal divalidasi dengan regex + pengecekan kalender (tidak cukup `new Date()` yang melakukan normalisasi tanggal).
- "Hari ini" dihitung di Asia/Jakarta menggunakan helper `todayInJakarta()`; jangan memakai `new Date().toISOString().slice(0, 10)` karena itu UTC.
- Jika ada > 1 error, semua error field yang relevan boleh ditampilkan; tidak harus berhenti di error pertama.
- Nilai form yang gagal validasi dikembalikan ke client dan dipakai sebagai `defaultValue`/`checked` agar tidak hilang.
- Pesan error ditampilkan tepat di bawah field terkait, dengan `aria-describedby` dan `aria-invalid="true"`.
- Error ringkasan di atas form boleh ditambahkan, tetapi bukan pengganti error inline.
- Validasi auth wajib dijalankan di server. Konfirmasi password hanya boleh dibandingkan di server; jangan mengirim ulang password ke client dalam `values`.
- Jangan pernah menampilkan pesan mentah PostgreSQL, stack trace, nama constraint, atau pesan mentah Supabase Auth ke pengguna.

---

### 7.6 Feedback, Loading, dan State

#### 7.6.1 Banner Status

Gunakan query parameter `status` (sukses) dan `error` (gagal) dengan allowlist berikut. Banner hanya muncul jika kode valid. Kode tidak dikenal diabaikan tanpa error.

> Halaman auth **tidak** memakai banner dari query parameter. Error login/signup ditampilkan inline di dalam form dengan `role="alert"` (§7.10).

| Halaman | Query | Tipe | Copy |
|---|---|---|---|
| Transaksi | `status=created` | Sukses | `Transaksi berhasil disimpan.` |
| Transaksi | `status=updated` | Sukses | `Perubahan transaksi berhasil disimpan.` |
| Transaksi | `status=deleted` | Sukses | `Transaksi berhasil dihapus.` |
| Kategori | `status=created` | Sukses | `Kategori berhasil ditambahkan.` |
| Kategori | `status=updated` | Sukses | `Nama kategori berhasil diperbarui.` |
| Kategori | `status=deleted` | Sukses | `Kategori berhasil dihapus.` |
| Kategori | `error=category-in-use` | Error | `Kategori tidak dapat dihapus karena masih digunakan oleh transaksi. Hapus atau ubah transaksi tersebut terlebih dahulu.` |

**Aturan banner:**

- Banner sukses memakai `role="status"`; banner error memakai `role="alert"`.
- Banner muncul di bawah page header dan di atas konten utama.
- Banner memiliki tombol/link "Tutup" dengan `aria-label="Tutup notifikasi"` yang menghapus `status`/`error` dari URL tanpa menghilangkan `month`.
- Banner tetap muncul selama parameter masih ada, termasuk setelah refresh. Tautan "Tutup" harus menghapus parameter dari URL agar banner tidak muncul lagi.
- Warna sukses hijau muda + teks hijau tua; error merah muda + teks merah tua. Ikon inline SVG 18px dengan `aria-hidden="true"`.

#### 7.6.2 Pending State

- Form create/edit: tombol simpan disabled selama aksi berjalan dan teks berubah "Menyimpan…".
- Form hapus: tombol "Hapus" disabled dan teks "Menghapus…".
- Form auth: tombol "Masuk"/"Buat Akun" disabled selama aksi berjalan dan teks berubah "Memproses…".
- Tombol "Keluar": disabled selama aksi berjalan dan teks berubah "Keluar…".
- Gunakan `useActionState` atau `useTransition`; jangan membuat state pending manual dengan `setTimeout`.
- Jangan mengosongkan form sebelum server mengembalikan sukses.
- Cegah double submit di UI dengan menonaktifkan tombol selama pending. Tidak perlu idempotency key di v1; cukup pastikan satu klik menghasilkan satu request.

#### 7.6.3 Loading

- `app/loading.tsx` menampilkan skeleton ringan atau teks "Memuat data…" dengan layout yang tidak melompat.
- Navigasi bulan boleh menampilkan indikator pending pada month picker (mis. opacity/disabled sementara).
- Jangan menampilkan halaman putih kosong saat data sedang diambil.

#### 7.6.4 Error dan 404

- `app/error.tsx` (Client Component) menampilkan `h1` "Terjadi kesalahan.", teks "Silakan coba lagi.", dan tombol "Coba lagi" yang memanggil `reset()`.
- `app/not-found.tsx` menampilkan `h1` "Halaman tidak ditemukan.", teks "Halaman yang Anda cari tidak tersedia.", dan tautan "Kembali ke Dashboard".
- `notFound()` dipakai untuk ID transaksi/kategori yang tidak ada, tidak valid, atau bukan milik user aktif.
- Error autentikasi tidak memakai halaman error global; tampilkan inline di form auth. Error tak terduga tetap di-log di server.
- Jangan menampilkan detail internal error ke pengguna. Log detail di server (`console.error`) tanpa password, token, atau isi cookie.

#### 7.6.5 Empty States

| Konteks | Copy | CTA |
|---|---|---|
| Dashboard, belum ada kategori | `Belum ada kategori.` + `Buat kategori terlebih dahulu untuk mulai mencatat transaksi.` | `Buat Kategori` → `/categories` |
| Dashboard, kategori ada tapi belum ada transaksi di bulan aktif | `Belum ada transaksi di bulan ini.` + `Catat pemasukan atau pengeluaran pertama Anda.` | `Tambah Transaksi` |
| Daftar transaksi, belum ada kategori | `Belum ada transaksi di bulan ini.` + `Buat kategori terlebih dahulu sebelum mencatat transaksi.` | `Buat Kategori` |
| Daftar transaksi, kategori ada tapi bulan kosong | `Belum ada transaksi di bulan ini.` + `Catat pemasukan atau pengeluaran pertama Anda.` | `Tambah Transaksi` |
| Form transaksi, belum ada kategori | `Belum ada kategori. Buat kategori terlebih dahulu sebelum mencatat transaksi.` | `Buat Kategori` (form disembunyikan) |
| Daftar kategori kosong | `Belum ada kategori.` + `Tambahkan kategori pertama Anda.` | Form tambah tetap tampil |

Empty state harus berada di dalam area konten (bukan alert browser) dan tidak boleh menampilkan tabel kosong tanpa penjelasan.

---

### 7.7 Format Tanggal, Bulan, dan Uang

#### 7.7.1 Uang

- Semua nominal disimpan dan dihitung sebagai **integer rupiah**.
- Format tampilan memakai `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 })`.
- Contoh: `150000` → `Rp 150.000` (spasi boleh non-breaking).
- Nominal transaksi:
  - Pemasukan: `+Rp 8.000.000`
  - Pengeluaran: `-Rp 150.000`
- Nominal saldo negatif: `-Rp 200.000` (tanda minus di depan mata uang).
- Nominal di tabel rata kanan dan memakai `font-variant-numeric: tabular-nums`.
- Tidak ada desimal, koma, atau satuan lain.
- Jangan melakukan perhitungan dengan string berformat. Simpan angka mentah; format hanya saat render.

#### 7.7.2 Tanggal

- Database: `date` (`YYYY-MM-DD`), tanpa jam dan tanpa zona waktu.
- Tampilan daftar: `16 Nov 2026` menggunakan `Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })` atau helper tanggal yang setara.
- Input: `<input type="date">` dengan nilai `YYYY-MM-DD`.
- Jangan memakai `new Date("2026-11-16")` secara langsung untuk display karena diperlakukan sebagai UTC dan dapat bergeser. Gunakan helper yang mem-parse `"${date}T00:00:00+07:00"` lalu format dengan `timeZone: "Asia/Jakarta"`, atau format komponen string secara manual. Jangan mengandalkan `new Date(y, m, d)` karena bergantung zona waktu server.
- Tanggal "hari ini" dan bulan berjalan selalu dihitung di Asia/Jakarta.

#### 7.7.3 Bulan

- Format query: `YYYY-MM`, contoh `2026-11`.
- Label tampilan: `November 2026`.
- Rentang query: `date >= "2026-11-01"` dan `date < "2026-12-01"` (half-open interval).
- Contoh pergantian tahun: `monthRange("2026-12")` → `{ start: "2026-12-01", endExclusive: "2027-01-01" }`.
- Jangan memakai `LIKE '2026-11%'`; gunakan rentang tanggal agar index dapat dipakai.
- Bulan berjalan dihitung dari Asia/Jakarta, bukan zona waktu server atau browser.
- **Catatan mobile:** jangan mengandalkan `<input type="month">` sebagai satu-satunya kontrol karena dukungan Safari/iOS terbatas. Gunakan dua `<select>` (bulan 1–12 dan tahun 2000–tahun berjalan) yang mengubah URL, atau fallback setara. Label "November 2026" tetap ditampilkan.

#### 7.7.4 Helper yang Disarankan

Letakkan di `lib/date.ts`, `lib/currency.ts`, dan `lib/month.ts`:

- `todayInJakarta(): string` → `YYYY-MM-DD`.
- `currentMonthInJakarta(): string` → `YYYY-MM`.
- `isValidMonth(value: string): boolean`.
- `monthRange(month: string): { start: string; endExclusive: string }`.
- `formatMonthLabel(month: string): string` → `November 2026`.
- `formatDate(date: string): string` → `16 Nov 2026`.
- `formatRupiah(amount: number): string` → `Rp 150.000`.
- `formatSignedRupiah(amount: number, type: "income" | "expense"): string`.
- `parseAmount(raw: string): number | null` dengan validasi digit-only.

---

### 7.8 Responsive Requirements

| Area | Mobile `< 768px` | Tablet `768–1023px` | Desktop `≥ 1024px` |
|---|---|---|---|
| Navigasi | Top bar + bottom nav fixed | Top header + nav horizontal | Sidebar kiri 240px |
| Konten | 1 kolom, padding 16px | 1 kolom, padding 24px | 1 kolom, padding 32px, max-width 1120px |
| Summary cards | 1 kolom (stack) | 3 kolom | 3 kolom |
| Rekap kategori | Kartu vertikal | Tabel | Tabel |
| Daftar transaksi | Kartu vertikal | Tabel 5 kolom (badge jenis di Uraian) | Tabel 5 kolom |
| Form | 1 kolom, tombol full-width | 1 kolom max-width 640px | 1 kolom max-width 640px |
| Dialog | Lebar penuh minus 32px | Max-width 420px | Max-width 420px |
| Tombol aksi utama | Full-width di bawah header | Inline di kanan header | Inline di kanan header |
| Halaman auth | 1 kolom, kartu penuh minus 32px | Kartu max-width 420px, center | Kartu max-width 420px, center |

**Aturan wajib:**

- Tidak ada horizontal scrolling pada lebar 375 px, 768 px, 1024 px, dan 1440 px.
- Teks panjang (uraian/kategori) harus `overflow-wrap: anywhere` atau `break-words`; jangan memotong informasi penting.
- Tabel tidak boleh dipaksa muat dengan mengecilkan font di bawah 14px. Jika tidak muat, ubah menjadi kartu.
- Target sentuh minimal 44 × 44 CSS px untuk semua tombol/link aksi.
- Font input minimal 16px di mobile untuk mencegah auto-zoom iOS.
- Gunakan `env(safe-area-inset-bottom)` pada bottom nav dan padding konten.
- Jangan menyembunyikan aksi "Ubah"/"Hapus" di mobile; keduanya harus tersedia.
- Form auth harus nyaman di 375 px: field full-width, tombol submit full-width, dan tidak ada horizontal scroll.
- Tombol "Keluar" dan theme toggle tidak boleh saling menimpa di top bar 375 px.
- Uji di lebar 375, 768, 1024, dan 1440 px, portrait dan landscape minimal pada 375 dan 768.
- Layout tidak boleh bergantung pada hover.

---

### 7.9 Aksesibilitas

Target minimum: WCAG 2.1 AA untuk alur utama.

| ID | Requirement |
|---|---|
| A11Y-01 | Semua input memiliki `<label>` yang terhubung via `htmlFor`/`id`; placeholder bukan pengganti label. |
| A11Y-02 | Grup radio "Jenis transaksi" dibungkus `<fieldset>` + `<legend>`. |
| A11Y-03 | Error field memiliki `aria-invalid="true"` dan `aria-describedby` ke elemen pesan. |
| A11Y-04 | Banner sukses `role="status"`; banner error `role="alert"`. |
| A11Y-05 | Navigasi aktif memakai `aria-current="page"`. |
| A11Y-06 | Fokus keyboard terlihat jelas (`focus-visible:ring-2` dengan offset). |
| A11Y-07 | Dialog memakai `shadcn/ui` Dialog, `aria-labelledby`, fokus awal ke "Batal", Escape menutup, focus trap aktif, dan fokus kembali ke tombol pemicu. |
| A11Y-08 | Tabel memakai `<caption>` (boleh visually hidden), `<th scope="col">`, dan header yang jelas. |
| A11Y-09 | Warna bukan satu-satunya penanda jenis transaksi; selalu ada teks "Pemasukan"/"Pengeluaran" dan tanda +/−. |
| A11Y-10 | Kontras teks normal minimal 4.5:1; teks besar minimal 3:1. |
| A11Y-11 | Urutan tab mengikuti urutan visual; tidak ada `tabindex` positif. |
| A11Y-12 | Tombol ikon (jika ada) memiliki accessible name; ikon dekoratif `aria-hidden="true"`. |
| A11Y-13 | Halaman dapat di-zoom 200% tanpa kehilangan konten/fungsi. |
| A11Y-14 | Hormati `prefers-reduced-motion`; animasi hanya transisi halus maksimal 150ms. |
| A11Y-15 | Bahasa dokumen `lang="id"`. |
| A11Y-16 | Form auth memakai label eksplisit, `autocomplete` yang benar (`email`, `current-password`, `new-password`), dan error inline yang terhubung `aria-describedby`; screen reader membacakan label dan error tanpa membacakan ulang password dari state. |
| A11Y-17 | Error form-level auth memakai `role="alert"` dan error field memakai `aria-invalid="true"`; kredensial salah diumumkan tanpa memindahkan fokus secara paksa. |
| A11Y-18 | Tombol "Keluar" memiliki label teks dan state pending yang dapat dibaca; tombol tidak hanya berupa ikon tanpa nama. |

---

### 7.10 Autentikasi

**Tujuan:** setiap pengguna memiliki akun sendiri dan hanya dapat mengakses data keuangannya sendiri. Autentikasi memakai **Supabase Auth bawaan** dengan provider **Email** dan metode **password**. Aplikasi **tidak** menyimpan password, membuat tabel kredensial, atau mengimplementasikan auth kustom.

**Keputusan teknis:**

- Signup, login, dan logout dijalankan lewat **Server Actions** menggunakan `@supabase/ssr` dan `utils/supabase/server.ts`.
- Sesi disimpan di cookie oleh `@supabase/ssr`; `proxy.ts` menyegarkan sesi pada setiap request.
- Otorisasi memakai `supabase.auth.getUser()` di server, **bukan** `getSession()`.
- Email confirmation **dimatikan** di dashboard Supabase untuk v1 agar `signUp()` langsung mengembalikan sesi aktif dan pengguna bisa diarahkan ke `/` (lihat §9.6).
- Setelah login/signup sukses, redirect selalu ke `/`. Tidak ada parameter `next`.
- Form auth memakai `noValidate` agar browser tidak menampilkan pesan validasi bawaan; semua error yang terlihat berasal dari validasi server dan memakai copy Indonesia.
- Tidak ada reset password, verifikasi email, magic link, OAuth, atau MFA di v1.

#### 7.10.1 Buat Akun — `/signup`

| ID | Requirement | Acceptance |
|---|---|---|
| AUTH-01 | `/signup` adalah halaman publik. Jika pengguna sudah memiliki sesi aktif, redirect ke `/`. | Membuka `/signup` saat login tidak menampilkan form; langsung ke dashboard. |
| AUTH-02 | Form memiliki field berurutan: Email, Password, Konfirmasi Password. | Urutan visual dan urutan tab sama; semua field wajib. |
| AUTH-03 | Email wajib, format valid, di-`trim()` dan di-lowercase sebelum dikirim ke Supabase. | `" Rina@Example.com "` menjadi `rina@example.com`. |
| AUTH-04 | Password wajib minimal 8 karakter. Password **tidak** di-trim dan tidak diubah kapitalisasinya. Konfirmasi password harus sama persis. | Password dengan spasi tetap diterima; konfirmasi berbeda ditolak. |
| AUTH-05 | Signup memanggil `supabase.auth.signUp({ email, password })` di server. Bila sesi langsung aktif, redirect ke `/`. | Akun baru langsung masuk ke dashboard tanpa langkah tambahan. |
| AUTH-06 | Bila email sudah terdaftar, tampilkan error field pada Email dan pertahankan nilai email. Password dan konfirmasi dikosongkan. | Error "Email sudah terdaftar. Silakan masuk."; tidak ada akun ganda. |
| AUTH-07 | Bila `signUp()` tidak mengembalikan sesi (mis. email confirmation tidak sengaja diaktifkan), jangan redirect dan jangan mengklaim sukses. Tampilkan error form-level generik dan log peringatan konfigurasi. | Pengguna tetap di `/signup`; tidak ada sesi setengah jadi. |
| AUTH-08 | Tombol submit "Buat Akun" disabled selama pending dan teks berubah "Memproses…". | Double submit tidak membuat dua akun. |
| AUTH-09 | Form memakai `autoComplete="email"`, `autoComplete="new-password"` untuk kedua field password, serta `inputMode="email"`. | Browser/password manager mengenali field dengan benar. |
| AUTH-10 | Password, konfirmasi password, token, dan cookie tidak boleh muncul di URL, log, pesan error, `values`, atau response action; password hanya dikirim di body form. | Tidak ada password di URL, console, atau response action; produksi wajib memakai HTTPS. |

#### 7.10.2 Masuk — `/login`

| ID | Requirement | Acceptance |
|---|---|---|
| AUTH-11 | `/login` adalah halaman publik. Jika pengguna sudah memiliki sesi aktif, redirect ke `/`. | Membuka `/login` saat login langsung ke dashboard. |
| AUTH-12 | Form memiliki field Email dan Password, tombol "Masuk", dan tautan "Belum punya akun? Daftar". | Halaman dapat dioperasikan dengan keyboard saja. |
| AUTH-13 | Login memanggil `supabase.auth.signInWithPassword({ email, password })` di server. Sukses → redirect `/`. | Login valid membuka dashboard dengan data milik user tersebut. |
| AUTH-14 | Kredensial salah selalu menampilkan pesan generik `Email atau password salah.` Tidak boleh membedakan email tidak terdaftar dan password salah. | Kedua kasus menghasilkan copy yang sama; tidak ada enumerasi akun lewat login. |
| AUTH-15 | Email dinormalisasi (`trim` + lowercase); password dikirim apa adanya. Nilai password tidak dikembalikan ke client setelah error. | Email tetap terisi; password kosong; pesan error tetap di tempat. |
| AUTH-16 | Tombol "Masuk" disabled selama pending dan teks berubah "Memproses…". | Double submit tidak mengirim dua request login. |
| AUTH-17 | Login tidak memakai parameter `next` atau URL eksternal. Selalu redirect ke `/`. | Mencoba `?next=https://example.com` diabaikan; tidak ada open redirect. |

#### 7.10.3 Keluar

| ID | Requirement | Acceptance |
|---|---|---|
| AUTH-18 | Tombol "Keluar" tersedia di app shell pada semua breakpoint sesuai §6.2. | Terlihat dan dapat digunakan di mobile, tablet, desktop. |
| AUTH-19 | Logout memanggil Server Action `signOut()`, yang menjalankan `supabase.auth.signOut()` lalu redirect ke `/login`. | Setelah logout, halaman inti meminta login kembali. |
| AUTH-20 | Tombol "Keluar" disabled dan teks berubah "Keluar…" selama proses. | Double click tidak menghasilkan error. |
| AUTH-21 | Setelah logout, navigasi/refresh ke halaman inti wajib meminta login. Halaman inti harus dinamis dan tidak di-cache lintas sesi; jangan mengandalkan tombol Back untuk mengakses data. | Refresh dashboard setelah logout → `/login`; tidak ada data keuangan baru yang dirender tanpa sesi. |

#### 7.10.4 Proteksi Route, Sesi, dan Isolasi Data

| ID | Requirement | Acceptance |
|---|---|---|
| AUTH-22 | `proxy.ts` yang sudah ada wajib menyegarkan sesi dan melakukan redirect optimistis: tanpa user → `/login`; user aktif di `/login` atau `/signup` → `/`. | Request tanpa cookie ke `/transactions` tidak pernah merender data; langsung `/login`. |
| AUTH-23 | Redirect dari proxy wajib mempertahankan cookie hasil refresh sesi. | Tidak terjadi logout acak saat sesi dirotasi. |
| AUTH-24 | Proxy **bukan** satu-satunya pengaman. Setiap page inti dan setiap Server Action keuangan wajib memanggil `requireUser()` sebelum mengakses data. | Memanggil Server Action langsung via POST tanpa sesi ditolak/redirect. |
| AUTH-25 | `requireUser()` mengembalikan `{ id, email }` dari `supabase.auth.getUser()`. Jika tidak ada user atau email tidak tersedia → redirect `/login`. | Tidak ada halaman inti yang dirender dengan user kosong. |
| AUTH-26 | Semua query kategori/transaksi memakai `user_id` dari `requireUser()`. `user_id` tidak pernah dibaca dari FormData, query string, atau header yang dapat dipalsukan. | User A tidak dapat melihat atau mengubah data user B, termasuk lewat ID di URL. |
| AUTH-27 | ID milik user lain diperlakukan sebagai tidak ditemukan (`notFound()` atau hasil kosong), bukan error 403 yang mengonfirmasi keberadaan data. | `/transactions/<id-user-lain>/edit` → 404. |
| AUTH-28 | Data keuangan dan data turunan sesi tidak boleh memakai cache lintas user. Jangan memakai `use cache` untuk query keuangan atau halaman inti. | Login bergantian di browser yang sama tidak menampilkan data user sebelumnya. |
| AUTH-29 | Email pengguna dari sesi ditampilkan di app shell (desktop/tablet) dan tidak dapat diedit. Email bukan input form. | Email tampil, dipotong dengan ellipsis bila panjang, dan tidak bisa diubah di UI. |
| AUTH-30 | Sesi yang kedaluwarsa/tercabut saat membuka halaman inti → redirect `/login`; tidak ada error 500 atau stack trace. | Hapus cookie sesi lalu refresh dashboard → halaman login. |

#### 7.10.5 Pemetaan Error Auth

Jangan menampilkan pesan mentah Supabase. Map ke copy berikut:

| Kondisi | Copy yang ditampilkan |
|---|---|
| Email kosong | `Email wajib diisi.` |
| Format email tidak valid | `Format email tidak valid.` |
| Password kosong | `Password wajib diisi.` |
| Password < 8 karakter (validasi aplikasi) | `Password minimal 8 karakter.` |
| `weak_password` (alasan lain dari Supabase) | `Password terlalu lemah. Gunakan password yang lebih kuat.` |
| Konfirmasi password berbeda | `Konfirmasi password tidak cocok.` |
| `invalid_credentials` | `Email atau password salah.` |
| `user_already_exists`, `email_exists` | `Email sudah terdaftar. Silakan masuk.` |
| Rate limit / HTTP 429 / `over_request_rate_limit` / `over_email_send_rate_limit` | `Terlalu banyak percobaan. Coba lagi beberapa saat lagi.` |
| `email_not_confirmed` | `Email belum dikonfirmasi. Silakan hubungi administrator.` (log peringatan konfigurasi) |
| `signup_disabled` | `Pendaftaran akun sedang tidak tersedia. Silakan coba lagi nanti.` |
| Sesi signup kosong padahal user dibuat | `Pendaftaran belum dapat diselesaikan. Silakan coba lagi.` (log peringatan konfigurasi) |
| Error tak terduga | `Terjadi kesalahan. Silakan coba lagi.` |

**Aturan tambahan:**

- Error field ditampilkan inline di bawah field; error form-level di atas tombol submit dengan `role="alert"`.
- Jangan mengosongkan email setelah error; jangan pernah mengembalikan password ke client.
- Log server hanya boleh memuat kode error dan pesan aman; jangan log `FormData`, password, token, atau cookie.
- Supabase menangani rate limit dan hashing password; aplikasi tidak menyimpan hash sendiri.
- Saat `signUp()`, perlakukan `data.user.identities` yang kosong (jika ada) sebagai email sudah terdaftar, meskipun Supabase tidak mengembalikan error eksplisit. Jangan membuat sesi dalam kondisi ini.
- Jangan memakai pesan error Supabase sebagai kunci UI; map berdasarkan `error.code`/status, dengan fallback generik.

#### 7.10.6 Copy Halaman Auth

| Elemen | Masuk (`/login`) | Buat Akun (`/signup`) |
|---|---|---|
| Judul halaman | Masuk | Buat Akun |
| Subjudul | Masuk untuk melanjutkan ke buku kas Anda. | Daftar untuk mulai mencatat keuangan pribadi Anda. |
| Label email | Email | Email |
| Placeholder email | nama@email.com | nama@email.com |
| Label password | Password | Password |
| Placeholder password | Masukkan password | Minimal 8 karakter |
| Label konfirmasi | — | Konfirmasi Password |
| Placeholder konfirmasi | — | Ulangi password |
| Tombol submit | Masuk | Buat Akun |
| Pending | Memproses… | Memproses… |
| Tautan bawah | Belum punya akun? **Daftar** | Sudah punya akun? **Masuk** |

**Copy tombol logout:** `Keluar` (pending: `Keluar…`).

---

## 8. Model Data dan Aturan Bisnis

### 8.1 Entity Relationship Diagram

```text
┌───────────────────────────┐
│ auth.users (Supabase)     │
│ id            uuid PK     │
└─────────────┬─────────────┘
              │ 1
      ┌───────┴────────┐
      │                │
      ▼ n              ▼ n
┌──────────────────────────┐          ┌────────────────────────────────────┐
│ categories               │          │ transactions                       │
├──────────────────────────┤          ├────────────────────────────────────┤
│ id            integer PK │ 1      n │ id            integer PK           │
│ user_id       uuid FK    │──────────│ user_id       uuid FK              │
│ name          varchar(50)│          │ category_id   integer FK (no action)│
│ created_at    timestamptz│          │ date          date                 │
│ updated_at    timestamptz│          │ description   varchar(200)         │
└──────────────────────────┘          │ type          transaction_type     │
                                      │ amount        integer (> 0)        │
                                      │ created_at    timestamptz          │
                                      │ updated_at    timestamptz          │
                                      └────────────────────────────────────┘
```

Relasi: **satu user memiliki banyak kategori dan transaksi; satu kategori memiliki banyak transaksi; satu transaksi memiliki tepat satu kategori milik user yang sama.**

Catatan: `auth.users` dikelola oleh Supabase Auth. Aplikasi **tidak** membuat atau mengelola tabel kredensial sendiri. Tabel `public.users` sisa scaffold tidak dipakai.

### 8.2 Tabel `categories`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | integer | PK, identity | Auto increment |
| `user_id` | uuid | NOT NULL, FK → `auth.users.id` ON DELETE CASCADE | Pemilik kategori; diambil dari sesi, bukan input |
| `name` | varchar(50) | NOT NULL, unik per user (case-insensitive) | Nama tampilan kategori, sudah dinormalisasi |
| `created_at` | timestamptz | NOT NULL, default now | Waktu dibuat |
| `updated_at` | timestamptz | NOT NULL, default now | Di-set ulang saat rename |

Aturan:
- Hanya nama. Tidak ada kolom `type`, `color`, `icon`, `budget`, atau `description`.
- Nama disimpan setelah trim + collapse whitespace.
- Unik berdasarkan `(user_id, lower(name))`; dua user berbeda boleh memiliki nama kategori yang sama.
- Panjang 1–50 karakter setelah normalisasi.
- `user_id` tidak boleh diubah setelah dibuat.

### 8.3 Tabel `transactions`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | integer | PK, identity | Auto increment |
| `user_id` | uuid | NOT NULL, FK → `auth.users.id` ON DELETE CASCADE | Pemilik transaksi; diambil dari sesi, bukan input |
| `date` | date | NOT NULL | Tanggal transaksi, `YYYY-MM-DD` |
| `description` | varchar(200) | NOT NULL | Uraian transaksi |
| `category_id` | integer | NOT NULL, FK → categories.id, ON DELETE NO ACTION | Kategori wajib dan harus milik user yang sama |
| `type` | transaction_type | NOT NULL | `income` atau `expense` |
| `amount` | integer | NOT NULL, CHECK 1..2.000.000.000 | Selalu positif, rupiah |
| `created_at` | timestamptz | NOT NULL, default now | Waktu dibuat |
| `updated_at` | timestamptz | NOT NULL, default now | Di-set ulang saat edit |

Aturan:
- `amount` tidak boleh 0, negatif, desimal, atau > 2.000.000.000.
- Tidak ada `currency`; semua IDR.
- `user_id` wajib; tidak ada transaksi global atau tanpa pemilik.
- `user_id` tidak boleh diubah setelah dibuat.
- `category_id` tidak boleh NULL dan harus diverifikasi milik user yang sama sebelum insert/update.
- Tidak ada `deleted_at`; hard delete.
- Tidak ada nama kategori yang disalin ke tabel ini.

### 8.4 Referensi Skema Drizzle

Tambahkan dua tabel berikut ke `db/schema.ts`. Tabel `public.users` adalah sisa scaffold dan **tidak dipakai**; auth memakai `auth.users` milik Supabase. **Jangan menjalankan `DROP TABLE public.users`** pada database yang sudah ada tanpa persetujuan. Jika definisi `usersTable` masih ada di schema dan tidak ingin ikut di-generate, hapus definisinya sebelum `db:generate`; fokuskan migrasi pada `categories` dan `transactions`.

```ts
import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  integer,
  uuid,
  varchar,
  date,
  timestamp,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
]);

export const categories = pgTable(
  "categories",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("categories_user_name_lower_idx").on(
      table.userId,
      sql`lower(${table.name})`,
    ),
    index("categories_user_id_idx").on(table.userId),
  ],
);

export const transactions = pgTable(
  "transactions",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    date: date("date").notNull(),
    description: varchar("description", { length: 200 }).notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "no action" }),
    type: transactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("transactions_user_date_created_idx").on(
      table.userId,
      table.date,
      table.createdAt,
    ),
    index("transactions_user_category_id_idx").on(
      table.userId,
      table.categoryId,
    ),
    check(
      "transactions_amount_check",
      sql`${table.amount} > 0 and ${table.amount} <= 2000000000`,
    ),
  ],
);
```

**Catatan tipe dan relasi:**

- Drizzle mengembalikan kolom `date` sebagai string `YYYY-MM-DD`. Jangan mengubahnya menjadi `Date` di service layer tanpa helper.
- `integer` PostgreSQL cukup untuk nominal maksimal Rp 2.000.000.000 per transaksi. Total agregat dihitung di TypeScript dengan `number` (aman hingga 9 kuadriliun).
- `updated_at` tidak otomatis berubah di PostgreSQL. Set `updatedAt: new Date()` secara eksplisit di query update.
- `ON DELETE NO ACTION` pada `transactions.category_id` adalah pengaman terakhir. Aplikasi tetap harus mengecek jumlah pemakaian sebelum delete untuk pesan yang ramah. `NO ACTION` (bukan `RESTRICT`) dipakai agar cascade penghapusan `auth.users` ke `categories` dan `transactions` dapat selesai dalam satu statement; penghapusan kategori biasa tetap ditolak selama masih ada transaksi.
- FK `user_id` → `auth.users(id)` **tidak didefinisikan di schema Drizzle** agar drizzle-kit tidak mencoba mengelola schema `auth`. Tambahkan lewat migrasi SQL kustom (§8.8). Jangan membuat tabel `auth.users` tiruan di schema publik.
- Semua service menerima `userId` sebagai argumen dan memfilter dengan `eq(table.userId, userId)`.
- Untuk mencegah referensi kategori lintas user, query insert/update transaksi wajib memakai `where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))` sebelum menyimpan.

### 8.5 Index dan Constraint

| Nama | Jenis | Tujuan |
|---|---|---|
| `categories_user_name_lower_idx` | unique index `(user_id, lower(name))` | Cegah duplikat case-insensitive dalam satu akun |
| `categories_user_id_idx` | index `(user_id)` | Filter daftar kategori per user |
| `transactions_user_date_created_idx` | index `(user_id, date, created_at)` | Filter bulan + urutan terbaru per user |
| `transactions_user_category_id_idx` | index `(user_id, category_id)` | Hitung pemakaian kategori + join per user |
| `transactions_amount_check` | check | Amount > 0 dan ≤ 2 miliar |
| FK `categories_user_id_fkey` | cascade ke `auth.users` | Hapus data user mengikuti penghapusan akun |
| FK `transactions_user_id_fkey` | cascade ke `auth.users` | Hapus data user mengikuti penghapusan akun |
| FK `transactions_category_id_fkey` | no action | Cegah kategori terhapus saat dipakai, tetapi aman untuk cascade user |

### 8.6 Aturan Perhitungan

Semua perhitungan menggunakan dataset transaksi bulan terpilih **milik user aktif**.

```text
dataset           = transactions where user_id = session.user.id
                    and date in [start, endExclusive)

totalIncome       = Σ amount where type = "income"
totalExpense      = Σ amount where type = "expense"
balance           = totalIncome - totalExpense          // boleh negatif

categoryIncome    = Σ amount where category = X and type = "income"
categoryExpense   = Σ amount where category = X and type = "expense"
categoryNet       = categoryIncome - categoryExpense
categoryActivity  = categoryIncome + categoryExpense

sort categories   = categoryActivity DESC, name ASC
```

Aturan konsistensi:
- Card "Pemasukan" = total kolom Pemasukan pada tabel + baris Total.
- Card "Pengeluaran" = total kolom Pengeluaran pada tabel + baris Total.
- Card "Saldo" = total kolom Selisih.
- Jangan membulatkan angka di tengah perhitungan; format hanya di presentasi.
- Jangan memakai floating point untuk uang. Semua nilai integer.

### 8.7 Invariant Bisnis

1. Setiap kategori dan transaksi dimiliki tepat satu user (`user_id` NOT NULL).
2. Setiap transaksi selalu memiliki kategori valid yang dimiliki user yang sama.
3. Kategori tidak bisa dihapus jika masih direferensikan transaksi.
4. Menghapus transaksi tidak menghapus kategori.
5. Mengubah nama kategori langsung tercermin di semua tampilan transaksi.
6. Nominal tersimpan selalu positif; arah uang ditentukan `type`.
7. Tanggal transaksi tidak boleh di masa depan dan tidak boleh sebelum 2000-01-01.
8. Nama kategori unik tanpa membedakan kapitalisasi **dalam lingkup satu user**.
9. Tidak ada operasi yang mengubah data di luar Server Action yang tervalidasi dan terautentikasi.
10. Tidak ada cache data keuangan atau data turunan sesi yang bisa membuat dashboard basi atau bocor antar user.
11. User tidak dapat membaca atau mengubah data user lain, bahkan dengan menebak ID.
12. Menghapus akun di Supabase menghapus kategori dan transaksi miliknya (cascade), tanpa menyentuh data user lain.

### 8.8 Migrasi, RLS, dan Setup Supabase

Tambahkan script berikut ke `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

Langkah implementasi:

1. Perbarui `db/schema.ts` sesuai §8.4.
2. Jalankan `pnpm db:generate` untuk membuat file SQL di `./drizzle`.
3. Review SQL yang dihasilkan, terutama unique index `(user_id, lower(name))`, index per user, FK kategori `NO ACTION`, dan check amount.
4. Buat migrasi kustom untuk FK ke `auth.users`:
   ```bash
   pnpm drizzle-kit generate --custom --name=auth_user_foreign_keys
   ```
   Isi dengan:
   ```sql
   ALTER TABLE public.categories
     ADD CONSTRAINT categories_user_id_fkey
     FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

   ALTER TABLE public.transactions
     ADD CONSTRAINT transactions_user_id_fkey
     FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
   ```
5. Buat migrasi kustom untuk RLS:
   ```bash
   pnpm drizzle-kit generate --custom --name=enable_rls
   ```
   Isi dengan:
   ```sql
   ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "categories_owner_all" ON public.categories
     FOR ALL TO authenticated
     USING (auth.uid() = user_id)
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "transactions_owner_all" ON public.transactions
     FOR ALL TO authenticated
     USING (auth.uid() = user_id)
     WITH CHECK (auth.uid() = user_id);
   ```
   RLS adalah **pertahanan berlapis** untuk akses via PostgREST/Supabase client. Koneksi Drizzle memakai `DATABASE_URL` langsung dan biasanya melewati RLS, jadi aplikasi tetap **wajib** memfilter `user_id` di setiap query.
6. Jalankan `pnpm db:migrate` pada database development.
7. Konfigurasi Supabase Auth di dashboard:
   - Authentication → Providers → **Email**: aktifkan.
   - **Confirm email**: nonaktifkan untuk v1 (signup harus langsung menghasilkan sesi).
   - **Minimum password length**: `8`.
   - **Allow new users to sign up**: aktifkan.
   - Site URL: `http://localhost:3000` untuk development.
8. Jangan menjalankan migrasi ke database remote/produksi tanpa persetujuan eksplisit pemilik data.
9. Jangan commit file `.env`.

**Catatan migrasi:**

- Jika tabel `categories`/`transactions` sudah berisi data dari versi tanpa auth, jangan langsung menambahkan `user_id NOT NULL`. Buat rencana backfill/assignment data ke satu akun terlebih dahulu. Untuk implementasi v1 dari nol, tabel dimulai kosong.
- Jangan membuat tabel `auth.users` tiruan atau mengelola schema `auth` lewat Drizzle; schema tersebut milik Supabase.
- Tidak perlu seed otomatis. Akun dan data uji QA dibuat lewat UI agar sekaligus menguji signup, login, dan isolasi data. Jika ingin data demo, buat script terpisah dan dokumentasikan; jangan jalankan otomatis saat aplikasi start.

## 9. Arsitektur Teknis

### 9.1 Stack dan Batasan

| Area | Ketentuan |
|---|---|
| Framework | Next.js 16 App Router, React 19, TypeScript strict |
| Styling | Tailwind CSS v4 (CSS-first, tanpa `tailwind.config.ts`) |
| Autentikasi | Supabase Auth (provider Email + password) via `@supabase/ssr` dan `utils/supabase/*` |
| Database | PostgreSQL via Supabase, diakses server-side dengan Drizzle ORM |
| DB client | `services/drizzle.service.ts` yang sudah ada |
| Mutasi | Server Actions |
| Rendering | Server Components untuk baca data; Client Components hanya untuk interaksi |
| Package manager | pnpm |
| Testing | Manual QA + `pnpm lint` + `pnpm build` (belum ada test runner) |
| Dependensi baru | `shadcn/ui` dan primitif Radix yang dibawanya diizinkan. `@supabase/ssr`/`@supabase/supabase-js` sudah terpasang untuk auth. Tidak ada state manager, date lib, chart lib, icon package, atau komponen UI lain di luar shadcn. |

**Batasan penting:**

- Supabase dipakai sebagai **host PostgreSQL + penyedia Autentikasi**. `@supabase/ssr`/`utils/supabase/*` hanya untuk auth dan refresh sesi; CRUD kategori/transaksi tetap lewat Drizzle.
- Jangan memakai Supabase JS client untuk membaca/menulis `categories`/`transactions`; jangan mengekspos query data keuangan lewat PostgREST dari aplikasi.
- Jangan memindahkan `services/drizzle.service.ts`; impor `db` dari sana.
- Jangan mengekspos `DATABASE_URL` ke browser. Hanya variabel `NEXT_PUBLIC_*` yang boleh masuk bundle client. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` memang publik, tetapi RLS dan otorisasi aplikasi tetap wajib.
- Jangan menambahkan endpoint REST. Semua mutasi lewat Server Action.
- Jangan membuat tabel atau logika password sendiri. Password hanya ditangani Supabase Auth.

### 9.2 Pola Alur Data

**Baca (read):**

```text
Proxy (proxy.ts)
  → updateSession() refresh cookie Supabase
  → redirect optimistis jika belum login

Page (Server Component)
  → requireUser()  ← guard utama, redirect /login jika tidak ada sesi
  → await searchParams / params
  → service function (services/*.service.ts, userId, ...)
  → Drizzle query ke PostgreSQL dengan filter user_id
  → agregasi di TypeScript bila perlu
  → render Server Component
```

**Tulis (write):**

```text
Client form (useActionState)
  → Server Action ('use server')
  → requireUser()  ← tolak/redirect jika tidak ada sesi
  → normalisasi + validasi server-side
  → cek kepemilikan kategori / aturan bisnis dengan user_id dari sesi
  → Drizzle insert/update/delete (user_id dari sesi)
  → revalidatePath(...)
  → redirect(...) dengan status
```

**Aturan:**

- Jangan melakukan fetch data di `useEffect` untuk halaman utama.
- Jangan menyimpan salinan data transaksi di client state global.
- Jangan membuat API route hanya untuk memenuhi pola REST.
- Query bulan harus memakai rentang tanggal, bukan string `LIKE`, dan selalu menyertakan `user_id`.
- Agregasi dashboard sebaiknya dilakukan dari satu query transaksi bulan tersebut milik user aktif, lalu di-`reduce` di TypeScript.
- Jumlah transaksi per kategori boleh dihitung dengan query agregat yang difilter `user_id`; pastikan hasil `count` dikonversi ke `number`.
- `user_id` hanya boleh berasal dari `requireUser()`, tidak pernah dari `FormData`, query string, atau body request.

### 9.3 Struktur Folder yang Diharapkan

```text
app/
  layout.tsx                      # html, body, metadata, font, theme; tanpa shell/nav
  globals.css
  loading.tsx
  error.tsx
  not-found.tsx
  (auth)/
    layout.tsx                    # layout auth: brand + theme toggle, tanpa nav aplikasi
    login/page.tsx                # Masuk
    signup/page.tsx               # Buat Akun
  (app)/
    layout.tsx                    # AppShell + email user + tombol Keluar
    page.tsx                      # Dashboard
    transactions/
      page.tsx                    # Daftar transaksi
      new/page.tsx                # Tambah transaksi
      [id]/edit/page.tsx          # Ubah transaksi
    categories/
      page.tsx                    # Daftar + form tambah kategori
      [id]/edit/page.tsx          # Ubah kategori
  actions/
    auth.ts                       # signUp, signIn, signOut
    transactions.ts               # Server Actions transaksi
    categories.ts                 # Server Actions kategori
components/
  app-shell.tsx
  auth/
    login-form.tsx                # "use client", useActionState
    signup-form.tsx               # "use client", useActionState
    logout-button.tsx             # "use client", useFormStatus
  nav-links.tsx                   # "use client", usePathname
  month-picker.tsx                # "use client", update URL
  summary-cards.tsx
  category-recap.tsx
  transaction-list.tsx
  transaction-form.tsx            # "use client", useActionState
  category-form.tsx               # "use client", useActionState
  delete-dialog.tsx               # "use client", shadcn Dialog
  status-banner.tsx               # Server Component
  empty-state.tsx
  ui/                             # primitif shadcn/ui (button, card, input, select, label, radio-group, popover, table, badge, dialog, alert, skeleton)
    field.tsx                     # komposisi Label + Input + helper/error
db/
  schema.ts                       # categories + transactions dengan user_id
lib/
  auth.ts                         # "server-only": getUser(), requireUser()
  date.ts
  currency.ts
  month.ts
  validation.ts
services/
  drizzle.service.ts              # existing
  categories.service.ts           # semua fungsi menerima userId
  transactions.service.ts         # semua fungsi menerima userId
  dashboard.service.ts            # agregasi hanya untuk userId
utils/
  supabase/
    server.ts                     # existing: Supabase server client
    client.ts                     # existing; tidak wajib dipakai v1
    middleware.ts                 # existing: updateSession()
proxy.ts                          # existing: refresh sesi + guard optimistis
drizzle/                          # hasil drizzle-kit generate
```

Nama file/fungsi/variabel dalam bahasa Inggris. Teks UI dalam Bahasa Indonesia.

**Catatan struktur:**

- `app/(auth)` dan `app/(app)` adalah route group; URL yang dihasilkan tetap `/login`, `/signup`, dan `/` (route group tidak mengubah path).
- Root layout tidak boleh memuat AppShell atau query database.
- Halaman inti wajib memanggil `requireUser()` sendiri, meskipun `(app)/layout.tsx` sudah menampilkannya untuk kebutuhan shell.
- `utils/supabase/client.ts` tidak wajib dipakai karena semua operasi auth v1 dijalankan lewat Server Actions.

### 9.4 Kontrak Server Action

Gunakan bentuk state yang konsisten:

```ts
export type ActionState = {
  status: "idle" | "error";
  fieldErrors?: Record<string, string>;
  formError?: string;
  values?: Record<string, string>;
};

export type AuthActionState = {
  status: "idle" | "error";
  fieldErrors?: Partial<
    Record<"email" | "password" | "confirmPassword", string>
  >;
  formError?: string;
  values?: { email?: string }; // password TIDAK pernah dikembalikan
};
```

**Aksi transaksi:**

```ts
createTransaction(prevState: ActionState, formData: FormData): Promise<ActionState>
updateTransaction(id: number, prevState: ActionState, formData: FormData): Promise<ActionState>
deleteTransaction(formData: FormData): Promise<void>
```

**Aksi kategori:**

```ts
createCategory(prevState: ActionState, formData: FormData): Promise<ActionState>
updateCategory(id: number, prevState: ActionState, formData: FormData): Promise<ActionState>
deleteCategory(formData: FormData): Promise<void>
```

**Aksi autentikasi:**

```ts
signUp(prevState: AuthActionState, formData: FormData): Promise<AuthActionState>
signIn(prevState: AuthActionState, formData: FormData): Promise<AuthActionState>
signOut(): Promise<void>
```

**Aturan implementasi:**

- Setiap action diawali `"use server"` di file terpisah.
- `id` untuk update di-`bind` di server component: `updateTransaction.bind(null, id)`, lalu divalidasi ulang di action.
- Untuk delete, kirim `id` lewat hidden input dan validasi sebagai integer positif.
- Jika validasi gagal: kembalikan `{ status: "error", fieldErrors, values }`. Jangan redirect.
- Jika sukses: `revalidatePath("/")`, `revalidatePath("/transactions")`, atau `revalidatePath("/categories")` sesuai dampak, lalu `redirect(...)`.
- `redirect()` melempar error kontrol; jangan membungkusnya dalam `try/catch` yang menelan error.
- Jangan mengembalikan objek database mentah ke client.
- Map error PostgreSQL:
  - `23505` (unique violation) → error duplikat nama kategori.
  - `23503` (foreign key violation) → error kategori masih dipakai.
  - Lainnya → log server + `Terjadi kesalahan. Silakan coba lagi.`
- Cek aturan bisnis di server, bukan hanya di komponen form.

**Aturan khusus auth:**

- `signUp`/`signIn` membuat Supabase server client dari `cookies()` (pola `utils/supabase/server.ts`), memanggil API auth, lalu `redirect("/")` bila sesi aktif. Jangan gunakan browser client.
- `signUp` wajib memvalidasi email + password + konfirmasi di server sebelum memanggil Supabase.
- `signOut` memanggil `supabase.auth.signOut()`, lalu `revalidatePath("/", "layout")` sebelum `redirect("/login")` agar cache RSC milik sesi sebelumnya tidak dipakai. Lakukan hal yang sama setelah login/signup sukses bila diperlukan.
- Jangan menaruh password di `AuthActionState.values`, log, pesan error, atau URL.
- Map error Supabase ke copy §7.10.5. Jangan teruskan pesan mentah.
- Jangan memanggil `supabase.auth.getSession()` untuk otorisasi; gunakan `getUser()` lewat `requireUser()`.
- Setiap action transaksi/kategori diawali `const user = await requireUser();` dan seluruh query memakai `user.id`.
- `categoryId` harus diverifikasi dengan `user.id`; jangan hanya memeriksa `id` kategori.
- `redirect()` setelah auth sukses harus berada di luar `try/catch` yang menangkap error kontrol Next.js.

**Pola form client:**

```tsx
const [state, formAction, pending] = useActionState(createTransaction, {
  status: "idle",
});
```

- Gunakan `state.fieldErrors` untuk error inline.
- Gunakan `pending` untuk disabled + copy "Menyimpan…".
- Gunakan `state.values` sebagai nilai default saat error.
- Untuk edit, nilai awal berasal dari server, lalu `state.values` menimpa jika ada error.

### 9.5 Catatan Next.js 16 (Wajib Dibaca)

Project ini memakai `cacheComponents: true` dan `partialPrefetching: true` di `next.config.ts`, serta `export const instant = false` di root layout. Ikuti aturan berikut:

1. **`params` dan `searchParams` adalah Promise.** Selalu `await`:
   ```tsx
   export default async function Page(props: PageProps<"/transactions">) {
     const searchParams = await props.searchParams;
   }
   ```
2. **Gunakan tipe generated** `PageProps<"/path">` dan `LayoutProps<"/">` yang sudah tersedia di project. Jangan menulis tipe manual yang bertentangan.
3. **Jangan menghapus `export const instant = false`** dari `app/layout.tsx`. Ini mencegah validasi static shell memblokir route yang membaca database.
4. **Jangan menambahkan `"use cache"`** pada query keuangan. Data harus segar setelah mutasi.
5. Setiap page yang menampilkan data bulanan harus membaca `searchParams` dan/atau `params`; jangan membuat halaman statis yang menampilkan data basi.
6. Setelah mutasi, gunakan `revalidatePath()` lalu `redirect()`. Jangan mengandalkan refresh manual.
7. `cookies()` async; pola existing di `utils/supabase/server.ts` sudah benar. Server Actions boleh menulis cookie sesi lewat Supabase server client.
8. Server Actions dapat dipanggil langsung via POST. Setiap action wajib memvalidasi input **dan** memanggil `requireUser()`; proxy bukan pengaman data.
9. Jika build gagal karena dynamic data, baca pesan error dan dokumentasi lokal di `node_modules/next/dist/docs/`; jangan menonaktifkan `cacheComponents` tanpa persetujuan.
10. **`proxy.ts` wajib dipakai** untuk refresh sesi Supabase dan redirect optimistis. Jangan membuat `middleware.ts` di root project; Next.js versi ini memakai `proxy.ts`. `utils/supabase/middleware.ts` yang sudah ada hanyalah helper `updateSession()`, bukan Next middleware. Proxy tetap bukan pengganti otorisasi di page/action.
11. Gunakan `supabase.auth.getUser()` untuk memutuskan akses, bukan `getSession()`. `getSession()` boleh dipakai hanya untuk membaca data sesi non-keputusan, jika benar-benar perlu.
12. Redirect yang dibuat setelah `updateSession()` harus menyalin cookie dari response refresh ke response redirect, agar sesi yang dirotasi tidak hilang.
13. Jangan menaruh `await requireUser()` di top level root layout. Letakkan di `(app)/layout.tsx` untuk kebutuhan shell dan di setiap page/action untuk otorisasi. Layout tidak dirender ulang saat navigasi client, jadi layout saja tidak cukup.
14. Halaman auth dan halaman inti membaca cookie, sehingga harus dirender dinamis. Jangan menambahkan `"use cache"` pada halaman yang bergantung pada sesi.
15. Pertahankan `config.matcher` di `proxy.ts` yang sudah mengecualikan `_next/static`, `_next/image`, `favicon.ico`, `sitemap.xml`, `robots.txt`, dan file gambar. Jangan membuat proxy berjalan untuk aset statis.
16. `updateSession()` yang ada mengembalikan `{ response, user }`. Gunakan `user` untuk redirect optimistis dan jangan memanggil `getUser()` dua kali di proxy.

### 9.6 Environment dan Setup

Variabel yang sudah ada di `.env.example`:

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

- `DATABASE_URL` wajib untuk Drizzle.
- `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` **wajib** untuk auth. Keduanya boleh tersedia di browser; jangan pernah memakai `SUPABASE_SERVICE_ROLE_KEY` di client.
- Jangan hapus `utils/supabase/*`; sekarang dipakai untuk auth.
- Jangan commit `.env` atau kredensial asli.
- Konfigurasi Supabase Auth yang wajib (detail di §8.8):
  - Provider Email aktif, signup diizinkan.
  - **Confirm email nonaktif** untuk v1 agar signup langsung mendapat sesi.
  - Minimum password length `8`.
  - Site URL development `http://localhost:3000`.
- Perbarui `README.md` dengan: cara install, cara mengisi env, konfigurasi Supabase Auth, `pnpm db:generate`, `pnpm db:migrate`, `pnpm dev`, langkah signup/login, dan catatan bahwa setiap akun hanya melihat datanya sendiri.
- README juga mencatat bahwa v1 belum memiliki reset password; pemulihan akun dilakukan manual lewat dashboard Supabase.

### 9.7 Keamanan

| ID | Aturan |
|---|---|
| SEC-01 | Semua input divalidasi ulang di server; HTML validation hanya enhancement. |
| SEC-02 | Semua query memakai Drizzle parameterized query; jangan menyusun SQL dari input user. |
| SEC-03 | `categoryId` diverifikasi keberadaannya dan kepemilikannya (`user_id` sesi) sebelum insert/update transaksi. |
| SEC-04 | Output dirender oleh React sehingga otomatis di-escape. Jangan memakai `dangerouslySetInnerHTML`. |
| SEC-05 | Jangan menampilkan stack trace, pesan PostgreSQL, atau path server ke pengguna. |
| SEC-06 | `DATABASE_URL` dan secret (mis. service role key) hanya di server; jangan pernah memakai prefix `NEXT_PUBLIC_`. Publishable key Supabase boleh publik karena dilindungi RLS. |
| SEC-07 | File yang mengimpor `db`/`services` tidak boleh punya directive `"use client"`. |
| SEC-08 | Semua halaman inti wajib sesi Supabase Auth aktif. Autentikasi memakai email + password Supabase; aplikasi tidak menyimpan password atau hash sendiri. |
| SEC-09 | Otorisasi data adalah tanggung jawab aplikasi: setiap query/action memfilter `user_id` dari sesi. Proxy hanya guard optimistis dan tidak boleh menjadi satu-satunya pengaman. |
| SEC-10 | ID kategori/transaksi milik user lain diperlakukan sebagai tidak ditemukan. Jangan mengembalikan 403 yang mengonfirmasi keberadaan data. |
| SEC-11 | RLS wajib diaktifkan pada `categories` dan `transactions` sebagai pertahanan berlapis terhadap akses PostgREST. Namun koneksi Drizzle melewati RLS, jadi RLS bukan pengganti filter `user_id` di aplikasi. |
| SEC-12 | Jangan mengekspos `DATABASE_URL`, service role key, atau secret Supabase ke browser. Hanya `NEXT_PUBLIC_*` yang boleh masuk bundle. |
| SEC-13 | Jangan mencatat password, token, cookie, atau seluruh `FormData` auth. Log hanya kode error yang aman. |
| SEC-14 | Login gagal memakai pesan generik untuk mencegah enumerasi akun. Signup boleh memberi tahu email sudah terdaftar karena dibutuhkan untuk alur. |
| SEC-15 | Jangan menambahkan parameter `next` atau redirect URL dari input pengguna. Semua redirect auth menuju `/` atau `/login` yang hard-coded. |
| SEC-16 | Rate limit login/signup mengikuti Supabase Auth. Map error 429 ke copy Indonesia; jangan menonaktifkan rate limit untuk kenyamanan development yang akan terbawa ke produksi. |
| SEC-17 | Server Action delete tetap mengecek foreign key dan aturan bisnis, meskipun UI sudah mencegah. |

### 9.8 Performa

- Query bulanan memakai index `(user_id, date, created_at)`.
- Satu page cukup melakukan satu query utama; hindari N+1.
- Agregasi dashboard dilakukan di TypeScript dari data bulan tersebut, sudah terfilter user.
- Target waktu render dashboard < 2 detik pada database lokal dengan 1.000 transaksi.
- Tidak memuat library chart, ikon, atau date yang berat.
- Gunakan `loading.tsx` agar navigasi tidak terasa kosong.
- Jangan melakukan prefetch data keuangan ke client sebelum dibutuhkan.
- Baca sesi sekali per request dengan React `cache()` di `lib/auth.ts`; proxy juga memanggil `getUser()` untuk refresh, tetapi data keuangan tidak di-fetch di proxy.
- Jangan meng-cache hasil query per user di cache global. Jika menambahkan cache di masa depan, cache key wajib memuat `user_id`.

## 10. UI dan Design Requirements

### 10.1 Arah Visual

- **Kesan:** rapi, tenang, terpercaya, seperti buku kas digital—bukan aplikasi bank yang ramai.
- **Gaya:** kertas hangat, tinta tajam, border 1px, tanpa gradien, tanpa ilustrasi dekoratif, tanpa animasi berlebihan.
- **Warna utama:** cobalt `#2447F9` untuk aksi; coral `#F05A3C` hanya sebagai garis sinyal pada feature card; hijau khusus pemasukan dan status sukses; merah khusus error, saldo/selisih negatif, dan aksi destruktif; pengeluaran normal memakai tinta.
- **Tema:** light-first + dark mode manual. Default terang; toggle 44×44 tersimpan di `localStorage`; kelas `.dark` di `<html>`. Jangan memakai `prefers-color-scheme` untuk mengganti tema otomatis.
- **Font:** Geist Sans (sudah tersedia) untuk UI dan angka; nominal memakai `tabular-nums`. Geist Mono tidak dipakai di UI.
- **Primitives:** shadcn/ui untuk Button, Card, Input, Select, Label, RadioGroup, Popover, Table, Badge, Dialog, Alert, dan Skeleton. Jangan membuat primitif itu dari nol.
- **Halaman auth:** sederhana dan tenang; kartu di tengah, tanpa ilustrasi, tanpa gradient. Nama aplikasi dan theme toggle tetap terlihat. Form auth tidak memakai app shell.
- **Ikon:** inline SVG sederhana, stroke 1.75–2, ukuran 18–20px. Tidak menambah package ikon.
- **Fokus:** kejelasan angka dan hierarki, bukan dekorasi.

### 10.2 Design Tokens

Definisikan token di `app/globals.css` (Tailwind v4 `@theme inline`), lalu pakai lewat utility shadcn (`bg-background`, `text-muted-foreground`, `border-border`, `bg-card`). Nama token mengikuti konvensi shadcn; jangan memakai `--color-surface` atau `--color-income`. Token lengkap ada di front matter `docs/DESIGN.md`.

| Token | Light | Dark | Pemakaian |
|---|---|---|---|
| `--background` | `#F7F5EF` | `#101114` | Latar halaman |
| `--foreground` | `#17181C` | `#F2F0EA` | Teks utama, angka netral |
| `--card` | `#FFFEFB` | `#17181D` | Card, tabel, form |
| `--card-foreground` | `#17181C` | `#F2F0EA` | Teks di atas card |
| `--border` | `#E2DED5` | `#2A2C33` | Border card/divider |
| `--input` | `#8E8A80` | `#62656F` | Border input |
| `--muted` | `#F1EEE7` | `#1F2026` | Hover baris, permukaan netral |
| `--muted-foreground` | `#66676F` | `#A6A7B0` | Teks sekunder/helper |
| `--primary` | `#2447F9` | `#5B76FF` | Tombol utama, link, focus ring, nav aktif |
| `--primary-foreground` | `#FFFFFF` | `#0B0D12` | Teks di atas primary |
| `--positive` | `#0B7A57` | `#4ADE9C` | Nominal pemasukan, sukses |
| `--positive-soft` | `#E3F4EC` | `#123528` | Background badge pemasukan/banner sukses |
| `--negative` | `#B42318` | `#FF8A80` | Error, selisih negatif, destruktif |
| `--negative-soft` | `#FBE7E4` | `#3B1A18` | Background banner error |
| `--warning` | `#8F5F00` | `#FBBF24` | Teks peringatan |
| `--warning-soft` | `#FFF2D9` | `#3A2A0A` | Background peringatan |
| `--brand` | `#F05A3C` | `#FF7A5C` | Garis aksen feature card |
| `--feature` | `#17181C` | `#1B2340` | Kartu Saldo bulan ini |
| `--feature-foreground` | `#F7F5EF` | `#F2F0EA` | Teks di atas feature card |
| `--feature-negative` | `#FF8A80` | `#FF8A80` | Amount saldo negatif di feature card |
| `--ring` | `#2447F9` | `#7C8CFF` | Focus ring |

**Tipografi:**

| Elemen | Ukuran/berat |
|---|---|
| `h1` | 24px/32px mobile, 30px/36px desktop, weight 700 |
| Subjudul halaman | 14px/20px, muted |
| Judul section | 20px/28px, weight 600 |
| Label field | 14px/20px, weight 500 |
| Input/select | 16px/24px (mobile minimal 16px) |
| Body | 16px/24px |
| Helper/error | 13px/18px |
| Angka nominal card | 24px/32px mobile, 28px/36px desktop, weight 700, tabular |
| Header tabel | 12px/16px, uppercase, letter-spacing 0.04em, muted |

**Bentuk dan spasi:**

- Radius card: 12px; input/tombol: 8px; badge: 999px; dialog: 16px.
- Border: 1px `--border`.
- Shadow card: tidak ada. Shadow hanya untuk popover dan dialog.
- Padding card: 16px mobile, 24px desktop.
- Jarak antar section: 24px mobile, 32px desktop.
- Tinggi input/tombol minimal 44px.
- Lebar konten maksimal 1120px; form maksimal 640px.

### 10.3 Komponen Wajib

| Komponen | Tanggung jawab | State yang wajib ada |
|---|---|---|
| `AppShell` | Header/sidebar/bottom nav + email user + Keluar + main | Mobile, tablet, desktop |
| `LoginForm` | Form email + password, error inline, pending | Default, error, pending |
| `SignupForm` | Form email + password + konfirmasi, error inline, pending | Default, error, pending |
| `LogoutButton` | Tombol Keluar dengan Server Action | Default, pending |
| `NavLinks` | Tautan nav + active state | `aria-current="page"` |
| `MonthPicker` | Prev/next + pemilih bulan/tahun | Default, disabled prev/next, pending |
| `ThemeToggle` | Toggle terang/gelap 44×44 | Light, dark, focus |
| `SummaryCards` | Tiga kartu ringkasan; Saldo bulan ini memakai feature card | Normal, nol, saldo negatif |
| `CategoryRecap` | Tabel/kartu rekap + total | Ada data, kosong |
| `TransactionList` | Tabel/kartu transaksi | Ada data, kosong, long text |
| `TransactionForm` | Create/edit transaksi | Default, error, pending, no-category |
| `CategoryForm` | Create/edit kategori | Default, error, pending |
| `DeleteDialog` | Konfirmasi hapus | Confirm, blocked (kategori dipakai), pending |
| `StatusBanner` | Pesan sukses/error dari query | Success, error, dismissible |
| `EmptyState` | Placeholder + CTA | Dashboard, transaksi, kategori |
| `Button` | Varian primary/outline/ghost/destructive | Default, hover, focus, disabled, pending |
| `Field` | Label + input + helper + error | Normal, error, disabled |
| `Badge` | Jenis transaksi | Income, expense |

**Aturan tombol:**

- Primary: cobalt solid; teks memakai `--primary-foreground` (putih di light mode, tinta gelap di dark mode). Satu primary action per view.
- Outline: card + border, teks foreground.
- Destructive: merah solid hanya untuk konfirmasi hapus; tombol "Hapus" di daftar boleh outline merah.
- Ghost: untuk "Batal"/"Tutup"/prev/next.
- Jangan memakai coral untuk aksi, error, atau pengeluaran. Coral hanya garis aksen feature card.
- Jangan memakai warna merah untuk aksi non-destruktif.
- Tinggi tombol minimal 44px; radius 8px; ikon 18px.
- Semua tombol punya label teks; ikon saja hanya untuk aksi sekunder dengan `aria-label`.

### 10.4 Copywriting

- Bahasa Indonesia baku, ringkas, tidak kaku. Gunakan "Anda" pada helper/empty state.
- Gunakan Title Case untuk judul halaman, judul section, dan label tombol ("Tambah Transaksi", "Rekap per Kategori"). Gunakan sentence case untuk kalimat bantuan, deskripsi, dan empty state. Konsisten di seluruh aplikasi.
- Istilah tetap:
  - **Pemasukan** / **Pengeluaran** (bukan "Income"/"Expense" di UI).
  - **Saldo bulan ini** untuk `income - expense` bulan terpilih, bukan saldo rekening.
  - **Selisih** untuk `income - expense` per kategori.
  - **Uraian** untuk deskripsi transaksi.
  - **Nominal** untuk jumlah uang.
  - **Masuk** untuk login, **Buat Akun** untuk signup, dan **Keluar** untuk logout.
  - **Email** dan **Password** ditulis apa adanya, bukan "Surel" atau "Kata sandi".
- Nominal selalu memakai "Rp" dan pemisah ribuan titik.
- Tanggal selalu `16 Nov 2026`, bukan `11/16/2026`.
- Jangan menampilkan angka mentah tanpa format.
- Error harus menjelaskan apa yang salah dan cara memperbaikinya bila relevan.
- Tidak ada teks "Coming soon", "TODO", atau placeholder di UI final.

### 10.5 Interaksi dan Motion

- Transisi warna/opacity maksimal 150ms.
- Fokus keyboard harus langsung terlihat; jangan menghapus outline tanpa pengganti.
- Hover hanya enhancement; semua aksi tetap dapat diakses lewat keyboard/tap.
- Dialog: fade ringan pada backdrop, tanpa animasi slide yang lambat.
- Jangan memakai animasi pada angka saldo; nilai harus langsung terbaca.
- Hormati `prefers-reduced-motion`.

### 10.6 Layout Halaman

**Dashboard:**

1. Header (judul, subjudul, CTA).
2. Month picker.
3. Summary cards (Pemasukan, Pengeluaran, Saldo bulan ini; Saldo memakai feature card).
4. Rekap card (header section + tautan + tabel/kartu).
5. Empty state menggantikan tabel bila tidak ada data.

**Transaksi:**

1. Header (judul, subjudul jumlah, CTA).
2. Banner (jika ada).
3. Month picker.
4. Daftar (tabel/kartu) atau empty state.

**Kategori:**

1. Header.
2. Banner (jika ada).
3. Card form tambah.
4. Daftar (tabel/kartu) atau empty state.

**Form transaksi/kategori:**

1. Tautan kembali.
2. Header.
3. Card form (max-width 640px).
4. Error callout (jika ada error form-level).
5. Field + error inline.
6. Actions (primary + batal).

**Masuk / Buat Akun:**

1. Header ringan: nama aplikasi + theme toggle.
2. Kartu auth di tengah (max-width 420px).
3. `h1` (Masuk / Buat Akun) + subjudul.
4. Field email, password, dan konfirmasi (khusus signup).
5. Error form-level di atas tombol submit, lalu tombol primary full-width.
6. Tautan ke halaman auth satunya.
7. Tanpa sidebar, bottom nav, atau tautan ke halaman inti sebelum login.

---

## 11. Rencana Implementasi

Kerjakan berurutan. Jangan lanjut ke fase berikutnya sebelum exit criteria fase saat ini terpenuhi.

### Fase 0 — Fondasi Data, Skema, dan Helper Auth

**Tugas:**
- Baca dokumentasi Next.js lokal yang relevan (`node_modules/next/dist/docs/`), terutama authentication, proxy, dan cache components.
- Perbarui `db/schema.ts` sesuai §8.4 (`user_id`, index per user, unique per user).
- Tambahkan script db ke `package.json`.
- Generate dan review migrasi; tambahkan migrasi kustom FK ke `auth.users` dan RLS (§8.8).
- Konfigurasi Supabase Auth: provider Email aktif, confirm email nonaktif, minimum password 8.
- Buat `lib/auth.ts` (`getUser`, `requireUser`), `lib/date.ts`, `lib/month.ts`, `lib/currency.ts`, `lib/validation.ts`.
- Buat service kategori, transaksi, dan dashboard dengan parameter `userId` sebagai argumen wajib.
- Pastikan `db`, `services`, dan `lib/auth.ts` tidak pernah diimpor ke Client Component.

**Exit criteria:**
- Migrasi berhasil di database development; FK ke `auth.users` dan RLS terpasang.
- Konfigurasi Supabase Auth terverifikasi; user uji dapat dibuat lewat dashboard atau akan dibuat lewat `/signup` di Fase 1.
- Query sederhana insert/select kategori dan transaksi dengan `user_id` berhasil.
- `requireUser()` redirect ke `/login` saat tidak ada sesi.
- Helper tanggal menghasilkan bulan/hari Jakarta yang benar.
- `pnpm lint` lulus untuk file baru.

### Fase 1 — Autentikasi dan Proteksi Route

**Tugas:**
- Perbarui root layout: `lang="id"`, metadata produk, font, dan background; belum memasang AppShell.
- Perluas `proxy.ts` + `utils/supabase/middleware.ts` untuk redirect optimistis dan mempertahankan cookie refresh.
- Buat `app/actions/auth.ts` (`signUp`, `signIn`, `signOut`) dengan validasi server dan pemetaan error.
- Buat `app/(auth)/layout.tsx`, `/login`, `/signup` beserta `LoginForm` dan `SignupForm`.
- Buat `LogoutButton`; integrasikan ke AppShell di Fase 2 (boleh dipasang sementara di halaman inti untuk pengujian).
- Redirect sukses login/signup ke `/`; logout ke `/login`.
- Tambahkan `requireUser()` di halaman inti dan action sebagai guard utama.
- Terapkan state pending, error inline, autocomplete, dan copy §7.10.

**Exit criteria:**
- Signup email baru → sesi aktif → redirect `/`.
- Email duplikat ditolak dengan copy yang benar.
- Login valid → `/`; login salah → pesan generik.
- Logout → `/login`; halaman inti tidak bisa diakses tanpa sesi.
- Pengguna login yang membuka `/login`/`/signup` → `/`.
- Tidak ada nav aplikasi di halaman auth.
- Password tidak muncul di URL, log, atau state client.
- Alur auth inti berfungsi; QA tampilan shell dan QA auth penuh (§12.1.1) dieksekusi di Fase 2 setelah dashboard/shell tersedia.

### Fase 2 — App Shell dan Design System Dasar

**Tugas:**
- Buat `app/(app)/layout.tsx`, `AppShell`, `NavLinks`, `Button`, `Field`, `EmptyState`.
- Tampilkan email pengguna dan tombol "Keluar" di shell sesuai §6.2.
- Terapkan token light/dark di `globals.css`, pasang theme toggle, dan siapkan primitif shadcn/ui.
- Pindahkan dashboard ke `app/(app)/page.tsx`; hapus halaman demo `users` dari `app/page.tsx`.
- Buat halaman placeholder untuk dashboard, transaksi, kategori.
- Tambahkan `loading.tsx`, `error.tsx`, `not-found.tsx`.

**Exit criteria:**
- Nav berfungsi di 375, 768, 1024, 1440 px.
- Active state benar; skip link berfungsi; tidak ada horizontal scroll.
- Email + Keluar tersedia di semua breakpoint.
- Theme toggle juga tersedia di halaman auth.
- QA auth §12.1.1 lulus dengan dashboard dan shell final.

### Fase 3 — Kategori

**Tugas:**
- Implementasi service kategori (list + count, create, update, delete guard) dengan `userId`.
- Halaman `/categories` dengan form inline.
- Halaman `/categories/[id]/edit`.
- Server Actions kategori + validasi + `requireUser()`.
- `DeleteDialog` untuk kategori.
- Banner status/error.
- Empty state.

**Exit criteria:**
- QA kategori di §12 lulus.
- Duplikat case-insensitive dalam satu user ditolak; user berbeda boleh punya nama sama.
- Kategori terpakai tidak bisa dihapus.
- User A tidak melihat/mengubah kategori user B; ID user B → 404.
- Rename langsung tercermin di data transaksi (setelah transaksi ada).

### Fase 4 — Transaksi

**Tugas:**
- Service transaksi (list per bulan, get by id, create, update, delete) dengan `userId`.
- Verifikasi `categoryId` milik user yang sama sebelum insert/update.
- `MonthPicker`.
- Halaman `/transactions` dengan tabel/kartu responsif.
- Halaman `/transactions/new` dan `[id]/edit` dengan form reusable.
- Server Actions transaksi + validasi + `requireUser()`.
- `DeleteDialog` transaksi.
- Banner status.
- Empty state dan callout belum ada kategori.

**Exit criteria:**
- QA transaksi di §12 lulus.
- Create income/expense benar.
- Edit/delete mengubah data; ID user lain → 404.
- Kategori user lain tidak bisa dipakai lewat manipulasi `categoryId`.
- Redirect membawa bulan yang tepat.
- Tidak ada double submit.

### Fase 5 — Dashboard

**Tugas:**
- Service dashboard: ambil transaksi bulan milik user + agregasi.
- Summary cards.
- Rekap per kategori + total row + sorting.
- Month picker terintegrasi.
- Empty state kondisional (termasuk akun baru tanpa kategori).
- Tautan ke daftar transaksi.

**Exit criteria:**
- Perhitungan Lampiran A cocok untuk akun uji.
- Card dan tabel konsisten.
- Bulan kosong menampilkan empty state.
- Bulan berjalan default benar.
- Dua akun berbeda tidak saling melihat data.

### Fase 6 — Polish, Responsif, dan Aksesibilitas

**Tugas:**
- Audit semua state: loading, error, empty, pending, success, sesi kedaluwarsa.
- Audit responsif di 375/768/1024/1440, termasuk `/login` dan `/signup`.
- Audit keyboard, focus, label, `aria-*`, kontras.
- Audit kebocoran data: IDOR, cache, back button setelah logout, email di shell.
- Pastikan copy konsisten dan tidak ada teks Inggris yang bocor.
- Optimasi query per user dan pastikan tidak ada N+1.
- Pastikan tidak ada sisa halaman/komponen demo `users`; dashboard sudah berada di `app/(app)/page.tsx`.

**Exit criteria:**
- Semua item §7.8, §7.9, dan §7.10 terpenuhi.
- Tidak ada error console.
- Halaman auth dan inti berfungsi di light/dark mode.
- Lighthouse accessibility ≥ 90 untuk dashboard, form, dan halaman auth (target, bukan blocker jika ada alasan teknis yang terdokumentasi).

### Fase 7 — QA Akhir dan Dokumentasi

**Tugas:**
- Jalankan seluruh QA matrix §12, termasuk auth dan isolasi data.
- Jalankan `pnpm lint` dan `pnpm build`.
- Perbarui README (setup, env, konfigurasi Supabase Auth, migrasi, alur signup/login, isolasi data).
- Pastikan tidak ada secret/password yang ter-commit.
- Pastikan tidak ada fitur di luar scope.

**Exit criteria:**
- Definition of Done §13 terpenuhi.
- Build produksi sukses.
- Dokumen ini tidak perlu diubah untuk memahami cara kerja aplikasi.

## 12. Acceptance Test dan QA

### 12.1 Functional Test Matrix

Jalankan di environment development dengan database bersih. Catat hasil dan screenshot bila perlu.

#### 12.1.1 Autentikasi dan Isolasi Data

| ID | Skenario | Langkah ringkas | Hasil yang diharapkan |
|---|---|---|---|
| QA-AUTH-01 | Signup valid | `/signup` → email baru, password 8+ karakter, konfirmasi sama → "Buat Akun" | Redirect ke `/`; sesi aktif; dashboard akun baru tanpa kategori; email tampil di shell |
| QA-AUTH-02 | Signup email duplikat | Signup ulang dengan email yang sama | Ditolak; "Email sudah terdaftar. Silakan masuk."; email dipertahankan; password kosong; tidak ada user ganda |
| QA-AUTH-03 | Validasi signup | Submit kosong, email salah format, password 7 karakter, konfirmasi berbeda | Error inline sesuai §7.5; tidak ada akun dibuat; tidak ada password yang dikembalikan |
| QA-AUTH-04 | Login valid | Logout, lalu `/login` dengan akun yang sama | Redirect `/`; data milik akun tersebut tampil |
| QA-AUTH-05 | Login gagal | Coba password salah dan email tidak terdaftar | Keduanya menampilkan `Email atau password salah.`; tidak ada perbedaan copy; password dikosongkan |
| QA-AUTH-06 | Proteksi route | Incognito buka `/transactions` dan `/categories` | Redirect `/login`; setelah login sukses diarahkan ke `/`, bukan kembali ke URL awal |
| QA-AUTH-07 | Halaman auth saat login | Saat sesi aktif buka `/login` dan `/signup` | Redirect `/`; form auth tidak tampil |
| QA-AUTH-08 | Logout | Klik "Keluar" di mobile, tablet, desktop | Redirect `/login`; refresh halaman inti meminta login lagi; tidak ada data keuangan baru tanpa sesi |
| QA-AUTH-09 | Persistensi sesi | Refresh dashboard dan buka tab baru | Tetap login; tidak ada redirect acak; tidak ada hydration warning |
| QA-AUTH-10 | Isolasi dua akun | Buat User A dan User B; masing-masing buat kategori/transaksi; buka URL edit milik akun lain | A tidak melihat data B; ID B → 404; opsi kategori B tidak muncul di form A |
| QA-AUTH-11 | Normalisasi email | Signup dengan `" Rina@Example.com "`, lalu login dengan `rina@example.com` | Berhasil; email ditampilkan lowercase tanpa spasi |
| QA-AUTH-12 | Tidak ada kebocoran password | Periksa URL, console browser, log server, dan response action setelah error | Password tidak muncul di mana pun; tidak ada token/cookie yang di-log |
| QA-AUTH-13 | Konfigurasi signup | Signup akun baru tanpa membuka email | Tidak ada email konfirmasi yang dikirim; sesi langsung aktif; redirect `/` |
| QA-AUTH-14 | Manipulasi kategori | Kirim `categoryId` milik user lain lewat form tambah transaksi | Ditolak "Kategori tidak ditemukan. Muat ulang halaman."; tidak ada transaksi tersimpan |

#### 12.1.2 Fitur Keuangan

| ID | Skenario | Langkah ringkas | Hasil yang diharapkan |
|---|---|---|---|
| QA-01 | Tambah kategori valid | `/categories` → isi "Makan" → Tambah | Kategori muncul, banner sukses, input kosong |
| QA-02 | Duplikat kategori | Tambah "Makan", lalu " makan " | Ditolak; error "Nama kategori sudah digunakan."; input dipertahankan |
| QA-03 | Ubah kategori | Klik Ubah "Makan" → "Makan & Minum" → simpan | Nama berubah, banner sukses, data transaksi ikut menampilkan nama baru |
| QA-04 | Hapus kategori kosong | Kategori tanpa transaksi → Hapus → konfirmasi | Kategori hilang, banner sukses |
| QA-05 | Hapus kategori terpakai | Kategori dengan 2 transaksi → Hapus | Dialog "Kategori tidak dapat dihapus"; tidak ada data hilang; panggilan langsung ke action juga ditolak |
| QA-06 | Tambah pengeluaran | Transaksi: 16 Nov 2026, "Makan siang", Makan, Pengeluaran, 150000 | Redirect ke November 2026, banner sukses, transaksi muncul dengan `-Rp 150.000` |
| QA-07 | Tambah pemasukan | Transaksi: 10 Nov 2026, "Gaji", Gaji, Pemasukan, 8000000 | Muncul dengan `+Rp 8.000.000`; total pemasukan dashboard naik |
| QA-08 | Validasi form kosong | Submit form tanpa mengisi apa pun | 5 error field yang relevan, tidak ada baris dibuat, nilai form tetap |
| QA-09 | Nominal tidak valid | Coba 0, -100, 10.5, `1e3`, 2.000.000.001 | Ditolak dengan pesan sesuai §7.5; data tidak tersimpan |
| QA-10 | Tanggal tidak valid | Coba 1999-12-31 dan tanggal besok | Ditolak dengan pesan sebelum 2000 / masa depan |
| QA-11 | Ubah bulan transaksi | Ubah transaksi 16 Nov menjadi 5 Okt | Redirect ke Oktober; hilang dari November; muncul di Oktober |
| QA-12 | Hapus transaksi | Hapus transaksi → konfirmasi | Transaksi hilang dari daftar dan dashboard, banner sukses |
| QA-13 | Perhitungan dashboard | Masukkan data Lampiran A | Pemasukan 9.000.000; pengeluaran 200.000; saldo 8.800.000; total row cocok |
| QA-14 | Kategori dengan dua jenis | Kategori "Freelance": income 500.000 + expense 100.000 | Baris menampilkan pemasukan 500.000, pengeluaran 100.000, selisih +400.000 |
| QA-15 | Pindah bulan | Dashboard Nov → prev ke Okt → next ke Nov | Semua section berubah; URL dan data konsisten; next disabled di bulan berjalan |
| QA-16 | Bulan kosong | Pilih bulan tanpa transaksi | Card Rp 0; rekap kosong dengan empty state; tidak error |
| QA-17 | Query bulan invalid | Buka `/?month=2026-13` dan `/?month=abc` | Fallback ke bulan berjalan; tidak error |
| QA-18 | Mobile 375px | Buka semua halaman inti dan `/login`/`/signup` di 375×812 | Bottom nav berfungsi di halaman inti; kartu, bukan tabel terpotong; tidak ada horizontal scroll; Keluar + theme toggle tidak menimpa |
| QA-19 | Tablet 768px | Buka semua halaman dan auth di 768×1024 | Top nav; email + Keluar terlihat; tabel/kartu sesuai; form max-width; tidak ada overflow |
| QA-20 | Desktop 1440px | Buka semua halaman dan auth di 1440×900 | Sidebar; email + Keluar di footer; konten max-width; kartu auth center |
| QA-21 | Batas bulan/timezone | Set TZ server ke UTC; simulasikan waktu 30 Nov 2026 17:30 UTC (= 1 Des 00:30 WIB); buka dashboard dan tambah transaksi 1 Des 2026 | Bulan berjalan dianggap Desember; transaksi tetap di Desember, bukan November |
| QA-22 | Teks panjang dan XSS | Uraian 200 karakter + `<script>alert(1)</script>` | Teks tampil literal, dibungkus rapi, tidak ada script berjalan, tidak overflow |
| QA-23 | 404 | Login, lalu buka `/transactions/999999/edit`, `/categories/abc/edit`, dan ID milik akun lain | Halaman 404 dengan tautan kembali; tidak ada stack trace; tidak mengonfirmasi data akun lain |
| QA-24 | Keyboard dan screen reader dasar | Tab melalui nav, form, dialog, tabel | Fokus terlihat; label terbaca; Escape menutup dialog; error diumumkan |
| QA-25 | Build dan lint | Jalankan `pnpm lint` dan `pnpm build` | Keduanya sukses tanpa error |
| QA-26 | Alur tanpa kategori | Hapus semua kategori → buka form transaksi | Callout "Belum ada kategori"; form tidak tampil; CTA ke kategori |
| QA-27 | Double submit | Klik "Simpan Transaksi" cepat dua kali | Hanya satu transaksi tersimpan; tombol disabled saat pending |

### 12.2 Responsive QA Matrix

| Viewport | Halaman yang diuji | Fokus |
|---|---|---|
| 375 × 812 | Login, signup, dashboard, transaksi, kategori, form | Bottom nav, kartu, tombol full-width, Keluar + toggle, tidak overflow |
| 768 × 1024 | Semua termasuk auth | Top nav, email + Keluar, tabel, form, dialog |
| 1024 × 768 | Semua termasuk auth | Sidebar, konten, tabel, kartu auth |
| 1440 × 900 | Semua termasuk auth | Max-width, whitespace, hierarki, kartu auth center |

Checklist tiap viewport:

- [ ] Tidak ada horizontal scroll pada `document.documentElement.scrollWidth > window.innerWidth`.
- [ ] Semua field dapat diisi tanpa zoom (iOS).
- [ ] Bottom nav tidak menutupi tombol terakhir (safe-area).
- [ ] Dialog tidak keluar dari viewport.
- [ ] Uraian/kategori panjang tidak memotong layout.
- [ ] Tombol aksi minimal 44 × 44 px.
- [ ] Tidak ada elemen yang hanya muncul saat hover.
- [ ] Form auth muat penuh di 375 px dan tombol submit full-width.
- [ ] Email pengguna tidak menimpa tombol "Keluar" atau theme toggle.

### 12.3 Command Checks

```bash
pnpm lint
pnpm build
pnpm dev
```

- `pnpm lint` harus tanpa error.
- `pnpm build` harus sukses, termasuk TypeScript check.
- `pnpm dev` harus bisa membuka `/signup`, `/login`, dashboard, transaksi, kategori, dan form setelah login.
- Tidak ada warning hydration mismatch di console browser.
- `proxy.ts` aktif: request tanpa sesi ke halaman inti tidak merender data.
- Tidak ada password/token di output log development.

### 12.4 Data Uji Perhitungan

Buat akun uji lewat `/signup`, lalu gunakan Lampiran A. Setelah data dimasukkan, cocokkan angka card, tabel, dan baris total. Jika ada selisih, perbaiki agregasi sebelum melanjutkan QA responsive. Ulangi dengan akun kedua untuk memastikan angka akun pertama tidak bocor.

---

## 13. Definition of Done

v1 dinyatakan selesai jika **semua** poin berikut terpenuhi:

- [ ] Seluruh requirement P0 di §7 diimplementasikan, termasuk §7.10.
- [ ] Seluruh QA matrix §12.1 lulus, termasuk auth dan isolasi data.
- [ ] Responsive matrix §12.2 lulus di 375, 768, 1024, 1440 px, termasuk halaman auth.
- [ ] Signup dengan email + password berhasil dan redirect ke `/`.
- [ ] Login/logout berfungsi; halaman inti tidak dapat diakses tanpa sesi.
- [ ] Pengguna yang sudah login tidak bisa membuka `/login`/`/signup`.
- [ ] Setiap akun hanya melihat kategori dan transaksi miliknya; ID user lain → 404.
- [ ] RLS aktif di `categories` dan `transactions`, dan aplikasi tetap memfilter `user_id`.
- [ ] Tidak ada password/token di database aplikasi, URL, log, atau state client.
- [ ] Dashboard akurat untuk data Lampiran A.
- [ ] Kategori tidak bisa dihapus saat masih dipakai.
- [ ] Semua nominal, tanggal, dan bulan mengikuti aturan format §7.7.
- [ ] Semua form mempertahankan input saat error dan mencegah double submit.
- [ ] Light dan dark mode konsisten; tidak ada flash tema; semua state diuji di kedua mode.
- [ ] `pnpm lint` dan `pnpm build` sukses.
- [ ] Tidak ada error/warning di console browser pada alur utama.
- [ ] Tidak ada teks placeholder, TODO, atau "Create Next App".
- [ ] Halaman demo `users` sudah diganti dengan dashboard.
- [ ] Migrasi Drizzle tersedia dan dapat dijalankan dari nol, termasuk FK auth dan RLS.
- [ ] README diperbarui (env, konfigurasi Supabase Auth, migrasi, dev, alur signup/login, isolasi data).
- [ ] Tidak ada secret/kredensial di repository.
- [ ] Tidak ada fitur di luar §5.
- [ ] Aksesibilitas dasar §7.9 dan §7.10 terpenuhi.

---

## 14. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kebocoran data antar akun/IDOR | Data keuangan user lain terlihat atau berubah | `requireUser()` di page/action, filter `user_id` di semua query, ID user lain → 404, RLS aktif, QA-AUTH-10/14 |
| Email confirmation tidak sengaja aktif | Signup tidak mendapat sesi; redirect gagal | Nonaktifkan di Supabase; `signUp` memeriksa `session`; tampilkan error konfigurasi dan log; QA-AUTH-13 |
| Tidak ada reset password | User lupa password tidak bisa masuk | Pemulihan manual lewat dashboard Supabase; catat di README; reset password jadi kandidat v2 |
| Session tidak ter-refresh | User ter-logout atau token kedaluwarsa | `proxy.ts` + `updateSession()`; `getUser()` di server; uji refresh dan sesi kedaluwarsa |
| Redirect auth menghilangkan cookie refresh | Logout acak saat redirect | Salin cookie dari response `updateSession` ke response redirect |
| Open redirect | User diarahkan ke situs berbahaya | Tidak ada parameter `next`; redirect selalu hard-coded ke `/` atau `/login` |
| Enumerasi akun | Penyerang mengetahui email terdaftar | Login memakai pesan generik; signup memang memberi tahu email terdaftar sesuai alur; rate limit Supabase |
| Email tidak diverifikasi | Pengguna dapat mendaftar dengan email yang bukan miliknya | Diterima sebagai tradeoff prototype v1; verifikasi email masuk kandidat v2; jangan gunakan email untuk reset password di v1 |
| Password/token bocor di log | Kredensial terekspos | Jangan log `FormData`, password, token, atau cookie; hanya kode error aman |
| Kunci publishable Supabase publik | Akses PostgREST langsung | Wajar untuk publishable key; RLS wajib dan aplikasi tidak memakai Supabase client untuk data keuangan |
| Bug timezone | Transaksi tanggal 1 masuk bulan sebelumnya | Gunakan helper Asia/Jakarta; uji QA-21; jangan pakai `toISOString()` untuk tanggal lokal |
| Kategori terhapus saat dipakai | Transaksi kehilangan relasi | FK `ON DELETE NO ACTION` + pengecekan jumlah pemakaian di action |
| Dashboard basi setelah mutasi | Angka tidak cocok | `revalidatePath` + redirect; jangan cache data keuangan |
| Scope creep | v1 tidak selesai | Ikuti §5 dan §2.3; tolak fitur tambahan |
| Daftar transaksi panjang | Halaman berat | Index per user; target < 500 baris/bulan; pagination untuk v2 |
| Nominal overflow | Data rusak | Batas 2 miliar + validasi server + check constraint |
| Salah pilih pemasukan/pengeluaran | Rekap salah | Default "Pengeluaran", badge jelas, edit tersedia |
| Next.js 16 cache/build error | Build gagal | Ikuti §9.5; baca docs lokal; pertahankan `instant = false` |
| Duplikasi kategori karena kapitalisasi | Data kotor | Normalisasi + unique index `(user_id, lower(name))` + error mapping |
| Error DB/auth mentah tampil | Kebocoran informasi | Map error code, log server, tampilkan pesan generik |

---

## 15. Asumsi dan Pertanyaan Terbuka

### 15.1 Asumsi

1. Aplikasi **multi-user**: setiap akun memiliki buku kas sendiri; tidak ada berbagi data atau organisasi.
2. Autentikasi memakai Supabase Auth provider **Email + password**. Email confirmation **nonaktif** di v1 agar signup langsung membuat sesi.
3. Tidak ada reset password, verifikasi email, OAuth, magic link, MFA, atau pengaturan profil di v1. Pemulihan akun manual lewat dashboard Supabase.
4. Aplikasi tidak mengirim email transaksional apa pun di v1.
5. Mata uang tunggal IDR; tidak ada nilai tukar.
6. Tidak ada saldo awal; saldo hanya hasil transaksi pada bulan terpilih.
7. Bulan rekap ditentukan dari tanggal transaksi.
8. Kategori bersifat flat, dimiliki per user, dan dapat dipakai untuk pemasukan maupun pengeluaran.
9. Setiap transaksi memiliki tepat satu kategori milik user yang sama.
10. Akun baru dimulai tanpa kategori/transaksi; tabel demo `public.users` tidak dijadikan bagian dari fitur.
11. Aplikasi dijalankan di server Node.js yang mendukung Next.js 16 dan PostgreSQL.
12. Pengguna memiliki akses ke dashboard Supabase untuk menjalankan migrasi dan mengatur provider Email/konfirmasi.
13. RLS diaktifkan sebagai pertahanan berlapis; koneksi Drizzle memakai `DATABASE_URL` langsung dan melewati RLS, sehingga aplikasi tetap memfilter `user_id`.
14. Sesi disimpan di cookie oleh `@supabase/ssr`; `proxy.ts` berjalan pada setiap request halaman inti.
15. Menghapus user di `auth.users` menghapus kategori/transaksi miliknya lewat cascade, tanpa menyentuh data user lain.

### 15.2 Pertanyaan Terbuka

**Tidak ada pertanyaan yang menghambat implementasi v1.** Semua keputusan yang diperlukan sudah ditetapkan di §4. Jika muncul kebutuhan baru, catat sebagai kandidat v2 dan jangan implementasikan tanpa persetujuan Product.

### 15.3 Kandidat v2 (Bukan Scope)

- Reset/lupa password, verifikasi email, OAuth/social login, MFA, ganti email/password.
- Profil pengguna, hapus akun mandiri, dan pengaturan akun.
- Peran/admin, berbagi buku kas antar akun, dan organisasi/multi-tenant.
- Akun/dompet keuangan dan transfer.
- Budget per kategori + peringatan.
- Transaksi berulang.
- Pencarian, filter, pagination.
- Grafik tren dan komposisi.
- Ekspor CSV/PDF.
- Tema kustom, jadwal tema otomatis, atau tema per halaman.
- PWA/offline.
- Multi-currency.

---

## Lampiran A — Contoh Perhitungan

**Prasyarat:** buat satu akun uji lewat `/signup` (mis. `rina@example.com`). Semua data di bawah adalah milik akun tersebut; akun kedua tidak boleh melihatnya.

**Data uji (November 2026):**

| Tanggal | Uraian | Kategori | Jenis | Nominal |
|---|---|---|---|---|
| 2026-11-10 | Gaji November | Gaji | Pemasukan | 8.000.000 |
| 2026-11-11 | Makan siang | Makan | Pengeluaran | 150.000 |
| 2026-11-15 | Makan malam | Makan | Pengeluaran | 50.000 |
| 2026-11-20 | Bonus proyek | Bonus | Pemasukan | 1.000.000 |

**Hasil dashboard yang diharapkan:**

| Card | Nilai |
|---|---|
| Pemasukan | Rp 9.000.000 |
| Pengeluaran | Rp 200.000 |
| Saldo bulan ini | Rp 8.800.000 |

**Rekap per kategori:**

| Kategori | Pemasukan | Pengeluaran | Selisih | Aktivitas |
|---|---:|---:|---:|---:|
| Gaji | Rp 8.000.000 | Rp 0 | +Rp 8.000.000 | Rp 8.000.000 |
| Bonus | Rp 1.000.000 | Rp 0 | +Rp 1.000.000 | Rp 1.000.000 |
| Makan | Rp 0 | Rp 200.000 | -Rp 200.000 | Rp 200.000 |
| **Total** | **Rp 9.000.000** | **Rp 200.000** | **+Rp 8.800.000** | — |

> Kolom "Aktivitas" hanya dipakai untuk menjelaskan aturan pengurutan; kolom ini tidak ditampilkan di UI dashboard.

**Urutan baris:** Gaji (8.000.000), Bonus (1.000.000), Makan (200.000).

**Varian kategori dua jenis:**
Tambahkan pemasukan "Refund makan" Rp 20.000 ke kategori Makan pada 25 Nov 2026. Maka:

- Makan: pemasukan Rp 20.000, pengeluaran Rp 200.000, selisih -Rp 180.000.
- Total pemasukan: Rp 9.020.000; total pengeluaran: Rp 200.000; saldo: Rp 8.820.000.

**Contoh format tanggal:** `2026-11-16` ditampilkan `16 Nov 2026`; bulan `2026-11` ditampilkan `November 2026`; nominal `150000` ditampilkan `Rp 150.000`.

---

## Lampiran B — Checklist Cepat untuk Implementator AI

Sebelum menandai pekerjaan selesai, pastikan:

- [ ] Saya sudah membaca dokumen ini sampai §13.
- [ ] Saya memakai Supabase Auth email + password, bukan auth kustom atau tabel password sendiri.
- [ ] Signup berhasil membuat sesi dan redirect ke `/`.
- [ ] Login, logout, dan proteksi route berfungsi; halaman auth tidak bisa dibuka saat login.
- [ ] `requireUser()` dipanggil di setiap page/action inti, bukan hanya di proxy/layout.
- [ ] Semua query kategori/transaksi memfilter `user_id` dari sesi; ID user lain → 404.
- [ ] `user_id` tidak pernah diambil dari FormData/URL.
- [ ] RLS aktif pada `categories` dan `transactions`.
- [ ] Tidak ada password/token di URL, log, state client, atau database aplikasi.
- [ ] Saya tidak menambahkan reset password, OAuth, MFA, dompet, budget, chart, atau pagination.
- [ ] Semua data uang memakai integer rupiah.
- [ ] Semua tanggal memakai logika Asia/Jakarta.
- [ ] Semua mutasi adalah Server Action tervalidasi.
- [ ] Semua halaman mengambil `searchParams`/`params` dengan `await`.
- [ ] `instant = false` di root layout tidak dihapus.
- [ ] Tidak ada `"use cache"` pada data keuangan atau data sesi.
- [ ] Semua error ditampilkan dalam Bahasa Indonesia.
- [ ] Saya sudah menjalankan `pnpm lint` dan `pnpm build`.
- [ ] Saya sudah menguji 375, 768, 1024, dan 1440 px, termasuk halaman auth.
- [ ] Saya sudah menguji skenario kategori terpakai, bulan kosong, dan isolasi dua akun.

