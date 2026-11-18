---
version: "2.0"
name: "Quiet Ledger"
product: "Dashboard keuangan pribadi"
locale: "id-ID"
currency: "IDR"
platform: "web"
theme: "light-first"
scope: "Sistem visual dan komposisi Dashboard v1; komponen bersama dipakai halaman Transaksi dan Kategori"
source-of-truth: "docs/PRD.MD untuk fitur, copy, layout, state, dan data. Dokumen ini untuk sistem visual."
token-contract:
  naming: "Key di colors.light dan colors.dark adalah nama CSS variable tanpa prefix --. Nama mengikuti konvensi shadcn/ui; extension tercantum di bawah."
  extensions:
    - "brand"
    - "positive"
    - "positive-soft"
    - "negative"
    - "negative-soft"
    - "warning"
    - "warning-soft"
    - "feature"
    - "feature-foreground"
    - "feature-muted"
    - "feature-negative"
    - "divider"
colors:
  light:
    background: "oklch(0.970 0.008 91.5)" # #F7F5EF
    foreground: "oklch(0.210 0.008 274.5)" # #17181C
    card: "oklch(0.997 0.004 91.4)" # #FFFEFB
    card-foreground: "oklch(0.210 0.008 274.5)" # #17181C
    popover: "oklch(1.000 0.000 89.9)" # #FFFFFF
    popover-foreground: "oklch(0.210 0.008 274.5)" # #17181C
    primary: "oklch(0.511 0.263 266.4)" # #2447F9
    primary-foreground: "oklch(1.000 0.000 89.9)" # #FFFFFF
    secondary: "oklch(0.932 0.013 86.8)" # #ECE8DF
    secondary-foreground: "oklch(0.210 0.008 274.5)" # #17181C
    muted: "oklch(0.950 0.010 87.5)" # #F1EEE7
    muted-foreground: "oklch(0.516 0.013 280.3)" # #66676F
    accent: "oklch(0.947 0.012 84.6)" # #F1EDE5
    accent-foreground: "oklch(0.210 0.008 274.5)" # #17181C
    destructive: "oklch(0.500 0.182 29.5)" # #B42318
    destructive-foreground: "oklch(1.000 0.000 89.9)" # #FFFFFF
    border: "oklch(0.901 0.013 86.8)" # #E2DED5
    input: "oklch(0.634 0.015 88.7)" # #8E8A80
    ring: "oklch(0.511 0.263 266.4)" # #2447F9
    sidebar: "oklch(0.956 0.010 87.5)" # #F3F0E9
    sidebar-foreground: "oklch(0.210 0.008 274.5)" # #17181C
    sidebar-primary: "oklch(0.511 0.263 266.4)" # #2447F9
    sidebar-primary-foreground: "oklch(1.000 0.000 89.9)" # #FFFFFF
    sidebar-accent: "oklch(0.932 0.013 86.8)" # #ECE8DF
    sidebar-accent-foreground: "oklch(0.210 0.008 274.5)" # #17181C
    sidebar-border: "oklch(0.901 0.013 86.8)" # #E2DED5
    sidebar-ring: "oklch(0.511 0.263 266.4)" # #2447F9
    brand: "oklch(0.661 0.191 33.2)" # #F05A3C
    positive: "oklch(0.514 0.106 164.3)" # #0B7A57
    positive-soft: "oklch(0.952 0.021 166.1)" # #E3F4EC
    negative: "oklch(0.500 0.182 29.5)" # #B42318
    negative-soft: "oklch(0.943 0.022 27.8)" # #FBE7E4
    warning: "oklch(0.524 0.111 74.7)" # #8F5F00
    warning-soft: "oklch(0.965 0.036 83.8)" # #FFF2D9
    feature: "oklch(0.210 0.008 274.5)" # #17181C
    feature-foreground: "oklch(0.970 0.008 91.5)" # #F7F5EF
    feature-muted: "oklch(0.768 0.015 84.6)" # #B8B3A9
    feature-negative: "oklch(0.759 0.144 26.1)" # #FF8A80
    divider: "oklch(0.901 0.013 86.8)" # #E2DED5
  dark:
    background: "oklch(0.178 0.006 271.0)" # #101114
    foreground: "oklch(0.955 0.008 91.5)" # #F2F0EA
    card: "oklch(0.210 0.010 276.6)" # #17181D
    card-foreground: "oklch(0.955 0.008 91.5)" # #F2F0EA
    popover: "oklch(0.232 0.012 278.0)" # #1C1D23
    popover-foreground: "oklch(0.955 0.008 91.5)" # #F2F0EA
    primary: "oklch(0.620 0.205 270.8)" # #5B76FF
    primary-foreground: "oklch(0.159 0.011 268.0)" # #0B0D12
    secondary: "oklch(0.265 0.012 271.0)" # #23252B
    secondary-foreground: "oklch(0.955 0.008 91.5)" # #F2F0EA
    muted: "oklch(0.245 0.011 278.0)" # #1F2026
    muted-foreground: "oklch(0.730 0.013 281.0)" # #A6A7B0
    accent: "oklch(0.278 0.015 274.3)" # #262830
    accent-foreground: "oklch(0.955 0.008 91.5)" # #F2F0EA
    destructive: "oklch(0.712 0.181 22.8)" # #FF6B6B
    destructive-foreground: "oklch(0.172 0.027 24.3)" # #1A0B0A
    border: "oklch(0.294 0.013 272.9)" # #2A2C33
    input: "oklch(0.508 0.016 272.5)" # #62656F
    ring: "oklch(0.681 0.169 275.0)" # #7C8CFF
    sidebar: "oklch(0.159 0.007 271.0)" # #0C0D10
    sidebar-foreground: "oklch(0.955 0.008 91.5)" # #F2F0EA
    sidebar-primary: "oklch(0.755 0.126 276.0)" # #9AA8FF
    sidebar-primary-foreground: "oklch(0.159 0.011 268.0)" # #0B0D12
    sidebar-accent: "oklch(0.236 0.014 272.7)" # #1C1E25
    sidebar-accent-foreground: "oklch(0.955 0.008 91.5)" # #F2F0EA
    sidebar-border: "oklch(0.270 0.013 272.9)" # #24262D
    sidebar-ring: "oklch(0.681 0.169 275.0)" # #7C8CFF
    brand: "oklch(0.729 0.169 34.1)" # #FF7A5C
    positive: "oklch(0.806 0.157 160.0)" # #4ADE9C
    positive-soft: "oklch(0.299 0.047 166.1)" # #123528
    negative: "oklch(0.759 0.144 26.1)" # #FF8A80
    negative-soft: "oklch(0.265 0.052 24.8)" # #3B1A18
    warning: "oklch(0.837 0.164 84.4)" # #FBBF24
    warning-soft: "oklch(0.297 0.052 81.4)" # #3A2A0A
    feature: "oklch(0.265 0.055 270.6)" # #1B2340
    feature-foreground: "oklch(0.955 0.008 91.5)" # #F2F0EA
    feature-muted: "oklch(0.788 0.058 274.0)" # #AEB8E0
    feature-negative: "oklch(0.759 0.144 26.1)" # #FF8A80
    divider: "oklch(0.294 0.013 272.9)" # #2A2C33
