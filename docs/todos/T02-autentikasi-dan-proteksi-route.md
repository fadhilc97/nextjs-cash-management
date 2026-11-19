# T02: Autentikasi Email/Password dan Proteksi Route

**What to build:** Calon pengguna dapat membuat akun dengan email dan password, langsung masuk ke halaman terlindungi, lalu keluar dan masuk kembali. Semua halaman inti menolak akses tanpa sesi, halaman auth menolak pengguna yang sudah login, dan setiap error tampil dalam Bahasa Indonesia tanpa membocorkan password atau pesan mentah Supabase.

**Blocked by:** T01 (helper validasi dan test runner).

**Status:** ready-for-agent

## Konteks wajib

- Baca `docs/PRD.MD` §7.10 (AUTH-01..30), §7.10.5 (pemetaan error), §7.10.6 (copy), §7.6.2 (pending), §9.4 (kontrak action), §9.5 (Next.js 16), dan §6.2 (baris halaman auth).
- Baca `docs/ARCHITECHTURE.md`: autentikasi berada di route group `(auth)`; halaman inti di `(core)`; action auth dikolokasikan di `(auth)`.
- Ikuti `docs/DESIGN.md` untuk token dan tampilan kartu auth.
- Supabase Auth provider Email harus aktif dengan minimum password 8. Dukung dua konfigurasi: confirm email nonaktif (signup langsung mendapat sesi dan redirect `/`) dan confirm email aktif (user dibuat, sesi kosong, pengguna diminta memeriksa email). Konfigurasi error hanya ketika Supabase tidak mengembalikan user maupun sesi.
- Jangan membuat tabel password atau auth kustom. Jangan memakai Supabase client untuk data keuangan.
- `params`/`searchParams` adalah Promise; gunakan tipe `PageProps<...>`. Jangan menambah `"use cache"` pada halaman yang membaca sesi.
- Gunakan library `zod` (sudah ada di `dependencies`) untuk skema validasi form login/signup di Server Action. Skema wajib memakai copy §7.5, menormalisasi email, tidak men-trim password, dan hanya mengembalikan email pada `values`; jangan menambah library validasi lain.

## Cakupan

- Root layout: `lang="id"`, metadata "Cash Management", font Geist Sans, background, dan token dasar yang dibutuhkan halaman auth dari `docs/DESIGN.md`. Kontrak token penuh dan penanganan tema diselesaikan di T04. Belum memasang AppShell.
- `lib/auth/index.ts`: `getUser()` dan `requireUser()` memakai `supabase.auth.getUser()` (bukan `getSession()`), di-cache per request, dan redirect `/login` bila tidak ada user/email.
- Proxy: refresh sesi lewat helper yang ada, redirect optimistis, dan **salin cookie hasil refresh ke response redirect**.
- Halaman `/login` dan `/signup` dengan layout auth tanpa sidebar/nav aplikasi. Theme toggle ditambahkan di T04.
- Form login/signup memakai `useActionState`, `noValidate`, label eksplisit, `autocomplete`, pending "Memproses…", error inline, dan error form-level `role="alert"`.
- Server Action `signUp`, `signIn`, `signOut`: validasi server dari T01 melalui skema Zod, normalisasi email, password tidak di-trim, redirect hard-coded (`/` atau `/login`), tanpa parameter `next`.
- Signup yang mengembalikan user tanpa sesi **tidak boleh** redirect; tampilkan pesan sukses `Akun berhasil dibuat. Cek email Anda untuk mengonfirmasi, lalu masuk.` Signup tanpa user dan sesi menampilkan error konfigurasi generik dan log peringatan tanpa data sensitif.
- `data.user.identities` kosong diperlakukan sebagai email sudah terdaftar.
- `signOut` merevalidasi layout sebelum redirect agar cache sesi sebelumnya tidak dipakai.
- Halaman inti sementara di `/` yang memanggil `requireUser()`, menampilkan email, dan menyediakan tombol Keluar. Halaman ini diganti AppShell di T04.
- Hapus pembacaan data demo `users` dari halaman `/`.

## TDD (wajib)

**Seam yang disepakati:** logika redirect, pemetaan error auth, hasil signup, dan pembentukan state error auth. Server Action yang menyentuh cookie/Next runtime dan tampilan form diverifikasi lewat manual QA; jangan membuat test komponen atau test yang memanggil Next runtime.

**Aturan loop:** satu test gagal → implementasi minimal → hijau → refactor. Jangan menulis semua test lebih dulu.

**Urutan red → green:**

