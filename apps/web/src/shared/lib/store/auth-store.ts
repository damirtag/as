import { create } from "zustand";
import { login, register, logout, refreshTokens } from "@/shared/lib/api/auth";
import { setAccessToken, clearAccessToken } from "@/shared/auth/token-store";
import type { IUserResponse as IUser } from "@as/contracts";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;
}
interface AuthActions {
  initAuth: () => Promise<void>;

  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
  ) => Promise<void>;
  logout: () => Promise<void>;

  refreshToken: () => Promise<void>;

  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  error: null,

  initAuth: async () => {
    if (get().isAuthenticated) {
      set({ isInitializing: false });
      return;
    }

    set({ isInitializing: true });

    try {
      const res = await refreshTokens();
      setAccessToken(res.tokens.accessToken);
      set({
        user: res.user ?? null,
        isAuthenticated: true,
      });
    } catch {
      clearAccessToken();
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isInitializing: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await login({ email, password });
      setAccessToken(res.tokens.accessToken);
      set({
        user: res.user ?? null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Login failed",
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const res = await register({ email, password, username });
      setAccessToken(res.tokens.accessToken);
      set({
        user: res.user ?? null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message ?? "Registration failed",
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logout();
    } finally {
      clearAccessToken();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  refreshToken: async () => {
    const res = await refreshTokens();
    setAccessToken(res.tokens.accessToken);
    set({
      user: res.user ?? get().user,
      isAuthenticated: true,
    });
  },

  clearError: () => set({ error: null }),
}));