typography:
  families:
    sans:
      name: "Geist Sans"
      css-var: "--font-geist-sans"
      fallback: "ui-sans-serif, system-ui, sans-serif"
      weights: [400, 500, 600, 700]
      usage: "Satu-satunya voice UI: heading, body, label, tombol, dan nominal."
    mono:
      name: "Geist Mono"
      css-var: "--font-geist-mono"
      usage: "Tidak dipakai di UI dashboard v1. Jangan memakai mono untuk nominal."
  numeric:
    feature: "tabular-nums lining-nums"
    locale: "id-ID"
  scale:
    h1:
      mobile: "24px/32px"
      desktop: "30px/36px"
      weight: 700
      tracking: "-0.02em"
      usage: "Judul halaman"
    subtitle:
      mobile: "14px/20px"
      desktop: "14px/20px"
      weight: 400
      usage: "Subjudul halaman, warna muted-foreground"
    h2:
      mobile: "20px/28px"
      desktop: "20px/28px"
      weight: 600
      tracking: "-0.01em"
      usage: "Judul section dan kartu"
    body:
      mobile: "16px/24px"
      desktop: "16px/24px"
      weight: 400
      usage: "Body dan isi tabel"
    label:
      mobile: "14px/20px"
      desktop: "14px/20px"
      weight: 500
      usage: "Label field dan label kartu"
    helper:
      mobile: "13px/18px"
      desktop: "13px/18px"
      weight: 400
      usage: "Helper, error, dan metadata"
    table-header:
      mobile: "12px/16px"
      desktop: "12px/16px"
      weight: 600
      tracking: "0.04em"
      transform: "uppercase"
      usage: "Header tabel dan label kolom"
    amount-card:
      mobile: "24px/32px"
      desktop: "28px/36px"
      weight: 700
      tracking: "-0.02em"
      usage: "Angka pada summary card, tabular-nums"
    amount-body:
      mobile: "16px/24px"
      desktop: "16px/24px"
      weight: 500
      usage: "Angka pada tabel dan kartu rekap, tabular-nums"
    button:
      mobile: "14px/20px"
      desktop: "14px/20px"
      weight: 600
      usage: "Label tombol"
rounded:
  base: "8px"
  control: "8px"
  card: "12px"
  feature-card: "12px"
  popover: "12px"
  dialog: "16px"
  badge: "9999px"
spacing:
  base: "4px"
  scale: ["4px", "8px", "12px", "16px", "24px", "32px", "48px", "64px"]
  page:
    mobile: "16px"
    tablet: "24px"
    desktop: "32px"
  section:
    mobile: "24px"
    desktop: "32px"
  card:
    mobile: "16px"
    desktop: "24px"
  grid-gap:
    mobile: "12px"
    desktop: "16px"
  container: "1120px"
  form: "640px"
  sidebar: "240px"
  topbar:
    mobile: "56px"
    tablet: "64px"
  bottom-nav: "64px"
shadows:
  popover: "0 8px 24px rgb(23 24 28 / 0.12), 0 1px 2px rgb(23 24 28 / 0.06)"
  dialog: "0 16px 48px rgb(23 24 28 / 0.18)"
components:
  button:
    height: {default: "44px", lg: "48px", icon: "44px"}
    radius: "8px"
    padding-x: {default: "16px", lg: "20px"}
    font: "14px/20px"
    weight: 600
    gap: "8px"
    icon: "18px"
    primary: {bg: "var(--primary)", fg: "var(--primary-foreground)", hover-light: "color-mix(in oklch, var(--primary) 90%, black)", hover-dark: "color-mix(in oklch, var(--primary) 90%, white)"}
    outline: {bg: "var(--card)", border: "1px solid var(--input)", fg: "var(--foreground)", hover: "var(--accent)"}
    ghost: {bg: "transparent", fg: "var(--foreground)", hover: "var(--accent)"}
    destructive: {bg: "var(--destructive)", fg: "var(--destructive-foreground)"}
    focus: "2px solid var(--ring), offset 2px"
  card:
    radius: "12px"
    border: "1px solid var(--border)"
    bg: "var(--card)"
    shadow: "none"
    padding: {mobile: "16px", desktop: "24px"}
    title: "20px/28px 600"
    description: "14px/20px 400 var(--muted-foreground)"
  feature-card:
    bg: "var(--feature)"
    fg: "var(--feature-foreground)"
    muted: "var(--feature-muted)"
    negative: "var(--feature-negative)"
    radius: "12px"
    padding: {mobile: "16px", desktop: "24px"}
    accent-rule: "1px solid var(--brand)"
    shadow: "none"
  summary-card:
    label: "14px/20px 500 var(--muted-foreground)"
    amount: "24px/32px 700; 28px/36px 700 desktop; tabular-nums"
    gap: "12px"
    min-height: "128px"
  input:
    height: "44px"
    radius: "8px"
    border: "1px solid var(--input)"
    bg: "var(--card)"
    padding-x: "12px"
    font: "16px/24px"
    label: "14px/20px 500"
    helper: "13px/18px 400 var(--muted-foreground)"
    error: "13px/18px 500 var(--negative)"
    focus: "2px solid var(--ring), offset 2px"
  select:
    trigger: "Sama dengan input; tinggi 44px, radius 8px"
    content: "radius 12px, border 1px, shadow popover, padding 4px"
    item: "min-height 44px, radius 8px"
  month-picker:
    height: "44px"
    nav-button: "44px x 44px, ghost, radius 8px"
    label: "14px/20px 600, tabular-nums"
    popover: "radius 12px, padding 12px, shadow popover"
    gap: "8px"
  table:
    header-height: "44px"
    row-height: "52px"
    padding-x: "16px"
    header-font: "12px/16px 600, uppercase, 0.04em"
    body-font: "16px/24px 400"
    amount: "16px/24px 500, tabular-nums, right"
    divider: "1px solid var(--divider)"
    total-border: "1px solid var(--foreground)"
    hover: "var(--muted)"
  dialog:
    width: "420px"
    mobile: "calc(100vw - 32px)"
    radius: "16px"
    padding: "24px"
    overlay: "rgb(23 24 28 / 0.40)"
    shadow: "0 16px 48px rgb(23 24 28 / 0.18)"
    title: "20px/28px 600"
    description: "14px/20px var(--muted-foreground)"
  badge:
    height: "22px"
    radius: "9999px"
    padding-x: "8px"
    font: "12px/16px 600"
  banner:
    radius: "12px"
    border: "1px solid"
    padding: "12px 16px"
    font: "14px/20px"
    success: {bg: "var(--positive-soft)", border: "color-mix(in oklch, var(--positive) 24%, transparent)", fg: "var(--positive)"}
    error: {bg: "var(--negative-soft)", border: "color-mix(in oklch, var(--negative) 24%, transparent)", fg: "var(--negative)"}
  empty-state:
    icon: "40px"
    padding: {mobile: "40px 24px", desktop: "48px 32px"}
    title: "16px/24px 600"
    description: "14px/20px 400 var(--muted-foreground)"
  nav:
    sidebar-width: "240px"
    item-height: "44px"
    item-radius: "8px"
    topbar-tablet: "64px"
    topbar-mobile: "56px"
    bottom-nav: "64px + env(safe-area-inset-bottom)"
    icon: "20px"
---

# Quiet Ledger — Design System

> **Inti:** presisi alat ukur, kehangatan kertas. Kertas gading, tinta tajam, satu garis coral di antara angka yang tenang.

**Status:** v2.0 · Dashboard keuangan pribadi v1 · Next.js App Router + Tailwind CSS 4 + shadcn/ui

**Otoritas dokumen:** `docs/PRD.MD` adalah sumber kebenaran untuk fitur, copy, layout, state, dan aturan data. Dokumen ini adalah sumber kebenaran untuk warna, tipografi, bentuk, spasi, dan perilaku visual. Jika keduanya bertabrakan pada hal visual, dokumen ini menang; jika bertabrakan pada fitur atau copy, PRD menang.

Nama "Quiet Ledger" adalah nama kerja sistem, bukan nama produk final. Wordmark `cash.` adalah placeholder visual; nama produk, `<title>`, dan metadata tetap `Cash Management` sesuai PRD APP-01.

## Overview

### Konteks yang dikunci dari wawancara

| Keputusan | Nilai |
|---|---|
| Produk | Keuangan pribadi |
| Pengguna | Individu yang mencatat pemasukan dan pengeluaran sendiri, sering dari HP, dan meninjau rekap dari laptop di akhir bulan |
| Nuansa | Crisp & presisi |
| Referensi | Monzo untuk kehangatan dan keterbacaan; Revolut untuk struktur dan disiplin data |
| Mode | Light-first, dark mode setara secara kualitas |
| Cakupan | Dashboard v1; sistem komponen bersama dipakai halaman Transaksi dan Kategori sesuai PRD |

### Konsep: Quiet Ledger

