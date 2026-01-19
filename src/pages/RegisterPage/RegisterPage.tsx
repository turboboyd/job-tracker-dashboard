import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { RegisterForm } from "src/features/auth/ui";
import { useAuth } from "src/shared/lib";
import { Card } from "src/shared/ui";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isAuthReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthReady && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthReady, isAuthenticated, navigate]);

  return (
    <div className="bg-background text-foreground flex items-center justify-center py-12">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">{t("auth.registerTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("auth.registerSubtitle")}</p>
        </div>

        <div className="mt-6">
          <RegisterForm onSuccess={() => navigate("/dashboard", { replace: true })} />
        </div>

        <div className="pt-6 text-center text-sm text-muted-foreground space-y-2">
          <div>
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="text-foreground hover:underline">
              {t("auth.signIn")}
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

export default RegisterPage;
