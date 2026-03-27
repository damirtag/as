import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { v7 as uuidv7 } from "uuid";
import { User } from "./user";
import { Quote } from "./quote";
import { Comment } from "./comment";

@Entity({ name: "reactions" })
export class Reaction {
  @PrimaryColumn("uuid")
  id: string = uuidv7();

  @Column("uuid")
  userId!: string;

  @ManyToOne(() => User, (user) => user.reactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column("uuid")
  quoteId!: string;

  @ManyToOne(() => Quote, (quote) => quote.reactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "quoteId" })
  quote!: Quote;

  @Column({ type: "uuid", nullable: true })
  commentId?: string;

  @ManyToOne(() => Comment, (comment) => comment.reactions, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "commentId" })
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
