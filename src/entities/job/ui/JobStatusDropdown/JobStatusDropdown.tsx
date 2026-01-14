import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";

import { JOB_STATUSES } from "src/entities/job/model/constants";
import type { JobStatus } from "src/entities/job/model/types";
import { Button } from "src/shared/ui";

type Mode = "read" | "edit";

type Props = {
  value: JobStatus | null | undefined;

  /** read = только показать, edit = можно менять */
  mode?: Mode;

  /** вызывается при выборе статуса (только в edit) */
  onChange?: (next: JobStatus) => void;

  /** блокировка во время запроса */
  disabled?: boolean;

  /** компактный вид (например для dashboard) */
  size?: "sm" | "md";
};

function labelOf(status: JobStatus) {
  return status.toUpperCase();
}

export function JobStatusDropdown({
  value,
  mode = "read",
  onChange,
  disabled = false,
  size = "sm",
}: Props) {
  const current = value ?? null;

  // просто плашка, без клика (read режим)
  if (mode === "read") {
    return (
      <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-foreground">
        {current ? labelOf(current) : "—"}
      </span>
    );
  }

  // edit режим => dropdown
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          size={size === "sm" ? "sm" : "default"}
          shape="pill"
          disabled={disabled}
        >
          {current ? labelOf(current) : "SET STATUS"}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-50 min-w-[180px] rounded-xl border border-border bg-card p-1 shadow"
        >
          {JOB_STATUSES.map((s) => {
            const active = s === current;

            return (
              <DropdownMenu.Item
                key={s}
                onSelect={() => onChange?.(s)}
                className={[
                  "flex cursor-pointer items-center justify-between gap-2",
                  "rounded-lg px-3 py-2 text-sm text-foreground",
                  "outline-none",
                  "hover:bg-muted focus:bg-muted",
                ].join(" ")}
              >
                <span>{labelOf(s)}</span>
                {active ? (
                  <span className="text-xs text-muted-foreground">Selected</span>
                ) : null}
              </DropdownMenu.Item>
            );
          })}

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          <DropdownMenu.Item
            onSelect={(e) => e.preventDefault()}
            className="px-3 py-2 text-xs text-muted-foreground outline-none"
          >
            Click to change status
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
