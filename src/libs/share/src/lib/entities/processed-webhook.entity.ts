import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"


@Entity()
export class ProcessedWebhook {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column("bigint", {
    unique: true
  })
  webhookId: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}