import { z } from "zod"

export const WebhookSchema = z.object({
  id: z.coerce.bigint().positive().transform(String),
  event: z.string().nonempty(),
  data: z.record(z.string(), z.any()),
  attempt: z.number().int().nonpositive(),
  timestamp: z.number().int().positive(),
})
