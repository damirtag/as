import { IBaseEntity } from "./base.interface";
import { IUser } from "./user.interface";
import { ReactionType } from "../enum";

export interface IReaction extends IBaseEntity {
  type: ReactionType;
  user: IUser;
  quoteId: string;
  commentId?: string;
}
