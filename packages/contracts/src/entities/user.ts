import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { v7 as uuidv7 } from "uuid";
import { Role } from "../enum";
import { Quote } from "./quote";
import { RefreshTokens } from "./auth";
import { Comment } from "./comment";
import { Reaction } from "./reaction";

@Entity({ name: "users" })
export class User {
  @PrimaryColumn("uuid")
  id: string = uuidv7();

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  username!: string;

  @Column({ type: "varchar", default: Role.USER })
  role!: Role;

  @Column({ nullable: true })
  name?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Quote, (quote) => quote.user)
  quotes!: Quote[];

  @OneToMany(() => RefreshTokens, (token) => token.user)
  tokens!: RefreshTokens[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @OneToMany(() => Reaction, (Reaction) => Reaction.user)
  reactions!: Reaction[];
}
