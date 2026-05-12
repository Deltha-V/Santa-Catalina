import { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminLoggedIn } from "../api/client";

export function RequireAdmin({ children }: { children: ReactElement }) {
  const location = useLocation();
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
