"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getActiveNav, type NavKey } from "@/lib/nav";

type NavVariant = "sidebar" | "tablet" | "mobile";

interface NavItem {
  key: NavKey;
  href: string;
  label: string;
  icon: () => ReactNode;
}

const ITEMS: NavItem[] = [
  {
    key: "dashboard",
    href: "/",
    label: "Dashboard",
    icon: () => (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    key: "transactions",
    href: "/transactions",
    label: "Transaksi",
    icon: () => (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M4 7h15M15 3l4 4-4 4M20 17H5M9 13l-4 4 4 4" />
      </svg>
    ),
  },
  {
    key: "categories",
    href: "/categories",
    label: "Kategori",
    icon: () => (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6Z" />
        <circle cx="8" cy="8" r="1.25" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const NAV_CLASS: Record<NavVariant, string> = {
  sidebar: "",
  tablet: "",
  mobile: "h-full",
};

const LIST_CLASS: Record<NavVariant, string> = {
  sidebar: "flex flex-col gap-1",
  tablet: "flex items-center gap-1",
  mobile: "grid h-full grid-cols-3",
};

const LINK_CLASS: Record<NavVariant, string> = {
  sidebar:
    "flex h-11 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar focus-visible:outline-none",
  tablet:
    "relative flex h-11 items-center gap-2 px-3 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
  mobile:
    "relative flex h-full flex-col items-center justify-center gap-1 text-[11px] leading-none text-muted-foreground transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
};

const ACTIVE_CLASS: Record<NavVariant, string> = {
  sidebar:
    "bg-sidebar-accent font-semibold text-sidebar-accent-foreground [&_svg]:text-primary",
  tablet:
    "font-semibold text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-px after:bg-primary",
  mobile:
    "font-semibold text-primary before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-primary",
};

export function NavLinks({ variant = "sidebar" }: { variant?: NavVariant }) {
  const pathname = usePathname();
  const active = getActiveNav(pathname);

  return (
    <nav aria-label="Navigasi utama" className={NAV_CLASS[variant]}>
      <ul className={LIST_CLASS[variant]}>
        {ITEMS.map((item) => {
          const isActive = active === item.key;
          const Icon = item.icon;

          return (
            <li key={item.key} className={variant === "mobile" ? "h-full" : ""}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  LINK_CLASS[variant],
                  isActive && ACTIVE_CLASS[variant],
                )}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
