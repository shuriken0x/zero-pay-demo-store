import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm"
import { Token } from "../token.enum"
import { TopUp } from "./top-up.entity"
import { Role } from "@share/entities/role.enum"

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: string

  @Column("varchar", {
    length: 255,
    unique: true,
  })
  username: string

  @Column("varchar", {
    length: 255,
  })
  password: string

  @Column("enum", {
    enum: Role,
  })
  role: Role

  @Column("boolean")
  banned: boolean

  @Column("decimal", {
    precision: 19,
    scale: 4,
  })
  balance: string

  @OneToMany(() => TopUp, (topUp) => topUp.user)
  topUps: Relation<TopUp>[]

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date
}
