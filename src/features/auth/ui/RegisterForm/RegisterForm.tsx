import { Formik } from "formik";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { normalizeError, useAuth } from "src/shared/lib";
import { Button, FormField, InlineError, Input } from "src/shared/ui";

import { GoogleSignInButton } from "../GoogleSignInButton/GoogleSignInButton";

export type RegisterFormProps = {
  onSuccess: (from: string) => void;
};

type RegisterValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type FirebaseAuthError = {
  code?: string;
  message?: string;
};

function mapFirebaseAuthError(e: unknown, t: (key: string) => string): string {
  if (typeof e === "object" && e !== null) {
    const err = e as FirebaseAuthError;
    switch (err.code) {
      case "auth/invalid-email":
        return t("auth.errors.invalidEmail");
      case "auth/email-already-in-use":
        return t("auth.errors.emailAlreadyInUse");
      case "auth/weak-password":
        return t("auth.errors.weakPassword");
      case "auth/too-many-requests":
        return t("auth.errors.tooManyRequests");
      case "auth/network-request-failed":
        return t("auth.errors.network");
      default:
        if (typeof err.message === "string" && err.message.trim().length > 0) {
          return err.message;
        }
        break;
    }
  }

  return normalizeError(e);
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { signUpWithEmail } = useAuth();

  const initialValues = useMemo<RegisterValues>(
    () => ({ email: "", password: "", confirmPassword: "" }),
    []
  );

  const schema = useMemo<Yup.ObjectSchema<RegisterValues>>(
    () =>
      Yup.object({
        email: Yup.string()
          .trim()
          .email(t("auth.validation.emailInvalid"))
          .required(t("auth.validation.emailRequired")),
        password: Yup.string()
          .min(6, t("auth.validation.passwordMin"))
          .required(t("auth.validation.passwordRequired")),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], t("auth.validation.passwordsMustMatch"))
          .required(t("auth.validation.confirmPasswordRequired")),
      }),
    [t]
  );

  return (
    <div className="space-y-4">
      <GoogleSignInButton onSuccess={(from) => onSuccess(from)} onError={() => {}} />

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-2 text-xs text-muted-foreground">{t("auth.or")}</span>
        </div>
      </div>

      <Formik<RegisterValues>
        initialValues={initialValues}
        validationSchema={schema}
        validateOnBlur
        validateOnChange={false}
        onSubmit={async (values, helpers) => {
          helpers.setStatus(undefined);

          try {
            await signUpWithEmail(values.email.trim(), values.password);
            onSuccess("");
          } catch (e) {
            helpers.setStatus(mapFirebaseAuthError(e, t));
          }
        }}
      >
        {(f) => {
          const commonError = typeof f.status === "string" ? f.status : undefined;
          const disabled = f.isSubmitting;

          return (
            <form onSubmit={f.handleSubmit} className="space-y-4">
              {commonError ? <InlineError message={commonError} /> : null}

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  label={t("auth.email")}
                  required
                  error={f.touched.email ? (f.errors.email as string | undefined) : undefined}
                >
                  {({ id, describedBy, invalid }) => (
                    <Input
                      id={id}
                      name="email"
                      value={f.values.email}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                      placeholder="you@example.com"
                      state={invalid ? "error" : "default"}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      disabled={disabled}
                      autoComplete="email"
                      inputMode="email"
                    />
                  )}
                </FormField>

                <FormField
                  label={t("auth.password")}
                  required
                  error={f.touched.password ? (f.errors.password as string | undefined) : undefined}
                >
                  {({ id, describedBy, invalid }) => (
                    <Input
                      id={id}
                      name="password"
                      type="password"
                      value={f.values.password}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                      placeholder="••••••••"
                      state={invalid ? "error" : "default"}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      disabled={disabled}
                      autoComplete="new-password"
                    />
                  )}
                </FormField>

                <FormField
                  label={t("auth.confirmPassword")}
                  required
                  error={
                    f.touched.confirmPassword
                      ? (f.errors.confirmPassword as string | undefined)
                      : undefined
                  }
                >
                  {({ id, describedBy, invalid }) => (
                    <Input
                      id={id}
                      name="confirmPassword"
                      type="password"
                      value={f.values.confirmPassword}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                      placeholder="••••••••"
                      state={invalid ? "error" : "default"}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      disabled={disabled}
                      autoComplete="new-password"
                    />
                  )}
                </FormField>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" variant="default" shadow="sm" shape="lg" disabled={disabled}>
                  {disabled ? t("auth.creatingAccount") : t("auth.createAccount")}
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">{t("auth.passwordHint")}</div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
