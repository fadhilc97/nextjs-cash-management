# T07: Transaksi — Daftar Bulanan dan Tambah

**What to build:** Pengguna dapat berpindah bulan, melihat seluruh transaksi bulan tersebut (tabel di tablet/desktop, kartu di mobile), lalu mencatat pemasukan atau pengeluaran baru. Transaksi tersimpan dengan kategori miliknya sendiri dan diarahkan ke bulan yang sesuai dengan tanggal transaksi.

**Blocked by:** T03 (tabel), T04 (shell, banner, primitif UI), T05 (kategori dan service kategorinya).

**Status:** done

## Konteks wajib

- Baca `docs/PRD.MD` §7.3.1 (TX-01..12), §7.3.2 (TX-13..25), §6.1 (aturan `month`), §7.5 (VALID-01..13), §7.6, §7.7 (tanggal/bulan/uang), §8.3, §8.6, dan §9.2–§9.4.
- Baca `docs/ARCHITECHTURE.md`: action transaksi di area `(core)`; `userId` dari sesi; service menerima `userId`.
- Month picker dipakai ulang oleh Dashboard (T08). Jangan membuat variasi kedua.
- URL adalah sumber kebenaran bulan. Jangan menyimpan bulan di `localStorage` atau state global.
- `<input type="month">` bukan satu-satunya kontrol: sediakan dua `<select>` (bulan dan tahun) atau fallback setara untuk Safari/iOS.
- Jangan membuat pagination, pencarian, filter, sorting yang dapat diklik, atau grafik.
- Gunakan library `zod` (sudah ada di `dependencies`) untuk skema validasi form transaksi baru di Server Action. Skema wajib memakai helper normalisasi dari T01, copy error §7.5, mengembalikan nilai form saat gagal, dan tidak menambah library validasi lain.

## Cakupan

- Helper URL bulan: mengubah URL halaman aktif dengan `?month=YYYY-MM` dan membuang `status`/`error` saat bulan berubah.
- `MonthPicker`: tombol prev/next, pilihan bulan 1–12 dan tahun 2000–tahun berjalan, label "November 2026", batas 2000-01 sampai bulan berjalan, next disabled di bulan berjalan, prev disabled di 2000-01, indikator pending saat navigasi.
- Halaman `/transactions`:
  - `month` valid dipakai; kosong/tidak valid fallback ke bulan berjalan Asia/Jakarta;
  - `h1` "Transaksi"; subjudul "12 transaksi di bulan ini." atau "Belum ada transaksi di bulan ini.";
  - tombol "Tambah Transaksi" menuju `/transactions/new?month=<aktif>`;
  - banner `status`;
  - tabel ≥768 px: Tanggal, Uraian (badge Pemasukan/Pengeluaran di dalam sel), Kategori, Nominal; mobile: kartu sesuai §7.3.1;
  - urutan `date DESC, created_at DESC`; nominal pemasukan `+`, pengeluaran `-`; tanggal `16 Nov 2026`; uraian panjang dibungkus;
  - empty state: belum ada kategori → CTA `Buat Kategori`; kategori ada tetapi bulan kosong → CTA `Tambah Transaksi`;
  - tanpa pagination; seluruh bulan ditampilkan.
- Aksi baris "Ubah"/"Hapus" **belum** ditambahkan di ticket ini; T09 menambahkan kolom Aksi dan dialog tanpa mengubah service list.
- Halaman `/transactions/new`:
  - field berurutan: Tanggal, Uraian, Kategori, Jenis, Nominal;
  - tanggal default hari ini Asia/Jakarta, `min=2000-01-01`, `max=hari ini`;
  - uraian `maxlength=200`, placeholder "Contoh: Makan siang";
  - kategori `<select>` wajib dengan placeholder "Pilih kategori" yang disabled, hanya kategori user aktif, A–Z;
  - jenis radio dalam `<fieldset>` + `<legend>` "Jenis transaksi", default "Pengeluaran";
  - nominal integer positif, prefix "Rp", `inputMode="numeric"`, helper "Masukkan angka tanpa titik atau koma.", batas 1..2.000.000.000;
  - tombol "Simpan Transaksi" dan "Batal"; Batal kembali ke `/transactions?month=<active>`;
  - pending "Menyimpan…"; error inline; nilai form dipertahankan; double submit dicegah;
  - bila belum ada kategori: callout "Belum ada kategori. Buat kategori terlebih dahulu sebelum mencatat transaksi." + tombol "Buat Kategori"; form disembunyikan.
- Service transaksi:
  - daftar per bulan memakai rentang half-open dan urutan yang ditentukan;
  - buat transaksi setelah memverifikasi kategori milik user yang sama;
  - daftar opsi kategori A–Z milik user.
- Server Action create: `requireUser()`, validasi server dengan skema Zod, simpan, revalidate `/` dan `/transactions`, redirect `/transactions?month=<bulan-dari-tanggal>&status=created`.
- Error kategori asing/tidak ada: "Kategori tidak ditemukan. Muat ulang halaman."; error DB tak terduga: "Terjadi kesalahan. Silakan coba lagi." tanpa detail internal.

