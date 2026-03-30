import { Role } from "enum";

export interface IJwtPayload {
  sub: string;
  email: string;
  type: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshToken {
  id: string;
  token: string;
  type: "refresh";
  expiresAt: Date;
  revoked: boolean;
  userId: string;
  createdAt: Date;
}
