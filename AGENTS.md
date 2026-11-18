<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Arsitektur

Baca [`docs/ARCHITECHTURE.md`](docs/ARCHITECHTURE.md) sebelum menulis kode. Dokumen tersebut adalah acuan tunggal untuk route group (`(auth)` dan `(core)`), struktur folder, aturan penempatan halaman/fitur, serta proteksi route dan sesi. Semua halaman, fitur, komponen, dan Server Action baru wajib mengikuti dokumen tersebut.

## Desain

Referensi desain dan sistem visual terdokumentasi di [`docs/DESIGN.md`](docs/DESIGN.md). Dokumen tersebut adalah acuan untuk warna, tipografi, spacing, komponen, state, motion, dan aksesibilitas. Baca dokumen tersebut sebelum membuat atau mengubah UI, dan jangan menambahkan pola visual di luar ketentuannya.
