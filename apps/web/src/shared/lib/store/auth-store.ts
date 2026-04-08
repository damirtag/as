import { create } from "zustand";
import { login, register, logout, refreshTokens } from "@/shared/lib/api/auth";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from "@/shared/auth/token-store";
import type { IUserResponse as IUser } from "@as/contracts";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await login({ email, password });
      set({
        user: response.user || { id: "temp", email },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await register({ email, password, username });
      set({
        user: response.user || { id: "temp", email, username },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Even if logout fails, clear local state
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  refreshToken: async () => {
    try {
      const response = await refreshTokens();
      set({
        user: response.user || get().user,
        isAuthenticated: true,
      });
    } catch (error) {
      // If refresh fails, logout
      set({
        user: null,
        isAuthenticated: false,
        error: "Session expired",
      });
      setAccessToken(null);
      setRefreshToken(null);
    }
  },

  checkAuth: () => {
    const token = getAccessToken();
    if (token) {
      set({ isAuthenticated: true });
      // Optionally, you could decode the token to get user info
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
