# T09: Transaksi — Ubah dan Hapus

**What to build:** Pengguna dapat memperbaiki transaksi lewat form yang sama dengan data terisi, lalu kembali ke bulan yang benar dengan banner sukses. Pengguna juga dapat menghapus transaksi lewat dialog konfirmasi; data hilang permanen dan dashboard ikut berubah. ID transaksi milik akun lain diperlakukan sebagai tidak ditemukan.

**Blocked by:** T07 (service transaksi, daftar, form, dan month picker).

**Status:** ready-for-agent

## Konteks wajib

- Baca `docs/PRD.MD` §7.3.3 (TX-26..30), §7.3.4 (TX-31..36), §7.5, §7.6.2, §7.9 (A11Y-07), §9.2–§9.4.
- Baca `docs/ARCHITECHTURE.md`: action transaksi di area `(core)`; `userId` dari sesi.
- Gunakan komponen form yang sama dengan mode create/edit. Jangan menduplikasi logika form.
- Dialog memakai shadcn/ui Dialog. Jangan membuat dialog dari nol.
- Hard delete. Tidak ada soft delete, restore, audit log, atau undo.
- `id` tidak valid/tidak ditemukan/milik user lain → `notFound()` untuk halaman edit; delete tidak boleh membocorkan keberadaan data.
- Setelah mutasi, revalidate Dashboard dan daftar Transaksi, lalu redirect dengan status yang benar.
- Gunakan library `zod` (sudah ada di `dependencies`) untuk skema validasi form transaksi ubah dan ID hapus. Jangan menduplikasi aturan validasi T07; pesan memakai copy §7.5, nilai form dikembalikan saat gagal, dan tidak menambah library validasi lain.

## Cakupan

- Service transaksi:
  - ambil transaksi berdasarkan ID **dan** `userId`;
  - ubah transaksi setelah memverifikasi kategori milik user yang sama;
  - hapus transaksi berdasarkan ID **dan** `userId`;
  - kembalikan null untuk ID asing/tidak ada.
- Halaman `/transactions/[id]/edit`:
  - `h1` "Ubah Transaksi", tombol "Simpan Perubahan", data terisi otomatis;
  - `id` bukan integer positif, tidak ada, atau milik user lain → 404;
  - bila kategori transaksi sudah tidak ada (kondisi tidak normal), tampilkan error form "Kategori tidak ditemukan. Muat ulang halaman." dan jangan crash;
  - Batal kembali ke daftar tanpa menyimpan.
- Server Action update:
  - `id` di-bind di server lalu divalidasi ulang;
  - `requireUser()`, validasi field dari T01 melalui skema Zod, verifikasi kepemilikan transaksi **dan** kategori;
  - revalidate `/` dan `/transactions`;
  - redirect `/transactions?month=<bulan-dari-tanggal-baru>&status=updated`.
- Daftar transaksi: tambahkan kolom Aksi (tabel) dan tombol aksi (kartu mobile) berisi "Ubah" dan "Hapus".
- Dialog hapus transaksi:
  - judul "Hapus transaksi?", isi `Transaksi "<uraian>" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`, tombol "Batal" dan "Hapus";
  - Batal menutup tanpa perubahan; Escape menutup; fokus awal "Batal"; fokus kembali ke pemicu;
  - tombol hapus pending "Menghapus…" dan disabled.
- Server Action delete:
  - ID dari hidden input, divalidasi integer positif melalui skema Zod; `requireUser()`;
  - hapus hanya transaksi milik user;
  - jika sudah tidak ada (termasuk ID milik user lain), redirect tetap sukses memakai `month` tersembunyi yang validasi (idempotent), tanpa stack trace;
  - revalidate `/` dan `/transactions`;
  - redirect `/transactions?month=<bulan-transaksi>&status=deleted`.

## TDD (wajib)

**Seam yang disepakati:** service transaksi (baca per ID, update, delete) dan helper validasi ID terhadap database development. Server Action, dialog, form, dan redirect diverifikasi manual.

