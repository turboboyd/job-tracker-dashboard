import React, { useMemo } from "react";

import type { DateFormat } from "src/app/store/userSettings";
import { Button } from "src/shared/ui/Button/Button";

import { DateFormatField } from "./DateFormatField";
import { TimeZoneField } from "./TimeZoneField";

export type TimeZoneOption = { value: string; label: string };

type Props = {
  timeZone: string;
  timeZoneOptions: ReadonlyArray<TimeZoneOption>;
  dateFormat: DateFormat;

  disabled: boolean;
  isSaving: boolean;
  hasChanges: boolean;

  onTimeZoneChange: (v: string) => void;
  onDateFormatChange: (fmt: DateFormat) => void;

  onReset: () => void;
  onSave: () => void;

  errorMessage?: string | null;
};

export function PreferencesSection({
  timeZone,
  timeZoneOptions,
  dateFormat,
  disabled,
  isSaving,
  hasChanges,
  onTimeZoneChange,
  onDateFormatChange,
  onReset,
  onSave,
  errorMessage,
}: Props) {
  const saveDisabled = disabled || isSaving || !hasChanges;
  const resetDisabled = disabled || isSaving || !hasChanges;

  const footerHint = useMemo(() => {
    if (disabled) return "Sign in to edit preferences.";
    if (!hasChanges) return "No changes yet.";
    return "Unsaved changes.";
  }, [disabled, hasChanges]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <TimeZoneField
          value={timeZone}
          options={timeZoneOptions}
          disabled={disabled || isSaving}
          onChange={onTimeZoneChange}
        />

        <DateFormatField
          value={dateFormat}
          disabled={disabled || isSaving}
          onChange={onDateFormatChange}
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="text-xs text-muted-foreground">{footerHint}</div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            shadow="sm"
            disabled={resetDisabled}
            onClick={onReset}
          >
            Reset
          </Button>

          <Button
            variant="default"
            shadow="sm"
            disabled={saveDisabled}
            onClick={onSave}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-foreground">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