## TDD (wajib)

**Seam yang disepakati:** service transaksi dan helper URL bulan terhadap database development, dengan `userId` eksplisit. Server Action, form, tabel/kartu, dan month picker diverifikasi manual.

**Aturan loop:** satu test gagal → implementasi minimal → hijau → refactor. Jangan menulis semua test lebih dulu.

**Urutan red → green:**

1. **URL bulan.** `/transactions` + `2026-10` → `/transactions?month=2026-10`; `/` + `2026-10` → `/?month=2026-10`; parameter `status`/`error` lama dibuang.
2. **Batas rentang.** Transaksi 31 Okt, 1 Nov, 30 Nov, dan 1 Des: hanya 1–30 Nov yang masuk daftar November.
3. **Urutan.** Transaksi tanggal sama diurutkan `created_at DESC`; tanggal berbeda diurutkan terbaru lebih dulu.
4. **Isolasi daftar.** Daftar user A tidak memuat transaksi user B.
5. **Filter kategori.** Daftar opsi hanya kategori user A dan urut A–Z.
6. **Buat pemasukan/pengeluaran.** Amount dan jenis tersimpan benar; `user_id` berasal dari argumen, bukan input.
7. **Kategori asing.** Membuat transaksi dengan kategori user B atau ID tidak ada ditolak dengan copy VAL-08; tidak ada baris tersimpan.
8. **Nama kategori terkini.** Setelah kategori di-rename, daftar transaksi menampilkan nama baru dari relasi.
9. **Bulan kosong.** Bulan tanpa transaksi mengembalikan array kosong.
10. **Bulan dari tanggal.** `2026-11-16` → `2026-11`; `2027-01-01` → `2027-01`; `2026-12-31` → `2026-12`.

**Di luar test otomatis:** Server Action, redirect, form, nilai yang dipertahankan, pending, tabel/kartu, month picker, dan ukuran responsif.

## Manual QA wajib

- QA-06..10, QA-22, QA-26, QA-27; TX-01..25.
- Month picker: prev/next mengubah URL dan data; next disabled di bulan berjalan; prev disabled di `2000-01`; refresh/bookmark mempertahankan bulan; `?month=2026-13` dan `?month=abc` fallback tanpa error.
- Tambah transaksi valid → redirect ke bulan tanggal transaksi, banner "Transaksi berhasil disimpan.", data muncul di urutan benar.
- Batal kembali ke bulan aktif tanpa menyimpan.
- Submit kosong → error field sesuai copy §7.5, nilai tetap.
- Nominal `0`, `-100`, `10.5`, `1e3`, `2.000.000.001` ditolak server; bukan hanya HTML.
- Tanggal `1999-12-31` dan besok ditolak.
- Uraian 200 karakter dan `<script>alert(1)</script>` tampil literal, tidak overflow, tidak menjalankan script.
- Tanpa kategori: callout tampil dan form tidak bisa disubmit.
- 375 px: kartu, bukan tabel terpotong; tidak ada horizontal scroll.
- Double submit hanya membuat satu transaksi.
- Kategori akun lain tidak muncul di `<select>` dan `categoryId` palsu ditolak.

## Acceptance criteria

- [x] `/transactions` menerima `?month=YYYY-MM`, fallback ke bulan berjalan untuk nilai tidak valid.
- [x] Ringkasan jumlah transaksi dan kedua jenis empty state sesuai §7.3.1.
- [x] Daftar hanya berisi transaksi user aktif, urut `date DESC, created_at DESC`, tanpa pagination.
- [x] Tabel ≥768 px dan kartu mobile memuat informasi yang sama; tidak ada overflow.
- [x] Nominal, tanggal, badge jenis, dan teks panjang mengikuti §7.3 dan §7.7.
- [x] Form create memiliki 5 field sesuai urutan dan copy §7.3.2.
- [x] Tanggal default hari ini Jakarta; tanggal masa depan/sebelum 2000 ditolak server.
- [x] Kategori hanya milik user aktif, A–Z, dengan placeholder disabled; kategori asing ditolak server.
- [x] Nominal hanya digit, 1..2 miliar, dan ditolak server bila tidak valid.
- [x] Form mempertahankan nilai setelah error, mencegah double submit, dan menampilkan pending.
- [x] Sukses redirect ke bulan tanggal transaksi dengan `status=created`.
- [x] Tanpa kategori, form diganti callout dengan CTA ke Kategori.
- [x] Validasi form transaksi baru di Server Action memakai skema Zod; tidak ada library validasi tambahan.
- [x] `pnpm test`, `pnpm test:db`, `pnpm lint`, dan `pnpm build` lulus.

## Di luar cakupan

- Ubah/hapus transaksi (T09).
- Pencarian, filter jenis, pagination, sorting yang dapat diklik.
- Akun/dompet, transfer, saldo awal, recurring, multi-currency.
- Grafik atau ringkasan tahunan.