**Aturan loop:** satu test gagal → implementasi minimal → hijau → refactor. Jangan menulis semua test lebih dulu.

**Urutan red → green:**

1. **Validasi ID.** `"12"` valid; `"abc"`, `"0"`, `"-1"`, `"1.5"`, dan string kosong ditolak sebagai ID tidak valid.
2. **Baca per ID.** Transaksi milik user A ditemukan; transaksi user B dan ID tidak ada mengembalikan null.
3. **Update field.** Tanggal, uraian (trim), kategori, jenis, dan nominal berubah sesuai input.
4. **Update lintas user.** User A tidak dapat mengubah transaksi user B; hasil null.
5. **Kategori asing saat update.** Mengirim `categoryId` milik user B atau ID tidak ada ditolak; transaksi lama tidak berubah.
6. **Bulan redirect.** Tanggal `2026-11-16` → `2026-11`; `2027-01-01` → `2027-01`; `2026-12-31` → `2026-12`.
7. **Delete milik sendiri.** Transaksi terhapus dan data bulan asalnya dikembalikan untuk redirect.
8. **Delete lintas user.** User A tidak dapat menghapus transaksi user B; hasil null dan baris user B tetap ada.
9. **Delete idempoten.** Menghapus ID yang sudah tidak ada mengembalikan null; action boleh redirect sukses memakai bulan tersembunyi yang valid, tanpa error mentah.

**Di luar test otomatis:** Server Action, dialog, fokus/Escape, pending, redirect, form terisi, banner, dan tampilan mobile.

## Manual QA wajib

- QA-11, QA-12, QA-23.
- TX-26..36.
- Edit membuka data yang benar; simpan mengubah data dan dashboard; redirect ke bulan tanggal baru dengan banner "Perubahan transaksi berhasil disimpan."
- Ubah tanggal dari November ke Oktober: transaksi hilang dari November dan muncul di Oktober.
- Hapus: dialog muncul dulu; Batal/Escape tidak mengubah data; konfirmasi menghapus permanen dan redirect bulan asal dengan banner.
- Double click hapus/simpan tidak menghasilkan error atau duplikasi.
- `/transactions/999999/edit`, `/transactions/abc/edit`, dan ID akun lain → 404 tanpa stack trace.
- Kategori yang hilang: tampilkan error form, bukan crash.
- 375 px: tombol Ubah/Hapus tersedia, target ≥44 px, dialog muat.
- Setelah logout, URL edit langsung tidak merender data.

## Acceptance criteria

- [ ] Form edit memakai komponen yang sama dengan create dan semua field terisi.
- [ ] `id` tidak valid/asing → 404; tidak ada crash.
- [ ] Kategori asing/tidak ada ditolak server; data lama tidak berubah.
- [ ] Update sukses redirect ke bulan tanggal baru dengan `status=updated`.
- [ ] Daftar menampilkan aksi Ubah dan Hapus di tabel maupun kartu mobile.
- [ ] Hapus hanya terjadi setelah konfirmasi dialog; copy §7.3.4 sesuai.
- [ ] Dialog memenuhi fokus awal, focus trap, Escape, dan pengembalian fokus.
- [ ] Delete idempoten/tidak membocorkan keberadaan transaksi; tidak ada stack trace.
- [ ] Delete sukses redirect ke bulan transaksi dengan `status=deleted`.
- [ ] Dashboard dan daftar langsung mencerminkan perubahan setelah edit/hapus.
- [ ] Semua query memakai `userId` dari sesi.
- [ ] Validasi form transaksi ubah/hapus di Server Action memakai skema Zod; tidak ada library validasi tambahan.
- [ ] `pnpm test`, `pnpm test:db`, `pnpm lint`, dan `pnpm build` lulus.

## Di luar cakupan

- Soft delete, restore, undo, audit log, bulk delete.
- Pagination, pencarian, filter.
- Mengubah transaksi milik akun lain atau berbagi data antar akun.
