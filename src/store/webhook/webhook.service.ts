import { Injectable, Logger } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { TopUpService } from "../top-up/top-up.service"
import { z } from "zod"
import { WebhookSchema } from "./webhook.schema"
import { InvoiceEvent } from "../gate/invoice/invoice.conts"
import { ProcessedWebhook } from "@share/entities"
import { invoiceWebhookDataSchema } from "../gate/invoice/schemas/invoice-webhook-data.schema"

@Injectable()
export class WebhookService {
  protected logger = new Logger(WebhookService.name)

  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    protected topUpService: TopUpService,
  ) {}

  async process(webhook: z.infer<typeof WebhookSchema>) {
    await this.dataSource.transaction("READ COMMITTED", async (manager) => {
      const processedWebhook = await manager.findOne(ProcessedWebhook, {
        where: {
          webhookId: webhook.id,
        },
        lock: {
          mode: "pessimistic_write",
        },
      })

      if (processedWebhook) {
        this.logger.debug(`Webhook(${webhook.id}) processed already`)
        return
      }

      await manager.insert(ProcessedWebhook, {
        webhookId: webhook.id,
      })

      if (!Object.values(InvoiceEvent).includes(webhook.event as InvoiceEvent)) {
        this.logger.debug(`Unsupported event received, event: ${webhook.event}`)
        return
      }

      await this.topUpService.process(
        {
          event: webhook.event as InvoiceEvent,
          data: webhook.data as z.infer<typeof invoiceWebhookDataSchema>,
        },
        manager,
      )
    })
  }
}
