import { useMemo } from "react";

import type { DateFormat } from "src/app/store/userSettings";
import { classNames } from "src/shared/lib";
import { Button } from "src/shared/ui/Button/Button";
import { FormField } from "src/shared/ui/Form/FormField/FormField";

function formatNowPreview(dateFormat: DateFormat): string {
  const d = new Date();
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  if (dateFormat === "DD.MM.YYYY") return `${dd}.${mm}.${yyyy}`;
  if (dateFormat === "MM/DD/YYYY") return `${mm}/${dd}/${yyyy}`;
  return `${yyyy}-${mm}-${dd}`;
}

type Props = {
  value: DateFormat;
  disabled: boolean;
  onChange: (fmt: DateFormat) => void;
};

export function DateFormatField({ value, disabled, onChange }: Props) {
  const preview = useMemo(() => formatNowPreview(value), [value]);

  return (
    <FormField label="Date format" hint={`Preview: ${preview}`} required>
      {() => (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(
            ["DD.MM.YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] as DateFormat[]
          ).map((fmt) => {
            const selected = value === fmt;
            return (
              <Button
                key={fmt}
                variant={selected ? "default" : "outline"}
                shadow="sm"
                className={classNames("h-auto py-3 flex-col items-start")}
                onClick={() => onChange(fmt)}
                disabled={disabled}
              >
                <div className="text-sm font-semibold">{fmt}</div>
                <div
                  className={classNames(
                    "mt-1 text-xs",
                    selected
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  {fmt === "DD.MM.YYYY"
                    ? "29.01.2026"
                    : fmt === "MM/DD/YYYY"
                      ? "01/29/2026"
                      : "2026-01-29"}
                </div>
              </Button>
            );
          })}
        </div>
      )}
    </FormField>
  );
}
