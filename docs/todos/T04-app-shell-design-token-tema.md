# T04: App Shell Responsif, Design Token, dan Tema

**What to build:** Pengguna yang sudah login melihat kerangka aplikasi yang konsisten di mobile, tablet, dan desktop: navigasi aktif, email, tombol Keluar, skip link, dan tema terang/gelap yang tersimpan. Halaman auth tetap memakai layout terpisah tanpa navigasi aplikasi.

**Blocked by:** T02 (sesi, email pengguna, dan halaman auth).

**Status:** ready-for-agent

## Konteks wajib

- Baca `docs/PRD.MD` §6.2 (pola navigasi), §7.1 (APP-01..12), §7.8 (responsif), §7.9 (a11y), §10 (UI dan token), dan §7.6.3–§7.6.4 (loading/error/404).
- Baca `docs/DESIGN.md` sampai front matter token; token adalah sumber kebenaran visual.
- Baca `docs/ARCHITECHTURE.md`: AppShell berada di layout `(core)`; halaman auth di `(auth)`; root layout tidak memuat shell atau query database.
- shadcn/ui dan primitif Radix yang dibawanya diizinkan. Jangan menambah package ikon, state manager, atau library UI lain. Ikon memakai inline SVG.
- Tema **light-first**: default terang, toggle manual, preferensi di `localStorage`, kelas `.dark` di `<html>`. Jangan mengganti tema otomatis lewat `prefers-color-scheme`.
- Pertahankan `export const instant = false` di root layout.
- Layout hanya untuk tampilan; setiap page dan action tetap memanggil `requireUser()` sendiri.

## Cakupan

- Lengkapi token light/dark dari `docs/DESIGN.md`; T02 hanya memasang token dasar untuk halaman auth. Jangan menduplikasi atau mengganti nama token.
- Inisialisasi shadcn/ui dan tambahkan primitif yang dipakai bersama: Button, Card, Input, Label, Select, Table, Badge, Alert, Skeleton. Dialog ditambahkan saat pertama dibutuhkan di T06.
- Komposisi `Field` (label + input + helper + error) dan `EmptyState` yang menerima copy/CTA.
- `StatusBanner` yang memetakan kode `status`/`error` ke copy §7.6.1, memakai `role="status"` atau `role="alert"`, dan punya tautan Tutup yang menghapus parameter tanpa menghilangkan `month`.
- Theme toggle 44×44 dengan `aria-label="Ganti tema"`, tersedia di header auth, top bar mobile/tablet, dan footer sidebar desktop. Tidak ada flash tema saat refresh.
- AppShell tiga breakpoint:
  - Mobile: top bar 56 px (nama aplikasi + Keluar + toggle), bottom nav 64 px + safe-area, padding bawah konten ≥ 88 px, tanpa email.
  - Tablet: header sticky dengan nama aplikasi + nav horizontal + email terpotong + Keluar + toggle.
  - Desktop: sidebar fixed 240 px dengan nav vertikal; footer berisi email, Keluar, toggle; konten bergeser 240 px, max-width 1120 px.
- `NavLinks`: Dashboard hanya untuk `/`; Transaksi untuk `/transactions` dan turunannya; Kategori untuk `/categories` dan turunannya; `aria-current="page"` dan penanda selain warna.
- Skip link "Lewati ke konten" sebagai fokus pertama, menuju `<main id="main-content">`.
- Tombol Keluar memakai `<form action={signOut}>`, pending "Keluar…", dan tersedia di semua breakpoint.
- Placeholder halaman `/transactions` dan `/categories` dengan satu `h1`; placeholder dashboard di `/` yang menampilkan email. Konten fitur menyusul.
- `loading.tsx`, `error.tsx` (tombol "Coba lagi" memanggil `reset()`), dan `not-found.tsx` (tautan "Kembali ke Dashboard").
- Hapus sisa halaman/komponen demo `users`.

## TDD (wajib)

**Seam yang disepakati:** logika murni untuk nav aktif, tema, banner status, dan URL tutup banner. Tampilan/responsif dan wiring logout diverifikasi manual; jangan membuat test komponen atau browser.

**Aturan loop:** satu test gagal → implementasi minimal → hijau → refactor. Tulis test sebelum komponen/halaman memakainya.

**Urutan red → green:**

1. **Nav aktif.** `"/"` → Dashboard; `"/transactions"`, `"/transactions/new"`, `"/transactions/12/edit"` → Transaksi; `"/categories"`, `"/categories/3/edit"` → Kategori; path lain → tidak ada.
2. **Tema.** `"dark"` → dark; `"light"`, `null`, `undefined`, dan nilai asing → light. Tidak ada cabang `prefers-color-scheme`.
3. **Banner transaksi.** `status=created|updated|deleted` → copy §7.6.1, tipe sukses. Kode tidak dikenal → tidak ada banner.
4. **Banner kategori.** `status=created|updated|deleted` dan `error=category-in-use` → copy masing-masing. Kode milik halaman lain diabaikan. Bila `status` dan `error` sama-sama valid, error diprioritaskan.
5. **Tutup banner.** URL dengan `month=2026-11&status=created&error=x` → mempertahankan `month`, menghapus `status`/`error`; tanpa `month` → tanpa query string. Parameter asing tidak dipertahankan.

**Di luar test otomatis:** layout CSS, breakpoint, safe-area, skip link, focus ring, theme flash, logout pending, loading/error/404, dan navigasi nyata.

## Manual QA wajib

- 375×812: top bar, bottom nav, Keluar + toggle tidak bertumpuk, tidak ada horizontal scroll, konten tidak tertutup bottom nav.
- 768×1024: header sticky, nav horizontal, email terpotong dengan `title`, tabel placeholder tidak overflow.
- 1024×768 dan 1440×900: sidebar 240 px, footer sidebar, konten max-width 1120 px.
- Item aktif punya `aria-current="page"` dan penanda visual selain warna.
- Skip link muncul saat fokus pertama, Enter memindahkan fokus ke `main`.
- Tema bertahan setelah refresh; tidak ada flash; tidak ada hydration warning; toggle ada di halaman auth.
- Keluar berfungsi dan menampilkan "Keluar…" saat pending.
- `loading.tsx`, `error.tsx`, `not-found.tsx` tampil sesuai copy.
- Setiap halaman punya tepat satu `h1`; tidak ada teks "Create Next App".

## Acceptance criteria

- [ ] AppShell mengikuti §6.2 dan hanya dipakai halaman `(core)` yang sudah login.
- [ ] Tidak ada horizontal scroll pada 375, 768, 1024, dan 1440 px.
- [ ] Email tampil di tablet/desktop, terpotong dengan ellipsis, dan tidak bisa diedit; tidak tampil di top bar mobile.
- [ ] Keluar tersedia di semua breakpoint dan redirect `/login`.
- [ ] Theme toggle tersimpan, tanpa flash, dan tersedia di halaman auth serta halaman inti.
- [ ] Nav aktif memakai `aria-current="page"` dan bukan hanya warna.
- [ ] Skip link berfungsi dan `main` memiliki `id="main-content"`.
- [ ] Banner status/error, loading, error, dan 404 sesuai copy PRD.
- [ ] Primitif UI memakai shadcn/ui; tidak ada package ikon/state/UI tambahan.
- [ ] Halaman demo `users` sudah hilang.
- [ ] `pnpm test`, `pnpm lint`, dan `pnpm build` lulus.

## Di luar cakupan

- CRUD kategori/transaksi dan dashboard berisi data (ticket fitur).
- Dialog (T06), grafik, drawer, hamburger, dropdown, atau pagination.
- Tema otomatis mengikuti sistem operasi.
