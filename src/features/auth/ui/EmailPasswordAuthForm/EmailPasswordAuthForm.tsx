import { Formik } from "formik";
import React, { useMemo, useState } from "react";

import {
  loginValidationSchema,
  type LoginFormValues,
} from "src/features/auth/model/loginValidation/loginValidation";
import { useAuth } from "src/shared/lib";
import { Button, Input } from "src/shared/ui";


export type EmailPasswordAuthFormProps = {
  onSuccess?: () => void;
};

type AuthMode = "signin" | "signup";

type FirebaseAuthError = {
  code?: string;
  message?: string;
};

function mapFirebaseAuthError(e: unknown, mode: AuthMode): string {
  let message = "Не удалось выполнить вход. Попробуй ещё раз.";

  if (typeof e === "object" && e !== null) {
    const err = e as FirebaseAuthError;

    switch (err.code) {
      case "auth/invalid-email":
        return "Некорректный email.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Неверный email или пароль.";
      case "auth/user-not-found":
        return "Пользователь не найден. Попробуй зарегистрироваться.";
      case "auth/email-already-in-use":
        return "Этот email уже зарегистрирован. Попробуй войти.";
      case "auth/weak-password":
        return "Слишком простой пароль. Используй минимум 6 символов.";
      case "auth/too-many-requests":
        return "Слишком много попыток. Подожди немного и попробуй снова.";
      case "auth/operation-not-allowed":
        return "Email/Password вход отключён в Firebase Console (Authentication → Sign-in method).";
      default:
        if (typeof err.message === "string" && err.message.length > 0)
          return err.message;
        break;
    }
  }

  if (mode === "signup") {
    message = "Не удалось создать аккаунт. Попробуй ещё раз.";
  }

  return message;
}

export const EmailPasswordAuthForm: React.FC<EmailPasswordAuthFormProps> = ({
  onSuccess,
}) => {
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [serverError, setServerError] = useState<string | null>(null);

  const initialValues = useMemo<LoginFormValues>(
    () => ({ email: "", password: "" }),
    []
  );

  return (
    <div className="space-y-3">
      <Formik<LoginFormValues>
        initialValues={initialValues}
        validationSchema={loginValidationSchema}
        validateOnBlur
        validateOnChange={false}
        onSubmit={async (values, helpers) => {
          setServerError(null);
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
          } catch (e) {
            setServerError(mapFirebaseAuthError(e, mode));
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
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
                aria-invalid={Boolean(
                  formik.touched.email && formik.errors.email
                )}
                aria-describedby={
                  formik.touched.email && formik.errors.email
                    ? "email-error"
                    : undefined
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
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                aria-invalid={Boolean(
                  formik.touched.password && formik.errors.password
                )}
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
                <p className="text-xs text-muted-foreground">
                  Минимум 6 символов.
                </p>
              )}
            </div>

            <Button
              className="w-full"
              type="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting
                ? mode === "signin"
                  ? "Вхожу..."
                  : "Создаю аккаунт..."
                : mode === "signin"
                ? "Continue"
                : "Create account"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  Нет аккаунта?{" "}
                  <button
                    type="button"
                    className="underline underline-offset-4 hover:no-underline"
                    onClick={() => {
                      setServerError(null);
                      formik.setErrors({});
                      formik.setTouched({});
                      setMode("signup");
                    }}
                  >
                    Зарегистрироваться
                  </button>
                </>
              ) : (
                <>
                  Уже есть аккаунт?{" "}
                  <button
                    type="button"
                    className="underline underline-offset-4 hover:no-underline"
                    onClick={() => {
                      setServerError(null);
                      formik.setErrors({});
                      formik.setTouched({});
                      setMode("signin");
                    }}
                  >
                    Войти
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </Formik>

      {serverError ? (
        <div className="rounded-md border border-border bg-muted p-3 text-sm">
          <div className="font-medium">Ошибка</div>
          <div className="mt-1 text-muted-foreground">{serverError}</div>
        </div>
      ) : null}
    </div>
  );
};