Dashboard ini bukan poster. Ia adalah meja kerja yang rapi: kertas gading, tinta hampir hitam, garis rambut 1px, dan angka yang rata seperti buku besar. Kehangatan datang dari permukaan kertas dan tipografi Geist Sans, bukan dari gradien atau ilustrasi. Presisi datang dari grid, angka tabular, dan hierarki yang tegas, bukan dari efek.

Referensi Monzo/Revolut diambil sebagai sikap, bukan skin. Dari Monzo: warna sinyal yang berani, copy yang langsung, dan rasa bahwa uang adalah milik manusia. Dari Revolut: kontrol, keteraturan, dan kepercayaan pada kepadatan data. Tidak ada tiruan logo, maskot, atau komposisi brand mereka.

### Lima prinsip

1. **Angka dulu, dekorasi belakangan.** H1, bulan, tiga angka ringkasan, lalu rekap. Tidak ada eyebrow, kicker, atau ilustrasi yang menunda angka.
2. **Satu aksi, satu sinyal.** Cobalt untuk tindakan dan fokus. Coral untuk satu momen manusia per layar. Hijau, merah, dan amber hanya untuk makna uang atau status.
3. **Garis, bukan bayangan.** Struktur dibangun dari border 1px dan pemisah tipis. Bayangan hanya untuk popover dan dialog yang benar-benar mengambang.
4. **Tenang, bukan datar.** Pengeluaran normal memakai tinta, bukan merah. Merah hanya untuk masalah nyata: saldo negatif, selisih negatif, error, dan aksi destruktif.
5. **Disiplin lingkup.** Tidak ada chart, budget, dompet, pencarian, filter, pagination, warna kategori, atau ikon kategori—meskipun terlihat bagus di mockup.

### Bukan ini

- Bukan terminal trading: tanpa candlestick, ticker berjalan, neon, atau latar hitam pekat.
- Bukan aplikasi gamifikasi: tanpa streak, badge pencapaian, atau animasi perayaan.
- Bukan halaman marketing: tanpa ilustrasi 3D, mockup ponsel, atau hero setinggi layar.
- Bukan neo-brutalist: tanpa hard offset shadow, border tebal, atau warna tabrak.
- Bukan dashboard analytics: tanpa chart, donut, sparkline, atau KPI grid empat kotak.

---

## Colors

Palet ini bekerja dengan pembagian peran, bukan jumlah warna. Sekitar 90% layar adalah kertas, tinta, kartu, dan permukaan netral.

| Peran | Token | Light | Dark | Dipakai untuk |
|---|---|---|---|---|
| Kertas | `--background` | `#F7F5EF` | `#101114` | Latar halaman |
| Tinta | `--foreground` | `#17181C` | `#F2F0EA` | Teks utama, angka netral |
| Aksi | `--primary` | `#2447F9` | `#5B76FF` | Tombol utama, link, focus ring, item nav aktif |
| Sinyal | `--brand` | `#F05A3C` | `#FF7A5C` | Satu garis aksen pada feature card |
| Pemasukan | `--positive` | `#0B7A57` | `#4ADE9C` | Nominal pemasukan dan banner sukses |
| Negatif/bahaya | `--negative` | `#B42318` | `#FF8A80` | Selisih negatif, error, aksi destruktif |
| Peringatan | `--warning` | `#8F5F00` | `#FBBF24` | Pesan peringatan, jika ada |
| Kartu | `--card` | `#FFFEFB` | `#17181D` | Permukaan kartu dan tabel |
| Garis | `--border` | `#E2DED5` | `#2A2C33` | Border 1px dan pemisah |
| Feature | `--feature` | `#17181C` | `#1B2340` | Kartu Saldo bulan ini |
| Teks feature | `--feature-foreground` | `#F7F5EF` | `#F2F0EA` | Teks di atas feature card |
| Teks feature muted | `--feature-muted` | `#B8B3A9` | `#AEB8E0` | Label di atas feature card |
| Saldo negatif | `--feature-negative` | `#FF8A80` | `#FF8A80` | Amount saldo negatif di atas feature card |

### Aturan warna

- **Cobalt adalah warna aksi.** Tombol primary, link, focus ring, item navigasi aktif, kontrol terpilih, dan tautan "Lihat semua transaksi". Jangan memakai cobalt sebagai hiasan, latar kartu besar, atau warna kategori.
- **Tautan cobalt hanya di atas `--background` atau `--card`.** Di dark mode, jangan menaruh teks link cobalt di atas `--muted` atau `--accent` karena kontrasnya turun di bawah 4,5:1.
- **Coral adalah sinyal, bukan aksi.** Satu-satunya pemakaian coral di Dashboard v1 adalah garis 1px di tepi atas kartu Saldo bulan ini. Coral tidak pernah menjadi warna tombol, error, pengeluaran, badge, atau teks.
- **Hijau hanya untuk pemasukan dan sukses.** Jangan memakai hijau untuk kategori, dekorasi, atau status netral.
- **Merah hanya untuk masalah nyata.** Error, aksi destruktif, saldo negatif, dan selisih negatif. Pengeluaran biasa memakai tinta; tabel rekap menampilkan nilai absolut tanpa warna merah.
- **Amber hanya untuk peringatan.** Jangan memakai amber sebagai warna kategori atau hiasan.
- **Tidak ada gradien, glass, glow, neon, atau kartu penuh warna.** Permukaan berwarna hanya untuk feature card, banner status, dan tint badge.
- **Tint maksimal 12%.** Banner dan badge memakai `positive-soft`/`negative-soft`; jangan membuat pelangi pastel.
- **Dark mode memakai tint dalam, bukan pastel terang.** Permukaan naik lewat lightness, bukan bayangan.
- **`--accent` adalah hover netral shadcn, bukan warna brand.** Coral selalu memakai `--brand`; jangan menimpa `--accent` dengan coral.

### Warna kategori

**Kategori tidak memiliki warna, ikon, atau pola.** PRD D4 mengunci kategori hanya memiliki nama. Jangan menambahkan dot warna, tile pastel, inisial berwarna, atau ikon kategori. Pembedaan baris rekap dilakukan lewat teks, urutan, dan tipografi—bukan lewat warna.

### Dark mode

- **Light-first.** Default adalah terang. Toggle manual 44×44 px tersedia di footer sidebar (desktop) dan top bar (tablet/mobile). Preferensi disimpan di `localStorage` dan kelas `.dark` dipasang di `<html>`.
- Jangan memakai `prefers-color-scheme` untuk mengganti tema otomatis. Yang dihormati otomatis hanyalah `prefers-reduced-motion`.
- Pasang script inline kecil di `<head>` untuk membaca preferensi sebelum paint; jangan biarkan flash tema atau hydration warning.
- Di dark mode, jangan memakai `#000000` atau `#FFFFFF`. Latar `#101114`, teks `#F2F0EA`.
- Kartu naik satu tingkat dari latar (`#17181D`), bukan diberi shadow.
- Feature card berubah dari tinta pekat menjadi cobalt dalam (`#1B2340`); teks tetap kertas dan garis coral tetap satu-satunya sinyal.
- Semua state (hover, focus, disabled, error, empty, pending) harus diuji di kedua mode.

### Kontras

| Pasangan | Light | Dark | Minimum |
|---|---:|---:|---|
| `foreground` / `background` | 16,3:1 | 16,6:1 | 4,5:1 |
| `muted-foreground` / `background` | 5,2:1 | 7,9:1 | 4,5:1 |
| `primary-foreground` / `primary` | 6,3:1 | 5,1:1 | 4,5:1 |
| `brand` / `background` | 3,1:1 | 7,4:1 | 3,0:1 |
| `positive` / `background` | 4,9:1 | 11,0:1 | 4,5:1 |
| `negative` / `background` | 6,0:1 | 8,3:1 | 4,5:1 |
| `warning` / `background` | 5,1:1 | 11,3:1 | 4,5:1 |
| `feature-muted` / `feature` | 8,5:1 | 7,9:1 | 4,5:1 |
| `feature-negative` / `feature` | 7,8:1 | 6,8:1 | 4,5:1 |

