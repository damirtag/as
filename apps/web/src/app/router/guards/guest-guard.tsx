import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/shared/lib";

export const GuestGuard = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitializing = useAuthStore((s) => s.isInitializing);

  if (isInitializing) return null; // or <PageSpinner />

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
};