1. **Redirect auth.** User tanpa sesi di `/transactions`, `/categories`, atau `/` → `/login`. User dengan sesi di `/login` atau `/signup` → `/`. User dengan sesi di halaman inti → tidak ada redirect. Halaman `/login` dan `/signup` tanpa sesi → tidak ada redirect.
2. **Pemetaan error.** `invalid_credentials` → `Email atau password salah.`; `user_already_exists`/`email_exists` → `Email sudah terdaftar. Silakan masuk.`; `weak_password` → `Password terlalu lemah. Gunakan password yang lebih kuat.`; `email_not_confirmed` → `Email belum dikonfirmasi. Silakan hubungi administrator.`; `signup_disabled` → `Pendaftaran akun sedang tidak tersedia. Silakan coba lagi nanti.`; rate limit/429 → `Terlalu banyak percobaan. Coba lagi beberapa saat lagi.`; error tak dikenal → `Terjadi kesalahan. Silakan coba lagi.` Tidak pernah mengembalikan pesan mentah.
3. **Hasil signup.** Sesi ada → sukses. User dibuat tetapi `identities` kosong → email sudah terdaftar. User dibuat tanpa sesi → perlu konfirmasi email (`confirmation_required`). User dan sesi sama-sama kosong → error konfigurasi `Pendaftaran belum dapat diselesaikan. Silakan coba lagi.`
4. **State error auth.** Email dikembalikan dalam bentuk sudah dinormalisasi; password dan konfirmasi **tidak pernah** ada di `values`; error konfirmasi berbeda hanya berasal dari validasi server; state dapat diserialisasi tanpa memuat password.
5. **Kontrak redirect.** Tidak ada fungsi yang menerima URL tujuan dari input pengguna; redirect hanya `/` dan `/login`.

**Di luar test otomatis:** wiring proxy, cookie refresh, form, halaman, dan Supabase API nyata. Verifikasi dengan manual QA di bawah.

## Manual QA wajib

- QA-AUTH-01, 02, 03, 04, 05, 06, 07, 08, 09, 11, 12, 13.
- Signup dengan confirm email nonaktif → sesi aktif → `/`. Signup dengan confirm email aktif → pesan cek email, lalu login setelah konfirmasi.
- Signup dengan `" Rina@Example.com "` → email tampil lowercase tanpa spasi.
- Login salah dan email tidak terdaftar menghasilkan copy identik.
- Refresh dashboard tetap login; hapus cookie lalu refresh → `/login` tanpa error 500.
- Logout → `/login`; tombol Back tidak merender data keuangan tanpa sesi.
- `/login` dan `/signup` tidak menampilkan nav aplikasi.
- Periksa URL, console, log server, dan response action: tidak ada password/token/cookie yang tercetak.
- Coba `?next=https://example.com` di `/login`; harus diabaikan.

## Acceptance criteria

- [ ] Signup valid membuat akun. Bila confirm email nonaktif: sesi aktif dan redirect `/`. Bila confirm email aktif: tampil pesan cek email tanpa error.
- [ ] Email duplikat ditolak dengan copy §7.10.5; email dipertahankan, password dikosongkan, tidak ada akun ganda.
- [ ] Signup tanpa user dan sesi tetap di `/signup`, menampilkan error konfigurasi, dan tidak membuat sesi setengah jadi.
- [ ] Login valid redirect `/`; login gagal memakai pesan generik.
- [ ] Logout menghapus sesi dan redirect `/login`; tombol menampilkan "Keluar…" saat pending.
- [ ] Semua halaman selain `/login`/`/signup` memanggil `requireUser()` sendiri, bukan hanya mengandalkan proxy/layout.
- [ ] Proxy mempertahankan cookie refresh saat redirect.
- [ ] Tidak ada parameter `next`, open redirect, atau redirect dari input pengguna.
- [ ] Password/token tidak muncul di URL, state client, log, atau pesan error.
- [ ] Tidak ada nav aplikasi di halaman auth; `lang="id"`, metadata, dan token tema terpasang.
- [ ] Validasi form auth di Server Action memakai skema Zod; tidak ada library validasi tambahan.
- [ ] `pnpm test`, `pnpm lint`, dan `pnpm build` lulus.

## Di luar cakupan

- Reset/lupa password, verifikasi email, magic link, OAuth, MFA, ganti email/password.
- App shell, navigasi, theme toggle, dan halaman fitur (T04 dan seterusnya).
- Tabel `categories`/`transactions` dan migrasi (T03).