Coral `#F05A3C` tidak lolos untuk teks kecil di atas kertas. Karena itu coral hanya dipakai sebagai garis aksen tipis, tidak pernah sebagai teks atau bidang penuh, termasuk nominal, label, error, atau badge.

Batas input memakai `--input` dengan kontras minimal 3:1 terhadap `--card` dan `--background`. Jangan mengembalikannya ke tint dekoratif yang hampir tidak terlihat.

## Typography

### Satu suara

| Peran | Font | Variable | Pemakaian |
|---|---|---|---|
| UI dan angka | **Geist Sans** | `--font-geist-sans` | Heading, body, label, tombol, nominal, tabel |
| Tooling | **Geist Mono** | `--font-geist-mono` | Tidak dipakai di UI dashboard v1 |

Geist Sans dipilih karena netral, tajam di ukuran kecil, dan angka tabular-nya rapi tanpa terasa seperti terminal. Jangan memakai font kedua untuk "kontras"—kontras dibangun lewat ukuran, bobot, dan warna. Geist Mono boleh tetap dimuat untuk tooling, tetapi tidak boleh muncul sebagai nominal, tanggal, atau label UI.

Angka uang memakai Geist Sans dengan `font-variant-numeric: tabular-nums lining-nums`. Jangan memakai mono untuk amount.

### Skala

| Token | Mobile | Desktop | Weight | Tracking | Dipakai untuk |
|---|---|---|---|---|---|
| `h1` | 24px/32px | 30px/36px | 700 | -0.02em | Judul halaman |
| `subtitle` | 14px/20px | 14px/20px | 400 | 0 | Subjudul halaman, muted |
| `h2` | 20px/28px | 20px/28px | 600 | -0.01em | Judul section/kartu |
| `body` | 16px/24px | 16px/24px | 400 | 0 | Body dan isi tabel |
| `label` | 14px/20px | 14px/20px | 500 | 0 | Label field dan label kartu |
| `helper` | 13px/18px | 13px/18px | 400 | 0 | Helper, error, metadata |
| `table-header` | 12px/16px | 12px/16px | 600 | 0.04em | Header tabel, uppercase |
| `amount-card` | 24px/32px | 28px/36px | 700 | -0.02em | Angka summary card |
| `amount-body` | 16px/24px | 16px/24px | 500 | 0 | Angka tabel dan kartu rekap |
| `button` | 14px/20px | 14px/20px | 600 | 0 | Label tombol |

- Body tidak pernah turun di bawah 16px; helper tidak di bawah 13px; header tabel tidak di bawah 12px.
- Bobot dipakai bertingkat: 400 untuk body, 500 untuk label dan amount tabel, 600 untuk heading section dan tombol, 700 hanya untuk H1 dan amount summary. Jangan memakai 700 untuk body atau 400 untuk heading.
- Uppercase hanya untuk header tabel dan label kolom. Amount, body, dan tombol tidak pernah uppercase.
- Jangan memakai letter-spacing negatif pada body atau helper; hanya pada H1 dan amount besar.
- Line-height heading lebih rapat daripada body. Jangan mencampur line-height 1.5 pada H1.

### Angka dan format

| Kasus | Format | Contoh |
|---|---|---|
| Penuh | `Rp` + spasi + ribuan titik | `Rp 24.580.000` |
| Pemasukan | plus di depan mata uang | `+Rp 8.000.000` |
| Pengeluaran | minus di depan mata uang | `-Rp 150.000` |
| Saldo negatif | minus di depan mata uang | `-Rp 200.000` |
| Selisih positif | plus di depan mata uang | `+Rp 1.250.000` |
| Bulan | nama bulan + tahun | `November 2026` |
| Tanggal | hari + bulan singkat + tahun | `16 Nov 2026` |

- Selalu format lewat `Intl.NumberFormat("id-ID")`; jangan menulis titik/koma manual.
- Jangan menampilkan desimal untuk IDR. Bulatkan ke rupiah.
- Amount rata kanan di kolom dan tabel. Gunakan `tabular-nums`.
- Dalam satu tabel, jangan mencampur format penuh dan kompak. Dashboard v1 tidak memakai format kompak (`jt`/`rb`).
- Tanda `+` hanya untuk pemasukan atau selisih positif. Pengeluaran dan saldo negatif memakai `-`.
- Jangan menampilkan `Rp 0` untuk kategori yang tidak punya transaksi; kategori tersebut tidak muncul di rekap.

---

## Layout & Spacing

### App shell

