# T10: Audit Aksesibilitas dan State Interaksi

**What to build:** Seluruh alur utama dapat digunakan dengan keyboard dan pembaca layar, serta setiap state (pending, sukses, error, loading, kosong, sesi berakhir) memberi umpan balik yang jelas. Ticket ini adalah audit dan perbaikan, bukan fitur baru.

**Blocked by:** T06, T08, T09 (semua halaman dan dialog sudah ada).

**Status:** done

## Konteks wajib

- Baca `docs/PRD.MD` §7.6 (feedback/loading/error/empty), §7.9 (A11Y-01..18), §7.10.4, §10.5 (motion), dan §12.1.2 (QA-24).
- Baca `docs/DESIGN.md` untuk kontras, fokus, dan state komponen.
- Jangan menambah fitur, halaman, atau dependensi. Fokus pada perbaikan semantik, fokus, copy, dan state.
- Karena keputusan proyek adalah Vitest untuk logic/service tanpa jsdom/Testing Library, temuan visual/semantik diverifikasi manual. Hanya perbaikan yang menyentuh logika murni yang ditulis test-first.

## Cakupan audit

- **Form dan field:** label terhubung `htmlFor`/`id`; placeholder bukan label; radio memakai `<fieldset>` + `<legend>`; error punya `aria-invalid="true"` dan `aria-describedby`; helper/error terbaca; urutan tab sama dengan visual; tidak ada `tabindex` positif.
- **Auth:** `autocomplete` benar (`email`, `current-password`, `new-password`); error form-level `role="alert"`; error field `aria-invalid`; password tidak dibacakan ulang dari state; fokus tidak dipindahkan paksa saat kredensial salah.
- **Banner dan navigasi:** sukses `role="status"`, error `role="alert"`; `aria-current="page"`; penanda aktif bukan hanya warna; tombol Tutup punya `aria-label="Tutup notifikasi"`.
- **Dialog:** `aria-labelledby`, focus trap, fokus awal "Batal", Escape menutup, fokus kembali ke pemicu (kategori dan transaksi).
- **Tabel:** `<caption>` (boleh visually hidden), `<th scope="col">`, header jelas.
- **Fokus dan keyboard:** `focus-visible:ring-2` dengan offset; skip link; semua aksi bisa dicapai tanpa hover; ikon dekoratif `aria-hidden`; tombol ikon punya nama.
- **Kontras dan warna:** teks normal ≥4.5:1, teks besar ≥3:1; jenis transaksi dan selisih tidak hanya dibedakan warna; tema terang dan gelap sama-sama lolos.
- **Lain-lain:** `lang="id"`; zoom 200% tidak kehilangan konten/fungsi; `prefers-reduced-motion` dihormati, transisi ≤150 ms; target sentuh ≥44×44; tidak ada error console/hydration.
- **State:** semua tombol pending (Menyimpan…, Memproses…, Menghapus…, Keluar…); form tidak dikosongkan sebelum sukses; error database/Supabase tidak mentah; loading tidak layar kosong; error page punya "Coba lagi"; 404 punya tautan kembali; sesi kedaluwarsa → `/login`; empty state sesuai §7.6.5; uraian panjang dan `<script>` tampil literal.

## TDD (wajib)

**Seam yang disepakati:** tidak ada seam UI otomatis baru. Bila audit menemukan bug pada logika murni (misalnya pemetaan banner, validasi ID, atau format), tulis test regresi yang gagal terlebih dahulu, lalu perbaiki. Perbaikan CSS/ARIA diverifikasi manual.

**Aturan loop:** reproduksi temuan → bila logika, test merah → perbaikan minimal → hijau; bila semantik/visual, perbaiki lalu ulangi langkah keyboard/screen reader yang gagal. Jangan mengubah copy atau perilaku yang sudah disepakati tanpa alasan yang tercatat.

## Manual QA wajib

- QA-24 (keyboard dan screen reader dasar) di Dashboard, Transaksi, form transaksi, Kategori, form kategori, Masuk, dan Buat Akun.
- Tab dari awal halaman: skip link muncul pertama; Enter memindahkan fokus ke `main`.
- Setiap input dapat diisi dan setiap aksi dapat dijalankan hanya dengan keyboard.
- Dialog: fokus awal, Tab tidak keluar dialog, Escape menutup, fokus kembali ke tombol pemicu.
- Banner sukses/error diumumkan dengan role yang benar; Tutup menghapus parameter tanpa menghilangkan bulan.
- Tabel terbaca dengan caption dan header kolom.
- Kontras diperiksa di light dan dark untuk teks, helper, tombol, badge, dan banner.
- Zoom browser 200%: tidak ada konten terpotong atau aksi hilang.
- `prefers-reduced-motion` aktif: tidak ada animasi yang mengganggu.
- Alur sesi kedaluwarsa: hapus cookie lalu refresh halaman inti → `/login`, tanpa 500.
- Submit form dengan error: pesan inline terbaca, nilai tidak hilang, password tidak kembali.
- Tidak ada teks Inggris bawaan, "TODO", "Coming soon", atau placeholder.
- Console bersih dari error/warning/hydration mismatch pada alur utama.

## Acceptance criteria

- [x] A11Y-01..18 terpenuhi di semua halaman dan dialog.
- [x] Setiap state (pending, sukses, error, loading, empty, 404, sesi berakhir) punya copy dan peran ARIA yang benar.
- [x] Semua form mempertahankan input saat error dan mencegah double submit.
- [x] Tidak ada error mentah PostgreSQL/Supabase, stack trace, atau path server yang tampil.
- [x] Tidak ada error/warning console pada alur utama.
- [x] Perbaikan logika memiliki test regresi yang ditulis sebelum perbaikan.
- [x] `pnpm test`, `pnpm test:db`, `pnpm lint`, dan `pnpm build` lulus.
- [x] Tidak ada fitur atau dependensi baru.

## Di luar cakupan

- Redesign visual atau perubahan struktur halaman.
- Penambahan test komponen/browser, axe, atau Playwright.
- Fitur baru di luar §5 PRD.
- Audit responsif dan tema menyeluruh (T11).
