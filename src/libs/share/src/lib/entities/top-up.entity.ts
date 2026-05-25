import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, type Relation } from "typeorm"
import { User } from "./user.entity"

@Entity()
export class TopUp {
  @PrimaryColumn("uuid", {
    default: () => "uuidv4()",
  })
  id: string

  @Column("decimal", {
    precision: 19,
    scale: 4,
  })
  amount: string

  @Column("jsonb")
  meta: {
    address: string
    token: string
    blockchain: string
    amount: string
  }

  @Column("boolean")
  paid: boolean

  @Column("boolean")
  expired: boolean

  @ManyToOne(() => User, (user) => user.topUps, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "userId",
  })
  user: Relation<User>

  @Column("bigint")
  userId: string

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date
}
