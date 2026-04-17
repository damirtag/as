import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/app-layout";
import { AuthLayout } from "./layouts/auth-layout";
import { AuthGuard } from "./guards/auth-guard";
import { GuestGuard } from "./guards/guest-guard";

import FeedPage from "@/pages/feed";
import QuotePage from "@/pages/quote";
import UserPage from "@/pages/user";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC AUTH */}
      <Route element={<GuestGuard />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* PRIVATE APP */}
      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/q/:id" element={<QuotePage />} />
          <Route path="/:username" element={<UserPage />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  );
};
