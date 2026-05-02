import axios from "axios";
import { setAccessToken } from "@/shared/auth/token-store";
import type { IAuthResponse, LoginDto, RegisterDto } from "@as/contracts";

const API_BASE_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:4000/auth";

// Ensure cookies are sent in requests
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const login = async (dto: LoginDto): Promise<IAuthResponse> => {
  const response = await axiosInstance.post<IAuthResponse>("/login", dto);
  setAccessToken(response.data.accessToken); // store only access token
  return response.data;
};

export const register = async (dto: RegisterDto): Promise<IAuthResponse> => {
  const response = await axiosInstance.post<IAuthResponse>(
    "/register",
    dto,
  );
  setAccessToken(response.data.accessToken);
  return response.data;
};

export const refreshTokens = async (): Promise<IAuthResponse> => {
  // no need to get refresh token from JS
  const response = await axiosInstance.post<IAuthResponse>("/refresh");
  setAccessToken(response.data.accessToken);
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post("/logout"); // cookie-based logout
  } catch (error) {
    // ignore network errors
  }
  setAccessToken(null); // clear only access token
};
