# T11: Audit Responsif dan Tema

**What to build:** Seluruh halaman nyaman dipakai di 375, 768, 1024, dan 1440 px, tanpa horizontal scroll, dengan navigasi, tabel/kartu, dialog, form, dan tema terang/gelap yang konsisten. Ticket ini adalah audit dan perbaikan, bukan fitur baru.

**Blocked by:** T06, T08, T09 (semua halaman, form, dan dialog sudah ada).

**Status:** ready-for-agent

## Konteks wajib

- Baca `docs/PRD.MD` §7.8 (matrix responsif), §12.2 (responsive QA matrix), §10 (layout, tipografi, token), dan §10.5 (motion).
- Baca `docs/DESIGN.md` untuk perilaku light/dark dan komponen.
- Jangan menambah fitur, halaman, animasi baru, atau dependensi. Fokus pada perbaikan layout dan tema.
- Tema light-first: default terang; dark hanya lewat toggle manual; tidak ada pergantian otomatis dari `prefers-color-scheme`.

## Cakupan audit

- **Viewport:** 375×812, 768×1024, 1024×768, 1440×900; portrait dan landscape minimal di 375 dan 768.
- **Halaman:** `/login`, `/signup`, `/`, `/transactions`, `/transactions/new`, `/transactions/[id]/edit`, `/categories`, `/categories/[id]/edit`.
- **Overflow:** `document.documentElement.scrollWidth <= window.innerWidth` di setiap halaman dan state (termasuk error, empty, dialog terbuka, uraian 200 karakter).
- **Navigasi:** bottom nav mobile + safe-area; header tablet; sidebar desktop; konten tidak tertutup; email/Keluar/toggle tidak bertumpuk; item aktif tetap terlihat.
- **Tabel dan kartu:** tabel muat di 768 px tanpa mengecilkan font di bawah 14 px; di bawah 768 px berubah menjadi kartu tanpa informasi hilang; dialog maksimal selebar yang ditentukan dan tidak keluar viewport.
- **Form:** satu kolom; input minimal 16 px di mobile; tombol aksi utama full-width di mobile dan inline di kanan header pada layar lebih besar; error tidak merusak layout.
- **Auth:** kartu penuh minus 32 px di mobile, max-width 420 px dan center di desktop; tanpa sidebar/nav aplikasi; tombol submit full-width.
- **Sentuh dan motion:** target ≥44×44 CSS px; tidak ada aksi yang hanya muncul saat hover; transisi ≤150 ms dan menghormati `prefers-reduced-motion`.
- **Tema:** light dan dark konsisten di semua halaman; tidak ada flash saat refresh; tidak ada warna yang hanya berfungsi di salah satu tema; kontras tetap terjaga.

## TDD (wajib)

**Seam yang disepakati:** tidak ada test layout otomatis (tanpa browser testing). Bila perbaikan menyentuh logika murni (misalnya perhitungan breakpoint, helper kelas, atau format), tulis test regresi lebih dulu. Perbaikan CSS dan tema diverifikasi manual di setiap viewport.

**Aturan loop:** reproduksi di viewport yang gagal → perbaiki minimal → ulangi seluruh matrix untuk memastikan tidak ada regresi. Jangan melakukan redesign di luar kebutuhan perbaikan.

## Manual QA wajib

Jalankan checklist §12.2 untuk setiap viewport:

- [ ] Tidak ada horizontal scroll (`scrollWidth > innerWidth`).
- [ ] Semua field dapat diisi tanpa zoom di iOS.
- [ ] Bottom nav tidak menutupi tombol terakhir (safe-area).
- [ ] Dialog tidak keluar viewport dan tetap dapat ditutup.
- [ ] Uraian/kategori panjang tidak memotong layout.
- [ ] Tombol aksi minimal 44×44 px.
- [ ] Tidak ada elemen yang hanya muncul saat hover.
- [ ] Form auth muat penuh di 375 px dan tombol submit full-width.
- [ ] Email pengguna tidak menimpa tombol Keluar atau theme toggle.
- [ ] Tabel berubah menjadi kartu di bawah 768 px; tidak ada kolom yang hilang.
- [ ] Light dan dark mode diuji di semua halaman; toggle bertahan setelah refresh; tidak ada flash/hydration warning.
- [ ] Tidak ada error/warning console saat berpindah halaman atau membuka dialog.

## Acceptance criteria

- [ ] Matrix 375/768/1024/1440 px lulus untuk seluruh halaman dan state.
- [ ] Tidak ada horizontal scroll di semua kombinasi halaman/viewport/state.
- [ ] Navigasi, konten, dan bottom nav tidak saling menutupi; safe-area diterapkan.
- [ ] Tabel/kartu, dialog, form, dan halaman auth mengikuti §7.8 dan §12.2.
- [ ] Light dan dark mode konsisten, tanpa flash, dan memenuhi kontras.
- [ ] Target sentuh dan ukuran font input memenuhi aturan mobile.
- [ ] Tidak ada error/warning console atau hydration mismatch.
- [ ] Perbaikan logika memiliki test regresi; tidak ada dependensi baru.
- [ ] `pnpm test`, `pnpm test:db`, `pnpm lint`, dan `pnpm build` lulus.

## Di luar cakupan

- Redesign visual, tema baru, animasi baru, atau layout tambahan.
- Perbaikan fitur yang belum ada di §5.
- Audit aksesibilitas semantik (T10).
