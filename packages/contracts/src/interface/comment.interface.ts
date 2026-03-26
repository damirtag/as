import { ITimestampedEntity } from "./base.interface";
import { IUser } from "./user.interface";

export interface IComment extends ITimestampedEntity {
  text: string;
  user: IUser;
  quoteId: string;
}
