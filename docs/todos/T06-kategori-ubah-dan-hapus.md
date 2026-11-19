# T06: Kategori — Ubah dan Hapus

**What to build:** Pengguna dapat mengganti nama kategori lewat halaman penuh dan menghapus kategori yang tidak terpakai lewat dialog konfirmasi. Kategori yang masih dipakai transaksi ditolak dengan penjelasan jumlah pemakaian, dan ID kategori milik akun lain diperlakukan sebagai tidak ditemukan.

**Blocked by:** T05 (service, halaman, dan form kategori).

**Status:** done

## Konteks wajib

- Baca `docs/PRD.MD` §7.4.2 (CAT-11..14), §7.4.3 (CAT-15..22), §7.5 (VAL-14..17), §7.6.1, dan §9.4.
- Baca `docs/ARCHITECHTURE.md`: action kategori tetap di area `(core)`; `userId` selalu dari sesi.
- Dialog memakai shadcn/ui Dialog. Jangan membuat dialog dari nol.
- Hapus kategori adalah hard delete. Tidak ada cascade ke transaksi dan tidak ada soft delete.
- Nama kategori tidak disalin ke transaksi; rename harus langsung terlihat lewat relasi ID.
- ID tidak valid, tidak ditemukan, atau milik user lain → `notFound()`, bukan 403.
- Gunakan library `zod` (sudah ada di `dependencies`) untuk skema validasi ID dan nama kategori pada Server Action ubah/hapus. Skema wajib memakai copy §7.5, mengembalikan nilai input saat gagal, dan tidak menambah library validasi lain.

## Cakupan

- Service kategori:
  - ambil kategori berdasarkan ID **dan** `userId`; kembalikan null untuk ID asing/tidak ada;
  - ubah nama dengan normalisasi dan cek duplikat yang mengecualikan ID kategori itu sendiri;
  - hitung pemakaian kategori;
  - hapus hanya jika pemakaian nol.
- Halaman `/categories/[id]/edit`: field nama, `h1` "Ubah Kategori", tombol "Simpan Perubahan" dan "Batal"; Batal kembali ke `/categories`.
- Server Action ubah: validasi ID dan nama melalui skema Zod, `requireUser()`, revalidate Kategori/Dashboard/Transaksi, redirect `/categories?status=updated`.
- Server Action hapus: ID dari hidden input, validasi integer positif melalui skema Zod, `requireUser()`, cek kepemilikan dan pemakaian; jika masih dipakai redirect `/categories?error=category-in-use`; jika sukses redirect `/categories?status=deleted`; map FK `23503` ke error yang sama.
- Tambahkan aksi "Ubah" (tautan) dan "Hapus" (tombol) pada setiap baris/kartu kategori.
- Dialog hapus punya dua keadaan:
  - tidak dipakai: judul "Hapus kategori?", isi menyebut nama kategori, tombol "Batal" dan "Hapus";
  - dipakai: judul "Kategori tidak dapat dihapus", isi menyebut jumlah transaksi, tombol "Mengerti".
- Dialog: `aria-labelledby`, focus trap, fokus awal pada "Batal", Escape menutup, fokus kembali ke tombol pemicu. Tombol hapus pending "Menghapus…" dan disabled.
- Banner `status=updated|deleted` dan `error=category-in-use` dari T04.

## TDD (wajib)

**Seam yang disepakati:** service kategori terhadap database development (baca per ID, update, hitung pemakaian, hapus) dengan `userId` eksplisit. Server Action, dialog, dan navigasi diverifikasi manual.

**Aturan loop:** satu test gagal → implementasi minimal → hijau → refactor. Jangan menulis semua test lebih dulu.

**Urutan red → green:**

1. **Baca per ID.** Kategori milik user A ditemukan; kategori milik user B dan ID yang tidak ada mengembalikan null.
2. **Ubah nama.** `"  Makan   &   Minum "` menjadi `"Makan & Minum"`; baris tersimpan.
3. **Duplikat saat ubah.** Mengganti kategori A menjadi nama kategori lain milik user A yang sama (beda kapitalisasi) ditolak.
4. **Rename ke diri sendiri.** Mengubah `"Makan"` menjadi `"MAKAN"` diperbolehkan dan tidak dianggap duplikat.
5. **Update lintas user.** User A tidak dapat mengubah kategori user B; hasil null.
6. **Hitung pemakaian.** Kategori dengan 3 transaksi (bulan dan jenis berbeda) menghasilkan 3; kategori tanpa transaksi menghasilkan 0; transaksi user lain tidak dihitung.
7. **Hapus tidak terpakai.** Kategori dengan pemakaian 0 terhapus dan tidak ada lagi di daftar.
8. **Hapus terpakai.** Kategori dengan pemakaian > 0 ditolak service dengan jumlah pemakaian; transaksi tetap utuh.
9. **Hapus lintas user.** User A tidak dapat menghapus kategori user B; hasil null.
10. **Rename tercermin.** Setelah rename, query transaksi yang bergabung dengan kategori menampilkan nama baru tanpa menyalin nama ke tabel transaksi.

**Di luar test otomatis:** Server Action, redirect, dialog, fokus/Escape, banner, dan pending state.

## Manual QA wajib

- QA-03, QA-04, QA-05.
- CAT-11..22.
- `/categories/abc/edit` dan ID kategori akun lain → 404 dengan tautan kembali, tanpa stack trace.
- Batal tidak menyimpan perubahan.
- Dialog tidak langsung menghapus; Batal menutup tanpa perubahan; Escape mengembalikan fokus.
- Kategori terpakai menampilkan jumlah transaksi yang benar dan hanya tombol "Mengerti".
- Panggil action hapus langsung untuk kategori terpakai → `?error=category-in-use`, bukan 500.
- Rename langsung terlihat di daftar transaksi dan rekap dashboard setelah data transaksi tersedia.
- Pending "Menghapus…" mencegah klik ganda.
- Mobile 375 px: dialog muat, aksi Ubah/Hapus tetap tersedia.

## Acceptance criteria

- [x] Halaman ubah kategori hanya berisi field nama, judul, simpan, dan batal.
- [x] `id` tidak valid/asing → 404; tidak ada crash atau kebocoran keberadaan data.
- [x] Duplikat saat ubah mengecualikan kategori itu sendiri; rename beda kapitalisasi diperbolehkan.
- [x] Rename langsung tercermin di semua tampilan yang memakai relasi kategori.
- [x] Hapus kategori kosong berhasil dan redirect `?status=deleted`.
- [x] Hapus kategori terpakai ditolak dengan jumlah transaksi dan redirect `?error=category-in-use`; tidak ada transaksi yang ikut terhapus.
- [x] Server Action tetap memeriksa pemakaian/FK meski dipanggil langsung.
- [x] Dialog memenuhi A11Y-07 dan copy §7.4.3.
- [x] Semua query kategori memakai `userId` dari sesi.
- [x] Validasi form kategori ubah/hapus di Server Action memakai skema Zod; tidak ada library validasi tambahan.
- [x] `pnpm test`, `pnpm test:db`, `pnpm lint`, dan `pnpm build` lulus.

## Di luar cakupan

- Halaman detail kategori.
- Soft delete, restore, bulk delete, atau cascade penghapusan transaksi.
- Mengubah tipe/warna/ikon kategori.
