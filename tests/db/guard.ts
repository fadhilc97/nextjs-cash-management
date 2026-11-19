import "dotenv/config";

export function assertDatabaseTestsAllowed() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("test:db tidak boleh berjalan dengan NODE_ENV=production.");
  }

  if (process.env.ALLOW_DB_TESTS !== "1") {
    throw new Error(
      "test:db diblokir. Set ALLOW_DB_TESTS=1 hanya untuk database development.",
    );
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL tidak diset. Isi database development di .env sebelum menjalankan test:db.",
    );
  }
}
