import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { v7 as uuidv7 } from "uuid";
import { User } from "./user";
import { Quote } from "./quote";
import { Reaction } from "./reaction";

@Entity({ name: "comments" })
export class Comment {
  @PrimaryColumn("uuid")
  id: string = uuidv7();

  @Column("text")
  text!: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Quote, (quote) => quote.comments, { onDelete: "CASCADE" })
  quote!: Quote;

  @OneToMany(() => Reaction, (reaction) => reaction.comment)
  reactions?: Reaction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
