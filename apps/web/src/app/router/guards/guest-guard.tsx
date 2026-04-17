import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/shared/lib";

export const GuestGuard = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
};
