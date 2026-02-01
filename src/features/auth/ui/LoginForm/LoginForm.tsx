import { Formik } from "formik";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useAuthActions, useAuthSelectors } from "src/app/store/auth";
import { InlineError, FormikInputField } from "src/shared/ui";

import { mapFirebaseAuthError } from "../../lib/firebaseAuthErrors";
import { createLoginSchema, type LoginValues } from "../../model/validation";
import { AuthFormShell } from "../AuthFormShell";
import { AuthSubmitButton } from "../AuthSubmitButton";

export type LoginFormProps = {
  onSuccess: (from: string) => void;
};

const initialValues: LoginValues = { email: "", password: "" };

const LOGIN_ERROR_OVERRIDES: Record<string, string> = {
  "auth/invalid-credential": "auth.errors.wrongPassword",
  "auth/wrong-password": "auth.errors.wrongPassword",
  "auth/user-not-found": "auth.errors.userNotFound",
};

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();

  const { signInWithEmail, clearAuthError } = useAuthActions();
  const { isLoading, error } = useAuthSelectors();

  const schema = useMemo(() => createLoginSchema(t), [t]);

  return (
    <AuthFormShell googleButtonProps={{ onSuccess }}>
      <Formik<LoginValues>
        initialValues={initialValues}
        validationSchema={schema}
        validateOnBlur
        validateOnChange={false}
        onSubmit={async (values) => {
          clearAuthError();
          await signInWithEmail(values.email.trim(), values.password);
          onSuccess("");
        }}
      >
        {(f) => {
          const commonError = error
            ? mapFirebaseAuthError(error, t, LOGIN_ERROR_OVERRIDES)
            : undefined;

          const disabled = f.isSubmitting || isLoading;

          return (
            <form onSubmit={f.handleSubmit} className="space-y-4">
              {commonError ? <InlineError message={commonError} /> : null}

              <div className="grid grid-cols-1 gap-4">
                <FormikInputField
                  formik={f}
                  name="email"
                  label={t("auth.email")}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  disabled={disabled}
                  onFocus={() => clearAuthError()}
                />

                <FormikInputField
                  formik={f}
                  name="password"
                  label={t("auth.password")}
                  required
                  preset="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={disabled}
                  onFocus={() => clearAuthError()}
                />
              </div>

              <AuthSubmitButton
                disabled={disabled}
                isSubmitting={disabled}
                idleText={t("auth.signIn")}
                submittingText={t("auth.signingIn")}
              />
            </form>
          );
        }}
      </Formik>
    </AuthFormShell>
  );
};
