import { z } from "zod"
import { createZodDto } from "nestjs-zod"
import { InvoiceEvent, InvoiceStatus } from "../../gate/invoice/invoice.conts"
import { WebhookSchema } from "../webhook.schema"

const schema = WebhookSchema

export class HandleWebhookDto extends createZodDto(schema) {}
