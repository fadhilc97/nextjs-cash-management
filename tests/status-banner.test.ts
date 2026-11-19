import { describe, expect, it } from "vitest";

import { getCategoryBanner, getTransactionBanner } from "@/lib/status-banner";

describe("transaction status banner", () => {
  it("maps every known transaction success code", () => {
    expect(getTransactionBanner({ status: "created" })).toEqual({
      tone: "success",
      message: "Transaksi berhasil disimpan.",
    });
    expect(getTransactionBanner({ status: "updated" })).toEqual({
      tone: "success",
      message: "Perubahan transaksi berhasil disimpan.",
    });
    expect(getTransactionBanner({ status: "deleted" })).toEqual({
      tone: "success",
      message: "Transaksi berhasil dihapus.",
    });
  });

  it("ignores unknown codes", () => {
    expect(getTransactionBanner({ status: "archived" })).toBeNull();
    expect(
      getTransactionBanner({ error: "category-in-use" }),
    ).toBeNull();
  });
});

describe("category status banner", () => {
  it("maps every known category success code", () => {
    expect(getCategoryBanner({ status: "created" })).toEqual({
      tone: "success",
      message: "Kategori berhasil ditambahkan.",
    });
    expect(getCategoryBanner({ status: "updated" })).toEqual({
      tone: "success",
      message: "Nama kategori berhasil diperbarui.",
    });
    expect(getCategoryBanner({ status: "deleted" })).toEqual({
      tone: "success",
      message: "Kategori berhasil dihapus.",
    });
  });

  it("maps the category-in-use error", () => {
    expect(getCategoryBanner({ error: "category-in-use" })).toEqual({
      tone: "error",
      message:
        "Kategori tidak dapat dihapus karena masih digunakan oleh transaksi. Hapus atau ubah transaksi tersebut terlebih dahulu.",
    });
  });

  it("ignores codes that belong to other pages", () => {
    expect(getCategoryBanner({ status: "archived" })).toBeNull();
    expect(getCategoryBanner({ error: "transaction-not-found" })).toBeNull();
  });

  it("prioritises a valid error over a valid status", () => {
    expect(
      getCategoryBanner({ status: "deleted", error: "category-in-use" }),
    ).toEqual({
      tone: "error",
      message:
        "Kategori tidak dapat dihapus karena masih digunakan oleh transaksi. Hapus atau ubah transaksi tersebut terlebih dahulu.",
    });
  });
});
