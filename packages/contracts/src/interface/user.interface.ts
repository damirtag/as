import { ITimestampedEntity } from "./base.interface";

export interface IUser extends ITimestampedEntity {
  email: string;
  username?: string;
}

export interface IUserWithPassword extends IUser {
  passwordHash: string;
}
