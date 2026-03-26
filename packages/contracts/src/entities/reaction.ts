import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from "typeorm";
import { v7 as uuidv7 } from "uuid";
import { User } from "./user";
import { Quote } from "./quote";
import { Comment } from "./comment";

@Entity({ name: "reactions" })
export class Reaction {
  @PrimaryColumn("uuid")
  id: string = uuidv7();

  @ManyToOne(() => User, (user) => user.reactions, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Quote, (quote) => quote.reactions, { onDelete: "CASCADE" })
  quote!: Quote;

  @ManyToOne(() => Comment, (comment) => comment.reactions, {
    onDelete: "CASCADE",
    nullable: true,
  })
  comment?: Comment;

  @Column({ type: "varchar", default: "like" })
  type!:
    | "like"
    | "love"
    | "handshake"
    | "laugh"
    | "sad"
    | "angry"
    | "rofl"
    | "dislike";

  @CreateDateColumn()
  createdAt!: Date;
}
