# T01: Fondasi TDD dan Helper Domain

**What to build:** Test runner dan helper domain yang menjadi fondasi seluruh aplikasi: tanggal/bulan Asia/Jakarta, format rupiah, parsing nominal, normalisasi nama kategori, dan validasi field dengan copy Indonesia persis §7.5. Setelah ticket ini, `pnpm test` membuktikan bahwa aturan tanggal, uang, dan validasi tidak ambigu sebelum ada UI atau database.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

## Konteks wajib

- Baca `docs/PRD.MD` §7.5 (validasi), §7.7 (format tanggal/bulan/uang), §8.6 (aturan hitung), §9.5 (Next.js 16), dan §10.4 (copywriting).
- Baca `docs/ARCHITECHTURE.md` dan `docs/DESIGN.md`.
- Bahasa kode Inggris; seluruh pesan error dan label UI Bahasa Indonesia.
- Vitest hanya **devDependency**. Tidak menambah library tanggal, uang, atau validasi.
- Tidak memakai jsdom/Testing Library. Ticket ini hanya menguji fungsi murni.
- Keputusan produk: TDD memakai Vitest untuk logic + service database, sedangkan UI diverifikasi manual. Ini menggantikan pernyataan PRD §9.1 bahwa proyek belum memiliki test runner; tidak ada dependensi runtime baru.
- Jangan memakai `new Date().toISOString()` untuk tanggal lokal, dan jangan mengandalkan zona waktu server.

## TDD (wajib)

**Seam yang disepakati:** fungsi publik pada modul helper tanggal, bulan, mata uang, dan validasi. Tidak ada test komponen, database, atau Server Action di ticket ini.

**Aturan loop:** tulis satu test yang gagal, lihat merah, tulis implementasi minimal, lihat hijau, lalu refactor. Daftar di bawah adalah target perilaku, **bukan** izin menulis semua test sekaligus.

**Urutan red → green:**

1. **Tanggal Jakarta.** Fungsi menerima instant opsional (default sekarang) agar deterministik.
   - `2026-11-30T17:30:00Z` → hari `2026-12-01` dan bulan `2026-12`.
   - `2026-11-30T16:59:59Z` → hari `2026-11-30` dan bulan `2026-11`.
2. **Rentang bulan.**
   - `2026-11` → awal `2026-11-01`, akhir eksklusif `2026-12-01`.
   - `2026-12` → awal `2026-12-01`, akhir eksklusif `2027-01-01`.
3. **Validasi bulan.** Terima `2000-01` dan `2026-12`; tolak `2026-13`, `2026-00`, `2026-1`, `abc`, dan string kosong.
4. **Navigasi bulan.** Geser bulan menangani pergantian tahun: `2026-01` mundur → `2025-12`; `2026-12` maju → `2027-01`. Batas rentang diuji dengan batas eksplisit (`2000-01` dan bulan berjalan yang diinjeksi), bukan jam sistem.
5. **Label bulan.** `2026-11` → `November 2026`, tidak bergantung zona waktu server.
6. **Format tanggal.** `2026-11-16` → `16 Nov 2026`; `2027-01-01` → `1 Jan 2027`. Suite dijalankan dengan `TZ=UTC` untuk membuktikan tidak ada pergeseran hari.
7. **Format rupiah.**
   - `150000` → `Rp 150.000`; `0` → `Rp 0`; `-200000` → `-Rp 200.000`.
   - Pemasukan `8000000` → `+Rp 8.000.000`; pengeluaran `150000` → `-Rp 150.000`.
   - Normalisasi non-breaking space sebelum assertion (PRD membolehkan spasi non-breaking).
8. **Parsing nominal.** `" 150000 "` → `150000`; `"0"` → `0`; tolak `""`, `"1e3"`, `"10.5"`, `"1.000"`, `"1,000"`, `"-1"`, `"+1"`, dan `"abc"`. Nilai `> 2.000.000.000` tetap ter-parse, lalu ditolak oleh validasi.
9. **Validasi transaksi.** Tanggal kosong, format salah, tanggal mustahil (`2026-02-30`, `2026-04-31`), sebelum 2000-01-01, dan setelah hari ini (Asia/Jakarta) menghasilkan copy VAL-01..04. Uraian kosong/whitespace dan > 200 karakter menghasilkan VAL-05..06. Kategori kosong/bukan integer positif menghasilkan VAL-07. Jenis di luar `income`/`expense` menghasilkan VAL-09. Nominal kosong, bukan digit-only, ≤ 0, dan > 2 miliar menghasilkan VAL-10..13. Input valid mengembalikan nilai ternormalisasi.
10. **Normalisasi nama kategori.** `"  Makan   siang  "` → `"Makan siang"`; tab/newline berlebih menjadi satu spasi; kosong dan > 50 karakter menghasilkan VAL-14..15.
11. **Validasi auth.** Email di-`trim` dan di-lowercase; format salah menghasilkan VAL-19. Password tidak di-trim; kosong → VAL-20; 7 karakter → VAL-21. Konfirmasi berbeda → VAL-22. Nilai email tetap tersedia untuk dipertahankan setelah error.

**Di luar test otomatis:** tidak ada UI di ticket ini. Jangan menulis test Server Action atau database; itu seam ticket berikutnya.

## Acceptance criteria

- [ ] `pnpm test` tersedia, memakai Vitest environment Node, alias `@` berfungsi, dan dijalankan dengan `TZ=UTC`.
- [ ] `pnpm test:watch` tersedia untuk loop red → green.
- [ ] Test integrasi database dikecualikan dari `pnpm test` (disiapkan sebagai `*.integration.test.ts` untuk T03).
- [ ] Semua perilaku di atas memiliki test yang ditulis sebelum implementasi dan lulus.
- [ ] Copy error sama persis dengan §7.5, termasuk tanda baca.
- [ ] Helper mengembalikan nilai ternormalisasi tanpa mengubah data mentah yang dibutuhkan form.
- [ ] Tidak ada dependensi runtime baru; Vitest hanya di `devDependencies`.
- [ ] `pnpm lint` dan `pnpm build` lulus.

## Di luar cakupan

- Tabel database, service, Server Action, halaman, komponen, tema, dan auth.
- Library tanggal/uang eksternal.
- Test komponen atau browser.
