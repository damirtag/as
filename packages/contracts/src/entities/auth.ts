import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { v7 as uuidv7 } from "uuid";
import { User } from "./user";

@Entity({ name: "refresh_tokens" })
export class RefreshTokens {
  @PrimaryColumn("uuid")
  id: string = uuidv7();

  @Column()
  token!: string;

  @Column()
  type!: "refresh";

  @Column({ type: "timestamptz" })
  expiresAt!: Date;

  @Column({type: "boolean"})
  revoked!: Boolean;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: "CASCADE" })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}