import { randomUUID } from "node:crypto"
import { InjectRepository } from "@nestjs/typeorm"
import { TopUp, User } from "@share/entities"
import { EntityManager, Repository } from "typeorm"
import { GateApi } from "../gate/gate.api"
import { Blockchain, FiatCurrency, Token } from "@share"
import { Injectable, Logger } from "@nestjs/common"
import { z } from "zod"
import { invoiceWebhookDataSchema } from "../gate/invoice/schemas/invoice-webhook-data.schema"
import { InvoiceEvent, InvoiceStatus } from "../gate/invoice/invoice.conts"

@Injectable()
export class TopUpService {
  protected logger = new Logger(TopUpService.name)

  constructor(
    @InjectRepository(TopUp) protected repository: Repository<TopUp>,
    protected gate: GateApi,
  ) {}

  async create({ amount, token, blockchain, userId }: CreateTopUpParams) {
    const id = randomUUID() as string
    const invoice = await this.gate.invoice.create({
      token,
      blockchain,
      fiat: {
        price: amount,
        currency: FiatCurrency.USD,
      },
      payload: id,
    })

    const insertResult = await this.repository
      .createQueryBuilder()
      .insert()
      .into(TopUp)
      .values({
        id,
        amount: amount.toString(),
        meta: {
          amount: invoice.pricing.crypto.amount,
          token: invoice.token,
          blockchain: invoice.blockchain,
          address: invoice.address,
        },
        paid: false,
        expired: false,
        userId,
      })
      .returning("*")
      .execute()

    const topUp = this.repository.create(insertResult.raw[0] as object)

    this.logger.log(`TopUp(${topUp.id}) created`)
    return topUp
  }

  async retrieve(id: string) {
    return await this.repository.findOneOrFail({
      where: {
        id,
      },
    })
  }

  async process(
    { event, data }: { event: InvoiceEvent; data: z.infer<typeof invoiceWebhookDataSchema> },
    manager: EntityManager,
  ) {
    const topUp = await manager.findOne(TopUp, {
      where: {
        id: data.meta.payload as string,
      },
      lock: {
        mode: "pessimistic_write",
      },
    })

    if (!topUp) {
      this.logger.warn(`TopUp not found by provided payload: ${data.meta.payload}`)
      return
    }

    if (topUp.paid) {
      this.logger.warn(`Ignoring, TopUp(${topUp.id}) already paid`)
      return
    }

    if (event === InvoiceEvent.Expired && topUp.expired) {
      this.logger.warn(`Ignoring, TopUp(${topUp.id}) already expired`)
      return
    }

    if (data.status === InvoiceStatus.Paid || data.status === InvoiceStatus.OverPaid) {
      await manager.update(TopUp, { id: topUp.id }, { paid: true })
      await manager.increment(User, { id: topUp.userId }, "balance", topUp.amount)
      this.logger.log(`TopUp(${topUp.id}) is paid`)
      return
    }

    if (data.status === InvoiceStatus.Expired) {
      await manager.update(TopUp, { id: topUp.id }, { expired: true })
      this.logger.log(`TopUp(${topUp.id}) is expired`)
      return
    }
  }
}

type CreateTopUpParams = {
  token: Token
  blockchain: Blockchain
  amount: number // in usd
  userId: string
}
