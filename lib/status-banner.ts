export type BannerTone = "success" | "error";

export interface BannerMessage {
  tone: BannerTone;
  message: string;
}

type QueryValue = string | string[] | null | undefined;

export interface BannerParams {
  status?: QueryValue;
  error?: QueryValue;
}

const TRANSACTION_STATUS: Record<string, string> = {
  created: "Transaksi berhasil disimpan.",
  updated: "Perubahan transaksi berhasil disimpan.",
  deleted: "Transaksi berhasil dihapus.",
};

const CATEGORY_STATUS: Record<string, string> = {
  created: "Kategori berhasil ditambahkan.",
  updated: "Nama kategori berhasil diperbarui.",
  deleted: "Kategori berhasil dihapus.",
};

const CATEGORY_IN_USE =
  "Kategori tidak dapat dihapus karena masih digunakan oleh transaksi. Hapus atau ubah transaksi tersebut terlebih dahulu.";

function first(value: QueryValue): string | undefined {
  return Array.isArray(value) ? value[0] : value ?? undefined;
}

export function getTransactionBanner(
  params: BannerParams,
): BannerMessage | null {
  const status = first(params.status);
  const message = status ? TRANSACTION_STATUS[status] : undefined;

  return message ? { tone: "success", message } : null;
}

export function getCategoryBanner(params: BannerParams): BannerMessage | null {
  if (first(params.error) === "category-in-use") {
    return { tone: "error", message: CATEGORY_IN_USE };
  }

  const status = first(params.status);
  const message = status ? CATEGORY_STATUS[status] : undefined;

  return message ? { tone: "success", message } : null;
}
