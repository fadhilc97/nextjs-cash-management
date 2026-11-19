import { describe, expect, it } from "vitest";

import { getAuthRedirect } from "@/lib/auth/routing";

describe("auth redirects", () => {
  it("sends unauthenticated users from core routes to login", () => {
    expect(getAuthRedirect("/", false)).toBe("/login");
    expect(getAuthRedirect("/transactions", false)).toBe("/login");
    expect(getAuthRedirect("/categories", false)).toBe("/login");
  });

  it("keeps unauthenticated users on the auth pages", () => {
    expect(getAuthRedirect("/login", false)).toBeNull();
    expect(getAuthRedirect("/signup", false)).toBeNull();
  });

  it("sends authenticated users away from the auth pages", () => {
    expect(getAuthRedirect("/login", true)).toBe("/");
    expect(getAuthRedirect("/signup", true)).toBe("/");
  });

  it("allows authenticated users to stay on core routes", () => {
    expect(getAuthRedirect("/", true)).toBeNull();
    expect(getAuthRedirect("/transactions", true)).toBeNull();
    expect(getAuthRedirect("/categories", true)).toBeNull();
  });

  it("normalizes a trailing slash before deciding", () => {
    expect(getAuthRedirect("/login/", true)).toBe("/");
    expect(getAuthRedirect("/signup/", false)).toBeNull();
  });
});
