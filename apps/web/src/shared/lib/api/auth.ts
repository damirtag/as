import axios from "axios";
import { setAccessToken } from "@/shared/auth/token-store";
import type { IAuthResponse, LoginDto, RegisterDto } from "@as/contracts";

const API_BASE_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:4000";

// Ensure cookies are sent in requests
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const login = async (dto: LoginDto): Promise<IAuthResponse> => {
  const response = await axiosInstance.post<IAuthResponse>("/auth/login", dto);
  setAccessToken(response.data.tokens.accessToken); // store only access token
  return response.data;
};

export const register = async (dto: RegisterDto): Promise<IAuthResponse> => {
  const response = await axiosInstance.post<IAuthResponse>(
    "/auth/register",
    dto,
  );
  setAccessToken(response.data.tokens.accessToken);
  return response.data;
};

export const refreshTokens = async (): Promise<IAuthResponse> => {
  // no need to get refresh token from JS
  const response = await axiosInstance.post<IAuthResponse>("/auth/refresh");
  setAccessToken(response.data.tokens.accessToken);
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post("/auth/logout"); // cookie-based logout
  } catch (error) {
    // ignore network errors
  }
  setAccessToken(null); // clear only access token
};
