import { ITimestampedEntity } from "./base.interface";
import { IUser } from "./user.interface";

export interface IQuote extends ITimestampedEntity {
  text: string;
  user: IUser;
}