```text
DESKTOP ≥ 1024px
┌──────────────┬──────────────────────────────────────────────────┐
│ cash.        │  Dashboard                    [Tambah Transaksi]  │
│              │  Ringkasan keuangan pribadi Anda.                  │
│  Dashboard   │                                                  │
│  Transaksi   │  [←]  November 2026  [→]                          │
│  Kategori    │                                                  │
│              │  ┌───────────┐ ┌────────────┐ ┌────────────────┐  │
│              │  │ Pemasukan │ │ Pengeluaran│ │ Saldo bulan ini│  │
│              │  └───────────┘ └────────────┘ └────────────────┘  │
│              │                                                  │
│              │  Rekap per Kategori          Lihat semua transaksi│
│              │  ┌──────────────────────────────────────────────┐ │
│              │  │ Kategori   Pemasukan   Pengeluaran   Selisih │ │
│              │  └──────────────────────────────────────────────┘ │
│  ◐ Tema      │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

- **Desktop ≥ 1024px:** sidebar kiri tetap 240px, konten maksimal 1120px, padding 32px. Tidak ada sidebar rail, tidak ada collapse.
- **Tablet 768–1023px:** top header sticky 64px dengan wordmark dan nav horizontal. Tidak ada sidebar.
- **Mobile < 768px:** top bar 56px, bottom nav fixed 64px + `env(safe-area-inset-bottom)`. Tidak ada hamburger, drawer, atau sheet navigasi.
- Bottom nav berisi tiga tujuan yang sama dengan sidebar: Dashboard, Transaksi, Kategori. Ikon 20px, label 11px, item aktif cobalt.
- `<main>` di mobile memakai padding bawah minimal 88px agar bottom nav tidak menutupi konten.
- Theme toggle 44×44px berada di footer sidebar (desktop) dan sisi kanan top bar (tablet/mobile).

### Breakpoint dan grid

| Viewport | Grid | Page padding | Navigasi | Dashboard |
|---|---|---|---|---|
| `< 768px` | 4 kolom | 16px | Top bar + bottom nav | Summary stack; rekap berupa kartu |
| `768–1023px` | 8 kolom | 24px | Top header + nav horizontal | Summary 3 kolom; rekap tabel |
| `≥ 1024px` | 12 kolom | 32px | Sidebar 240px | Summary 3 kolom; rekap tabel; max 1120px |

- Jangan membuat konten melebar penuh di monitor ultrawide.
- Jangan memaksa tabel rekap masuk di mobile dengan mengecilkan font atau horizontal scroll. Di bawah 768px, tabel berubah menjadi kartu.
- Tidak ada horizontal scroll di 375, 768, 1024, dan 1440px.
- Uji portrait dan landscape minimal pada 375px dan 768px.

### Ritme spasi

- Basis 4px. Skala: 4, 8, 12, 16, 24, 32, 48, 64.
- Jarak antar-section 24px mobile, 32px desktop.
- Jarak antar-kartu 12px mobile, 16px desktop.
- Padding kartu 16px mobile, 24px desktop.
- Padding halaman 16px mobile, 24px tablet, 32px desktop.
- Selalu lebih banyak ruang di atas heading daripada di bawahnya.
- Tinggi baris tabel 52px; header tabel 44px; semua kontrol dan target sentuh minimal 44×44px.
- Gunakan skala di atas untuk ritme layout. Nilai di luar skala hanya untuk dimensi komponen, misalnya ikon 40px atau dialog 420px.

### Komposisi Dashboard

Urutan ini mengikuti PRD §7.2 dan tidak boleh diubah.

1. **Page header.** H1 `Dashboard` 24/32 mobile, 30/36 desktop, weight 700. Subjudul `Ringkasan keuangan pribadi Anda.` 14/20 muted. Tombol primary `Tambah Transaksi` di kanan pada desktop/tablet; full-width di bawah subjudul pada mobile. Tidak ada eyebrow atau kicker di atas H1.
2. **Month picker.** Satu baris kontrol 44px: tombol prev 44×44, pemilih bulan, tombol next 44×44. Di desktop, trigger `November 2026` 14/20 weight 600 membuka popover berisi Select bulan dan Select tahun. Di mobile, dua Select inline (bulan dan tahun) menggantikan trigger; gabungan nilainya adalah label bulan. Jangan mengandalkan `<input type="month">`. Next disabled di bulan berjalan; prev disabled di `2000-01`. Saat pending, kontrol meredup dan tidak bisa diklik ganda, tetapi label bulan tetap terbaca.
3. **Tiga summary card.** Selalu tiga: `Pemasukan`, `Pengeluaran`, `Saldo bulan ini`. Di mobile stack 1 kolom dengan urutan yang sama. Di tablet/desktop 3 kolom sama lebar. Label 14/20 weight 500 muted; amount 24/32 mobile, 28/36 desktop, weight 700, tabular.
   - `Pemasukan`: amount `--positive`.
   - `Pengeluaran`: amount `--foreground` (bukan merah; pengeluaran normal bukan error).
   - `Saldo bulan ini`: **feature card** dengan permukaan `--feature`, teks `--feature-foreground`, label `--feature-muted`, dan garis coral 1px di tepi atas. Amount kertas saat positif; saat negatif memakai `--feature-negative` dan tanda minus. Kartu tidak berubah merah.
4. **Rekap per Kategori.** Satu card berisi header section: H2 `Rekap per Kategori` 20/28 weight 600 dan tautan `Lihat semua transaksi` 14/20 weight 500 cobalt. Di bawahnya tabel (tablet/desktop) atau daftar kartu (mobile).
   - Kolom: `Kategori`, `Pemasukan`, `Pengeluaran`, `Selisih`.
   - Header tabel 12/16 weight 600 uppercase, tracking 0.04em, muted; border bawah 1px.
   - Baris 52px, border bawah 1px `--divider`, hover `--muted`. Tidak ada zebra stripe.
   - Baris total di bawah: border atas 1px `--foreground`, teks weight 600, amount weight 700. Nilainya harus sama dengan tiga summary card. Tidak memakai latar gelap.
   - `Pemasukan` dan `Pengeluaran` menampilkan nilai absolut tanpa tanda; `Selisih` memakai `+`/`-`. Warna bukan satu-satunya pembeda.
   - Urutan data mengikuti PRD DASH-06: total aktivitas menurun, tie-break nama A–Z. Desain tidak mengurutkan ulang.
5. **Empty state.** Jika belum ada transaksi, tabel diganti empty state di dalam card Rekap. Section header dan tautan tetap ada. Copy dan CTA persis mengikuti PRD §7.6.5:
   - Belum ada kategori: `Belum ada kategori.` + `Buat kategori terlebih dahulu untuk mulai mencatat transaksi.` + CTA `Buat Kategori`.
   - Kategori ada, bulan kosong: `Belum ada transaksi di bulan ini.` + `Catat pemasukan atau pengeluaran pertama Anda.` + CTA `Tambah Transaksi`.
   - Jangan menampilkan tabel kosong, angka `Rp 0` palsu, atau ilustrasi dekoratif.

### Radius, border, dan shadow

| Elemen | Radius | Border | Shadow |
|---|---:|---|---|
| Input, Select, Button outline | 8px | 1px `--input` | Tidak ada |
| Card, Summary card | 12px | 1px `--border` | Tidak ada |
| Feature card | 12px | Tidak ada; garis aksen 1px coral di atas | Tidak ada |
| Popover | 12px | 1px `--border` | `0 8px 24px rgb(23 24 28 / 0.12), 0 1px 2px rgb(23 24 28 / 0.06)` |
| Dialog | 16px | 1px `--border` | `0 16px 48px rgb(23 24 28 / 0.18)` |
| Badge | 9999px | Tidak ada | Tidak ada |
| Tabel di dalam Card | Mengikuti Card (12px) | Tidak ada border sendiri; divider baris 1px `--divider` | Tidak ada |

- Kartu tidak memakai shadow. Elevasi hanya untuk popover dan dialog.
- Gunakan `shadows.popover` dan `shadows.dialog` dari front matter; jangan membuat shadow lain.
- Jangan memakai colored halo atau glow sebagai shadow.
- Jangan menumpuk kartu di dalam kartu. Gunakan separator 1px.
- Border kiri/kanan berwarna maksimal 1px. Tidak ada stripe 2–4px pada kartu, list, atau alert.
- Garis coral pada feature card adalah satu-satunya border berwarna di Dashboard.

### Motion

- Durasi transisi maksimal 150ms; easing `cubic-bezier(0.2, 0, 0, 1)`.
- Hover dan focus hanya mengubah warna/opacity; jangan menggeser layout.
- Dialog memakai fade ringan pada overlay dan konten, tanpa slide lambat.
- Angka tidak count-up. Tidak ada parallax, autoplay, confetti, atau animasi berulang.
- Tidak ada animasi chart karena tidak ada chart.
- `prefers-reduced-motion`: matikan transform dan fade; tampilkan state akhir secara instan.

### Browser surfaces

- `::selection`: cobalt 18% di light mode, 30% di dark mode; teks tetap `--foreground`.
- `caret-color: var(--primary)`.
- Scrollbar 6px, thumb `--input`, hover `--muted-foreground`; Firefox `scrollbar-width: thin`.
- Focus ring 2px `--ring`, offset 2px. Jangan pernah menghapus outline tanpa pengganti.
- Link underline offset 4px, thickness 1px.
- `::placeholder` memakai `--muted-foreground` dengan opacity 1.
- Disabled: opacity 45%, cursor `not-allowed`, tanpa hover.
- Angka memakai `font-variant-numeric: tabular-nums lining-nums`.

## Components

Semua primitif memakai **shadcn/ui**. Jangan membuat Button, Dialog, Select, Table, atau Popover sendiri. Style lewat token, variant, dan `className` yang membaca token; jangan menempelkan hex di komponen. Komponen di luar daftar ini tidak dipakai di v1.

### Inventaris

| Komponen shadcn | Varian yang dipakai | Fungsi |
|---|---|---|
| `Button` | primary, outline, ghost, destructive, icon | Aksi dan navigasi |
| `Card` | default, feature composition | Summary card dan Rekap per Kategori |
| `Input` | default | Form transaksi dan kategori (shared) |
| `Select` | default | Month picker dan form |
| `Label` | default | Label field |
| `RadioGroup` | default | Jenis transaksi di form |
| `Popover` | default | Pemilih bulan/tahun |
| `Table` | default | Rekap per Kategori (tablet/desktop) |
| `Badge` | income, expense | Jenis transaksi di daftar transaksi |
| `Dialog` | default | Konfirmasi hapus |
| `Alert` | default, destructive | Banner status dan error form-level |
| `Skeleton` | default | Loading state |

Jangan memakai `Chart`, `Tabs`, `Progress`, `Sheet`, `Command`, `DropdownMenu`, `Avatar`, `Toast`, `Sidebar`, `Calendar`, `Pagination`, `Tooltip`, atau `ToggleGroup`. Dashboard tidak punya chart, tab, budget, pencarian, filter, pagination, atau menu baris.

Ikon memakai inline SVG sederhana: stroke 1.75–2, ukuran render 18–20px untuk ikon UI dan 40px untuk empty/error state, `aria-hidden="true"` untuk ikon dekoratif. Jangan menambah package ikon apa pun.

### Button dan hierarki aksi

- Hanya satu tombol primary per view. Di Dashboard, primary adalah `Tambah Transaksi`.
- `primary`: cobalt solid, teks mengikuti `--primary-foreground` (putih di light mode, tinta gelap di dark mode). Di light mode hover menggelapkan cobalt maksimal 10%; di dark mode hover mencerahkan cobalt maksimal 10% agar teks gelap tetap lolos kontras. Jangan memakai coral.
- `outline`: permukaan kartu + border 1px `--input`, teks tinta. Untuk aksi pendamping.
- `ghost`: transparan, hover `--accent`. Untuk prev/next month picker, `Tutup` banner, dan aksi sekunder.
- `destructive`: hanya di dialog konfirmasi hapus. Aksi hapus di daftar boleh outline merah, bukan tombol merah penuh.
- Height 44px; icon-only 44×44px dengan `aria-label`. Radius 8px. Font 14/20 weight 600. Gap ikon 8px.
- Pending: tombol disabled, label berubah `Menyimpan…` atau `Menghapus…`, lebar dikunci agar tidak bergeser.
- Semua tombol punya label teks. Icon-only hanya untuk prev/next, tutup banner, dan theme toggle, selalu dengan accessible name.

### Card dan summary card

- Card: radius 12px, border 1px `--border`, padding 16px mobile / 24px desktop, tanpa shadow.
- Summary card memakai tinggi minimum 128px dan `display: grid` dengan label di atas, amount di bawah. Label 14/20 weight 500 muted; amount 24/32 mobile, 28/36 desktop, weight 700.
- `Saldo bulan ini` adalah satu-satunya feature card: permukaan `--feature`, label `--feature-muted`, amount `--feature-foreground` (atau `--feature-negative` bila negatif), garis coral 1px di tepi atas. Tidak ada kartu gelap kedua di Dashboard.
- Jangan menaruh Card di dalam Card. Untuk memisahkan header section dan tabel, gunakan border 1px atau padding, bukan card bertumpuk.
- Jangan menambahkan ikon tren, panah naik/turun, persentase, atau caption "bulan lalu" pada summary card. PRD tidak memintanya.

### MonthPicker

- Komposisi: `Button ghost` prev (chevron kiri, `aria-label="Bulan sebelumnya"`), pemilih bulan, `Button ghost` next (chevron kanan, `aria-label="Bulan berikutnya"`).
- Desktop: trigger `November 2026` 14/20 weight 600, tabular, membuka `Popover` berisi `Select` bulan dan `Select` tahun. Mobile: dua `Select` inline (bulan dan tahun) menggantikan trigger; gabungan nilainya adalah label bulan.
- Popover: radius 12px, border 1px, padding 12px, shadow popover, lebar 280px. Item Select minimal 44px.
- Prev disabled di `2000-01`; next disabled di bulan berjalan. Disabled memakai opacity 45%, bukan warna merah.
- Perubahan bulan langsung mengubah URL `?month=YYYY-MM`; jangan memakai state lokal sebagai sumber kebenaran.
- Saat pending, kontrol meredup dan tidak bisa diklik ganda. Jangan menampilkan spinner besar atau menutupi label bulan.
- Jangan memakai `<input type="month">` sebagai satu-satunya kontrol.

### Table dan Rekap per Kategori

- Table dibungkus Card. Header section terpisah dari tabel oleh border 1px `--border`.
- Header tabel 12/16 weight 600 uppercase, tracking 0.04em, `--muted-foreground`. Tinggi 44px. Border bawah 1px.
- Baris 52px, padding horizontal 16px, border bawah 1px `--divider`. Baris terakhir tidak punya border bawah; baris total memakai border atas 1px `--foreground`.
- Kolom `Kategori` rata kiri; `Pemasukan`, `Pengeluaran`, `Selisih` rata kanan dan tabular.
- Teks kategori dan `Uraian` 16/24 weight 400; boleh wrap dengan `overflow-wrap: anywhere`. Jangan memotong dengan ellipsis tanpa title.
- Baris total: label `Total` weight 600, amount weight 700. Jangan memakai latar gelap, badge, atau warna coral.
- Hover baris memakai `--muted`. Tidak ada zebra stripe, sorting affordance, atau checkbox.
- Di bawah 768px, tabel berubah menjadi daftar kartu vertikal:
  - Judul kategori 16/24 weight 600.
  - Tiga baris label/amount: `Pemasukan`, `Pengeluaran`, `Selisih`.
  - `Selisih` memakai weight 600; nilai positif memakai tinta, nilai negatif memakai `--negative`. Baris lain memakai tinta.
  - Kartu total terpisah di bawah daftar, border 1px `--foreground`, bukan baris tabel.
- Empty state menggantikan tabel, bukan berada di bawah tabel kosong.
- Untuk daftar transaksi (shared), aksi `Ubah` dan `Hapus` selalu terlihat sebagai tombol teks/outline 44px di setiap baris atau kartu. Jangan menyembunyikannya di dropdown atau hanya saat hover.

### Form (shared)

- Form transaksi (create/edit) dan edit kategori memakai halaman penuh, bukan dialog. Tambah kategori memakai form inline di halaman kategori. Max-width 640px, satu kolom.
- Jika belum ada kategori, form transaksi diganti callout `Belum ada kategori. Buat kategori terlebih dahulu sebelum mencatat transaksi.` dengan CTA `Buat Kategori`; field form disembunyikan.
- Label di atas input, 14/20 weight 500, gap 6px, terhubung via `htmlFor`/`id`. Helper 13/18 muted. Error 13/18 `--negative`, memakai `aria-invalid="true"`, dan terhubung lewat `aria-describedby`.
- Input/Select tinggi 44px, radius 8px, border 1px `--input`, padding horizontal 12px, font 16/24 (mobile minimal 16px).
- Focus: ring 2px cobalt, offset 2px. Jangan menghapus outline.
- Amount input memakai prefix `Rp` di dalam field, rata kiri, `inputMode="numeric"`. Jangan menampilkan spinner number.
- Grup radio `Jenis transaksi` dibungkus `<fieldset>` + `<legend>`; pilihan berupa dua kartu radio 44px, bukan tombol pil.
- Tombol actions: primary di kanan, `Batal` ghost di kiri. Di mobile, primary full-width dan `Batal` di bawahnya.
- Jangan memakai placeholder sebagai label. Label selalu terlihat.
- Error form-level memakai `Alert` destructive di atas field, bukan toast.

### Dialog

- Hanya untuk konfirmasi hapus. Jangan memakai dialog untuk form, filter, atau month picker.
- `Dialog` shadcn, max-width 420px, mobile `calc(100vw - 32px)`, radius 16px, padding 24px, overlay tinta 40%, shadow dialog.
- Judul 20/28 weight 600; deskripsi 14/20 muted. Footer: `Batal` outline di kiri, `Hapus` destructive di kanan.
- Fokus awal ke `Batal` (set `autoFocus` atau `onOpenAutoFocus`). Escape menutup. Fokus kembali ke tombol pemicu. Focus trap aktif.
- Untuk kategori yang masih dipakai, dialog menampilkan pesan error PRD dan tidak menutup otomatis; tombol `Hapus` disabled.
- Jangan memakai `window.confirm`, alert browser, atau sheet dari bawah.

### Banner status

- Muncul di halaman Transaksi/Kategori, bukan Dashboard. Letakkan di bawah page header dan di atas konten.
- `Alert` dengan tint `positive-soft`/`negative-soft`, border 1px 24% dari warna semantik, ikon inline 18px, teks 14/20.
- Sukses `role="status"`; error `role="alert"`.
- Tombol `Tutup` ghost 44×44 dengan `aria-label="Tutup notifikasi"`, menghapus `status`/`error` dari URL tanpa menghilangkan `month`.
- Jangan memakai toast untuk pesan yang harus bertahan setelah refresh.

### Empty state

- Berada di dalam area konten, bukan alert browser. Tidak ada tabel kosong tanpa penjelasan.
- Ikon inline 40px, stroke 1.75, warna `--muted-foreground`, tanpa lingkaran pastel.
- Judul 16/24 weight 600; deskripsi 14/20 muted; satu CTA.
- Jika page header sudah punya tombol primary, CTA empty state memakai `outline`. Jika CTA empty state adalah satu-satunya aksi di view, baru memakai `primary`. Jangan pernah ada dua tombol primary dalam satu view.
- Padding 40px 24px mobile, 48px 32px desktop. Max-width teks 42ch, centered.
- Copy persis PRD §7.6.5. Jangan menambah "Yuk", "Segera", emoji, atau tanda seru.
- Dashboard: `Belum ada kategori.` / `Belum ada transaksi di bulan ini.` dengan CTA sesuai konteks.
- Daftar kategori kosong: `Belum ada kategori.` + `Tambahkan kategori pertama Anda.`; form tambah tetap tampil.

### Loading

- `app/loading.tsx` memakai `Skeleton` ringan dengan layout yang sama agar tidak ada layout shift.
- Dashboard: tiga blok summary setinggi 128px, lalu lima baris rekap setinggi 52px. Mobile memakai tiga kartu ringkasan dan tiga kartu rekap.
- Pending bulan: picker meredup 60% dan tidak bisa diklik ganda; jangan mengganti seluruh halaman dengan spinner.
- Jangan memakai shimmer yang bergerak saat `prefers-reduced-motion`; gunakan blok statis `--muted`.
- Jangan menampilkan halaman putih kosong atau teks "Loading…" dalam bahasa Inggris.

### Error page

- `app/error.tsx` dan `app/not-found.tsx` memakai app shell yang sama dan komposisi seperti empty state: ikon inline 40px `--muted-foreground`, H1 24/32 mobile dan 30/36 desktop, deskripsi 14/20 muted, satu CTA.
- Copy persis PRD §7.6.4: `Terjadi kesalahan.` + `Silakan coba lagi.` + `Coba lagi`; 404 memakai `Halaman tidak ditemukan.` + `Halaman yang Anda cari tidak tersedia.` + `Kembali ke Dashboard`.
- Aksi utama memakai primary karena merupakan satu-satunya aksi di view: `Coba lagi` sebagai button, `Kembali ke Dashboard` sebagai tautan. Tidak ada ilustrasi, kode error internal, atau stack trace.

### Badge

- Hanya untuk jenis transaksi di daftar transaksi, bukan di Dashboard.
- Pill 22px, padding horizontal 8px, font 12/16 weight 600. Tanpa uppercase.
- `Pemasukan`: `positive-soft` + `positive`. `Pengeluaran`: `muted` + `foreground` (bukan merah; pengeluaran biasa bukan error).
- Jangan memakai badge untuk status, budget, atau kategori. Tidak ada badge di summary card.

### Navigasi

- Sidebar desktop 240px, padding 16px, item 44px, radius 8px, gap 12px. Wordmark `cash.` 18/24 weight 700 (placeholder visual; nama produk di metadata tetap `Cash Management`).
- Item aktif: `--sidebar-accent`, teks `--foreground` weight 600, ikon cobalt, border kiri 1px cobalt, dan `aria-current="page"`. Border kiri selalu 1px (transparan saat tidak aktif) agar layout tidak bergeser. Tidak ada stripe lebih dari 1px.
- Top header tablet 64px, sticky, latar solid, border bawah 1px. Nav horizontal 44px, item aktif cobalt weight 600 dengan underline 1px.
- Bottom nav mobile 64px + safe-area, tiga item, ikon 20px, label 11px. Item aktif cobalt weight 600 dengan indikator 1px di atas ikon. Jangan menyembunyikan label.
- Tidak ada search, command palette, avatar, notifikasi, atau menu profil.
- Theme toggle icon-only 44×44, `aria-label="Ganti tema"` dan `aria-pressed` sesuai mode aktif, di footer sidebar dan kanan top bar.
- Skip link `Lewati ke konten` ke `#main-content` adalah elemen fokus pertama dan terlihat saat fokus.

