import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ControlProps = {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

interface FieldProps {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({
  id,
  label,
  helper,
  error,
  required,
  className,
  children,
}: FieldProps) {
  const describedBy = error ? `${id}-error` : helper ? `${id}-helper` : undefined;
  const control = isValidElement<ControlProps>(children)
    ? cloneElement(children as ReactElement<ControlProps>, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })
    : children;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-negative">
            *
          </span>
        ) : null}
      </Label>
      {control}
      {error ? (
        <p
          id={`${id}-error`}
          className="text-[13px] leading-[18px] font-medium text-negative"
        >
          {error}
        </p>
      ) : helper ? (
        <p
          id={`${id}-helper`}
          className="text-[13px] leading-[18px] text-muted-foreground"
        >
          {helper}
        </p>
      ) : null}
    </div>
  );
}
