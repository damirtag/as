import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/shared/lib";
import { PageLoader } from "@/shared/components";

export const GuestGuard = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitializing = useAuthStore((s) => s.isInitializing);

  if (isInitializing) return <PageLoader />;

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
};