import { ITimestampedEntity } from "./base.interface";

export interface IUser extends ITimestampedEntity {
  email: string;
  username?: string;
}

export interface IUserResponse {
  id: string;
  email: string;
  username?: string;
  role?: string;
}

export interface IUserWithPassword extends IUser {
  passwordHash: string;
}
