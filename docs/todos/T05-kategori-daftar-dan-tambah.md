# T05: Kategori — Daftar dan Tambah

**What to build:** Pengguna dapat menambah kategori dari halaman Kategori dan langsung melihatnya di daftar A–Z beserta jumlah transaksi. Nama dinormalisasi, duplikat tanpa membedakan kapitalisasi ditolak dalam akun yang sama, dan kategori akun lain tidak pernah terlihat.

**Blocked by:** T03 (tabel dan test database), T04 (shell, banner, empty state, primitif UI).

**Status:** ready-for-agent

## Konteks wajib

- Baca `docs/PRD.MD` §7.4.1 (CAT-01..10), §7.4 aturan tambahan, §7.5 (VAL-14..17), §7.6.1 (banner), §8.2, dan §9.2 (pola baca/tulis).
- Baca `docs/ARCHITECHTURE.md`: action kategori berada di area `(core)`; semua query memakai `userId` dari `requireUser()`.
- Nama kategori hanya nama. Jangan menambah tipe, warna, ikon, budget, atau deskripsi.
- Jangan membuat kategori default otomatis.
- Gunakan service dari ticket ini untuk halaman; Server Action tetap tipis dan tidak memuat logika bisnis berat.

## Cakupan

- Service kategori:
  - daftar kategori milik user, diurutkan A–Z case-insensitive, dengan jumlah transaksi semua bulan dan semua jenis;
  - buat kategori dengan normalisasi trim + collapse whitespace;
  - cek duplikat case-insensitive dalam lingkup user, termasuk penanganan unique violation `23505`.
- Server Action tambah kategori: `requireUser()`, validasi server dari T01, simpan, `revalidatePath` untuk Kategori dan Dashboard, redirect `/categories?status=created`.
- Saat error: kembalikan `fieldErrors` dan nilai input agar tidak hilang; jangan redirect.
- Halaman Kategori:
  - `h1` "Kategori" dan subjudul "Kelola kategori untuk mengelompokkan transaksi.";
  - form inline di atas daftar: label "Nama Kategori", placeholder "Contoh: Transportasi", tombol "Tambah Kategori", pending "Menyimpan…";
  - banner sukses dari T04;
  - daftar tabel di tablet/desktop (Nama, Jumlah transaksi) dan kartu di mobile;
  - empty state "Belum ada kategori. Tambahkan kategori pertama Anda." dengan form tetap terlihat.
- Aksi Ubah/Hapus per baris **belum** di ticket ini; ditambahkan di T06 tanpa mengubah struktur data service.

## TDD (wajib)

**Seam yang disepakati:** service kategori terhadap database development, dengan `userId` eksplisit. Server Action, form, dan tampilan diverifikasi manual.

**Aturan loop:** satu test gagal → implementasi minimal → hijau → refactor. Jangan menulis semua test lebih dulu.

**Urutan red → green:**

1. **Buat dan baca.** Membuat `"Transportasi"` untuk user A lalu membaca daftar A mengembalikan baris tersebut dengan nama ternormalisasi.
2. **Normalisasi.** `"  Makan   siang  "` tersimpan sebagai `"Makan siang"`.
3. **Duplikat per user.** `"Makan"` lalu `"makan"` untuk user A ditolak sebagai konflik; tidak ada baris kedua.
4. **Nama sama lintas user.** User A dan user B sama-sama boleh memiliki `"Makan"`.
5. **Isolasi daftar.** Daftar user A tidak pernah memuat kategori user B.
6. **Urutan.** `"makan"`, `"Belanja"`, `"Gaji"` tampil sebagai `Belanja`, `Gaji`, `makan` (case-insensitive A–Z).
7. **Jumlah transaksi.** Dua transaksi user A pada kategori yang sama, berbeda bulan dan jenis, menghasilkan hitungan 2; kategori tanpa transaksi menghasilkan 0.
8. **Hitungan tidak lintas user.** Transaksi user B tidak menambah hitungan kategori user A, bahkan bila baris transaksi tersebut secara langsung mereferensikan kategori A (kondisi tidak normal, tetapi harus aman).
9. **Daftar kosong.** User tanpa kategori mengembalikan array kosong, bukan error.

**Di luar test otomatis:** Server Action, redirect, banner, pending state, form inline, tabel/kartu, dan perilaku responsive.

## Manual QA wajib

- QA-01 dan QA-02.
- CAT-01..10 dan CAT-21.
- Submit `"Makan"` lalu `" makan "` → error inline di bawah field, input tetap berisi, tidak ada baris baru.
- Submit valid → banner "Kategori berhasil ditambahkan.", field kosong, baris muncul tanpa reload penuh.
- Dua akun: kategori akun B tidak terlihat dan tidak bisa dipakai di akun A.
- Empty state tampil dengan form tetap tersedia.
- Mobile 375 px menampilkan kartu; tablet/desktop menampilkan tabel tanpa horizontal scroll.
- Tombol disabled dan teks "Menyimpan…" saat pending; double submit tidak membuat dua baris.

## Acceptance criteria

- [ ] Form tambah kategori tampil inline dan dapat dipakai dengan keyboard.
- [ ] Nama dinormalisasi trim + collapse whitespace dan dibatasi 1–50 karakter.
- [ ] Duplikat case-insensitive dalam satu user ditolak dengan `Nama kategori sudah digunakan.`
- [ ] Dua user berbeda boleh memakai nama kategori yang sama.
- [ ] Daftar hanya berisi kategori user aktif dan diurutkan A–Z case-insensitive.
- [ ] Jumlah transaksi benar untuk semua bulan dan semua jenis, tanpa menghitung transaksi user lain.
- [ ] Banner sukses, empty state, dan input yang dipertahankan saat error sesuai §7.4 dan §7.6.
- [ ] Tidak ada kategori default otomatis dan tidak ada kolom di luar nama.
- [ ] `pnpm test`, `pnpm test:db`, `pnpm lint`, dan `pnpm build` lulus.

## Di luar cakupan

- Ubah/hapus kategori (T06).
- Membuat kategori dari form transaksi.
- Tipe kategori, warna, ikon, budget, deskripsi, pencarian, sorting yang dapat diklik, atau pagination.
