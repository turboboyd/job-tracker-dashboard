import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "src/shared/lib";
import { Button } from "src/shared/ui";
import { GoogleIcon } from "src/shared/ui/icons/GoogleIcon";

type LocationState = { from?: { pathname?: string; search?: string } };

function getFrom(state: LocationState | null): string {
  const fromPath = state?.from?.pathname ?? "/dashboard";
  const fromSearch = state?.from?.search ?? "";
  return `${fromPath}${fromSearch}`;
}

export type GoogleSignInButtonProps = {
  onSuccess?: (from: string) => void;
  onError?: (message: string) => void;
  className?: string;
};

type FirebaseAuthError = {
  code?: string;
  message?: string;
};

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  className,
}) => {
  const { signInWithGoogle } = useAuth();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      const from = getFrom(location.state as LocationState | null);
      onSuccess?.(from);
    } catch (e: unknown) {
      let message = "Не удалось войти. Попробуй ещё раз.";

      if (typeof e === "object" && e !== null) {
        const err = e as FirebaseAuthError;

        if (err.code === "auth/popup-closed-by-user") {
          message = "Окно входа было закрыто. Попробуй ещё раз.";
        } else if (err.code === "auth/cancelled-popup-request") {
          message = "Ожидается окно входа. Проверь блокировку popups.";
        } else if (err.code === "auth/popup-blocked") {
          message = "Браузер заблокировал окно входа. Разреши popups.";
        } else if (typeof err.message === "string" && err.message.length > 0) {
          message = err.message;
        }
      }

      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={["w-full justify-center gap-2", className]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      disabled={isLoading}
    >
      <GoogleIcon className="h-4 w-4" />
      {isLoading ? "Открываю Google..." : "Sign in with Google"}
    </Button>
  );
};
