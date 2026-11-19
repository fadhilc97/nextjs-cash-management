"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  formatMonthLabel,
  isValidMonth,
  shiftMonth,
} from "@/lib/month";
import { buildMonthUrl } from "@/lib/month-url";
import { cn } from "@/lib/utils";

const MIN_MONTH = "2000-01";

const MONTH_NAMES = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat("id-ID", {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, index, 1))),
);

function ChevronLeftIcon() {
  return (
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

interface MonthPickerProps {
  /** Active month in `YYYY-MM`, already resolved by the page. */
  month: string;
  /** Latest selectable month in `YYYY-MM`, normally the current Jakarta month. */
  maxMonth: string;
}

export function MonthPicker({ month, maxMonth }: MonthPickerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const activeMonth = isValidMonth(month) ? month : maxMonth;
  const year = Number(activeMonth.slice(0, 4));
  const monthNumber = Number(activeMonth.slice(5, 7));

  const minYear = Number(MIN_MONTH.slice(0, 4));
  const maxYear = Number(maxMonth.slice(0, 4));
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, index) => maxYear - index,
  );

  function navigate(nextMonth: string) {
    if (pending || nextMonth === activeMonth) {
      return;
    }

    if (nextMonth < MIN_MONTH || nextMonth > maxMonth) {
      return;
    }

    startTransition(() => {
      router.push(buildMonthUrl(pathname, nextMonth));
    });
  }

  function selectMonth(nextMonthNumber: number) {
    if (!Number.isInteger(nextMonthNumber)) {
      return;
    }

    const candidate = `${year}-${String(nextMonthNumber).padStart(2, "0")}`;
    navigate(candidate);
  }

  function selectYear(nextYear: number) {
    if (!Number.isInteger(nextYear)) {
      return;
    }

    const candidate = `${nextYear}-${String(monthNumber).padStart(2, "0")}`;
    navigate(candidate > maxMonth ? maxMonth : candidate);
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 transition-opacity duration-150",
        pending && "opacity-60",
      )}
      aria-busy={pending}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Bulan sebelumnya"
        disabled={pending || activeMonth <= MIN_MONTH}
        onClick={() => navigate(shiftMonth(activeMonth, -1, { min: MIN_MONTH }))}
      >
        <ChevronLeftIcon />
      </Button>

      <div className="flex min-w-0 items-center gap-2">
        <label className="sr-only" htmlFor="month-picker-month">
          Bulan
        </label>
        <select
          id="month-picker-month"
          value={String(monthNumber)}
          disabled={pending}
          onChange={(event) => selectMonth(Number(event.target.value))}
          className="h-11 rounded-md border border-input bg-card px-3 text-base font-semibold text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          {MONTH_NAMES.map((name, index) => {
            const value = index + 1;
            const candidate = `${year}-${String(value).padStart(2, "0")}`;

            return (
              <option
                key={name}
                value={String(value)}
                disabled={candidate > maxMonth}
              >
                {name}
              </option>
            );
          })}
        </select>

        <label className="sr-only" htmlFor="month-picker-year">
          Tahun
        </label>
        <select
          id="month-picker-year"
          value={String(year)}
          disabled={pending}
          onChange={(event) => selectYear(Number(event.target.value))}
          className="h-11 rounded-md border border-input bg-card px-3 text-base font-semibold text-foreground tabular-nums outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          {years.map((optionYear) => (
            <option key={optionYear} value={String(optionYear)}>
              {optionYear}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Bulan berikutnya"
        disabled={pending || activeMonth >= maxMonth}
        onClick={() => navigate(shiftMonth(activeMonth, 1, { max: maxMonth }))}
      >
        <ChevronRightIcon />
      </Button>

      <span className="sr-only" aria-live="polite">
        {formatMonthLabel(activeMonth)}
      </span>
    </div>
  );
}
