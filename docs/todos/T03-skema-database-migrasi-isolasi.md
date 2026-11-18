# T03: Skema Database, Migrasi, dan Isolasi Data

**What to build:** Database siap menyimpan kategori dan transaksi milik banyak akun: tabel, enum, index, constraint, foreign key ke `auth.users`, dan RLS. Test integrasi membuktikan constraint serta prasyarat isolasi bekerja sebelum fitur CRUD dibangun di atasnya.

**Blocked by:** T02 (fixture test memakai akun Supabase Auth yang dibuat lewat signup/login).

**Status:** ready-for-agent

## Konteks wajib

- Baca `docs/PRD.MD` §8.1–§8.8, §9.7 (SEC-06, SEC-11), dan §12.1.1.
- Baca `docs/ARCHITECHTURE.md`: semua service menerima `userId`; Drizzle hanya di server.
- `auth.users` dimiliki Supabase. Jangan membuat tabel tiruan, mengelola schema `auth`, atau menambahkan `.references()` Drizzle ke schema tersebut.
- Jangan menjalankan migrasi ke database remote/produksi tanpa persetujuan eksplisit pemilik data. Ticket ini hanya untuk database development.
- Jangan menjalankan `DROP TABLE public.users` tanpa persetujuan, meskipun tabel itu sisa scaffold.
- Drizzle mengembalikan kolom `date` sebagai string `YYYY-MM-DD`; jangan mengubahnya menjadi `Date` di service.
- RLS adalah pertahanan berlapis. Koneksi Drizzle melewati RLS, jadi aplikasi tetap wajib memfilter `user_id`.

## Cakupan

- Ganti schema demo dengan enum `transaction_type`, tabel `categories`, dan tabel `transactions` sesuai §8.4.
- Unique index `(user_id, lower(name))`, index per user, index kategori per user, dan check amount 1..2.000.000.000.
- Script `db:generate`, `db:migrate`, dan `db:studio`.
- Generate migrasi, review SQL, lalu tambahkan migrasi kustom untuk FK `user_id` ke `auth.users` dengan `ON DELETE CASCADE`.
- Tambahkan migrasi kustom RLS: aktifkan RLS dan policy owner untuk kedua tabel.
- Hapus definisi `usersTable` dari schema **sebelum** generate pertama. Periksa bahwa tidak ada snapshot migrasi lama yang akan menghasilkan `DROP TABLE users`. Jika ada, jangan drop tanpa persetujuan.
- Siapkan harness test integrasi dengan dua akun uji:
  - Kredensial dibaca dari env test (placeholder di `.env.example`), tidak di-hard-code dan tidak di-commit.
  - `beforeAll`: coba login; bila akun belum ada, signup (confirm email harus nonaktif). Jangan menghapus akun auth.
  - Bersihkan hanya kategori/transaksi milik akun uji sebelum dan sesudah test.
  - Jangan pernah mencetak password, token, atau cookie.
- `pnpm test:db` hanya berjalan bila `ALLOW_DB_TESTS=1`, menolak `NODE_ENV=production`, dan memakai database development.

## TDD (wajib)

**Seam yang disepakati:** kontrak database (tabel, constraint, index, FK, RLS) diuji lewat Drizzle terhadap database development. Tidak ada test service CRUD, UI, atau RLS lewat PostgREST di ticket ini.

**Aturan loop:** satu test gagal → migrasi/perubahan minimal → hijau → review SQL. Jangan menulis semua test sebelum migrasi pertama.

**Urutan red → green:**

1. **Kategori lintas user.** User A dan User B boleh sama-sama memiliki kategori `"Makan"`.
2. **Duplikat per user.** Untuk user yang sama, `"Makan"` lalu `"makan"` (atau `" MAKAN "`) ditolak dengan unique violation `23505`.
3. **Batas nominal.** Amount `0` dan `2.000.000.001` ditolak check constraint `23514`; `1` dan `2.000.000.000` diterima.
4. **Kategori terpakai.** Menghapus kategori yang masih direferensikan transaksi ditolak foreign key `23503`; setelah transaksi dihapus, kategori bisa dihapus.
5. **Kepemilikan wajib.** Insert kategori/transaksi tanpa `user_id` ditolak `NOT NULL`.
6. **Relasi auth.** Foreign key `categories.user_id` dan `transactions.user_id` menunjuk `auth.users(id)` dengan aturan cascade; tidak ada tabel `auth.users` tiruan.
7. **RLS.** Kedua tabel memiliki RLS aktif dan tepat satu policy owner; policy memakai `auth.uid() = user_id` untuk `USING` dan `WITH CHECK`.
8. **Index.** Index unik nama per user, index filter user, dan index `(user_id, date, created_at)` ada sesuai §8.5.

**Di luar test otomatis:** menjalankan migrasi dari database kosong (manual), perilaku RLS lewat PostgREST, dan cascade penghapusan akun nyata.

## Manual QA wajib

- Jalankan `pnpm db:generate`; review SQL: enum, unique index case-insensitive, check amount, FK kategori `NO ACTION`, dan tidak ada tabel auth tiruan.
- Jalankan `pnpm db:migrate` pada database development kosong setelah persetujuan.
- Verifikasi `pnpm db:generate` berikutnya tidak menghasilkan drift.
- Buka schema di database: RLS aktif, policy ada, FK ke `auth.users` ada.
- Pastikan `.env` tidak ter-commit dan `drizzle/` ikut ter-commit.

## Acceptance criteria

- [ ] Schema sesuai §8.4; `usersTable` demo tidak lagi dipakai.
- [ ] Migrasi dari nol menghasilkan tabel, enum, index, check, FK auth, dan RLS.
- [ ] FK `user_id` memakai `ON DELETE CASCADE`; FK kategori memakai `NO ACTION`.
- [ ] Dua user boleh punya nama kategori sama; duplikat case-insensitive dalam satu user ditolak.
- [ ] Amount di luar 1..2 miliar ditolak database, bukan hanya UI.
- [ ] Kategori terpakai tidak bisa dihapus di level database.
- [ ] `pnpm test:db` lulus dan tidak pernah berjalan di produksi.
- [ ] Tidak ada akun auth yang dihapus oleh test; hanya data kategori/transaksi yang dibersihkan.
- [ ] Tidak ada rahasia, password, atau token di test, log, atau repository.
- [ ] `pnpm test`, `pnpm lint`, dan `pnpm build` lulus.

## Di luar cakupan

- Service CRUD kategori/transaksi dan Server Action (ticket fitur).
- Seed data demo atau kategori default.
- Perubahan pada `public.users` atau schema `auth`.
- Migrasi data lama; tabel dimulai kosong.
