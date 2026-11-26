# T12: Dokumentasi dan QA Akhir

**What to build:** Proyek siap diserahkan: README menjelaskan cara memasang, mengonfigurasi Supabase Auth, menjalankan migrasi, menguji, dan memahami isolasi data. Seluruh matriks QA dan Definition of Done v1 terverifikasi tanpa secret, fitur di luar scope, atau error build.

**Blocked by:** T10 (aksesibilitas/state) dan T11 (responsif/tema).

**Status:** done

## Konteks wajib

- Baca `docs/PRD.MD` §9.6 (environment/setup), §11 Fase 7, §12 (seluruh QA), §13 (Definition of Done), dan §14 (risiko).
- Baca `docs/ARCHITECHTURE.md` dan `docs/DESIGN.md` agar README tidak bertentangan dengan keputusan proyek.
- Jangan mengubah scope, menambah fitur, atau menonaktifkan pengaman demi membuat QA lulus.
- Jangan menjalankan migrasi ke database remote/produksi tanpa persetujuan eksplisit.
- Jangan men-commit `.env`, password akun uji, token, atau kredensial asli.

## Cakupan

- Perbarui README (Bahasa Indonesia) minimal memuat:
  - stack dan prasyarat (Node, pnpm, PostgreSQL/Supabase);
  - instalasi dan variabel environment (`DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, variabel akun uji DB);
  - konfigurasi Supabase Auth: provider Email aktif, **confirm email nonaktif**, minimum password 8, signup diizinkan, Site URL development;
  - perintah `pnpm dev`, `pnpm test`, `pnpm test:db`, `pnpm lint`, `pnpm build`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`;
  - langkah migrasi dari database kosong, termasuk migrasi kustom FK `auth.users` dan RLS;
  - alur signup → dashboard, login, logout, dan aturan redirect;
  - penjelasan bahwa setiap akun hanya melihat kategori/transaksi miliknya, ID akun lain → 404, dan RLS adalah lapisan tambahan;
  - catatan bahwa v1 belum memiliki reset password; pemulihan akun manual lewat dashboard Supabase;
  - catatan test runner Vitest (devDependency) dan cakupannya: logic + service database, UI lewat manual QA;
  - peringatan agar `pnpm test:db` hanya dijalankan pada database development.
- Pastikan `.env.example` memuat semua variabel yang dibutuhkan tanpa nilai rahasia.
- Pastikan tidak ada halaman/komponen demo `users` tersisa dan dashboard berada di route yang benar.
- Jalankan dan catat hasil:
  - `pnpm test`;
  - `pnpm test:db`;
  - `pnpm lint`;
  - `pnpm build`;
  - `pnpm dev` dan buka `/signup`, `/login`, dashboard, transaksi, kategori, serta form.
- Jalankan seluruh QA §12.1.1 dan §12.1.2, termasuk dua akun, IDOR, timezone QA-21, XSS QA-22, double submit QA-27, dan keyboard QA-24.
- Verifikasi ulang migrasi dari database kosong dan tidak ada drift.
- Periksa `git status`/diff: tidak ada secret, file build, atau perubahan di luar scope.
- Jika menemukan bug: perbaiki test-first untuk logika murni; untuk UI, perbaiki dan ulangi langkah QA terkait. Jangan menandai selesai selama masih ada kegagalan P0.

## TDD (wajib)

**Seam yang disepakati:** tidak ada perilaku produk baru di ticket ini. Setiap bug logika yang ditemukan saat QA harus direproduksi dengan test yang gagal terlebih dahulu, lalu diperbaiki. Perbaikan copy/layout diverifikasi manual.

**Aturan loop:** reproduksi → test merah (bila logika) → perbaikan minimal → seluruh suite hijau → ulangi QA yang gagal. Jangan melemahkan test atau validasi agar lulus.

## Manual QA wajib

- QA-AUTH-01..14 dan QA-01..27.
- Responsive matrix §12.2 di 375, 768, 1024, dan 1440 px.
- Command checks §12.3: `pnpm lint`, `pnpm build`, `pnpm dev`; tidak ada hydration mismatch; proxy menolak request tanpa sesi; tidak ada password/token di log.
- Definition of Done §13 diperiksa satu per satu.
- Akun baru tanpa kategori → alur "Buat Kategori" → transaksi → dashboard akurat.
- Akun kedua tidak melihat data akun pertama; URL ID akun lain → 404; `categoryId` akun lain ditolak.
- Logout lalu refresh/back pada halaman inti → `/login`.
- Timezone: server UTC, simulasi 30 Nov 2026 17:30 UTC → bulan berjalan Desember.
- Uraian 200 karakter + `<script>alert(1)</script>` tampil literal.
- Light/dark mode di semua halaman; toggle bertahan; tidak ada flash.

## Acceptance criteria

- [x] README lengkap dan sesuai implementasi final.
- [x] `.env.example` lengkap, tanpa rahasia.
- [x] `pnpm test`, `pnpm test:db`, `pnpm lint`, dan `pnpm build` lulus.
- [x] Seluruh QA §12 lulus dan hasilnya dicatat; tidak ada kegagalan P0 terbuka.
- [x] Definition of Done §13 terpenuhi seluruhnya.
- [x] Migrasi dari database kosong berhasil dan tidak ada drift.
- [x] Tidak ada secret, `.env`, token, atau password di repository.
- [x] Tidak ada halaman/komponen demo `users`, teks "Create Next App", "TODO", atau "Coming soon".
- [x] Tidak ada fitur di luar §5 PRD (reset password, OAuth, dompet, budget, chart, pagination, dan lainnya).
- [x] Tidak ada error/warning console pada alur utama.
- [x] Perubahan hanya berisi dokumentasi dan perbaikan yang diperlukan; tidak ada refactor berskala besar.

## Di luar cakupan

- Fitur v2 (reset password, verifikasi email, OAuth, MFA, profil, dompet, budget, recurring, pencarian, filter, pagination, grafik, ekspor).
- Deployment produksi atau migrasi ke database produksi.
- Menutup atau mengubah issue induk di tracker (tidak ada issue induk pada alur ini).