### Feedback, copy, dan aksesibilitas

- Bahasa Indonesia baku, ringkas, tidak kaku. Gunakan **"Anda"**; jangan memakai sapaan informal.
- Title Case untuk judul halaman, judul section, dan label tombol: `Dashboard`, `Rekap per Kategori`, `Tambah Transaksi`, `Buat Kategori`. Tautan `Lihat semua transaksi` mengikuti PRD (sentence case).
- Sentence case untuk helper, deskripsi, dan empty state.
- Istilah tetap: **Pemasukan**, **Pengeluaran**, **Saldo bulan ini**, **Selisih**, **Uraian**, **Nominal**.
- Jangan memakai "income", "expense", "balance", "budget", "cashflow", atau "transaksi terakhir" di UI.
- Contoh copy yang benar: `Ringkasan keuangan pribadi Anda.`, `Belum ada transaksi di bulan ini.`, `Catat pemasukan atau pengeluaran pertama Anda.`, `Kategori tidak dapat dihapus karena masih digunakan oleh transaksi.`
- Error menjelaskan apa yang salah dan cara memperbaikinya. Jangan menampilkan stack trace atau kode internal.
- Target WCAG 2.1 AA. Fokus selalu terlihat, target sentuh 44px, error terhubung ke field, dialog memerangkap fokus.
- Urutan tab mengikuti urutan visual; jangan memakai `tabindex` positif.
- Status tidak boleh hanya warna: sertakan teks, ikon, tanda +/−, atau label.
- Dokumen memakai `lang="id"`.
- Tabel memakai `<caption>` (boleh visually hidden), `<th scope="col">`, dan header yang jelas.
- Dialog memakai `aria-labelledby`; banner sukses `role="status"`, error `role="alert"`.
- Hormati `prefers-reduced-motion`. Uji zoom 200% dan lebar 320px tanpa horizontal scroll.

