import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { v7 as uuidv7 } from "uuid";
import { User } from "./user";
import { Comment } from "./comment";
import { Reaction } from "./reaction";

@Entity({ name: "quotes" })
export class Quote {
  @PrimaryColumn("uuid")
  id: string = uuidv7();

  @Column("text")
  text!: string;

  @Column("uuid")
  userId!: string;

  @ManyToOne(() => User, (user) => user.quotes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @OneToMany(() => Comment, (comment) => comment.quote)
  comments!: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.quote)
  reactions!: Reaction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
