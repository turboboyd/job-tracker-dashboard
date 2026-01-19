import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { LoginForm } from "src/features/auth/ui/LoginForm/LoginForm";
import { useAuth } from "src/shared/lib";
import { Card } from "src/shared/ui";

type LocationState = { from?: { pathname?: string; search?: string } };

function getFrom(state: LocationState | null): string {
  const fromPath = state?.from?.pathname ?? "/dashboard";
  const fromSearch = state?.from?.search ?? "";
  return `${fromPath}${fromSearch}`;
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => getFrom(location.state as LocationState | null), [location.state]);

  useEffect(() => {
    if (isAuthReady && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthReady, isAuthenticated, navigate, from]);

  return (
    <div className="bg-background text-foreground flex items-center justify-center py-12">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">{t("auth.loginTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("auth.loginSubtitle")}</p>
        </div>

        <div className="mt-6">
          <LoginForm onSuccess={(target) => navigate(target || from, { replace: true })} />
        </div>

        <div className="pt-6 text-center text-sm text-muted-foreground space-y-2">
          <div>
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="text-foreground hover:underline">
              {t("auth.createAccount")}
            </Link>
          </div>
          <div>
            <Link to="/" className="hover:underline">
              {t("common.backToHome")}
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