## Do's and Don'ts

### Do

- Ikuti urutan PRD: page header → month picker → tiga summary card → Rekap per Kategori → empty state.
- Gunakan satu tombol primary per view; di Dashboard, primary adalah `Tambah Transaksi`.
- Gunakan `Saldo bulan ini` sebagai satu-satunya feature card dengan garis coral 1px.
- Gunakan border 1px, radius 12px untuk kartu, dan whitespace untuk hierarki.
- Gunakan `tabular-nums` dan format `id-ID`; amount rata kanan di tabel, sedangkan summary card tetap rata kiri.
- Gunakan Geist Sans untuk UI dan angka; jangan memakai mono untuk nominal.
- Gunakan "Anda", Title Case untuk label, dan sentence case untuk helper.
- Jelaskan masalah dan pemulihannya di error; pertahankan input saat validasi gagal.
- Bangun semua state: hover, focus, active, disabled, loading, empty, error, pending.
- Uji mode terang dan gelap, 375–1440px, serta zoom 200%.
- Atur permukaan browser: selection, caret, scrollbar, focus ring, underline offset.
- Pertahankan satu sumber kebenaran token di `globals.css`; komponen membaca variable.
- Gunakan inline SVG 18–20px untuk ikon UI; ikon empty/error state 40px, stroke 1.75–2.

### Don't

- Jangan menambahkan chart, donut, sparkline, progress bar, budget, dompet, saldo awal, atau ringkasan tahunan.
- Jangan menambahkan warna atau ikon kategori. Kategori hanya punya nama.
- Jangan menambahkan pencarian, filter, pagination, sorting yang dapat diklik, atau tab.
- Jangan memakai gradient, glassmorphism, glow, neon, 3D coin, atau ilustrasi stok.
- Jangan menaruh eyebrow/kicker di atas H1. Heading harus berdiri sendiri.
- Jangan membuat hero metric card berisi angka besar + label kecil + sparkline + statistik pendukung.
- Jangan memberi shadow pada card. Shadow hanya untuk popover dan dialog.
- Jangan memakai border kiri/kanan berwarna lebih dari 1px pada kartu, list, atau alert.
- Jangan memakai blur pada kartu, top bar, atau sidebar; blur hanya untuk overlay dialog.
- Jangan memakai coral untuk tombol, error, pengeluaran, badge, atau teks. Coral adalah garis sinyal.
- Jangan memakai merah untuk pengeluaran biasa, atau hijau untuk hal yang bukan pemasukan/sukses.
- Jangan memakai tile kategori dengan latar warna saturasi penuh.
- Jangan memakai pill untuk semua komponen. Pill hanya untuk badge.
- Jangan memakai body di bawah 16px, label di bawah 11px, amount uppercase, atau body all-caps. Skala 12px hanya untuk header tabel dan badge.
- Jangan menampilkan desimal untuk IDR atau mencampur format penuh dan kompak dalam satu tabel.
- Jangan memakai count-up, confetti, parallax, autoplay, atau animasi berulang.
- Jangan memakai dark pattern: opsi tercentang otomatis, tombol batal yang disembunyikan, atau copy menyesatkan.
- Jangan memakai `#000000` atau `#FFFFFF` di dark mode.
- Jangan membuat tabel yang di-scroll horizontal di mobile; ubah menjadi kartu.
- Jangan menambahkan dependency baru di luar shadcn/ui dan primitif Radix yang dibawanya.

