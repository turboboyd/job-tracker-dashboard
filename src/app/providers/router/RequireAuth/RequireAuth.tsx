import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthSelectors } from "src/app/store/auth";

export const RequireAuth: React.FC = () => {
  const { isAuthenticated, isAuthReady } = useAuthSelectors();

  const location = useLocation();

  if (!isAuthReady) {
    return <div className="p-4">Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
