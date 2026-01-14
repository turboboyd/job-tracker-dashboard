import React, { useId } from "react";

import { classNames } from "src/shared/lib";

type FieldRenderProps = {
  id: string;
  describedBy?: string;
  invalid: boolean;
  errorId?: string;
  hintId?: string;
};

type Props = {
  label: string;
  required?: boolean;

  error?: string;
  hint?: string;

  htmlFor?: string;

  children: React.ReactNode | ((p: FieldRenderProps) => React.ReactNode);
};

export function FormField({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
}: Props) {
  const autoId = useId();
  const id = htmlFor ?? `field-${autoId}`;

  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const invalid = Boolean(error);

  return (
    <div>
      <label className="mb-1 block text-sm text-muted-foreground" htmlFor={id}>
        {label} {required ? <span className="text-destructive">*</span> : null}
      </label>

      <div className={classNames(error ? "rounded-xl" : "")}>
        {typeof children === "function"
          ? children({ id, describedBy, invalid, errorId, hintId })
          : children}
      </div>

      {hint ? (
        <div id={hintId} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </div>
      ) : null}

      {error ? (
        <div
          id={errorId}
          className="mt-1 text-xs text-destructive"
          role="alert"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