---

## Implementation notes

Token lengkap ada di front matter. Di Tailwind 4, petakan ke `@theme inline` agar utility seperti `bg-background`, `text-foreground`, `border-border`, `bg-brand`, dan `text-positive` tersedia.

```css
@import "tailwindcss";
@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.970 0.008 91.5);
  --foreground: oklch(0.210 0.008 274.5);
  --card: oklch(0.997 0.004 91.4);
  --card-foreground: oklch(0.210 0.008 274.5);
  --popover: oklch(1.000 0.000 89.9);
  --popover-foreground: oklch(0.210 0.008 274.5);
  --primary: oklch(0.511 0.263 266.4);
  --primary-foreground: oklch(1.000 0.000 89.9);
  --secondary: oklch(0.932 0.013 86.8);
  --secondary-foreground: oklch(0.210 0.008 274.5);
  --muted: oklch(0.950 0.010 87.5);
  --muted-foreground: oklch(0.516 0.013 280.3);
  --accent: oklch(0.947 0.012 84.6);
  --accent-foreground: oklch(0.210 0.008 274.5);
  --destructive: oklch(0.500 0.182 29.5);
  --destructive-foreground: oklch(1.000 0.000 89.9);
  --border: oklch(0.901 0.013 86.8);
  --input: oklch(0.634 0.015 88.7);
  --ring: oklch(0.511 0.263 266.4);
  --sidebar: oklch(0.956 0.010 87.5);
  --sidebar-foreground: oklch(0.210 0.008 274.5);
  --sidebar-primary: oklch(0.511 0.263 266.4);
  --sidebar-primary-foreground: oklch(1.000 0.000 89.9);
  --sidebar-accent: oklch(0.932 0.013 86.8);
  --sidebar-accent-foreground: oklch(0.210 0.008 274.5);
  --sidebar-border: oklch(0.901 0.013 86.8);
  --sidebar-ring: oklch(0.511 0.263 266.4);
  --brand: oklch(0.661 0.191 33.2);
  --positive: oklch(0.514 0.106 164.3);
  --positive-soft: oklch(0.952 0.021 166.1);
  --negative: oklch(0.500 0.182 29.5);
  --negative-soft: oklch(0.943 0.022 27.8);
  --warning: oklch(0.524 0.111 74.7);
  --warning-soft: oklch(0.965 0.036 83.8);
  --feature: oklch(0.210 0.008 274.5);
  --feature-foreground: oklch(0.970 0.008 91.5);
  --feature-muted: oklch(0.768 0.015 84.6);
  --feature-negative: oklch(0.759 0.144 26.1);
  --divider: oklch(0.901 0.013 86.8);
  --radius: 0.5rem;
}

.dark {
  --background: oklch(0.178 0.006 271.0);
  --foreground: oklch(0.955 0.008 91.5);
  --card: oklch(0.210 0.010 276.6);
  --card-foreground: oklch(0.955 0.008 91.5);
  --popover: oklch(0.232 0.012 278.0);
  --popover-foreground: oklch(0.955 0.008 91.5);
  --primary: oklch(0.620 0.205 270.8);
  --primary-foreground: oklch(0.159 0.011 268.0);
  --secondary: oklch(0.265 0.012 271.0);
  --secondary-foreground: oklch(0.955 0.008 91.5);
  --muted: oklch(0.245 0.011 278.0);
  --muted-foreground: oklch(0.730 0.013 281.0);
  --accent: oklch(0.278 0.015 274.3);
  --accent-foreground: oklch(0.955 0.008 91.5);
  --destructive: oklch(0.712 0.181 22.8);
  --destructive-foreground: oklch(0.172 0.027 24.3);
  --border: oklch(0.294 0.013 272.9);
  --input: oklch(0.508 0.016 272.5);
  --ring: oklch(0.681 0.169 275.0);
  --sidebar: oklch(0.159 0.007 271.0);
  --sidebar-foreground: oklch(0.955 0.008 91.5);
  --sidebar-primary: oklch(0.755 0.126 276.0);
  --sidebar-primary-foreground: oklch(0.159 0.011 268.0);
  --sidebar-accent: oklch(0.236 0.014 272.7);
  --sidebar-accent-foreground: oklch(0.955 0.008 91.5);
  --sidebar-border: oklch(0.270 0.013 272.9);
  --sidebar-ring: oklch(0.681 0.169 275.0);
  --brand: oklch(0.729 0.169 34.1);
  --positive: oklch(0.806 0.157 160.0);
  --positive-soft: oklch(0.299 0.047 166.1);
  --negative: oklch(0.759 0.144 26.1);
  --negative-soft: oklch(0.265 0.052 24.8);
  --warning: oklch(0.837 0.164 84.4);
  --warning-soft: oklch(0.297 0.052 81.4);
  --feature: oklch(0.265 0.055 270.6);
  --feature-foreground: oklch(0.955 0.008 91.5);
  --feature-muted: oklch(0.788 0.058 274.0);
  --feature-negative: oklch(0.759 0.144 26.1);
  --divider: oklch(0.294 0.013 272.9);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-brand: var(--brand);
  --color-positive: var(--positive);
  --color-positive-soft: var(--positive-soft);
  --color-negative: var(--negative);
  --color-negative-soft: var(--negative-soft);
  --color-warning: var(--warning);
  --color-warning-soft: var(--warning-soft);
  --color-feature: var(--feature);
  --color-feature-foreground: var(--feature-foreground);
  --color-feature-muted: var(--feature-muted);
  --color-feature-negative: var(--feature-negative);
  --color-divider: var(--divider);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --radius-sm: 0.375rem; /* 6px */
  --radius-md: 0.5rem;   /* 8px: kontrol */
  --radius-lg: 0.75rem;  /* 12px: card */
  --radius-xl: 1rem;     /* 16px: dialog */
}
```

- Petakan radius secara eksplisit: Button/Input/Select trigger `rounded-md` (8px); Card, Popover, dan Select content `rounded-lg` (12px); Dialog `rounded-xl` (16px). Jangan mengandalkan default shadcn yang memakai `rounded-xl` untuk Card dan `rounded-lg` untuk Dialog.
- Hapus `shadow-sm` dari Card. Batasi Dialog ke `max-width: 420px` dan set fokus awal ke tombol `Batal`.
- Gunakan `Geist Sans` dari `next/font/google` atau package `geist` yang sudah tersedia; pertahankan variabel `--font-geist-sans`. Jangan mengganti ke font lain.
- Inisialisasi shadcn/ui dengan `cssVariables: true`. Jangan menimpa token di level komponen.
- Pasang `dark` class strategy. Script inline di `<head>` membaca `localStorage.getItem("theme") === "dark"` dan menambahkan `.dark` sebelum paint. Toggle menulis preferensi dan mengganti kelas; tidak ada `prefers-color-scheme` otomatis.
- Jangan menambahkan `next-themes`, state manager, date library, chart library, atau icon package. Jika `shadcn init` menambahkan `lucide-react`, hapus; ikon memakai inline SVG. Helper tanggal dan uang tetap internal sesuai PRD §7.7.4.
- Mulai dari komponen shadcn yang ada; jangan menulis ulang primitif dari nol. Tetapi jangan mengimpor komponen yang tidak dipakai.
- Theme semua state dengan token yang sama; jangan membuat hex baru untuk hover, disabled, atau error.
- Sebelum dianggap selesai: kedua mode terlihat disengaja, semua state ada, 375px tidak horizontal scroll, kontras lolos, angka terformat `id-ID`, dan fokus selalu terlihat.

