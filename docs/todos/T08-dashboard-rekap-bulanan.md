# T08: Dashboard Rekap Bulanan

**What to build:** Pengguna membuka Dashboard dan langsung memahami kondisi bulan terpilih: total pemasukan, pengeluaran, saldo, serta rekap per kategori yang diurutkan dari aktivitas terbesar. Angka pada kartu, tabel, dan baris total selalu konsisten dan hanya berasal dari data miliknya.

**Blocked by:** T07 (data transaksi, month picker, dan service transaksi).

**Status:** done

## Konteks wajib

- Baca `docs/PRD.MD` §7.2 (DASH-01..13), §8.6 (aturan hitung), §7.7 (format), §6.3 (alur bulan), dan Lampiran A (data uji dan angka harapan).
- Baca `docs/DESIGN.md` untuk kartu ringkasan dan feature card "Saldo bulan ini".
- Dashboard memakai month picker yang sama dengan halaman Transaksi. Jangan membuat kontrol bulan kedua.
- Agregasi dilakukan di TypeScript dari satu dataset transaksi bulan terpilih milik user aktif. Jangan memakai `SUM` string PostgreSQL dan jangan membulatkan di tengah perhitungan.
- Jangan menambah chart library atau grafik apa pun.
- Bulan berjalan dihitung di Asia/Jakarta, bukan zona waktu server/browser.
- Saldo boleh negatif dan harus tampil jelas.

## Cakupan

- Fungsi agregasi murni:
  - input: transaksi bulan terpilih yang sudah terfilter user, masing-masing dengan kategori, jenis, dan amount;
  - output: `totalIncome`, `totalExpense`, `balance`, baris per kategori (`income`, `expense`, `net`, `activity`), dan total baris;
  - hanya kategori dengan minimal satu transaksi yang masuk;
  - urutan `activity DESC`, tie-break nama kategori A–Z case-insensitive.
- Service dashboard: mengambil transaksi bulan terpilih + nama kategori untuk user aktif dengan satu query utama, memakai rentang half-open.
- Halaman `/`:
  - `h1` "Dashboard", subjudul "Ringkasan keuangan pribadi Anda.", tombol utama "Tambah Transaksi" membawa `month` aktif;
  - month picker dari T07;
  - tiga summary card: Pemasukan, Pengeluaran, Saldo bulan ini (Saldo memakai feature card, termasuk state negatif);
  - section "Rekap per Kategori" dengan tautan "Lihat semua transaksi" ke `/transactions?month=<aktif>`;
  - tabel di tablet/desktop: Kategori, Pemasukan, Pengeluaran, Selisih; baris Total di bawah; kartu vertikal di mobile;
  - kolom Pemasukan/Pengeluaran memakai nilai absolut tanpa tanda; kolom Selisih memakai `+`/`-`; warna bukan satu-satunya pembeda;
  - `month` tidak valid fallback ke bulan berjalan; refresh/bookmark mempertahankan bulan;
  - empty state kondisional:
    - belum ada kategori sama sekali → "Belum ada kategori." + arahan + CTA "Buat Kategori";
    - kategori ada tetapi bulan kosong → "Belum ada transaksi di bulan ini." + CTA "Tambah Transaksi";
  - tabel kosong tidak ditampilkan tanpa penjelasan.
- Semua section memakai dataset yang sama agar card, tabel, dan total konsisten.

## TDD (wajib)

**Seam yang disepakati:** fungsi agregasi murni dengan fixture eksplisit, dan service pengambilan data bulanan terhadap database development. Tampilan kartu/tabel diverifikasi manual.

**Aturan loop:** satu test gagal → implementasi minimal → hijau → refactor. Tulis test agregasi satu per satu; jangan menulis semua kasus di awal.

**Urutan red → green:**

1. **Lampiran A.** Data November 2026 menghasilkan Pemasukan 9.000.000, Pengeluaran 200.000, Saldo 8.800.000.
2. **Baris Lampiran A.** Gaji 8.000.000/0/+8.000.000; Bonus 1.000.000/0/+1.000.000; Makan 0/200.000/-200.000; urutan Gaji, Bonus, Makan.
3. **Varian refund.** Tambah pemasukan 20.000 ke Makan → Makan 20.000/200.000/-180.000; total 9.020.000/200.000/8.820.000.
4. **Kategori dua jenis.** Freelance pemasukan 500.000 + pengeluaran 100.000 → selisih +400.000 dan aktivitas 600.000.
5. **Sorting.** Aktivitas lebih besar di atas; aktivitas sama diurutkan nama A–Z case-insensitive.
6. **Kategori kosong.** Kategori tanpa transaksi tidak muncul sebagai baris Rp 0.
7. **Bulan kosong.** Tidak ada transaksi → semua total 0, baris kosong, tidak error.
8. **Saldo negatif.** Pengeluaran > pemasukan → saldo negatif dan tetap terhitung benar.
9. **Konsistensi.** Jumlah kolom Pemasukan/Pengeluaran/Selisih sama dengan card dan baris Total.
10. **Isolasi data.** Service bulanan hanya mengembalikan transaksi user aktif; transaksi user lain dengan bulan sama tidak masuk.

**Di luar test otomatis:** halaman, month picker, kartu, tabel/kartu responsif, empty state, dan link.

## Manual QA wajib

- QA-13, QA-14, QA-15, QA-16, QA-17, QA-21.
- DASH-01..13.
- Masukkan Lampiran A lewat UI; cocokkan card, tabel, dan baris Total.
- Pindah bulan prev/next: seluruh section berubah konsisten; URL berubah; refresh tetap di bulan itu.
- Bulan berjalan default benar saat server memakai TZ UTC (simulasi 30 Nov 2026 17:30 UTC = 1 Des 00:30 WIB).
- Bulan kosong: card Rp 0, rekap kosong dengan empty state, tidak error.
- Akun baru tanpa kategori: CTA "Buat Kategori"; setelah kategori ada tetapi belum ada transaksi: CTA "Tambah Transaksi".
- Dua akun dengan data berbeda tidak saling melihat angka/baris.
- 375 px: kartu rekap, bukan tabel terpotong; tidak ada horizontal scroll.
- Tautan "Lihat semua transaksi" membuka bulan yang sama.

## Acceptance criteria

- [x] `/` menerima `?month=YYYY-MM`, default dan fallback memakai bulan berjalan Jakarta.
- [x] Tiga summary card menampilkan total yang sama dengan tabel dan baris Total.
- [x] Rekap hanya memuat kategori yang punya transaksi pada bulan itu, tepat satu baris per kategori.
- [x] Urutan `activity DESC`, tie-break nama A–Z.
- [x] Nilai absolut dipakai di kolom Pemasukan/Pengeluaran; Selisih memakai `+`/`-`.
- [x] Saldo negatif tampil jelas dan tidak crash.
- [x] Empty state membedakan "belum ada kategori" dan "bulan kosong".
- [x] Seluruh data hanya milik user aktif, termasuk query agregasi dan tautan bulan.
- [x] Tidak ada chart library, grafik, atau ringkasan tahunan.
- [x] `pnpm test`, `pnpm test:db`, `pnpm lint`, dan `pnpm build` lulus.

## Di luar cakupan

- Grafik tren/pie, ringkasan tahunan, ekspor, budget, dan target tabungan.
- Filter/pencarian di dashboard.
- Perubahan pada halaman Transaksi selain tautan yang mempertahankan bulan.
