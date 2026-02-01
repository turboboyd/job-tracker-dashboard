import { Formik } from "formik";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuthActions, useAuthSelectors } from "src/app/store/auth";
import { Button, Input } from "src/shared/ui";

import { mapFirebaseAuthError } from "../../lib/firebaseAuthErrors";
import { createLoginSchema, type LoginValues } from "../../model/validation";

export type EmailPasswordAuthFormProps = {
  onSuccess?: () => void;
};

type AuthMode = "signin" | "signup";

const initialValues: LoginValues = { email: "", password: "" };

export const EmailPasswordAuthForm: React.FC<EmailPasswordAuthFormProps> = ({
  onSuccess,
}) => {
  const { t } = useTranslation();

  const { signInWithEmail, signUpWithEmail, clearAuthError } = useAuthActions();
  const { isLoading, error } = useAuthSelectors();

  const [mode, setMode] = useState<AuthMode>("signin");

  const schema = useMemo(() => createLoginSchema(t), [t]);

  const errorText = error
    ? mapFirebaseAuthError(
        error,
        t,
        {
          "auth/invalid-credential": "auth.errors.wrongPassword",
          "auth/wrong-password": "auth.errors.wrongPassword",
          "auth/user-not-found": "auth.errors.userNotFound",
          "auth/email-already-in-use": "auth.errors.emailAlreadyInUse",
          "auth/weak-password": "auth.errors.weakPassword",
        },
        mode === "signup" ? "auth.errors.signupGeneric" : "auth.errors.signinGeneric",
      )
    : null;

  return (
    <div className="space-y-3">
      <Formik<LoginValues>
        initialValues={initialValues}
        validationSchema={schema}
        validateOnBlur
        validateOnChange={false}
        onSubmit={async (values, helpers) => {
          clearAuthError();
          helpers.setSubmitting(true);

          try {
            const email = values.email.trim();
            const password = values.password;

            if (mode === "signin") {
              await signInWithEmail(email, password);
            } else {
              await signUpWithEmail(email, password);
            }

            onSuccess?.();
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t("auth.email")}
              </label>
              <Input
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="name@example.com"
                autoComplete="email"
                inputMode="email"
                aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
                aria-describedby={
                  formik.touched.email && formik.errors.email ? "email-error" : undefined
                }
              />
              {formik.touched.email && formik.errors.email ? (
                <div id="email-error" className="text-xs text-destructive">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t("auth.password")}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                aria-invalid={Boolean(formik.touched.password && formik.errors.password)}
                aria-describedby={
                  formik.touched.password && formik.errors.password
                    ? "password-error"
                    : undefined
                }
              />
              {formik.touched.password && formik.errors.password ? (
                <div id="password-error" className="text-xs text-destructive">
                  {formik.errors.password}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">{t("auth.passwordHint")}</p>
              )}
            </div>

            <Button className="w-full" type="submit" disabled={formik.isSubmitting || isLoading}>
              {formik.isSubmitting || isLoading
                ? mode === "signin"
                  ? t("auth.emailPassword.signingIn")
                  : t("auth.emailPassword.creatingAccount")
                : mode === "signin"
                  ? t("auth.emailPassword.continue")
                  : t("auth.emailPassword.createAccount")}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  {t("auth.noAccount")}{" "}
                  <button
                    type="button"
                    className="underline underline-offset-4 hover:no-underline"
                    onClick={() => {
                      clearAuthError();
                      formik.setErrors({});
                      formik.setTouched({});
                      setMode("signup");
                    }}
                  >
                    {t("auth.emailPassword.switchToSignUp")}
                  </button>
                </>
              ) : (
                <>
                  {t("auth.haveAccount")}{" "}
                  <button
                    type="button"
                    className="underline underline-offset-4 hover:no-underline"
                    onClick={() => {
                      clearAuthError();
                      formik.setErrors({});
                      formik.setTouched({});
                      setMode("signin");
                    }}
                  >
                    {t("auth.emailPassword.switchToSignIn")}
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </Formik>

      {errorText ? (
        <div className="rounded-md border border-border bg-muted p-3 text-sm">
          <div className="font-medium">{t("auth.errorTitle")}</div>
          <div className="mt-1 text-muted-foreground">{errorText}</div>
        </div>
      ) : null}
    </div>
  );
};
