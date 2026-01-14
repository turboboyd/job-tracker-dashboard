import type { FormikErrors, FormikTouched } from "formik";

export function getFieldError<T>(
  name: keyof T,
  touched: FormikTouched<T>,
  errors: FormikErrors<T>
): string | undefined {
  const isTouched = Boolean(touched[name]);
  const err = errors[name];
  if (!isTouched) return undefined;
  return typeof err === "string" ? err : undefined;
}
