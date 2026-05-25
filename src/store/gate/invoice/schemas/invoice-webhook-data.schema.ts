import { z } from "zod"
import { Blockchain } from "@share/blockchain.enum"
import { Token } from "@share/token.enum"
import { InvoiceStatus } from "../invoice.conts"

export const invoiceWebhookDataSchema = z.object({
  id: z.uuidv4(),
  token: z.enum(Token),
  blockchain: z.enum(Blockchain),
  status: z.enum(InvoiceStatus),
  meta: z.object({
    payload: z.string().or(z.null())
  })
})
